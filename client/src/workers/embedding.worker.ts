import { pipeline, env } from "@huggingface/transformers";

env.allowRemoteModels = true;
env.useBrowserCache = true;
let extractor: any;

self.onmessage = async (event: MessageEvent<{ type: "embed"; requestId: string; texts: string[]; modelId: string }>) => {
  try {
    if (!extractor) extractor = await pipeline("feature-extraction", event.data.modelId, { dtype: "q8" } as any);
    const output = await extractor(event.data.texts, { pooling: "mean", normalize: true });
    self.postMessage({ type: "complete", requestId: event.data.requestId, embeddings: output.tolist?.() ?? [] });
  } catch (error) {
    self.postMessage({ type: "error", requestId: event.data.requestId, message: error instanceof Error ? error.message : "No se pudo calcular el embedding." });
  }
};
