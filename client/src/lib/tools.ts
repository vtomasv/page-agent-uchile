// Style reminder: Archivo editorial cívico — tools are deterministic, typed, and never execute model-provided HTML.

import { courseById, courses, courseChunks, curriculumByCourse } from "@/content/courses";
import { siteChunks } from "@/content/site";
import { retrieveLocal, type RetrievedChunk } from "@/lib/retrieval";
import type { AgentUIArtifact, ContextChunk, Course, CurriculumData, CurriculumViewMode, RetrievalConfig } from "@/lib/types";

export type ToolContext = { route: string; currentChunks: ContextChunk[]; retrieval: RetrievalConfig };

export const toolDescriptions = [
  ["search_site", "Busca contenido dentro del snapshot local."],
  ["get_current_page", "Devuelve el contexto normalizado de la página actual."],
  ["get_course", "Lee una ficha factual de curso."],
  ["compare_courses", "Recopila datos de dos cursos antes de explicar diferencias."],
  ["navigate", "Propone una ruta interna sin navegar de forma inesperada."],
  ["scroll_to", "Desplaza la lectura hacia una sección ya existente."],
  ["highlight", "Destaca temporalmente la fuente asociada."],
  ["render_artifact", "Crea una visualización a través de un componente aprobado."],
  ["render_curriculum", "Construye una malla, flujo de precedencias o comparación paralela de cursos."],
  ["remove_artifact", "Retira una visualización temporal."],
  ["speak", "Lee un mensaje mediante una voz local o del navegador."],
] as const;

export function searchSite(query: string, context: ToolContext): RetrievedChunk[] {
  const all = [...context.currentChunks, ...siteChunks, ...courseChunks].filter((chunk, index, list) => list.findIndex((item) => item.id === chunk.id) === index);
  return retrieveLocal(query, all, context.route, context.retrieval);
}

export function getCurrentPage(context: ToolContext) {
  return context.currentChunks;
}

export function getCourse(courseId: string): Course | undefined {
  return courseById[courseId];
}

export function compareCourses(courseIds: string[]) {
  const selected = courseIds.map((id) => courseById[id]).filter(Boolean);
  if (selected.length < 2) return undefined;
  const categorySet = new Set(selected.map((course) => course.category));
  const modalities = new Set(selected.map((course) => course.modality));
  const similarities = [
    modalities.size === 1 ? `Ambos son ${selected[0].modality.toLocaleLowerCase("es-CL")}.` : "Ambos forman parte de la oferta de Educación Continua DCC.",
    "Son cursos con objetivos, contenidos, duración, precio e inicio descritos en el snapshot local.",
    categorySet.size === 1 ? `Comparten el foco de ${selected[0].category.toLocaleLowerCase("es-CL")}.` : "Permiten construir rutas complementarias de aprendizaje.",
  ];
  const differences = [
    { label: "Inicio / plazo", values: selected.map((course) => course.startDate) },
    { label: "Duración", values: selected.map((course) => course.duration) },
    { label: "Precio", values: selected.map((course) => course.price) },
    { label: "Foco", values: selected.map((course) => course.shortDescription) },
  ];
  return { courses: selected, similarities, differences, recommendation: "La opción más apropiada depende del punto de partida y del objetivo. Esta recomendación se basa solo en los objetivos, requisitos y contenidos descritos aquí." };
}

export function createComparisonArtifact(courseIds: string[]): AgentUIArtifact | undefined {
  const data = compareCourses(courseIds);
  if (!data) return undefined;
  return { id: `comparison-${courseIds.join("-")}-${Date.now()}`, type: "comparison", title: "Una comparación para seguir leyendo", subtitle: "Datos del snapshot local, con interpretación separada.", sources: data.courses.map((course) => `course:${course.id}:overview`), data, placement: { mode: "top" }, createdAt: Date.now() };
}

export function resolveCurriculumCourseIds(query: string, route: string, currentChunks: ContextChunk[] = []) {
  const explicit = matchCourseIds(query);
  if (explicit.length) return explicit;
  const visibleCourseIds = Array.from(new Set(currentChunks.filter((chunk) => chunk.entityType === "course").map((chunk) => chunk.entityId ?? chunk.id.split(":")[1]).filter(Boolean)));
  if (visibleCourseIds.length) return visibleCourseIds;
  const routeCourse = courses.find((course) => `/cursos/${course.slug}` === route);
  return routeCourse ? [routeCourse.id] : courses.slice(0, 3).map((course) => course.id);
}

export function createCurriculumArtifact(courseIds: string[], mode: CurriculumViewMode = "flow"): AgentUIArtifact | undefined {
  const selected = courseIds.map((id) => courseById[id]).filter(Boolean).slice(0, 4);
  if (!selected.length) return undefined;
  const data: CurriculumData = { courses: selected.map((course) => ({ course, modules: curriculumByCourse[course.id] ?? [] })), mode };
  return { id: `curriculum-${courseIds.join("-")}-${Date.now()}`, type: "curriculum", title: mode === "compare" ? "Mallas en paralelo" : `Malla · ${selected[0].title}`, subtitle: "Flujo de aprendizaje y precedencias del snapshot local.", sources: selected.map((course) => `course:${course.id}:curriculum`), data, placement: { mode: "top" }, createdAt: Date.now() };
}

export function createSummaryArtifact(course: Course): AgentUIArtifact {
  return { id: `summary-${course.id}-${Date.now()}`, type: "summary", title: `Resumen · ${course.title}`, subtitle: "Una ficha breve creada a partir de la página consultada.", sources: [`course:${course.id}:overview`, `course:${course.id}:objectives`, `course:${course.id}:contents`], data: { course }, placement: { mode: "top" }, createdAt: Date.now() };
}

export function createCourseListArtifact(items: Course[], title = "Cursos que coinciden con tu pregunta"): AgentUIArtifact {
  return { id: `course-list-${Date.now()}`, type: "course-list", title, subtitle: "Resultados del catálogo local de demostración.", sources: items.map((course) => `course:${course.id}:overview`), data: { courses: items }, placement: { mode: "top" }, createdAt: Date.now() };
}

export function createRecommendationArtifact(course: Course, reason: string): AgentUIArtifact {
  return { id: `recommendation-${course.id}-${Date.now()}`, type: "recommendation", title: "Una ruta posible desde esta página", subtitle: "La interpretación está separada de los datos del sitio.", sources: [`course:${course.id}:overview`, `course:${course.id}:objectives`, `course:${course.id}:contents`], data: { course, reason }, placement: { mode: "top" }, createdAt: Date.now() };
}

export function matchCourseIds(query: string) {
  const normalized = query.toLocaleLowerCase("es-CL");
  return courses.filter((course) => {
    const terms = [course.id, course.title, course.slug, course.category, ...course.contents].join(" ").toLocaleLowerCase("es-CL");
    return terms.split(/\s+/).some((term) => term.length > 4 && normalized.includes(term)) || normalized.includes(course.id.replace(/-/g, " "));
  }).map((course) => course.id);
}

export function resolveComparisonCourseIds(query: string, currentChunks: ContextChunk[] = []) {
  const explicit = matchCourseIds(query);
  if (explicit.length >= 2) return explicit;
  const visibleCourseIds = Array.from(new Set(currentChunks.filter((chunk) => chunk.entityType === "course").map((chunk) => chunk.entityId ?? chunk.id.split(":")[1]).filter(Boolean)));
  if (visibleCourseIds.length >= 2) return visibleCourseIds;
  return courses.slice(0, 3).map((course) => course.id);
}
