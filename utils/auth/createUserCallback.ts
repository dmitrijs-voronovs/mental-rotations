import { Prisma } from "@prisma/client";
import { User } from "next-auth";
import { prisma } from "@lib/prisma";

const ALL_GROUPS = [1, 2, 3];

function getGroupWithLeastMembers(
  allGroupsInfo: (Prisma.PickArray<
    Prisma.UserInfoGroupByOutputType,
    "testGroupIdx"[]
  > & { _count: { _all: number } })[]
): number {
  if (allGroupsInfo.length !== ALL_GROUPS.length) {
    return ALL_GROUPS.find(
      (groupId) => !allGroupsInfo.some((info) => info.testGroupIdx === groupId)
    )!;
  }

  const { testGroupIdx } = allGroupsInfo.slice(1).reduce(
    (acc, group) => {
      return group._count._all < acc.min
        ? {
            min: group._count._all,
            testGroupIdx: group.testGroupIdx,
          }
        : acc;
    },
    {
      min: allGroupsInfo[0]._count._all,
      testGroupIdx: allGroupsInfo[0].testGroupIdx,
    }
  );
  return testGroupIdx;
}

export async function createUserCallback(message: { user: User }) {
  console.log("starting to create", message.user);
  const allGroupsInfo = await prisma.userInfo.groupBy({
    by: ["testGroupIdx"],
    _count: {
      _all: true,
    },
  });
  const dat = await prisma.userInfo.create({
    data: {
      user: {
        connect: {
          id: message.user.id,
        },
      },
      testGroupIdx: getGroupWithLeastMembers(allGroupsInfo),
      info: {},
    },
  });
  console.log("created", dat);
}
