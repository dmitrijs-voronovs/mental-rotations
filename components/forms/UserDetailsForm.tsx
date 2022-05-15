import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Field, FieldProps, Formik } from "formik";

type UserDetailsFormValues = {
  age: number;
  gender: string;
  occupation: string;
  fieldOfActivity: string;
  isRightHanded: boolean;
  hasNeurodegenerativeIllnesses: boolean;
  hasAgreedToPolicy: boolean;
};

type UserDetailsFormProps = {
  onSubmit: (values: UserDetailsFormValues) => void;
};

export function UserDetailsForm({ onSubmit }: UserDetailsFormProps) {
  return (
    <Box p="5" maxW={"lg"} border={"1px solid"} borderRadius={"5px"}>
      <VStack alignItems={"left"} mb={5}>
        <Heading size={"lg"}>Account details</Heading>
        <Text>Please fill additional information about yourself</Text>
      </VStack>
      <Formik
        initialValues={{
          age: 15,
          gender: "Male",
          occupation: "",
          fieldOfActivity: "",
          isRightHanded: true,
          hasNeurodegenerativeIllnesses: false,
          hasAgreedToPolicy: false,
        }}
        validateOnBlur
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
          onSubmit(values);
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="flex-start">
              <Field
                validate={(val?: number) =>
                  !val ? "Age is required" : undefined
                }
                name="age"
                type={"number"}
              >
                {({ form }: FieldProps<number>) => (
                  <FormControl
                    isInvalid={!!(form.touched.age && form.errors.age)}
                    isRequired
                  >
                    <FormLabel htmlFor="age">Age</FormLabel>
                    <NumberInput
                      step={1}
                      min={10}
                      max={100}
                      allowMouseWheel
                      onChange={(val) => form.setFieldValue("age", Number(val))}
                    >
                      <NumberInputField placeholder={"18"} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{form.errors.age}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="gender" type={"string"}>
                {({ field, form }: FieldProps<number>) => (
                  <FormControl
                    isInvalid={!!(form.touched.gender && form.errors.gender)}
                    isRequired
                  >
                    <FormLabel htmlFor="gender">Gender</FormLabel>
                    <RadioGroup
                      defaultValue={"Male"}
                      {...field}
                      onChange={(nextValue) =>
                        form.setFieldValue(field.name, nextValue)
                      }
                    >
                      <Stack direction="row">
                        <Radio value="Male">Male</Radio>
                        <Radio value="Female">Female</Radio>
                      </Stack>
                    </RadioGroup>
                    <FormErrorMessage>{form.errors.gender}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field
                name={"occupation"}
                validate={(val?: string) =>
                  !val
                    ? "Value is required"
                    : val.length < 4
                    ? "Occupation length should be > 3"
                    : undefined
                }
              >
                {({ field, form }: FieldProps<number>) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      !!(form.touched.occupation && form.errors.occupation)
                    }
                  >
                    <FormLabel htmlFor="occupation">Occupation</FormLabel>
                    <Input
                      {...field}
                      id="occupation"
                      placeholder={"Scientist"}
                    />
                    <FormErrorMessage>
                      {form.errors.occupation}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field
                name={"fieldOfActivity"}
                validate={(val?: string) =>
                  !val
                    ? "Value is required"
                    : val.length < 4
                    ? "Field of activity length should be > 3"
                    : undefined
                }
              >
                {({ field, form }: FieldProps<number>) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      !!(
                        form.touched.fieldOfActivity &&
                        form.errors.fieldOfActivity
                      )
                    }
                  >
                    <FormLabel htmlFor="fieldOfActivity">
                      Field of activity
                    </FormLabel>
                    <Input
                      {...field}
                      id="fieldOfActivity"
                      placeholder={"Mathematician"}
                    />
                    <FormErrorMessage>
                      {form.errors.fieldOfActivity}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name={"isRightHanded"}>
                {({ field, form }: FieldProps<string>) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      !!(
                        form.touched.isRightHanded && form.errors.isRightHanded
                      )
                    }
                    display={"flex"}
                    alignItems={"baseline"}
                  >
                    <FormLabel htmlFor="isRightHanded">
                      Are you right handed?
                    </FormLabel>
                    <Switch
                      {...field}
                      id="isRightHanded"
                      size={"sm"}
                      defaultChecked={true}
                    />
                    <FormErrorMessage>
                      {form.errors.isRightHanded}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name={"hasNeurodegenerativeIllnesses"}>
                {({ field, form }: FieldProps<string>) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      !!(
                        form.touched.hasNeurodegenerativeIllnesses &&
                        form.errors.hasNeurodegenerativeIllnesses
                      )
                    }
                    display={"flex"}
                    alignItems={"baseline"}
                  >
                    <FormLabel htmlFor="hasNeurodegenerativeIllnesses">
                      Do you have neurodegenerative illnesses?
                    </FormLabel>
                    <Switch
                      {...field}
                      id="hasNeurodegenerativeIllnesses"
                      size={"sm"}
                    />
                    <FormErrorMessage>
                      {form.errors.occupation}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Divider />
              <Field
                id="hasAgreedToPolicy"
                name="hasAgreedToPolicy"
                validate={(val?: boolean) =>
                  !val ? "Should be accepter" : undefined
                }
              >
                {({ field, form }: FieldProps<string>) => (
                  <FormControl
                    name={"hasAgreedToPolicy"}
                    isRequired
                    isInvalid={
                      !!(
                        form.touched.hasAgreedToPolicy &&
                        form.errors.hasAgreedToPolicy
                      )
                    }
                  >
                    <Checkbox {...field}>Accept policy</Checkbox>
                    <FormErrorMessage>
                      {form.errors.hasAgreedToPolicy}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button type="submit" isFullWidth>
                Submit
              </Button>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  );
}
