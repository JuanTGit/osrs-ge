import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;

/* 
Prisma Pattern

prisma.model.method({
	where: { ... },   // condition — which rows
	data:  { ... },   // payload — what to save/update
	orderBy: { ... }, // sorting
	take: number      // limit
  })

*/
