// Style reminder: Archivo editorial cívico — the catalog behaves like an index with human-readable metadata.

import { ArrowDown, ArrowUpRight, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { CourseCard } from "@/components/CourseCard";
import { courses } from "@/content/courses";

export default function Courses() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const categories = ["Todas", ...Array.from(new Set(courses.map((course) => course.category)))];
  const visible = useMemo(() => courses.filter((course) => (category === "Todas" || course.category === category) && `${course.title} ${course.shortDescription} ${course.contents.join(" ")}`.toLocaleLowerCase("es-CL").includes(query.toLocaleLowerCase("es-CL"))), [category, query]);
  return <AppShell><section className="catalog-hero"><div><span className="eyebrow"><span className="eyebrow-line" /> Catálogo local</span><h1>Todo empieza<br /><em>con una ruta.</em></h1></div><p>Explora la oferta de cursos y programas de Educación Continua DCC. El asistente puede ayudarte a encontrar, comparar y leer entre estas fichas.</p><div className="catalog-count"><strong>{courses.length.toString().padStart(2, "0")}</strong><span>cursos indexados<br />en este snapshot</span></div></section><section className="catalog-section"><div className="catalog-toolbar"><div className="catalog-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por tema, curso o contenido" aria-label="Buscar cursos" /></div><div className="category-filters"><Filter size={15} />{categories.map((item) => <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="catalog-result-line"><span>{visible.length} resultados</span><Link href="/" className="text-link">Volver al inicio <ArrowUpRight size={15} /></Link></div><div className="course-grid catalog-grid">{visible.map((course, index) => <CourseCard key={course.id} course={course} index={index} />)}</div>{!visible.length && <div className="empty-catalog"><span>00</span><h2>No encontramos esa ruta.</h2><p>Prueba con “datos”, “software” o “inteligencia artificial”.</p></div>}<div className="catalog-foot"><span className="eyebrow dark-eyebrow">¿Quieres contexto?</span><h2>Pregunta por la diferencia,<br /><em>no solo por el nombre.</em></h2><ArrowDown size={18} /></div></section></AppShell>;
}
