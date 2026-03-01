import z from "zod";
import {
  ReactionFor,
  ReactionType,
} from "../../../../../prisma/generated/enums";

export const reactionValidationSchema = z.object({
  type: z.enum(Object.values(ReactionType)),
  reactionFor: z.enum(Object.values(ReactionFor)),
  targetId: z.string(),
});
