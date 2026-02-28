import { ZodObject } from "zod";

export const zodValidator = <T>(payload: T, schema: ZodObject) => {
  const validatedPayload = schema.safeParse(payload);

  if (!validatedPayload.success) {
    return {
      success: false,
      errors: validatedPayload.error.issues.map((e) => {
        return {
          field: e.path[0] as string,
          message: e.message as string,
        };
      }),
    };
  }

  return {
    success: validatedPayload.success,
    data: validatedPayload.data,
    message: "",
  };
};
