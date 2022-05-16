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

  const a = await prisma.userInfo.upsert({
    where: {
      userId: session.user.id,
    },
    update: {
      info: req.body,
    },
    create: {
      user: {
        connect: {
          id: session.user.id,
        },
      },
      info: req.body,
    },
  });
  res.json(a);
});

export default handler;
