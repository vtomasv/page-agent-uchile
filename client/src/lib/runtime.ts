// Style reminder: Archivo editorial cívico — runtime status is visible, plain-language, and honest.

import type { RuntimeCapabilities } from "@/lib/types";

export async function detectRuntimeCapabilities(): Promise<RuntimeCapabilities> {
  const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
  let microphone: RuntimeCapabilities["microphone"] = "unknown";
  try {
    if (navigator.permissions?.query) {
      const result = await navigator.permissions.query({ name: "microphone" as PermissionName });
      microphone = result.state === "granted" ? "allowed" : result.state === "denied" ? "denied" : "unknown";
    }
  } catch {
    microphone = "unknown";
  }
  const webgpu = "gpu" in navigator;
  const wasm = typeof WebAssembly !== "undefined";
  return {
    webgpu,
    wasm,
    cacheStorage: "caches" in window,
    indexedDb: "indexedDB" in window,
    microphone,
    audioContext: "AudioContext" in window || "webkitAudioContext" in window,
    serviceWorker: !("serviceWorker" in navigator) ? "unavailable" : navigator.serviceWorker.controller ? "active" : "supported",
    speechSynthesis: "speechSynthesis" in window,
    speechRecognition: "SpeechRecognition" in window || "webkitSpeechRecognition" in window,
    deviceMemory: navigatorWithMemory.deviceMemory,
    backend: webgpu ? "WebGPU" : wasm ? "WASM / CPU" : "Unavailable",
  };
}

export function formatBytes(value?: number) {
  if (!value) return "—";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}
