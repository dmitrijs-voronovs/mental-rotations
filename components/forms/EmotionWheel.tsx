import {
  Box,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FastField, FieldProps, Formik } from "formik";
import { Fragment, useState } from "react";

const otherOptions = ["Nav emociju", "Citas emocijas"];
const emotions = [
  "Interese",
  "Uzjautrinājums",
  "Lepnums",
  "Prieks",
  "Bauda",
  "Apmierinājums",
  "Apbrīna",
  "Milestība",
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

const width = 880;
const height = 880;
const innerRadius = 84;

const initialFormValues = emotions.reduce(
  (initialVals, e) => ({ ...initialVals, [e]: 0 }),
  {}
);

type EmotionWheelProps = {
  onSubmit: (values: Record<string, string | number>) => void;
};

export function EmotionWheel({ onSubmit }: EmotionWheelProps) {
  const [other, setOther] = useState("");

  return (
    <Box
      p="5"
      border={"1px solid"}
      borderRadius={"5px"}
      minW={`${width}px`}
      minH={`${height}px`}
      pos={"relative"}
    >
      <VStack alignItems={"left"} mb={5}>
        <Heading size={"lg"}>Geneva emotion wheel test</Heading>
        <Text>Please fill additional information about yourself</Text>
      </VStack>
      <Formik
        initialValues={initialFormValues}
        validateOnBlur
        onSubmit={(values) => {
          onSubmit({ ...values, other });
        }}
      >
        {({ handleSubmit, setValues }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Box w={width} height={height} position={"relative"}>
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
                          const origSize = 16;
                          const offset = 90;
                          const scales = emotions.map((_e, i) => 1 + i * 0.5);
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
                                      border={"1px"}
                                      key={optionIdx}
                                      value={optionIdx}
                                      position={"absolute"}
                                      left={left}
                                      top={top}
                                      // background={colors[emotionIdx]}
                                      borderRadius={optionIdx === 0 ? 0 : "50%"}
                                      transform={`translate(-50%, -50%) scale(${
                                        1 + optionIdx * 0.5
                                      }) ${
                                        optionIdx === 0
                                          ? "rotate(" + -angle + "rad)"
                                          : ""
                                      }`}
                                      // })`}
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
                        transform={`translate(${-50 + Math.sin(angle) * 50}%, ${
                          -50 + Math.cos(angle) * 50
                        }%)`}
                      >
                        <Text fontSize={"lg"}>{emotion}</Text>
                      </Box>
                    </Fragment>
                  );
                })}
                <Button
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
                  No emotions
                </Button>
                <Button
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
                    const a = prompt("which one?", other);
                    console.log(a);
                    setOther(a || "");
                  }}
                >
                  Other
                </Button>
              </Box>
              <Button type={"submit"}>Submit</Button>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
}
