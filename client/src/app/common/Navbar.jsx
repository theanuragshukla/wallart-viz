import {
  Button,
  Box,
  chakra,
  IconButton,
  VStack,
  HStack,
  Flex,
  useColorModeValue,
  useDisclosure,
  CloseButton,
} from "@chakra-ui/react";
import { HambergerMenu } from "iconsax-react";

import Logo from "./Logo";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

export default function Navbar() {
  const bg = useColorModeValue("background", "background");
  const mobileNav = useDisclosure();
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <chakra.header
        bg={bg}
        w="full"
        px={{
          base: 2,
          sm: 4,
        }}
        py={4}
        shadow="md"
      >
        <Flex
          px={{ md: 32 }}
          alignItems="center"
          justifyContent="space-between"
          mx="auto"
        >
          <Logo />
          <HStack display="flex" alignItems="center" spacing={1}>
            <HStack
              spacing={1}
              mr={1}
              color="brand.500"
              display={{
                base: "none",
                md: "inline-flex",
              }}
            >
              <Button
                rounded={"full"}
                px={6}
                onClick={() => navigate(ROUTES.LOGIN)}
                colorScheme={"orange"}
                bg={"orange.400"}
                _hover={{ bg: "orange.500" }}
              >
                Login
              </Button>
            </HStack>
            <Box
              display={{
                base: "inline-flex",
                md: "none",
              }}
            >
              <IconButton
                display={{
                  base: "flex",
                  md: "none",
                }}
                aria-label="Open menu"
                fontSize="20px"
                color="gray.800"
                _dark={{
                  color: "inherit",
                }}
                variant="ghost"
                icon={<HambergerMenu />}
                onClick={mobileNav.onOpen}
              />

              <VStack
                pos="absolute"
                top={0}
                left={0}
                right={0}
                display={mobileNav.isOpen ? "flex" : "none"}
                flexDirection="column"
                p={2}
                pb={4}
                m={2}
                bg={bg}
                spacing={3}
                rounded="sm"
                shadow="sm"
              >
                <Flex width="100%" justify="flex-end">
                  <CloseButton
                    aria-label="Close menu"
                    onClick={mobileNav.onClose}
                  />
                </Flex>
              </VStack>
            </Box>
          </HStack>
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
}
