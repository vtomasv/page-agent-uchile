// Style reminder: Archivo editorial cívico — a capability indicator is a plain-language footnote, not a badge of magic.

import { Cpu, Database, Download, WifiOff } from "lucide-react";
import { useAgent } from "@/contexts/AgentContext";

export function RuntimeBadge({ compact = false }: { compact?: boolean }) {
  const { runtime, modelStatus, modelProgress } = useAgent();
  const isReady = modelStatus === "ready";
  return <div className={`runtime-badge ${compact ? "is-compact" : ""}`} data-agent-chrome title="La inferencia, cuando el modelo está cargado, ocurre en el navegador">
    <span className="runtime-icon"><Cpu size={15} /></span>
    <span className="runtime-copy"><strong>{isReady ? "Modelo local listo" : "Harness local"}</strong><small>{runtime?.backend ?? "Detectando backend"}{modelStatus === "downloading" ? ` · ${modelProgress}%` : " · sin envío de preguntas"}</small></span>
    {!compact && <span className="runtime-markers"><span title="IndexedDB"><Database size={13} /></span><span title="Cache local"><Download size={13} /></span><span title="Modo offline"><WifiOff size={13} /></span></span>}
  </div>;
}
