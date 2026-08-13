// Style reminder: Archivo editorial cívico — the replica keeps the DCC information architecture visible.

import type { ContextChunk, SiteSection } from "@/lib/types";

export const siteSections: SiteSection[] = [
  {
    id: "about",
    title: "¿Quiénes somos?",
    eyebrow: "El contexto de la página",
    body: "Bienvenidos a Educación Continua del Departamento de Ciencias de la Computación de la Universidad de Chile. Aquí se reúnen programas para potenciar habilidades, mantenerte actualizado o reinventar tu carrera profesional.",
    bullets: ["Programas respaldados por la excelencia académica de la Universidad de Chile.", "Clases 100% online y en vivo.", "Oferta de Magíster, Diplomas, Cursos y Bootcamps."],
  },
  {
    id: "programs",
    title: "Magíster y Diplomas",
    eyebrow: "Rutas de formación",
    body: "La oferta de Educación Continua incluye el Magíster en Tecnologías de la Información y diplomas profesionales en Python, Protección de Datos Personales, Inteligencia Artificial, Ingeniería de Software, Gestión de Proyectos Informáticos y Ciencia e Ingeniería de Datos.",
  },
  {
    id: "bootcamps",
    title: "Bootcamps",
    eyebrow: "Aprendizaje intensivo",
    body: "Los bootcamps de Educación Continua cubren Desarrollo de Aplicaciones Móviles, Diseño UX/UI, Desarrollo Frontend y Desarrollo Backend.",
    bullets: ["Desarrollo de Aplicaciones Móviles", "Diseño UX/UI", "Desarrollo Frontend", "Desarrollo Backend"],
  },
  {
    id: "contact",
    title: "Contacto",
    eyebrow: "Conversemos",
    body: "Departamento de Ciencias de la Computación, FCFM, Universidad de Chile. Beauchef #851, Edificio Poniente, segundo piso, oficinas 210-214. Santiago, Chile.",
    bullets: ["ec@dcc.uchile.cl", "+56 2 2978 4965", "+56 9 8434 8251"],
  },
];

export const siteChunks: ContextChunk[] = siteSections.map((section) => ({
  id: `site:${section.id}`,
  route: "/",
  entityType: section.id === "contact" ? "contact" : "section",
  entityId: section.id,
  heading: section.title,
  text: [section.body, ...(section.bullets ?? [])].join(" "),
  selector: `#section-${section.id}`,
  source: "structured-content",
}));

export const navItems = ["Nosotros", "Pregrado", "Postgrado", "Educación Continua", "Investigación", "Difusión"];

export const pageSourceLabel = "Educación Continua DCC · snapshot de demostración";
