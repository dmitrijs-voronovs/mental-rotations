import { PrismaClient } from "@prisma/client";
import test1 from "../public/tests/1-easy/data.json";
import { TestResults } from "@components/EventDisplay";

const prisma = new PrismaClient();

async function main() {
  const tasks = test1 as TestResults;
  const formattedTasks = formatTasks(tasks);
  const testData = await prisma.test.upsert({
    where: { name: "complex" },
    update: {
      tasks: {
        deleteMany: {},
        createMany: {
          data: formattedTasks,
        },
      },
    },
    create: {
      name: "complex",
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
  console.log(testData);
}

function formatTasks(tasks: TestResults) {
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
    // imageUrl: t.scene.split("/").slice(0, -1).join("/") + "/",
    imageUrl: "tests/complex/",
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
