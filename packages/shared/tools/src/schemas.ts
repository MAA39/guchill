import { z } from "zod";

export const CbtStepType = z.enum([
  "fact",
  "emotion",
  "body",
  "interpretation",
  "behavior",
  "auto_thought",
  "reasoning_error",
]);

export type CbtStepType = z.infer<typeof CbtStepType>;

export const RecordCbtStepInput = z.object({
  step_type: CbtStepType.describe("CBT step type"),
  quote_span: z.string().min(1).describe("Quote from user utterance"),
  confidence: z.number().min(0).max(1).describe("Classification confidence 0.0-1.0"),
});

export type RecordCbtStepInput = z.infer<typeof RecordCbtStepInput>;

export const PresentChoicesInput = z.object({
  title: z.string().min(1).describe("Question text before 3 choices"),
  choices: z
    .array(
      z.object({
        id: z.string().min(1).describe("Choice ID (e.g. a, b, c)"),
        label: z.string().min(1).describe("Choice label"),
      })
    )
    .length(3),
});

export type PresentChoicesInput = z.infer<typeof PresentChoicesInput>;
