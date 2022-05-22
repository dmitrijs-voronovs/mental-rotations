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

export function SwitchToDesktopOverlay() {
  const { t } = useTranslation();
  const { isOpen } = useDisclosure({ isOpen: true });
  if (isMobile)
    return (
      <>
        <Modal isOpen={isOpen} onClose={() => {}} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("Please, switch to a desktop device")}</ModalHeader>
            <ModalBody>
              <Text mb={5}>
                {t(
                  "Mobile devices are not suitable for Object Rotation exercises, sorry for the inconvenience."
                )}
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  return null;
}
