// Style reminder: Archivo editorial cívico — provenance is clickable, local, and easy to inspect.

import { Link } from "wouter";
import { ArrowUpRight, Quote } from "lucide-react";
import { useAgent } from "@/contexts/AgentContext";
import type { AgentSource } from "@/lib/types";

export function SourceChip({ source }: { source: AgentSource }) {
  const { focusSource } = useAgent();
  const handleClick = () => { focusSource(source.chunkId ?? source.id); };
  return <button className="source-chip" onClick={handleClick} title="Ir a la fuente dentro de la página" aria-label={`Fuente: ${source.label}`}>
    <Quote size={12} /> <span>{source.label}</span><ArrowUpRight size={12} />
  </button>;
}
