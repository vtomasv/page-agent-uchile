// Style reminder: Archivo editorial cívico — visual responses are temporary, validated, and reversible.

import type { AgentUIArtifact, PageMutation } from "@/lib/types";

export class ArtifactManager {
  private mutations: PageMutation[] = [];
  private listeners = new Set<(mutations: PageMutation[]) => void>();

  subscribe(listener: (mutations: PageMutation[]) => void) {
    this.listeners.add(listener);
    listener(this.mutations);
    return () => { this.listeners.delete(listener); };
  }

  private emit() {
    this.listeners.forEach((listener) => listener([...this.mutations]));
  }

  addArtifact(artifact: AgentUIArtifact) {
    this.mutations = [...this.mutations, { id: artifact.id, createdAt: Date.now(), artifact, status: "active" }];
    this.emit();
    return artifact;
  }

  removeArtifact(id: string) {
    this.mutations = this.mutations.map((mutation) => mutation.id === id ? { ...mutation, status: "removed" } : mutation);
    this.emit();
  }

  restoreArtifact(id: string) {
    this.mutations = this.mutations.map((mutation) => mutation.id === id ? { ...mutation, status: "active" } : mutation);
    this.emit();
  }

  removeAll() {
    this.mutations = this.mutations.map((mutation) => ({ ...mutation, status: "removed" }));
    this.emit();
  }

  undo() {
    const lastActive = [...this.mutations].reverse().find((mutation) => mutation.status === "active");
    if (lastActive) this.removeArtifact(lastActive.id);
  }

  getActive() {
    return this.mutations.filter((mutation) => mutation.status === "active");
  }

  getAll() {
    return [...this.mutations];
  }
}
