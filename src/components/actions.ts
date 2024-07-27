"use server"

import { db } from "@/server/db"; // Import your Drizzle ORM setup
import { tornei } from "@/server/db/schema"; // Import the schema

export async function getTornei() {
  const result = await db.select().from(tornei);
  return result;
}