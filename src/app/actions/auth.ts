"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Não autorizado");
  }

  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    throw new Error("As senhas não coincidem");
  }

  if (newPassword.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      passwordHash: hashedPassword,
      requiresNewPassword: false,
    },
  });

  revalidatePath("/");
  return { success: true };
}
