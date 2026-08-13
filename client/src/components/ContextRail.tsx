// Style reminder: Archivo editorial cívico — the current page gets a quiet, useful margin note.

import { BookOpenText, ChevronRight, ScanText } from "lucide-react";
import { useAgent } from "@/contexts/AgentContext";
import { getCourseForRoute } from "@/contexts/AgentContext";
import { siteSections } from "@/content/site";

export function ContextRail() {
  const { route, currentChunks, openChat, focusSource } = useAgent();
  const course = getCourseForRoute(route);
  const headings = currentChunks.filter((chunk) => chunk.heading).slice(0, 5);
  return <aside className="context-rail" data-agent-chrome aria-label="Contexto de la página">
    <div className="rail-kicker"><span className="status-dot" data-state="ready" />Page awareness</div>
    <div className="rail-title"><ScanText size={17} /><span>Lo que estás leyendo</span></div>
    <p className="rail-copy">El agente prioriza este contenido antes de buscar en el catálogo local.</p>
    {course ? <div className="rail-course"><span className="course-code">{course.code}</span><strong>{course.title}</strong><span>{course.category}</span></div> : <div className="rail-course"><span className="course-code">DCC / EC</span><strong>Educación Continua</strong><span>Snapshot local · 8 cursos</span></div>}
    <div className="rail-links">{headings.map((chunk) => <button key={chunk.id} onClick={() => focusSource(chunk.id)}><span>{chunk.heading}</span><ChevronRight size={14} /></button>)}</div>
    <button className="rail-ask" onClick={openChat}><BookOpenText size={15} /> Preguntar sobre esta página</button>
    <div className="rail-footnote">{siteSections.length + 8} fuentes indexadas · datos locales</div>
  </aside>;
}
