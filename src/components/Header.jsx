import { Image, Flex, useColorMode, Box, Button } from "@chakra-ui/react";
import React from "react";
import { RiHome2Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { FiLogIn } from "react-icons/fi";
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const currentUser = useRecoilValue(userAtom); // current logged in user lsw global;

  return (
    <Flex alignItems={"center"} justifyContent={"space-evenly"} mt={6} mb={12}>
      {currentUser && (
        <Box>
          <Link to={"/"}>
            <RiHome2Line size={24} />
          </Link>
        </Box>
      )}
      <Box>
        <Image
          w={6}
          cursor={"pointer"}
          alt="logo_pic"
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
        />
      </Box>

      {currentUser && (
        <Box>
          <Link to={`/@${currentUser?.username}`}>
            <RxAvatar size={24} />
          </Link>
        </Box>
      )}

      {!currentUser && (
        <Box alignSelf={"flex-end"}>
          <Link to={"/"}>
            <FiLogIn size={24} />
          </Link>
        </Box>
      )}
    </Flex>
  );
};

export default Header;
