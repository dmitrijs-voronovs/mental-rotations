import { prisma } from "@lib/prisma";

export function getFirstEmotionTest(userId: string) {
  return prisma.additionalTest.findFirst({
    where: {
      userId,
      type: "EMOTION_WHEEL",
    },
    select: { id: true },
  });
}

export function getFirstMentalRotationTest(userId: string) {
  return prisma.completedTest.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });
}

export function getFirstDepressionTest(userId: string) {
  return prisma.additionalTest.findFirst({
    where: {
      userId,
      type: "PHQ9",
    },
    select: { id: true },
  });
}
