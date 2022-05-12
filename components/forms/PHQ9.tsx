import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FastField, FieldProps, Formik } from "formik";
import { FC } from "react";

const questions = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
  "Trouble concentrating on things, such as reading the newspaper or watching television?",
  "Moving or speaking so slowly that other people cou… that you have been moving a lot more than usual?",
  "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way?",
  // "Ask the patient: how difficult have these problems…f things at home, or get along with other people?",
];

const answers = {
  "Not at all": 0,
  "Several days": 1,
  "More than half the days": 2,
  "Nearly every day": 3,
};

const getResults = (points: number) => {
  switch (true) {
    case points <= 4:
      return "Scores ≤4 suggest minimal depression which may not require treatment.";
    case points <= 9:
      return "Scores 5-9 suggest mild depression which may require only watchful waiting and repeated PHQ-9 at followup.";
    case points <= 14:
      return "Scores 10-14 suggest moderate depression severity; patients should have a treatment plan ranging form counseling, followup, and/or pharmacotherapy.";
    case points <= 19:
      return "Scores 15-19 suggest moderately severe depression; patients typically should have immediate initiation of pharmacotherapy and/or psychotherapy.";
    case points >= 20:
      return "Scores 20 and greater suggest severe depression; patients typically should have immediate initiation of pharmacotherapy and expedited referral to mental health specialist.";
    default:
      throw new Error("Invalid score");
  }
};

const QuestionField: FC<{ question: string; id: number }> = ({
  question,
  id,
}) => (
  <FastField name={id} type={"string"} key={id}>
    {({ field, form }: FieldProps<number>) => (
      <FormControl
        isInvalid={!!(form.touched[id] && form.errors[id])}
        isRequired
      >
        <FormLabel htmlFor={String(id)}>{question}</FormLabel>
        <RadioGroup
          // defaultValue={}
          {...field}
          onChange={(nextValue) =>
            form.setFieldValue(String(field.name), Number(nextValue))
          }
          name={String(id)}
        >
          <VStack alignItems={"left"}>
            {Object.entries(answers).map(([answer, points]) => (
              <Radio key={answer} value={points}>
                {answer}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>
        <FormErrorMessage>{form.errors.gender}</FormErrorMessage>
      </FormControl>
    )}
  </FastField>
);

function sumAllValues(values: Record<string, string>) {
  return Object.values(values).reduce((total, v) => total + Number(v), 0);
}

export function PHQ9() {
  return (
    <Box p="5" maxW={"lg"} border={"1px solid"} borderRadius={"5px"}>
      <VStack alignItems={"left"} mb={5}>
        <Heading size={"lg"}>PHQ9 test</Heading>
        <Text>Please fill additional information about yourself</Text>
      </VStack>
      <Formik
        initialValues={Object.fromEntries(questions.map((_q, i) => [i, ""]))}
        validateOnBlur
        onSubmit={(values) => {
          alert(
            JSON.stringify({ values, total: sumAllValues(values) }, null, 2)
          );
        }}
      >
        {({ handleSubmit, values }) => {
          const totalPoints = sumAllValues(values);
          return (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                {questions.map((q, i) => (
                  <QuestionField key={i} question={q} id={i} />
                ))}
                <Button type="submit" isFullWidth>
                  Submit
                </Button>
                <Box
                  position={"sticky"}
                  bottom={2}
                  background={"blueviolet"}
                  color={"white"}
                  p={5}
                  borderRadius={5}
                >
                  <Heading
                    display={"flex"}
                    alignItems={"baseline"}
                    mb={2}
                    mt={-2}
                  >
                    <Text fontSize={"6xl"} mr={1}>
                      {totalPoints}
                    </Text>
                    point{totalPoints !== 1 && "s"}
                  </Heading>
                  <Text>{getResults(totalPoints)}</Text>
                </Box>
              </VStack>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
}
