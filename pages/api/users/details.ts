import nc from "next-connect";
import { prisma } from "@lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Prisma } from "@prisma/client";

const handler = nc().post<NextApiRequest, NextApiResponse>(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401);
    return res.end();
  }

  const data = req.body as Partial<Prisma.UserInfoCreateInput>;

  const a = await prisma.userInfo.upsert({
    where: {
      userId: session.user.id,
    },
    update: {
      ...data,
    },
    create: {
      user: {
        connect: {
          id: session.user.id,
        },
      },
      info: data.info || {},
      testGroupIdx: data.testGroupIdx,
    },
  });
  res.json(a);
});

export default handler;
