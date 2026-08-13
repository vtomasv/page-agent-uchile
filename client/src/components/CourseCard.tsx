// Style reminder: Archivo editorial cívico — course cards read like a catalog, not generic app tiles.

import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { Link } from "wouter";
import type { Course } from "@/lib/types";

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  return <article className={`course-card accent-${course.accent}`} data-course-id={course.id} style={{ "--delay": `${index * 45}ms` } as React.CSSProperties}>
    <div className="course-card-top"><span className="course-code">{course.code}</span><span className="course-category">{course.category}</span></div>
    <h3>{course.title}</h3>
    <p>{course.shortDescription}</p>
    <div className="course-meta"><span><CalendarDays size={15} />{course.startDate}</span><span><Clock3 size={15} />{course.duration}</span></div>
    <div className="course-card-footer"><span>{course.price}</span><Link href={`/cursos/${course.slug}`} className="text-link">Ver ficha <ArrowUpRight size={15} /></Link></div>
  </article>;
}
