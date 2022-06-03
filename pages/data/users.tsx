import React, { FC, useState } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CenteredContainer } from "@components/CenteredContainer";
import { Heading, Input, Link, ListItem, OrderedList } from "@chakra-ui/react";
import { prisma } from "@lib/prisma";
import NextLink from "next/link";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userIds = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  return {
    props: {
      userIds,
      locale: context.locale,
      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

const DynamicTest: FC<{ userIds: { id: string }[]; locale: string }> = ({
  userIds,
  locale,
}) => {
  const [search, setSearch] = useState("");
  const ids = userIds.filter(({ id }) => id.includes(search));

  console.log(userIds, ids);
  return (
    <CenteredContainer flexDirection={"column"} justifyContent={"flex-start"}>
      <Heading pb={5} textAlign={"center"}>
        User data
      </Heading>
      <Input
        my={3}
        maxW={"2xs"}
        placeholder={"search"}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <OrderedList>
        {ids.map(({ id }) => (
          <ListItem key={id}>
            <NextLink href={`/data/user/${id}`} locale={locale}>
              <Link>{id}</Link>
            </NextLink>
          </ListItem>
        ))}
      </OrderedList>
    </CenteredContainer>
  );
};

export default DynamicTest;
