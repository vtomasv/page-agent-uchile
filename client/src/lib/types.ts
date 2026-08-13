// Style reminder: Archivo editorial cívico — provenance, clarity, and reversible page-aware interactions.

export type Course = {
  id: string;
  slug: string;
  sourceUrl: string;
  title: string;
  code?: string;
  category: string;
  program: string;
  duration: string;
  price: string;
  startDate: string;
  modality: string;
  objectives: string[];
  contents: string[];
  professors: string[];
  requirements: string[];
  payment: string[];
  relatedCourseIds: string[];
  shortDescription: string;
  accent: "maroon" | "teal" | "ochre" | "charcoal";
};

export type SiteSection = {
  id: string;
  title: string;
  eyebrow?: string;
  body: string;
  bullets?: string[];
};

export type ContextChunk = {
  id: string;
  route: string;
  entityType?: "course" | "program" | "section" | "contact" | "generated";
  entityId?: string;
  heading?: string;
  text: string;
  selector?: string;
  source: "dom" | "structured-content";
};

export type AgentSource = {
  id: string;
  label: string;
  route: string;
  chunkId?: string;
};

export type AgentMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
  sources?: AgentSource[];
  isStreaming?: boolean;
};

export type ArtifactType =
  | "comparison"
  | "summary"
  | "recommendation"
  | "timeline"
  | "course-list"
  | "fact-sheet";

export type ComparisonData = {
  courses: Course[];
  similarities: string[];
  differences: Array<{ label: string; values: string[] }>;
  recommendation: string;
};

export type AgentUIArtifact = {
  id: string;
  type: ArtifactType;
  title: string;
  subtitle?: string;
  sources: string[];
  data: unknown;
  placement?: { mode: "after-section" | "before-section" | "inline" | "top"; anchorId?: string };
  createdAt: number;
};

export type PageMutation = {
  id: string;
  createdAt: number;
  artifact: AgentUIArtifact;
  status: "active" | "removed";
};

export type RuntimeCapabilities = {
  webgpu: boolean;
  wasm: boolean;
  cacheStorage: boolean;
  indexedDb: boolean;
  microphone: "allowed" | "denied" | "unknown";
  audioContext: boolean;
  serviceWorker: "active" | "supported" | "unavailable";
  speechSynthesis: boolean;
  speechRecognition: boolean;
  deviceMemory?: number;
  backend: "WebGPU" | "WASM / CPU" | "Unavailable";
};

export type ModelStatus = "idle" | "downloading" | "ready" | "error";

export type ModelConfig = {
  llm: { modelId: string; dtype: "q4" | "q8" | "fp16" | "fp32"; device: "webgpu" | "wasm"; maxNewTokens: number; temperature: number; topP: number; repetitionPenalty: number; contextBudget: number; streaming: boolean; preload: boolean };
  embeddings: { modelId: string; dtype: "q8" | "q4" | "fp32"; device: "webgpu" | "wasm"; pooling: "mean"; normalize: boolean };
  asr: { modelId: string; language: string; device: "webgpu" | "wasm"; dtype: "q8" | "q4" | "fp32" };
  tts: { engine: "speechSynthesis" | "transformers"; modelId: string; voice: string; speed: number };
};

export type RetrievalConfig = {
  chunkSize: number;
  overlap: number;
  topK: number;
  similarityThreshold: number;
  currentPageBoost: number;
  embeddingModel: string;
};

export type MemoryConfig = {
  mode: "none" | "session" | "persistent";
  maxTurns: number;
  maxTokensApprox: number;
  includeGeneratedArtifacts: boolean;
};

export type HarnessConfig = {
  version: number;
  models: ModelConfig;
  prompt: { system: string; language: "es" | "en"; detail: "concise" | "balanced" | "detailed" };
  tools: Record<string, boolean>;
  retrieval: RetrievalConfig;
  memory: MemoryConfig;
  voice: { enabled: boolean; autoplay: boolean; language: string; speed: number };
  ui: { chatPosition: "bottom-right"; showContextRail: boolean; showRuntimeBadge: boolean };
};

export type WorkerRequest =
  | { type: "load-model"; config: ModelConfig["llm"] }
  | { type: "generate"; requestId: string; messages: AgentMessage[]; systemPrompt: string; config: ModelConfig["llm"] }
  | { type: "interrupt"; requestId: string };

export type WorkerEvent =
  | { type: "download-progress"; payload: { status: string; file?: string; progress?: number; loaded?: number; total?: number } }
  | { type: "model-ready"; model: string; backend: string }
  | { type: "token"; requestId: string; text: string }
  | { type: "complete"; requestId: string; payload: { text: string } }
  | { type: "error"; requestId?: string; message: string };
