import {
  Avatar,
  Box,
  Flex,
  VStack,
  Text,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsInstagram, BsThreeDots } from "react-icons/bs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowTaost";
import refreshAtom from "../atoms/refreshAtom";
import toggleAtom from "../atoms/toggleAtom";

const UserHeader = ({ user }) => {
  const setToggleAtomStatus = useSetRecoilState(toggleAtom);
  const toggleAtomStatus = useRecoilValue(toggleAtom);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom); // global user loggedin lsw
  const [following, setFollowing] = useState(
    user?.followers.includes(currentUser?._id)
  );
  const [refresh, setRefresh] = useRecoilState(refreshAtom);
  const [updating, setUpdating] = useState(false);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast("done", "Profile URL copied", "success");
    });
  };

  const toggleFollowUnFollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      setUpdating(false);
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/users/toggleFollow/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: true,
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", "Please login to follow", "error");
        return;
      }

      showToast("done", data.message, "success");
      setRefresh(!refresh);
      setFollowing(!following);
    } catch (error) {
      showToast("Error", data.error, "error");
    } finally {
      setTimeout(() => {
        setUpdating(false);
      }, 2000);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text
              fontSize={"sm"}
              fontWeight={"semibold"}
              color={"gray"}
              letterSpacing={0.4}
            >
              @{user.username}
            </Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user.name}
            src={user.profilepicture}
            size={"xl"}
          ></Avatar>
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currentUser?._id === user._id && (
        <Link to="/update">
          <Button>Update Profile</Button>
        </Link>
      )}

      {currentUser?._id !== user._id && (
        <Button onClick={toggleFollowUnFollow} isLoading={updating}>
          {following ? "unfollow" : "follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>
            {user.followers.length}{" "}
            {user.followers.length === 1 ? "follower" : "followers"}
          </Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link>
            <Text color={"gray.light"}>instagram.com</Text>
          </Link>
        </Flex>

        <Flex gap={2}>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <BsThreeDots size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      {/* 2nd div */}
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={
            toggleAtomStatus === "threads"
              ? "1.5px solid white"
              : "1.5px solid gray"
          }
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Button
            _hover={{ bg: "none" }}
            onClick={() => setToggleAtomStatus("threads")}
            bg={"none"}
          >
            <Text fontWeight={"bold"}>Threads</Text>
          </Button>
        </Flex>
        <Flex
          flex={1}
          borderBottom={
            toggleAtomStatus !== "threads"
              ? "1.5px solid white"
              : "1.5px solid gray"
          }
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
          color={"gray.light"}
        >
          <Button
            _hover={{ bg: "none" }}
            onClick={() => setToggleAtomStatus("replies")}
            bg={"none"}
          >
            <Text fontWeight={"bold"}>Replies</Text>
          </Button>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
