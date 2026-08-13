// Style reminder: Archivo editorial cívico — institutional navigation anchors the page before the assistant speaks.

import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/content/site";
import { useAgent } from "@/contexts/AgentContext";

export function SiteHeader() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { runtime } = useAgent();
  return (
    <header className="site-header" data-agent-chrome>
      <div className="top-strip">
        <div className="brand-lockup">
          <img src="/manus-storage/page-agent-mark_4c100dab.png" alt="" className="brand-mark" />
          <div>
            <span className="brand-overline">Departamento de Ciencias de la Computación</span>
            <span className="brand-title">Universidad de Chile</span>
          </div>
        </div>
        <div className="top-strip-right">
          <span>FCFM · Educación Continua</span>
          <a href="#contacto">Contacto <ArrowUpRight size={14} /></a>
        </div>
        <button className="mobile-menu-button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div className={`main-nav ${mobileOpen ? "is-open" : ""}`}>
        <div className="main-nav-inner">
          <Link href="/" className="section-name" onClick={() => setMobileOpen(false)}>Educación Continua</Link>
          <nav aria-label="Navegación institucional">
            {navItems.map((item) => <a key={item} href={item === "Educación Continua" ? "#inicio" : "#contacto"} className={item === "Educación Continua" ? "is-current" : ""} onClick={() => setMobileOpen(false)}>{item}</a>)}
          </nav>
          <div className="nav-status">
            <span className="status-dot" data-state={runtime?.backend === "WebGPU" ? "ready" : "soft"} />
            <span>{runtime?.backend === "WebGPU" ? "Agente local · GPU" : "Agente local · listo"}</span>
          </div>
        </div>
      </div>
      <div className="sub-nav">
        <div className="sub-nav-inner">
          <span className="sub-nav-label">DCC / Formación profesional</span>
          <nav aria-label="Secciones de Educación Continua">
            <Link href="/cursos" className={location === "/cursos" ? "is-current" : ""}>Cursos</Link>
            <a href="#programas">Programas</a>
            <a href="#contacto">Docentes</a>
            <a href="#contacto">Equipo</a>
          </nav>
          <a href="#contacto" className="apply-link">Postula aquí <ArrowUpRight size={15} /></a>
        </div>
      </div>
    </header>
  );
}
