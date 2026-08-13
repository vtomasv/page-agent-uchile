// Style reminder: Archivo editorial cívico — the page remains primary; agent artifacts sit inside its reading flow.

import type { ReactNode } from "react";
import { AgentChat } from "@/components/AgentChat";
import { ContextRail } from "@/components/ContextRail";
import { PageArtifactView } from "@/components/PageArtifact";
import { RuntimeBadge } from "@/components/RuntimeBadge";
import { SiteHeader } from "@/components/SiteHeader";
import { useAgent } from "@/contexts/AgentContext";

export function AppShell({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { artifacts, removeArtifact } = useAgent();
  if (admin) return <div className="admin-shell"><SiteHeader />{children}<AgentChat /></div>;
  return <div className="site-shell"><SiteHeader /><div className="site-layout"><ContextRail /><main className="site-main"><RuntimeBadge />{artifacts.map((artifact) => <PageArtifactView key={artifact.id} artifact={artifact} onClose={() => removeArtifact(artifact.id)} />)}{children}</main></div><AgentChat /><footer className="site-footer" id="contacto"><div><span className="footer-kicker">DCC / Educación Continua</span><h2>Aprender también es<br /><em>seguir preguntando.</em></h2></div><div className="footer-contact"><strong>Departamento de Ciencias de la Computación</strong><span>FCFM, Universidad de Chile</span><span>Beauchef 851 · Santiago, Chile</span><a href="mailto:ec@dcc.uchile.cl">ec@dcc.uchile.cl</a></div><div className="footer-meta"><span>Snapshot de demostración · 2026</span><a href="/admin">Abrir harness admin ↗</a></div></footer></div>;
}
