"use server";

import { date, z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const changeBioSchema = z.object({
  description: z
    .string()
    .min(4, "A descrição precisa ter no mínimo 4 caracteres"),
});

type ChangeBioSchema = z.infer<typeof changeBioSchema>;

export async function changeBio(data: ChangeBioSchema) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      data: null,
      error: "Usuário não autenticado",
    };
  }

  const schema = changeBioSchema.safeParse(data);

  if (!schema.success) {
    return {
      data: null,
      error: schema.error.issues[0].message,
    };
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        bio: data.description,
      },
    });

    return {
      data: user,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Falha ao salvar alterações",
    };
  }
}
