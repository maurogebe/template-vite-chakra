/*eslint-disable*/
import { HamburgerIcon } from "@chakra-ui/icons";
// chakra imports
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Icon,
    Link,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import IconBox from "../Icons/IconBox";
import { CreativeTimLogo } from "../Icons/Icons";
import { Separator } from "../Separator/Separator";
import { useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Route } from "../../../routes";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

function SidebarResponsive(props: any) {

    // to check for active links and opened collapses
    let location = useLocation();
    
    const { themeColor, primaryColorLevel } = useSelector((state: RootState) => state.theme.state);

    // this is for the rest of the collapses
    const [state, setState] = useState<any>({});
    const mainPanel = useRef<any>();

    // verifies if routeName is the one active (in browser input)
    const activeRoute = (routeName: string) => {
      return location.pathname === routeName ? "active" : "";
    };
  
    const createLinks = (routes: Route[]) => {
      // Chakra Color Mode
      const activeBg = useColorModeValue("white", "gray.700");
      const inactiveBg = useColorModeValue("white", "gray.700");
      const activeColor = useColorModeValue("gray.700", "white");
      const inactiveColor = useColorModeValue("gray.400", "gray.400");
  
      return routes?.map((prop: Route, key: any) => {
        if (prop.category && prop.state) {
          var st: any = {};
          st[prop["state"]] = !state[prop.state];
          return (
            <div key={prop.name}>
              <Text
                color={activeColor}
                fontWeight="bold"
                mb={{
                  xl: "12px",
                }}
                mx="auto"
                ps={{
                  sm: "10px",
                  xl: "16px",
                }}
                py="12px"
              >
                { prop.name }
              </Text>
              {createLinks(prop.views || [])}
            </div>
          );
        }
        return (
          <NavLink to={prop.path} key={prop.name}>
            {activeRoute(prop.path) === "active" ? (
              <Button
                boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg={activeBg}
                mb={{
                  xl: "12px",
                }}
                mx={{
                  xl: "auto",
                }}
                ps={{
                  sm: "10px",
                  xl: "16px",
                }}
                py="12px"
                borderRadius="15px"
                _hover="none"
                w="100%"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                <Flex>
                  {typeof prop.icon === "string" ? (
                    <Icon color={`${themeColor}.${primaryColorLevel}`}>{prop.icon}</Icon>
                  ) : (
                    <IconBox
                      bg="teal.300"
                      color="white"
                      h="30px"
                      w="30px"
                      me="12px"
                    >
                      {prop.icon}
                    </IconBox>
                  )}
                  <Text color={activeColor} my="auto" fontSize="sm">
                    {prop.name}
                  </Text>
                </Flex>
              </Button>
            ) : (
              <Button
                boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg="transparent"
                mb={{
                  xl: "12px",
                }}
                mx={{
                  xl: "auto",
                }}
                py="12px"
                ps={{
                  sm: "10px",
                  xl: "16px",
                }}
                borderRadius="15px"
                _hover="none"
                w="100%"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                <Flex>
                  {typeof prop.icon === "string" ? (
                    <Icon color={`${themeColor}.${primaryColorLevel}`}>{prop.icon}</Icon>
                  ) : (
                    <IconBox
                      bg={inactiveBg}
                      color="teal.300"
                      h="30px"
                      w="30px"
                      me="12px"
                    >
                      {prop.icon}
                    </IconBox>
                  )}
                  <Text color={inactiveColor} my="auto" fontSize="sm">
                    {prop.name}
                  </Text>
                </Flex>
              </Button>
            )}
          </NavLink>
        );
      });
    };
    
    const { logoText, routes, ...rest } = props;
  
    var links = <>{createLinks(routes)}</>;

    //  BRAND
    //  Chakra Color Mode
    let hamburgerColor = useColorModeValue("gray.500", "gray.200");

    if (props.secondary === true) {
      hamburgerColor = "white";
    }

    const brand = (
      <Box pt={"35px"} mb="8px">
        <Link
          href={`${import.meta.env.VITE_PUBLIC_URL}/#/`}
          target="_blank"
          display="flex"
          lineHeight="100%"
          mb="30px"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          fontSize="11px"
        >
          <CreativeTimLogo w="32px" h="32px" me="10px" />
          <Text fontSize="sm" mt="3px">
            {logoText}
          </Text>
        </Link>
        <Separator></Separator>
      </Box>
    );
  
    // SIDEBAR
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef<any>();
    
    // Color variables
    return (
      <Flex
        display={{ sm: "flex", xl: "none" }}
        ref={mainPanel}
        alignItems="center"
      >
        <HamburgerIcon
          color={hamburgerColor}
          w="18px"
          h="18px"
          ref={btnRef}
          onClick={onOpen}
        />
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          placement={document.documentElement.dir === "rtl" ? "right" : "left"}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent
            w="250px"
            maxW="250px"
            ms={{
              sm: "16px",
            }}
            my={{
              sm: "16px",
            }}
            borderRadius="16px"
          >
            <DrawerCloseButton
              _focus={{ boxShadow: "none" }}
              _hover={{ boxShadow: "none" }}
            />
            <DrawerBody maxW="250px" px="1rem">
              <Box maxW="100%" h="100vh">
                <Box>{brand}</Box>
                <Stack direction="column" mb="40px">
                  <Box>{links}</Box>
                </Stack>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    );
  }

  export default SidebarResponsive