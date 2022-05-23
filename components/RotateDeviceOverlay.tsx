import { isMobile } from "react-device-detect";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Text, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import useScreenOrientation from "react-hook-screen-orientation";

export function RotateDeviceOverlay() {
  const scr = useScreenOrientation();
  const { t } = useTranslation();
  const { isOpen } = useDisclosure({ isOpen: true });
  if (isMobile && scr === "portrait-primary")
    return (
      <>
        <Modal isOpen={isOpen} onClose={() => {}} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {t("Please, rotate your device horizontally")}
            </ModalHeader>
            <ModalBody>
              <Text mb={5}>
                {t(
                  "Exercises require landscape orientation. Sorry for the inconvenience."
                )}
                <br />
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  return null;
}
