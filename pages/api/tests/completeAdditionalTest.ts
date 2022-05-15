import nc from "next-connect";
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = nc().post<NextApiRequest, NextApiResponse>(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401);
    return res.end();
  }

  const a = await prisma.additionalTest.create({
    data: {
      type: req.body.type,
      data: req.body.data,
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });
  res.json(a);
});

export default handler;
