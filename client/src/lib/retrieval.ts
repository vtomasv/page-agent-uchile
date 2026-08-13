// Style reminder: Archivo editorial cívico — retrieval favors the visible page and makes sources inspectable.

import type { ContextChunk, RetrievalConfig } from "@/lib/types";

export type RetrievedChunk = ContextChunk & { score: number; lexicalScore: number; routeBoost: number };

function tokenize(text: string) {
  return text.toLocaleLowerCase("es-CL").normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/[a-z0-9]+/g) ?? [];
}

export function lexicalScore(query: string, text: string) {
  const queryTokens = new Set(tokenize(query));
  const textTokens = tokenize(text);
  if (!queryTokens.size || !textTokens.length) return 0;
  const matches = textTokens.filter((token) => queryTokens.has(token)).length;
  const uniqueMatches = new Set(textTokens.filter((token) => queryTokens.has(token))).size;
  return Math.min(1, matches / Math.max(3, queryTokens.size * 1.6) + uniqueMatches / Math.max(8, textTokens.length));
}

export function retrieveLocal(query: string, chunks: ContextChunk[], route: string, config: RetrievalConfig): RetrievedChunk[] {
  return chunks
    .map((chunk) => {
      const lexical = lexicalScore(query, `${chunk.heading ?? ""} ${chunk.text}`);
      const routeBoost = chunk.route === route || (route.startsWith("/cursos/") && chunk.entityType === "course" && chunk.route === route) ? config.currentPageBoost : 0;
      return { ...chunk, score: lexical + routeBoost, lexicalScore: lexical, routeBoost };
    })
    .filter((chunk) => chunk.score >= config.similarityThreshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, config.topK);
}

export function buildGroundedContext(chunks: RetrievedChunk[], maxChars = 5000) {
  let total = 0;
  return chunks
    .map((chunk) => {
      const line = `[${chunk.id}] ${chunk.heading ?? "Fuente"}: ${chunk.text}`;
      if (total + line.length > maxChars) return "";
      total += line.length;
      return line;
    })
    .filter(Boolean)
    .join("\n");
}

export function chunkForDom(route: string): ContextChunk[] {
  const main = document.querySelector("main");
  if (!main) return [];
  const elements = Array.from(main.querySelectorAll("h1, h2, h3, p, li")).filter((element) => !element.closest("[data-agent-chrome]"));
  const chunks: ContextChunk[] = [];
  let currentHeading = "";
  elements.forEach((element, index) => {
    const text = element.textContent?.trim();
    if (!text) return;
    if (/^H[1-3]$/.test(element.tagName)) currentHeading = text;
    if (text.length < 18 && !/^H[1-3]$/.test(element.tagName)) return;
    chunks.push({ id: `dom:${route}:${index}`, route, heading: currentHeading || undefined, text, selector: element.id ? `#${element.id}` : undefined, source: "dom" });
  });
  return chunks;
}
