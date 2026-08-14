// Style reminder: Archivo editorial cívico — generated artifacts are native-looking, source-linked, and reversible.

import { ArrowUpRight, BookOpen, Check, ChevronDown, ChevronUp, Headphones, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useAgent } from "@/contexts/AgentContext";
import { SourceChip } from "@/components/SourceChip";
import { courseChunks } from "@/content/courses";
import { siteChunks } from "@/content/site";
import type { AgentUIArtifact, ComparisonData, Course } from "@/lib/types";

function ArtifactHeader({ artifact, onClose }: { artifact: AgentUIArtifact; onClose: () => void }) {
  const { speak } = useAgent();
  return <div className="artifact-header"><div className="artifact-label"><span className="artifact-badge">Generado por el asistente</span><span className="artifact-type">{artifact.type === "comparison" ? "Comparación" : artifact.type === "summary" ? "Resumen" : artifact.type === "recommendation" ? "Recomendación" : "Selección"}</span></div><div className="artifact-actions"><button onClick={() => speak(`${artifact.title}. ${artifact.subtitle ?? ""}`)} aria-label="Escuchar artifact"><Headphones size={15} /></button><button onClick={onClose} aria-label="Descartar artifact"><X size={16} /></button></div></div>;
}

function SourceRow({ ids }: { ids: string[] }) {
  const { currentChunks } = useAgent();
  const allChunks = [...currentChunks, ...siteChunks, ...courseChunks];
  return <div className="artifact-sources"><span>Fuentes</span>{ids.slice(0, 3).map((id) => { const chunk = allChunks.find((item) => item.id === id); return <SourceChip key={id} source={{ id, chunkId: id, label: chunk?.heading ?? id.split(":").slice(0, 2).join(" · "), route: chunk?.route ?? "/" }} />; })}</div>;
}

function ComparisonArtifact({ artifact, onClose }: { artifact: AgentUIArtifact; onClose: () => void }) {
  const data = artifact.data as ComparisonData;
  const [expanded, setExpanded] = useState(true);
  return <section className="page-artifact artifact-comparison" id={artifact.id} data-agent-artifact>
    <ArtifactHeader artifact={artifact} onClose={onClose} />
    <div className="artifact-body"><h2>{artifact.title}</h2><p className="artifact-subtitle">{artifact.subtitle}</p>
      <div className="comparison-grid">{data.courses.map((course) => <div className="comparison-course" key={course.id}><div className={`comparison-accent accent-${course.accent}`} /><span className="course-code">{course.code}</span><h3>{course.title}</h3><p>{course.shortDescription}</p><div className="comparison-stat"><strong>Inicio</strong><span>{course.startDate}</span></div><div className="comparison-stat"><strong>Duración</strong><span>{course.duration}</span></div><div className="comparison-stat"><strong>Precio</strong><span>{course.price}</span></div><Link href={`/cursos/${course.slug}`} className="text-link">Abrir ficha <ArrowUpRight size={15} /></Link></div>)}</div>
      <button className="artifact-expand" onClick={() => setExpanded((value) => !value)}>{expanded ? <>Ocultar lectura editorial <ChevronUp size={16} /></> : <>Ver lectura editorial <ChevronDown size={16} /></>}</button>
      {expanded && <div className="comparison-reading"><div><span className="reading-kicker">Puntos en común</span><ul>{data.similarities.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div><div><span className="reading-kicker">Diferencias visibles</span>{data.differences.map((item) => <div className="difference-row" key={item.label}><strong>{item.label}</strong><span>{item.values.join(" · ")}</span></div>)}</div><div className="interpretation-note"><span className="reading-kicker">Interpretación</span><p>{data.recommendation}</p></div></div>}
    </div><SourceRow ids={artifact.sources} />
  </section>;
}

function CourseListArtifact({ artifact, onClose }: { artifact: AgentUIArtifact; onClose: () => void }) {
  const data = artifact.data as { courses: Course[] };
  return <section className="page-artifact artifact-list" id={artifact.id} data-agent-artifact><ArtifactHeader artifact={artifact} onClose={onClose} /><div className="artifact-body"><h2>{artifact.title}</h2><p className="artifact-subtitle">{artifact.subtitle}</p><div className="artifact-course-list">{data.courses.map((course) => <div className="artifact-course-row" key={course.id}><div><span className="course-code">{course.code}</span><h3>{course.title}</h3><p>{course.shortDescription}</p></div><Link href={`/cursos/${course.slug}`} className="icon-link" aria-label={`Abrir ${course.title}`}><ArrowUpRight size={17} /></Link></div>)}</div></div><SourceRow ids={artifact.sources} /></section>;
}

function SummaryArtifact({ artifact, onClose }: { artifact: AgentUIArtifact; onClose: () => void }) {
  const data = artifact.data as { course: Course };
  const course = data.course;
  return <section className="page-artifact artifact-summary" id={artifact.id} data-agent-artifact><ArtifactHeader artifact={artifact} onClose={onClose} /><div className="artifact-body"><h2>{artifact.title}</h2><p className="artifact-subtitle">{artifact.subtitle}</p><div className="summary-columns"><div><span className="reading-kicker">En una línea</span><p className="summary-lead">{course.shortDescription}</p><span className="reading-kicker">Objetivos</span><ul>{course.objectives.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div><div><span className="reading-kicker">Ficha rápida</span><div className="fact-list"><div><strong>Inicio</strong><span>{course.startDate}</span></div><div><strong>Duración</strong><span>{course.duration}</span></div><div><strong>Modalidad</strong><span>{course.modality}</span></div><div><strong>Requisitos</strong><span>{course.requirements.join(" · ")}</span></div></div></div></div></div><SourceRow ids={artifact.sources} /></section>;
}

function RecommendationArtifact({ artifact, onClose }: { artifact: AgentUIArtifact; onClose: () => void }) {
  const data = artifact.data as { course: Course; reason: string };
  return <section className="page-artifact artifact-recommendation" id={artifact.id} data-agent-artifact><ArtifactHeader artifact={artifact} onClose={onClose} /><div className="artifact-body"><div className="recommendation-flag"><BookOpen size={18} /><span>Lectura basada en datos de la página</span></div><h2>{artifact.title}</h2><p className="artifact-subtitle">{artifact.subtitle}</p><div className="recommendation-box"><strong>{data.course.title}</strong><p>{data.reason}</p><Link href={`/cursos/${data.course.slug}`} className="text-link">Revisar objetivos y contenidos <ArrowUpRight size={15} /></Link></div><p className="artifact-disclaimer">No es una clasificación universal ni una promesa de resultado. Es una interpretación explícita basada en los datos visibles del snapshot.</p></div><SourceRow ids={artifact.sources} /></section>;
}

export function PageArtifactView({ artifact, onClose }: { artifact: AgentUIArtifact; onClose: () => void }) {
  const element = artifact.type === "comparison" ? <ComparisonArtifact artifact={artifact} onClose={onClose} /> : artifact.type === "course-list" ? <CourseListArtifact artifact={artifact} onClose={onClose} /> : artifact.type === "summary" ? <SummaryArtifact artifact={artifact} onClose={onClose} /> : artifact.type === "recommendation" ? <RecommendationArtifact artifact={artifact} onClose={onClose} /> : <SummaryArtifact artifact={artifact} onClose={onClose} />;
  return <div className="artifact-wrap">{element}<button className="artifact-dismiss" onClick={onClose}><RotateCcw size={14} /> Descartar esta vista</button></div>;
}
