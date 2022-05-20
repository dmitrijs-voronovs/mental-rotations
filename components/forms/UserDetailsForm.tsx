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
  Link,
  ModalCloseButton,
  ModalFooter,
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
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FastField as Field, FieldProps, Formik } from "formik";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";

type UserDetailsFormValues = {
  age: number;
  gender: string;
  occupation: string;
  academicField: string;
  isRightHanded: boolean;
  hasNeurodegenerativeIllnesses: boolean;
  hasAgreedToPolicy: boolean;
};

type UserDetailsFormProps = {
  onSubmit: (values: UserDetailsFormValues) => void;
  initialValues?: Partial<UserDetailsFormValues>;
};

function PrivacyPolicy() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      Accept privacy policy and terms of use{" "}
      <Link href={"#"} onClick={onOpen} color={"purple"}>
        (read)
      </Link>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Privacy policy and terms of use</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack textAlign={"start"} alignItems={"start"} spacing={3}>
              <Heading size={"md"}>Application purposes</Heading>
              <Text>
                The application is designed to test mental rotation skills of
                two groups of users - regular users and users with the
                neurodegenerative diseases -, and collect data for future
                analysis.
              </Text>
              <Heading size={"md"}>Your information</Heading>
              <Text>
                Your information is stored privately and is used only to
                associate a single data entry with a certain person. Each person
                later on is referred only by the generated identification
                number, thus personal details are not disclosed.
              </Text>
              <Heading size={"md"}>Your Data</Heading>
              <Text>
                Each answer for the tests and exersises is being securely stored
                in the database. The data is later processed in bulks.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function UserDetailsForm({
  onSubmit,
  initialValues = {},
}: UserDetailsFormProps) {
  return (
    <Box p="5" maxW={"lg"}>
      <VStack alignItems={"left"} mb={5}>
        <Heading size={"lg"}>Account details</Heading>
        <Text>Please fill additional information about yourself</Text>
      </VStack>
      <Formik
        initialValues={{
          age: 15,
          gender: "Male",
          occupation: "",
          academicField: "",
          isRightHanded: true,
          hasNeurodegenerativeIllnesses: false,
          hasAgreedToPolicy: false,
          ...initialValues,
        }}
        validateOnBlur
        onSubmit={(values) => {
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
                      defaultValue={initialValues?.age}
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
                name={"academicField"}
                validate={(val?: string) =>
                  !val
                    ? "Value is required"
                    : val.length < 4
                    ? "Academic field length should be > 3"
                    : undefined
                }
              >
                {({ field, form }: FieldProps<number>) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      !!(
                        form.touched.academicField && form.errors.academicField
                      )
                    }
                  >
                    <FormLabel htmlFor="academicField">
                      Academic field
                    </FormLabel>
                    <Input
                      {...field}
                      id="academicField"
                      placeholder={"Mathematician"}
                    />
                    <FormErrorMessage>
                      {form.errors.academicField}
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
                      defaultChecked={initialValues.isRightHanded || true}
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
                  >
                    <FormLabel htmlFor="hasNeurodegenerativeIllnesses">
                      Do you have neurodegenerative disorder?
                    </FormLabel>
                    {/*<Switch*/}
                    {/*  {...field}*/}
                    {/*  id="hasNeurodegenerativeIllnesses"*/}
                    {/*  size={"sm"}*/}
                    {/*  defaultChecked={*/}
                    {/*    initialValues.hasNeurodegenerativeIllnesses*/}
                    {/*  }*/}
                    {/*/>*/}
                    <RadioGroup
                      defaultValue={"No"}
                      {...field}
                      onChange={(nextValue) =>
                        form.setFieldValue(field.name, nextValue)
                      }
                    >
                      <Stack direction="column">
                        <Radio value="No">No</Radio>
                        <Radio value="Alzheimer">
                          Yes, Alzheimer's disease
                        </Radio>
                        <Radio value="Huntington">
                          Yes, Huntington's disease
                        </Radio>
                        <Radio value="Another">Yes, another</Radio>
                      </Stack>
                    </RadioGroup>
                    <FormErrorMessage>
                      {form.errors.hasNeurodegenerativeIllnesses}
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
                    <Checkbox
                      {...field}
                      defaultChecked={initialValues?.hasAgreedToPolicy}
                    >
                      <PrivacyPolicy />
                    </Checkbox>
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
