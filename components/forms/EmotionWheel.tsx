import {
  Box,
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FastField, FieldProps, Formik } from "formik";
import { Fragment, useState } from "react";
import { useTranslation } from "next-i18next";

export const emotions = [
  "Interese",
  "Uzjautrinājums",
  "Lepnums",
  "Prieks",
  "Bauda",
  "Apmierinājums",
  "Apbrīna",
  "Mīlestība",
  "Atvieglojums",
  "Līdzjutība",
  "Skumjas",
  "Vaina",
  "Nožela",
  "Kauns",
  "Vilšanās",
  "Bailes",
  "Riebums",
  "Nicinājums",
  "Naids",
  "Dusmas",
];

export const getOverview = (
  score: Record<string, number>
): {
  "Positive Valence": number;
  "Negative Valence": number;
  "High Control/Power": number;
  "Low Control/Power": number;
} => {
  const values = emotions.map((e) => score[e]);
  const sum = (arr: number[]) => arr.reduce((total, n) => total + n, 0);
  const len = values.length;
  return {
    "Positive Valence": sum(values.slice(0, len / 2)),
    "Negative Valence": sum(values.slice(len / 2)),
    "High Control/Power":
      sum(values.slice(0, len / 4)) + sum(values.slice((len / 4) * 3)),
    "Low Control/Power": sum(values.slice(len / 4, (len / 4) * 3)),
  };
};

const colors = [
  "#FF6600",
  "#FF9901",
  "#FFCC01",
  "#FFFF00",
  "#DDFF33",
  "#CCE600",
  "#99CC00",
  "#66B300",
  "#339900",
  "#008000",
  "#006633",
  "#004D66",
  "#003399",
  "#011ACC",
  "#011ACC",
  "#3300CC",
  "#660099",
  "#990066",
  "#CC0033",
  "#FF0000",
];

function getPositionShift(
  width: number,
  height: number,
  i: number,
  radius: number
) {
  const [centerX, centerY] = [width / 2, height / 2];
  const shiftAngle = (Math.PI * 2) / emotions.length;
  const angle = Math.PI - shiftAngle / 2 - shiftAngle * i;
  const [shiftX, shiftY] = [Math.cos(angle) * radius, Math.sin(angle) * radius];
  const top = centerX + shiftX;
  const left = centerY + shiftY;
  return { top, left, shiftAngle, angle };
}

const width = 680;
const height = 680;
const innerRadius = 84;

const initialFormValues = {
  ...emotions.reduce((initialVals, e) => ({ ...initialVals, [e]: 0 }), {}),
  other: "",
};

type EmotionWheelProps = {
  onSubmit: (values: Record<string, string | number>) => void;
  coloured?: boolean;
};

export function EmotionWheel({
  onSubmit,
  coloured = false,
}: EmotionWheelProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(["common", "emotions"]);
  return (
    <Box m="5" borderRadius={"5px"} minH={`${height}px`} pos={"relative"}>
      <VStack
        alignItems={"center"}
        textAlign={"center"}
        mb={5}
        zIndex={2}
        spacing={4}
      >
        <Heading size={"lg"}>{t("emotions|Geneva emotion wheel")}</Heading>
        <Text align={"center"} maxW={["xs", "md", "lg"]}>
          {t(
            "emotions|Please indicate the emotion(-s) you have experienced during the last 2 weeks and their intensities. Click on smaller circles to specify lower intensity and on bigger circles for bigger intensity. Also there is an option to add your own emotion by pressing the 'other' button."
          )}
        </Text>
      </VStack>
      <Formik
        initialValues={initialFormValues}
        validateOnBlur
        // validate={(values) => {
        //   const errors = {} as typeof initialFormValues;
        //   const sum = Object.entries(values).reduce(
        //     (acc, [k, v]) => (k !== "other" ? acc + Number(v) : acc),
        //     0
        //   );
        //   if (!values.other && sum === 0)
        //     errors.other = 'Please, select an emotion or specify "other"';
        //   return errors;
        // }}
        onSubmit={(values) => {
          setLoading(true);
          onSubmit(values);
        }}
      >
        {({ handleSubmit, setValues, setFieldValue, values }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                pos={"relative"}
                h={"100px"}
              >
                <Box
                  w={["sm", "md", "lg", "xl", "2xl"]}
                  mt={-10}
                  position={"relative"}
                  transform={[
                    "scale(0.4) translate(-35%)",
                    "scale(0.5) translate(-25%)",
                    "scale(0.8) translate(-15%)",
                    "scale(1) translate(-10%)",
                    "scale(1) translate(0%)",
                  ]}
                  transformOrigin={"center"}
                >
                  {emotions.map((emotion, emotionIdx) => {
                    const { top, left, angle } = getPositionShift(
                      width,
                      height,
                      emotionIdx,
                      315
                    );
                    const answerRange = 6;
                    return (
                      <Fragment key={emotion}>
                        <FastField name={emotion}>
                          {({ field, form }: FieldProps<string>) => {
                            // TODO: make dynamic calculations according to formulas https://docs.google.com/spreadsheets/d/1xM3PbcXFuv7EVcMSmpiFVCuJ5xqCXDHr3jqt1V3ZOtg/edit#gid=0
                            // const origSize = 16;
                            // const offset = 90;
                            // const scales = emotions.map((_e, i) => 1 + i * 0.5);
                            // const positions = [75, 91, 115, 147, 187, 235];
                            // const positions = [100, 116, 140, 172, 212, 260];
                            const positions = [100, 118, 145, 181, 226, 280];

                            return (
                              <RadioGroup
                                {...field}
                                onChange={(nextValue) =>
                                  form.setFieldValue(
                                    String(field.name),
                                    Number(nextValue)
                                  )
                                }
                                name={emotion}
                              >
                                {Array.from({ length: answerRange }).map(
                                  (_e, optionIdx) => {
                                    const { top, left } = getPositionShift(
                                      width,
                                      height,
                                      emotionIdx,
                                      optionIdx === 0
                                        ? positions[optionIdx] - 5
                                        : positions[optionIdx]
                                    );
                                    return (
                                      <Radio
                                        colorScheme={"gray"}
                                        border={"1px"}
                                        key={optionIdx}
                                        value={optionIdx}
                                        position={"absolute"}
                                        left={left}
                                        top={top}
                                        background={
                                          coloured
                                            ? colors[emotionIdx]
                                            : undefined
                                        }
                                        borderRadius={
                                          optionIdx === 0 ? 0 : "50%"
                                        }
                                        transform={`translate(-50%, -50%) scale(${
                                          1 + optionIdx * 0.5
                                        }) ${
                                          optionIdx === 0
                                            ? "rotate(" + -angle + "rad)"
                                            : ""
                                        }`}
                                      />
                                    );
                                  }
                                )}
                              </RadioGroup>
                            );
                          }}
                        </FastField>
                        <Box
                          position={"absolute"}
                          top={top}
                          left={left}
                          transform={`translate(${
                            -50 + Math.sin(angle) * 50
                          }%, ${-50 + Math.cos(angle) * 50}%)`}
                        >
                          <Text fontSize={"lg"}>
                            {t(`emotions|${emotion}`)}
                          </Text>
                        </Box>
                      </Fragment>
                    );
                  })}
                  <Button
                    colorScheme={"gray"}
                    size={"lg"}
                    position={"absolute"}
                    top={height / 2}
                    left={width / 2}
                    w={`${innerRadius * 2 + 2}px`}
                    h={`${innerRadius}px`}
                    pt={2}
                    transform={`translate(-50%, -100%) scale(.94)`}
                    borderRadius={`${innerRadius}px ${innerRadius}px 0 0`}
                    onClick={() => setValues(initialFormValues)}
                  >
                    {t("emotions|No emotions")}
                  </Button>
                  <Button
                    colorScheme={"gray"}
                    size={"lg"}
                    position={"absolute"}
                    top={height / 2}
                    left={width / 2}
                    w={`${innerRadius * 2 + 2}px`}
                    h={`${innerRadius}px`}
                    pb={2}
                    transform={`translate(-50%, 0) scale(.94)`}
                    borderRadius={`0 0 ${innerRadius}px ${innerRadius}px`}
                    onClick={() => {
                      const a = prompt(
                        t("Indicate your emotion"),
                        values.other
                      );
                      setFieldValue("other", a || "");
                    }}
                  >
                    {t("emotions|Other")}
                  </Button>
                </Box>
              </Flex>
              <Flex
                justifyContent={"center"}
                textAlign={"center"}
                // maxW={"sm"}
                alignItems={"center"}
              >
                {/*<Box mb={3} color={"red.500"}>*/}
                {/*  {errors.other}*/}
                {/*  /!*<ErrorMessage name={"other"} />*!/*/}
                {/*</Box>*/}
                <Button
                  mt={[
                    `${600 * 0.4}px`,
                    `${600 * 0.5}px`,
                    `${600 * 0.9}px`,
                    `${600 * 1.1}px`,
                  ]}
                  isLoading={loading}
                  // disabled={!dirty}
                  type={"submit"}
                >
                  {t("Submit")}
                </Button>
              </Flex>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
}
