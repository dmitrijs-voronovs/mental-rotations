import { FC } from "react";
import { Prisma } from "@prisma/client";
import { useTranslation } from "next-i18next";
import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

const timeFmt = new Intl.NumberFormat();
export const TestResults: FC<{
  data: Prisma.CompletedTaskCreateWithoutTestInput[];
}> = ({ data }) => {
  const { t } = useTranslation();
  return (
    <>
      <Heading fontSize={"xl"} pb={"1rem"}>
        {t("Your results:")}
      </Heading>
      <TableContainer mt={4} mb={6}>
        <Table variant="simple" size={"sm"}>
          <Thead>
            <Tr>
              <Th>{t("Task No.")}</Th>
              <Th>{t("Time (sec)")}</Th>
              <Th>{t("Correct")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(({ time, correct }, i) => (
              <Tr key={i}>
                <Td>{i + 1}</Td>
                <Td>{timeFmt.format(time)}</Td>
                <Td>{correct ? t("YES") : t("NO")}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>{t("Total")}:</Th>
              <Th textTransform={"lowercase"}>
                {timeFmt.format(
                  data.reduce((totalTime, d) => totalTime + d.time, 0)
                ) +
                  " " +
                  t("sec")}
              </Th>
              <Th>
                {data.reduce(
                  (totalCorrect, d) => totalCorrect + Number(d.correct),
                  0
                )}
                /{data.length}
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
};
