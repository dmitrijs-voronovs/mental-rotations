import {
  Box,
  Button,
  Heading,
  Link,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ArrowRightIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@lib/prisma";
import NextLink from "next/link";
import JSConfetti from "js-confetti";

type Item = {
  done: boolean;
  name: string;
  description: string;
  link: string;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  const userId = session!.user.id;
  const completedItems = await Promise.all([
    prisma.additionalTest.findFirst({
      where: {
        userId,
        type: "EMOTION_WHEEL",
      },
      select: { id: true },
    }),
    prisma.completedTest.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    }),
    prisma.additionalTest.findFirst({
      where: {
        userId,
        type: "PHQ9",
      },
      select: { id: true },
    }),
  ]);
  const items: Item[] = [
    {
      name: "Emotion test",
      description: "Emotion Test description",
      link: "/forms/emotionTest",
      done: !!completedItems[0],
    },
    {
      name: "Mental rotation test",
      description: "Mental rotation test description",
      link: "/tests",
      done: !!completedItems[1],
    },
    {
      name: "Depression test (PHQ9)",
      description: "Depression test (PHQ9) description",
      link: "/forms/phq9",
      done: !!completedItems[2],
    },
  ];

  return {
    props: {
      items,
      locale: context.locale,
    },
  };
};

export default function Status({
  items,
  locale,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const allDone = items.every((i) => i.done);
  const pendingIdx = items.findIndex((i) => !i.done);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confetti = useRef<JSConfetti>();

  useEffect(() => {
    if (items.every((i) => i.done)) {
      confetti.current = new JSConfetti({ canvas: canvasRef.current! });
      setInterval(() => confetti.current!.addConfetti(), 2000);
    }
  }, [items]);

  return (
    <>
      <VStack>
        <Box>
          <Heading>Status</Heading>
          <Text>This is your current test status</Text>
        </Box>
        <Box>
          <List spacing={3}>
            {items.map((item, idx) => {
              const ListItemDetails = (
                <VStack alignItems={"start"} spacing={0}>
                  <Text casing={"uppercase"} fontWeight={"bold"}>
                    {item.name}
                  </Text>
                  <Text>{item.description}</Text>
                </VStack>
              );
              return (
                <ListItem
                  key={item.name}
                  display={"flex"}
                  alignItems={"center"}
                >
                  <ListIcon
                    as={
                      item.done
                        ? CheckIcon
                        : idx === pendingIdx
                        ? ArrowRightIcon
                        : CloseIcon
                    }
                    color={
                      item.done
                        ? "green.500"
                        : idx === pendingIdx
                        ? "blue.500"
                        : "red.500"
                    }
                  />
                  {item.done || idx !== pendingIdx ? (
                    ListItemDetails
                  ) : (
                    <NextLink href={item.link} locale={locale}>
                      <Link>{ListItemDetails}</Link>
                    </NextLink>
                  )}
                </ListItem>
              );
            })}
          </List>
          {allDone && (
            <Button
              onClick={() => {
                confetti.current?.addConfetti();
              }}
            >
              You did it, hooray!!!
            </Button>
          )}
        </Box>
      </VStack>
      <canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
        ref={canvasRef}
      />
    </>
  );
}