import { z } from "zod";

export const geocodeQuerySchema = z.object({
  q: z.string().trim().min(2, "Type at least 2 characters").max(100),
});

export type GeocodeQuery = z.infer<typeof geocodeQuerySchema>;
