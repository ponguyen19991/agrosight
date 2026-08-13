import { z } from "zod";

export const fieldsQuerySchema = z.object({
  farmId: z.string().min(1, "farmId is required"),
});

export type FieldsQuery = z.infer<typeof fieldsQuerySchema>;

const geoJsonPolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.array(z.number()).length(2))).min(1),
});

export const createFieldSchema = z.object({
  farmId: z.string().min(1),
  name: z.string().min(1, "Field name is required").max(100),
  cropType: z.string().min(1, "Crop is required"),
  growthStage: z.string().min(1),
  boundary: geoJsonPolygonSchema,
  areaHectares: z.number().positive("Draw a boundary before continuing"),
  notes: z.string().max(2000).optional(),
  assignedManagerName: z.string().max(120).optional(),
  irrigationType: z.string().max(60).optional(),
  plantingDate: z.coerce.date().optional(),
});

export type CreateFieldInput = z.infer<typeof createFieldSchema>;

export const updateFieldSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  cropType: z.string().min(1).optional(),
  growthStage: z.string().min(1).optional(),
  notes: z.string().max(2000).nullable().optional(),
  assignedManagerName: z.string().max(120).nullable().optional(),
  irrigationType: z.string().max(60).nullable().optional(),
  plantingDate: z.coerce.date().nullable().optional(),
});

export type UpdateFieldInput = z.infer<typeof updateFieldSchema>;
