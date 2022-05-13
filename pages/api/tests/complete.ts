import nc from "next-connect";
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = nc().post<NextApiRequest, NextApiResponse>(async (req, res) => {
  const a = await prisma.completedTest.create({
    data: req.body,
    include: {
      tasks: true,
    },
  });

  res.json(a);
});

export default handler;
