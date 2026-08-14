import { describe, expect, it } from "vitest";
import { answerGrounded } from "@/lib/agent";
import { DEFAULT_CONFIG } from "@/lib/config";

describe("Page Agent comparison intent", () => {
  it("creates a grounded comparison when the user asks for prices and deadlines without naming courses", () => {
    const result = answerGrounded("Hazme una comparación de precios y plazos", "/", [], DEFAULT_CONFIG);
    expect(result.status).toBe("grounded");
    expect(result.artifact?.type).toBe("comparison");
    expect(result.artifact?.data).toMatchObject({ courses: expect.arrayContaining([expect.objectContaining({ price: expect.any(String), startDate: expect.any(String) })]) });
    expect(result.sources.length).toBeGreaterThanOrEqual(2);
  });
});
