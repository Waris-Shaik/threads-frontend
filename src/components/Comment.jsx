import {
  Avatar,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";
import useShowToast from "../hooks/useShowTaost";
import { useRecoilState, useRecoilValue } from "recoil";
import refreshAtom from "../atoms/refreshAtom";
import userAtom from "../atoms/userAtom";

const Comments = ({ reply, postId, lastReply }) => {
  const showToast = useShowToast();
  const [refresh, setRefresh] = useRecoilState(refreshAtom);
  const currentUser = useRecoilValue(userAtom);
  const copyText = useRef(null);
  const [liked, setLiked] = useState(false);

  const deleteComment = async () => {
    if (!currentUser) return showToast("", "Please login to delete", "error");
    try {
      const res = await fetch(
        `/api/posts/${postId}/reply/delete/${reply?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: true,
        }
      );

      const data = await res.json();
      if (data.error) {
        showToast("", data.error, "error");
        return;
      }

      showToast("", data.message, "success");
      setRefresh(!refresh);
    } catch (error) {
      showToast("Error", "An error occured during deleting reply", "error");
    }
  };

  const copyReply = () => {
    navigator.clipboard.writeText(copyText.current.innerText);
    showToast("", "copied", "success");
  };

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar
          size={"sm"}
          name={reply?.username}
          src={reply?.userProfilePicture}
          mt={1}
        />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"}>
            <Text fontSize={"sm"} letterSpacing={0.5}>
              {reply?.username}
            </Text>

            <Flex gap={4} alignItems={"center"}>
              <Text color={"gray.light"} my={1} fontSize={"xs"}>
                {formatDistanceToNow(new Date(reply?.createdAt))} ago.
              </Text>
              <Menu>
                <MenuButton>
                  <BsThreeDots />
                </MenuButton>
                <Portal>
                  <MenuList>
                    {reply?.text && (
                      <MenuItem onClick={copyReply}>Copy</MenuItem>
                    )}
                    {currentUser?._id.toString() ===
                      reply?.userId.toString() && (
                      <MenuItem onClick={deleteComment}>Delete</MenuItem>
                    )}
                  </MenuList>
                </Portal>
              </Menu>
            </Flex>
          </Flex>

          {reply?.text && (
            <Text fontSize={"sm"} mt={"-2"} ref={copyText}>
              {reply?.text}
            </Text>
          )}
          {reply?.image && (
            <Box
              border={""}
              w={"200px"}
              overflow={"hidden"}
              borderRadius={"2px"}
            >
              <Image src={reply?.image} w={"full"} />
            </Box>
          )}
          {/* <Actions /> */}
          <Box display={"flex"} alignItems={"center"} gap={4}>
            <LikeSvg liked={liked} setLiked={setLiked} />
            <Box>
              {" "}
              <Text fontSize={"xs"} my={1} color={"gray.light"}>
                {liked ? 1 : 0} likes
              </Text>
            </Box>
          </Box>
        </Flex>
      </Flex>
      {!lastReply ? <Divider bg={"gray.light"} /> : null}
    </>
  );
};

export default Comments;

const LikeSvg = ({ liked, setLiked }) => {
  return (
    <svg
      aria-label="Like"
      color={liked ? "rgb(237, 73, 86)" : ""}
      fill={liked ? "rgb(237, 73, 86)" : "transparent"}
      height="14"
      role="img"
      viewBox="0 0 24 22"
      width="20"
      onClick={() => setLiked(!liked)}
    >
      <title>like</title>
      <path
        d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
        stroke="currentColor"
        strokeWidth="2"
      ></path>
    </svg>
  );
};
