import { pipeline, env } from "@huggingface/transformers";

env.allowRemoteModels = true;
env.useBrowserCache = true;
let transcriber: any;

self.onmessage = async (event: MessageEvent<{ type: "transcribe"; requestId: string; audio: Float32Array; modelId: string }>) => {
  try {
    if (!transcriber) transcriber = await pipeline("automatic-speech-recognition", event.data.modelId, { dtype: "q8" } as any);
    const result = await transcriber(event.data.audio, { language: "spanish", task: "transcribe" });
    self.postMessage({ type: "complete", requestId: event.data.requestId, text: result.text ?? "" });
  } catch (error) {
    self.postMessage({ type: "error", requestId: event.data.requestId, message: error instanceof Error ? error.message : "No se pudo transcribir el audio." });
  }
};
