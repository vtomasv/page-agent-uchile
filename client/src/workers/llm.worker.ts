import { pipeline, TextStreamer, env } from "@huggingface/transformers";
import type { WorkerEvent, WorkerRequest } from "@/lib/types";

env.allowRemoteModels = true;
// This prototype does not bundle model weights. Keeping local resolution enabled
// makes Vite/Nginx return index.html for missing model paths, which then appears
// as `Unexpected token '<'` while Transformers.js parses JSON metadata.
env.allowLocalModels = false;
env.useBrowserCache = true;

let generator: any;
let activeRequest = "";

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;
  const send = (payload: WorkerEvent) => self.postMessage(payload);
  try {
    if (message.type === "interrupt") {
      activeRequest = "";
      return;
    }
    if (message.type === "load-model") {
      const device = message.config.device === "webgpu" && "gpu" in navigator ? "webgpu" : "wasm";
      generator = await pipeline("text-generation", message.config.modelId, {
        device,
        dtype: message.config.dtype,
        progress_callback: (payload: any) => send({ type: "download-progress", payload }),
      } as any);
      send({ type: "model-ready", model: message.config.modelId, backend: device === "webgpu" ? "WebGPU" : "WASM / CPU" });
      return;
    }
    if (message.type === "generate") {
      activeRequest = message.requestId;
      if (!generator) {
        await (self as any).postMessage({ type: "error", requestId: message.requestId, message: "El modelo aún no está cargado." } satisfies WorkerEvent);
        return;
      }
      const prompt = [{ role: "system", content: message.systemPrompt }, ...message.messages].map((item) => `${item.role}: ${item.content}`).join("\n");
      let text = "";
      const streamer = new TextStreamer((generator as any).tokenizer, {
        skip_prompt: true,
        callback_function: (token: string) => {
          if (activeRequest !== message.requestId) return;
          text += token;
          send({ type: "token", requestId: message.requestId, text: token });
        },
      });
      await generator(prompt, { max_new_tokens: message.config.maxNewTokens, temperature: message.config.temperature, top_p: message.config.topP, repetition_penalty: message.config.repetitionPenalty, streamer });
      send({ type: "complete", requestId: message.requestId, payload: { text } });
    }
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "Error al ejecutar el modelo local.";
    const messageText = rawMessage.includes("Unexpected token '<'") || rawMessage.includes("<!doctype")
      ? "La descarga del modelo recibió HTML en vez de metadata JSON. Se desactivó la búsqueda local; verifica conexión a Hugging Face, bloqueadores del navegador y vuelve a cargar."
      : rawMessage;
    send({ type: "error", requestId: "requestId" in message ? message.requestId : undefined, message: messageText });
  }
};
