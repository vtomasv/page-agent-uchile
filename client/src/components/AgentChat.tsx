// Style reminder: Archivo editorial cívico — the chat is an invitation to inspect the page, not a generic assistant bubble.

import { Bot, ChevronDown, CornerDownLeft, Headphones, Mic, Minus, PanelRight, Send, Square, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAgent } from "@/contexts/AgentContext";
import { RuntimeBadge } from "@/components/RuntimeBadge";
import { SourceChip } from "@/components/SourceChip";

const suggestions = ["¿Qué cursos de IA están disponibles?", "Compara Machine Learning con Deep Learning", "¿Qué curso empieza primero?", "Resume esta página", "¿Cuál parece apropiado para alguien interesado en LLMs?"];

function statusLabel(status: string) {
  return ({ thinking: "Leyendo el contexto…", generating: "Generando…", listening: "Escuchando…", transcribing: "Transcribiendo…", speaking: "Hablando…", error: "Revisa permisos del navegador", ready: "Listo para leer la página" } as Record<string, string>)[status] ?? "Listo para leer la página";
}

export function AgentChat() {
  const { status, messages, openChat, closeChat, minimizeChat, sendMessage, clearConversation, startListening, stopListening, stopGeneration, speak, runtime, config } = useAgent();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, status]);
  if (status === "closed") return <button className="chat-launcher" onClick={openChat} data-agent-chrome><span className="chat-launcher-icon"><Bot size={21} /></span><span><strong>Pregunta a la página</strong><small>Contexto local disponible</small></span><ChevronDown size={17} /></button>;
  if (status === "minimized") return <button className="chat-minimized" onClick={openChat} data-agent-chrome><span className="status-dot" data-state="ready" />Page Agent <span>{messages.length ? `${messages.length} mensajes` : "abrir"}</span></button>;
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (draft.trim()) { void sendMessage(draft); setDraft(""); } };
  return <section className="agent-chat" data-agent-chrome aria-label="Page Agent">
    <div className="chat-head"><div className="chat-title"><span className="chat-avatar"><Bot size={17} /></span><div><strong>Page Agent</strong><span><span className="status-dot" data-state={status === "error" ? "error" : "ready"} />{statusLabel(status)}</span></div></div><div className="chat-head-actions"><button onClick={minimizeChat} aria-label="Minimizar chat"><Minus size={17} /></button><button onClick={closeChat} aria-label="Cerrar chat"><X size={17} /></button></div></div>
    <div className="chat-runtime"><RuntimeBadge compact /><span className="chat-privacy"><PanelRight size={13} /> preguntas no salen del navegador</span></div>
    <div className="chat-messages" ref={scrollRef}>
      {!messages.length && <div className="chat-empty"><span className="empty-index">01</span><h2>Pregunta a la página,<br /><em>no a una caja negra.</em></h2><p>El asistente lee la ficha y el catálogo local para responder con fuentes visibles.</p><div className="suggestions">{suggestions.map((item) => <button key={item} onClick={() => { void sendMessage(item); }}>{item}<CornerDownLeft size={13} /></button>)}</div></div>}
      {messages.map((message) => <div className={`message ${message.role}`} key={message.id}><div className="message-meta">{message.role === "assistant" ? <><span className="message-avatar"><Bot size={13} /></span>Page Agent</> : "Tú"}</div><p>{message.content}</p>{message.role === "assistant" && <div className="message-actions"><button onClick={() => speak(message.content)}><Headphones size={13} /> Escuchar</button>{message.sources?.map((source) => <SourceChip source={source} key={source.id} />)}</div>}</div>)}
      {(status === "thinking" || status === "generating") && <div className="message assistant thinking-message"><div className="message-meta"><span className="message-avatar"><Bot size={13} /></span>Page Agent</div><div className="typing"><span /><span /><span /></div><button onClick={stopGeneration} className="stop-button"><Square size={12} /> Detener</button></div>}
    </div>
    <div className="chat-foot"><form onSubmit={submit} className="chat-form"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Pregunta por esta página…" rows={1} aria-label="Escribe una pregunta" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(event); } }} /><button type="button" className={`icon-button ${status === "listening" ? "is-listening" : ""}`} onClick={status === "listening" ? stopListening : startListening} aria-label={status === "listening" ? "Detener micrófono" : "Usar micrófono"}><Mic size={18} /></button><button type="submit" className="send-button" aria-label="Enviar pregunta"><Send size={17} /></button></form><div className="chat-foot-row"><span>Shift + Enter para una nueva línea</span><button onClick={clearConversation}><Trash2 size={13} /> Limpiar conversación</button></div></div>
  </section>;
}
