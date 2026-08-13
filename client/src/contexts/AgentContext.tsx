// Style reminder: Archivo editorial cívico — the harness is calm, inspectable, and always reversible.

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { courseById, courseChunks } from "@/content/courses";
import { siteChunks } from "@/content/site";
import { answerGrounded } from "@/lib/agent";
import { ArtifactManager } from "@/lib/artifacts";
import { DEFAULT_CONFIG, loadConfig, saveConfig } from "@/lib/config";
import { chunkForDom } from "@/lib/retrieval";
import { detectRuntimeCapabilities } from "@/lib/runtime";
import { clearLocal, readLocal, saveLocal } from "@/lib/storage";
import type { AgentMessage, AgentUIArtifact, ContextChunk, HarnessConfig, RuntimeCapabilities } from "@/lib/types";

type AgentStatus = "closed" | "minimized" | "ready" | "thinking" | "generating" | "listening" | "transcribing" | "speaking" | "error";

type AgentContextValue = {
  route: string;
  currentChunks: ContextChunk[];
  messages: AgentMessage[];
  artifacts: AgentUIArtifact[];
  mutations: ReturnType<ArtifactManager["getAll"]>;
  status: AgentStatus;
  modelStatus: "idle" | "downloading" | "ready" | "error";
  modelProgress: number;
  runtime: RuntimeCapabilities | null;
  config: HarnessConfig;
  setConfig: (config: HarnessConfig) => void;
  openChat: () => void;
  minimizeChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  stopGeneration: () => void;
  clearConversation: () => void;
  clearMemory: () => void;
  speak: (text: string) => void;
  startListening: () => void;
  stopListening: () => void;
  removeArtifact: (id: string) => void;
  restoreArtifact: (id: string) => void;
  removeAllArtifacts: () => void;
  undoArtifact: () => void;
  focusSource: (sourceId: string) => void;
  preloadLLM: () => void;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onstart?: () => void;
  onresult?: (event: any) => void;
  onerror?: () => void;
  onend?: () => void;
  start: () => void;
  stop: () => void;
};

const AgentContext = createContext<AgentContextValue | null>(null);
const conversationKey = "current-session";

function createMessage(role: AgentMessage["role"], content: string, sources?: AgentMessage["sources"]): AgentMessage {
  return { id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, role, content, createdAt: Date.now(), sources };
}

export function AgentProvider({ children }: { children: ReactNode }) {
  const [route] = useLocation();
  const [config, setConfigState] = useState<HarnessConfig>(() => loadConfig());
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [currentChunks, setCurrentChunks] = useState<ContextChunk[]>([]);
  const [status, setStatus] = useState<AgentStatus>("closed");
  const [runtime, setRuntime] = useState<RuntimeCapabilities | null>(null);
  const [modelStatus, setModelStatus] = useState<AgentContextValue["modelStatus"]>("idle");
  const [modelProgress, setModelProgress] = useState(0);
  const [mutations, setMutations] = useState<ReturnType<ArtifactManager["getAll"]>>([]);
  const managerRef = useRef<ArtifactManager | undefined>(undefined);
  const workerRef = useRef<Worker | undefined>(undefined);
  const activeRequestRef = useRef<string | null>(null);

  if (!managerRef.current) managerRef.current = new ArtifactManager();

  useEffect(() => {
    const manager = managerRef.current!;
    return manager.subscribe(setMutations);
  }, []);

  useEffect(() => {
    detectRuntimeCapabilities().then(setRuntime);
    readLocal<AgentMessage[]>("conversations", conversationKey).then((saved) => {
      if (saved?.length && config.memory.mode === "persistent") setMessages(saved);
    });
  }, []);

  useEffect(() => {
    const structured = route.startsWith("/cursos/")
      ? courseChunks.filter((chunk) => chunk.route === route)
      : siteChunks;
    const domChunks = chunkForDom(route);
    setCurrentChunks([...structured, ...domChunks]);
  }, [route]);

  useEffect(() => {
    if (config.memory.mode === "persistent") void saveLocal("conversations", conversationKey, messages.slice(-config.memory.maxTurns * 2));
  }, [config.memory.mode, config.memory.maxTurns, messages]);

  useEffect(() => {
    if (config.models.llm.preload) preloadLLM();
    return () => workerRef.current?.terminate();
  }, []);

  const setConfig = (nextConfig: HarnessConfig) => {
    setConfigState(nextConfig);
    saveConfig(nextConfig);
  };

  const openChat = () => setStatus((current) => current === "closed" ? "ready" : current);
  const minimizeChat = () => setStatus("minimized");
  const closeChat = () => setStatus("closed");

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || status === "thinking" || status === "generating") return;
    const userMessage = createMessage("user", trimmed);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setStatus("thinking");
    await new Promise((resolve) => window.setTimeout(resolve, 320));
    const result = answerGrounded(trimmed, route, currentChunks, config);
    const assistant = createMessage("assistant", result.answer, result.sources);
    setMessages((current) => [...current, assistant]);
    if (result.artifact) managerRef.current?.addArtifact(result.artifact);
    setStatus("ready");
  };

  const stopGeneration = () => {
    if (activeRequestRef.current && workerRef.current) workerRef.current.postMessage({ type: "interrupt", requestId: activeRequestRef.current });
    activeRequestRef.current = null;
    setStatus("ready");
  };

  const clearConversation = () => {
    setMessages([]);
    void clearLocal("conversations", conversationKey);
  };

  const clearMemory = () => {
    clearConversation();
    managerRef.current?.removeAll();
  };

  const speak = (text: string) => {
    if (!config.voice.enabled || !runtime?.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = config.voice.language;
    utterance.rate = config.voice.speed;
    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => setStatus("ready");
    utterance.onerror = () => setStatus("ready");
    window.speechSynthesis.speak(utterance);
  };

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const startListening = () => {
    const speechWindow = window as Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setStatus("error");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = config.voice.language;
    recognition.interimResults = false;
    recognition.onstart = () => setStatus("listening");
    recognition.onresult = (event) => {
      setStatus("transcribing");
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) void sendMessage(transcript);
    };
    recognition.onerror = () => setStatus("error");
    recognition.onend = () => setStatus((current) => current === "listening" || current === "transcribing" ? "ready" : current);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setStatus("ready");
  };

  const preloadLLM = () => {
    if (modelStatus === "downloading" || modelStatus === "ready") return;
    setModelStatus("downloading");
    setModelProgress(6);
    const worker = new Worker(new URL("@/workers/llm.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<any>) => {
      if (event.data.type === "download-progress") setModelProgress(Math.max(8, Math.round(event.data.payload.progress ?? 8)));
      if (event.data.type === "model-ready") { setModelProgress(100); setModelStatus("ready"); }
      if (event.data.type === "error") setModelStatus("error");
    };
    worker.postMessage({ type: "load-model", config: config.models.llm });
  };

  const focusSource = (sourceId: string) => {
    const chunk = currentChunks.find((item) => item.id === sourceId) ?? [...siteChunks, ...courseChunks].find((item) => item.id === sourceId);
    if (!chunk?.selector) return;
    const element = document.querySelector(chunk.selector);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    element?.classList.add("source-highlight");
    window.setTimeout(() => element?.classList.remove("source-highlight"), 1400);
  };

  const value = useMemo<AgentContextValue>(() => ({
    route,
    currentChunks,
    messages,
    artifacts: mutations.filter((mutation) => mutation.status === "active").map((mutation) => mutation.artifact),
    mutations,
    status,
    modelStatus,
    modelProgress,
    runtime,
    config,
    setConfig,
    openChat,
    minimizeChat,
    closeChat,
    sendMessage,
    stopGeneration,
    clearConversation,
    clearMemory,
    speak,
    startListening,
    stopListening,
    removeArtifact: (id) => managerRef.current?.removeArtifact(id),
    restoreArtifact: (id) => managerRef.current?.restoreArtifact(id),
    removeAllArtifacts: () => managerRef.current?.removeAll(),
    undoArtifact: () => managerRef.current?.undo(),
    focusSource,
    preloadLLM,
  }), [route, currentChunks, messages, mutations, status, modelStatus, modelProgress, runtime, config]);

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) throw new Error("useAgent debe usarse dentro de AgentProvider");
  return context;
}

export function getCourseForRoute(route: string) {
  const slug = route.split("/").pop();
  return Object.values(courseById).find((course) => course.slug === slug);
}
