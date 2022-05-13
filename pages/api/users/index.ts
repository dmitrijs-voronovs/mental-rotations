import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json(
    await prisma.user.findMany({
      include: { accounts: true, sessions: true, _count: true },
    })
  );
}
