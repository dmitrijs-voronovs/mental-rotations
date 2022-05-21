import {
  Box,
  Button,
  Center,
  Heading,
  Link,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ArrowRightIcon, CheckIcon, TimeIcon } from "@chakra-ui/icons";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import NextLink from "next/link";
import JSConfetti from "js-confetti";
import {
  getFirstDepressionTest,
  getFirstEmotionTest,
  getFirstMentalRotationTest,
} from "@utils/status/statusHelpers";
import { Navbar } from "@components/Navbar";

type Item = {
  done: boolean;
  name: string;
  description: string;
  link: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user)
    return {
      redirect: {
        destination: `/api/auth/signin/`,
        permanent: false,
      },
    };

  if (!session.user.infoFilled)
    return {
      redirect: {
        destination: `/${context.locale}/forms/newUser/`,
        permanent: false,
      },
    };

  const userId = session!.user.id;
  const completedItems = await Promise.all([
    getFirstEmotionTest(userId),
    getFirstMentalRotationTest(userId),
    getFirstDepressionTest(userId),
  ]);

  const items: Item[] = [
    {
      name: "Emotions",
      description:
        "The emotions and feelings you have experienced for the past 2 weeks",
      link: "/forms/emotionTest",
      done: !!completedItems[0],
    },
    {
      name: "Object rotation",
      description: "Discover your mental rotation abilities",
      link: "/tests",
      done: !!completedItems[1],
    },
    {
      name: "Health and depression",
      description: "Your health and depression state",
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
}: {
  items: Item[];
  locale: string | undefined;
}) {
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
    <Center height={"100vh"}>
      <Navbar />
      <Box maxW={"xl"} mx={"auto"} my={5}>
        <VStack alignItems={"start"} spacing={5}>
          <Box mb={4}>
            <Heading mb={5}>Experiment status</Heading>
            <Text fontSize={"xl"}>
              Go through each item to complete the experiment:
            </Text>
          </Box>
          <Box>
            <List spacing={4}>
              {items.map((item, idx) => {
                const ListItemDetails = (
                  <VStack
                    cursor={idx === pendingIdx ? "pointer" : "not-allowed"}
                    alignItems={"start"}
                    spacing={0}
                    pl={2}
                  >
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
                    p={3}
                    borderRadius={"5px"}
                    _hover={{ background: "purple.50" }}
                  >
                    <ListIcon
                      alignSelf={"start"}
                      mt={1}
                      as={
                        item.done
                          ? CheckIcon
                          : idx === pendingIdx
                          ? ArrowRightIcon
                          : TimeIcon
                      }
                      color={item.done ? "green.500" : "blue.500"}
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
          </Box>
          {allDone && (
            <Button
              onClick={() => {
                confetti.current?.addConfetti();
              }}
            >
              You did it, hooray!!!
            </Button>
          )}
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
      </Box>
    </Center>
  );
}
