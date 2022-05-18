import { Prisma, PrismaClient } from "@prisma/client";
import { TestResults } from "@components/EventDisplay";
import { TEST_NAMES } from "../config/testNames";

const prisma = new PrismaClient();

async function main() {
  const res = await Promise.all(TEST_NAMES.map(addTest));
  console.log(res);
}

async function addTest(testName: string) {
  const tasks = (await import(`../public/tests/${testName}/data.json`))
    .default as TestResults;
  const formattedTasks = formatTasks(tasks, testName);
  await prisma.test.upsert({
    where: { name: testName },
    update: {
      tasks: {
        deleteMany: {},
        createMany: {
          data: formattedTasks,
        },
      },
    },
    create: {
      name: testName,
      description: "The first test to conduct with 10 tasks of 7 blocks each",
      tasks: {
        createMany: {
          data: formattedTasks,
        },
      },
    },
    include: {
      tasks: true,
    },
  });
}

function getImgSrc(testName: string, src: string) {
  return `/tests/${testName}/${src}`;
}

function formatTasks(
  tasks: TestResults,
  testName: string
): Prisma.TaskUncheckedCreateWithoutTestInput[] {
  return tasks.map((t) => ({
    taskNumber: t.taskNumber,
    referenceShape: {
      "reference-spreadOnX": t["reference-spreadOnX"],
      "reference-spreadOnY": t["reference-spreadOnY"],
      "reference-spreadOnZ": t["reference-spreadOnZ"],
      "reference-totalBlocks": t["reference-totalBlocks"],
      "reference-finalRotationX": t["reference-finalRotationX"],
      "reference-finalRotationY": t["reference-finalRotationY"],
      "reference-finalRotationZ": t["reference-finalRotationZ"],
      "reference-maxDeltaForNextBlock": t["reference-maxDeltaForNextBlock"],
    },
    targetShape: {
      "target-spreadOnX": t["target-spreadOnX"],
      "target-spreadOnY": t["target-spreadOnY"],
      "target-spreadOnZ": t["target-spreadOnZ"],
      "target-totalBlocks": t["target-totalBlocks"],
      "target-finalRotationX": t["target-finalRotationX"],
      "target-finalRotationY": t["target-finalRotationY"],
      "target-finalRotationZ": t["target-finalRotationZ"],
      "target-maxDeltaForNextBlock": t["target-maxDeltaForNextBlock"],
    },
    angles: {
      rotationX: t.rotationX,
      rotationY: t.rotationY,
      rotationZ: t.rotationZ,
    },
    correctAnswer: t.correctAnswer,
    images: {
      referenceShape: getImgSrc(testName, t["referenceShape"]),
      referenceShapeRotated: getImgSrc(testName, t["referenceShapeRotated"]),
      testShape: getImgSrc(testName, t["testShape"]),
      testShape1: getImgSrc(testName, t["testShape1"]),
      testShape2: getImgSrc(testName, t["testShape2"]),
      testShape3: getImgSrc(testName, t["testShape3"]),
      testShape4: getImgSrc(testName, t["testShape4"]),
      testShape5: getImgSrc(testName, t["testShape5"]),
      scene: getImgSrc(testName, t["scene"]),
    },
  }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
