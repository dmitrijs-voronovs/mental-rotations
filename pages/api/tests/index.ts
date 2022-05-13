import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json(
    await prisma.test.findMany({
      include: { tasks: true },
    })
  );
}
