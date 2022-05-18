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
import { ArrowRightIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  if (!session?.user)
    return {
      redirect: {
        destination: `/${context.locale}/api/auth/signin/`,
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
      name: "Emotion test",
      description: "Test your emotions, tell about your feeling",
      link: "/forms/emotionTest",
      done: !!completedItems[0],
    },
    {
      name: "Mental rotation test",
      description: "Test your mental rotation abilities",
      link: "/tests",
      done: !!completedItems[1],
    },
    {
      name: "Patient Health Questionnaire-9 (PHQ9)",
      description: "Test how mentally healthy you are",
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
    <Center height={"100vh"}>
      <Navbar />
      <Box maxW={"xl"} mx={"auto"} my={5}>
        <VStack alignItems={"start"} spacing={5}>
          <Box mb={4}>
            <Heading mb={5}>Test status</Heading>
            <Text fontSize={"xl"}>
              This is your current test status. <br />
              Go through each item to complete the test:
            </Text>
          </Box>
          <Box>
            <List spacing={8}>
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
                      alignSelf={"start"}
                      mt={1}
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
