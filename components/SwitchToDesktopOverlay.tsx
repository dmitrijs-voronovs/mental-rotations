import { isMobile } from "react-device-detect";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Text, useDisclosure } from "@chakra-ui/react";

export function SwitchToDesktopOverlay() {
  const { isOpen } = useDisclosure({ isOpen: true });
  if (isMobile)
    return (
      <>
        <Modal isOpen={isOpen} onClose={() => {}}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Please, switch to a desktop device</ModalHeader>
            <ModalBody>
              <Text mb={5}>
                Mobile devices are not suitable for Object Rotation exercises,
                sorry for the inconvenience.
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  return null;
}
