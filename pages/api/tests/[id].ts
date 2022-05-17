import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  if (req.method === "GET") {
    res.json(
      await prisma.test.findUnique({
        where: { id },
        include: { tasks: true },
      })
    );
  } else if (req.method === "POST" || req.method === "PUT") {
    res.json(
      await prisma.test.create({ data: req.body, include: { tasks: true } })
    );
  } else if (req.method === "DELETE") {
    res.json(await prisma.test.delete({ where: { id } }));
  } else {
    throw new Error("Noooooo");
  }
}
