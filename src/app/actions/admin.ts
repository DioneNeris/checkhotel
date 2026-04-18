"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role, RoomStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

// --- USUÁRIOS ---
export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as Role;

  // Gerar senha temporária aleatória (8 caracteres)
  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  await prisma.user.create({
    data: { 
      name, 
      email, 
      role, 
      passwordHash: hashedPassword,
      requiresNewPassword: true,
      active: true
    },
  });

  revalidatePath("/admin/usuarios");
  return { tempPassword }; // Retornar para exibir no modal
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as Role;
  const active = formData.get("active") === "true";

  await prisma.user.update({
    where: { id },
    data: { name, email, role, active },
  });

  revalidatePath("/admin/usuarios");
}

export async function resetUserPassword(id: string) {
  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({
    where: { id },
    data: { 
      passwordHash: hashedPassword,
      requiresNewPassword: true 
    },
  });

  revalidatePath("/admin/usuarios");
  return { tempPassword };
}

export async function deleteUser(id: string) {
  // Em vez de deletar, inativamos para manter o histórico
  await prisma.user.update({
    where: { id },
    data: { active: false },
  });
  revalidatePath("/admin/usuarios");
}

// --- CAMAREIRAS ---
export async function createMaid(formData: FormData) {
  const name = formData.get("name") as string;
  const active = formData.get("active") === "true";

  await prisma.maid.create({
    data: { name, active },
  });

  revalidatePath("/admin/camareiras");
}

export async function updateMaid(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const active = formData.get("active") === "true";

  await prisma.maid.update({
    where: { id },
    data: { name, active },
  });

  revalidatePath("/admin/camareiras");
}

export async function deleteMaid(id: string) {
  await prisma.maid.delete({ where: { id } });
  revalidatePath("/admin/camareiras");
}

// --- QUARTOS ---
export async function createRoom(formData: FormData) {
  const number = formData.get("number") as string;

  await prisma.room.create({
    data: { number, status: RoomStatus.FREE },
  });

  revalidatePath("/admin/quartos");
}

export async function updateRoom(id: string, formData: FormData) {
  const number = formData.get("number") as string;

  await prisma.room.update({
    where: { id },
    data: { number },
  });

  revalidatePath("/admin/quartos");
}

export async function deleteRoom(id: string) {
  await prisma.room.delete({ where: { id } });
  revalidatePath("/admin/quartos");
}

// --- CHECKLIST ---
export async function createChecklistItem(formData: FormData) {
  const description = formData.get("description") as string;
  const order = parseInt(formData.get("order") as string);

  await prisma.checklistItem.create({
    data: { description, order, isActive: true },
  });

  revalidatePath("/admin/checklist");
}

export async function updateChecklistItem(id: string, formData: FormData) {
  const description = formData.get("description") as string;
  const order = parseInt(formData.get("order") as string);
  const isActive = formData.get("isActive") === "true";

  await prisma.checklistItem.update({
    where: { id },
    data: { description, order, isActive },
  });

  revalidatePath("/admin/checklist");
}

export async function deleteChecklistItem(id: string) {
  await prisma.checklistItem.delete({ where: { id } });
  revalidatePath("/admin/checklist");
}

