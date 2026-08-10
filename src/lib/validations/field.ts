import { z } from "zod";

export const fieldsQuerySchema = z.object({
  farmId: z.string().min(1, "farmId is required"),
});

export type FieldsQuery = z.infer<typeof fieldsQuerySchema>;
