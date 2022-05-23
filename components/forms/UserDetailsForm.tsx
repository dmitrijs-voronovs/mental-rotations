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
import { useTranslation } from "next-i18next";
import { useState } from "react";

export type UserDetailsFormValues = {
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
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {t("Accept privacy policy and terms of use ")}
      <Link href={"#"} onClick={onOpen} color={"purple"}>
        ({t("read")})
      </Link>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("Privacy policy and terms of use")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack textAlign={"start"} alignItems={"start"} spacing={3}>
              <Heading size={"md"}>{t("Application purposes")}</Heading>
              <Text>
                {t(
                  "The application is designed to test mental rotation skills and collect data for future analysis. Additionally, it collects data about user emotions and well-being."
                )}
              </Text>
              <Heading size={"md"}>{t("Your information")}</Heading>
              <Text>
                {t(
                  "Your information is stored privately and is used only to associate a single data entry with a certain person. Each person later on is referred only by the generated identification number, thus personal details are not disclosed."
                )}
              </Text>
              <Heading size={"md"}>{t("Your Data")}</Heading>
              <Text>
                {t(
                  "Each answer for the tests and exercises is being securely stored in the database. The data is later processed in bulks."
                )}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              {t("Close")}
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
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  return (
    <Box p="5" maxW={"lg"}>
      <VStack alignItems={"left"} mb={5}>
        <Heading size={"lg"}>{t("Account details")}</Heading>
        <Text>{t("Please fill additional information about yourself")}</Text>
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
          setLoading(true);
          onSubmit(values);
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="flex-start">
              <Field
                validate={(val?: number) =>
                  !val ? t("Age is required") : undefined
                }
                name={"age"}
                type={"number"}
              >
                {({ form }: FieldProps<number>) => (
                  <FormControl
                    isInvalid={!!(form.touched.age && form.errors.age)}
                    isRequired
                  >
                    <FormLabel htmlFor="age">{t("Age")}</FormLabel>
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
              <Field name={"gender"} type={"string"}>
                {({ field, form }: FieldProps<number>) => (
                  <FormControl
                    isInvalid={!!(form.touched.gender && form.errors.gender)}
                    isRequired
                  >
                    <FormLabel htmlFor="gender">{t("Gender")}</FormLabel>
                    <RadioGroup
                      defaultValue={"Male"}
                      {...field}
                      onChange={(nextValue) =>
                        form.setFieldValue(field.name, nextValue)
                      }
                    >
                      <Stack direction="row">
                        <Radio value="Male">{t("Male")}</Radio>
                        <Radio value="Female">{t("Female")}</Radio>
                        <Radio value="Another">{t("Another")}</Radio>
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
                    ? t("Value is required")
                    : val.length < 3
                    ? t("Value should be at least 3 characters long")
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
                    <FormLabel htmlFor="occupation">
                      {t("Occupation")}
                    </FormLabel>
                    <Input
                      {...field}
                      id="occupation"
                      placeholder={t("Scientist")}
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
                    ? t("Value is required")
                    : val.length < 3
                    ? t("Value should be at least 3 characters long")
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
                      {t("Academic field")}
                    </FormLabel>
                    <Input
                      {...field}
                      id="academicField"
                      placeholder={t("Mathematician")}
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
                      {t("Are you right handed?")}
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
                      {t("Do you have neurodegenerative disorder?")}
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
                        <Radio value="No">{t("No")}</Radio>
                        <Radio value="Alzheimer">
                          {t("Yes, Alzheimer's disease")}
                        </Radio>
                        <Radio value="Huntington">
                          {t("Yes, Huntington's disease")}
                        </Radio>
                        <Radio value="Parkinson">
                          {t("Yes, Parkinson's Disease")}
                        </Radio>
                        <Radio value="Another">{t("Yes, another")}</Radio>
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
                name={"hasAgreedToPolicy"}
                validate={(val?: boolean) =>
                  !val ? t("Should be checked") : undefined
                }
              >
                {({ field, form }: FieldProps<string>) => (
                  <FormControl
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
              <Button type="submit" isFullWidth isLoading={loading}>
                {t("Submit")}
              </Button>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  );
}
