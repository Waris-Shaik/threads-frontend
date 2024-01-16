import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Text,
  Image,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { memo, useEffect, useRef, useState } from "react";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowTaost";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import refreshAtom from "../atoms/refreshAtom";
import { server } from "../main";

const Post = ({ post, postedby }) => {
  // fetch the user
  const [user, setUser] = useState(null); // _
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom); // logged in user global lws
  const [refresh, setRefresh] = useRecoilState(refreshAtom);
  const copyText = useRef(null);

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`${server}/api/posts/delete/${post?._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("done", data.message, "success");
      setRefresh(!refresh);
    } catch (error) {
      showToast("Error", "An error occured while deleting post", "error");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${server}/api/users/profile/` + postedby, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setUser(data.user);
      } catch (error) {
        showToast("Error", "An error occured while fetching user.", "error");
        setUser(null);
      }
    };

    getUser();
  }, [postedby]);

  const getTextCopy = () => {
    navigator.clipboard.writeText(copyText.current.innerText).then(() => {
      showToast("", "coped", "success");
    });
  };

  return (
    <div>
      <Link to={`/@${user?.username}/posts/${post?._id}`}>
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar
              size={"md"}
              name={user?.username}
              src={user?.profilepicture}
              _hover={{ cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/@${user?.username}`);
              }}
            ></Avatar>
            <Box w="1px" h={"full"} bg="gray.light" my={4}></Box>
            <Box position={"relative"} w={"full"}>
              {post.replies.length === 0 && (
                <Text textAlign={"center"}>🥱</Text>
              )}

              {post.replies[post.replies.length - 1] && (
                <Avatar
                  size={"xs"}
                  name={post.replies[post.replies.length - 1]?.username}
                  src={
                    post.replies[post.replies.length - 1]?.userProfilePicture
                  }
                  position={"absolute"}
                  top={"0px"}
                  left="15px"
                  padding="2px"
                ></Avatar>
              )}

              {post.replies[post.replies.length - 2] && (
                <Avatar
                  size={"xs"}
                  name={post.replies[post.replies.length - 2]?.username}
                  src={
                    post.replies[post.replies.length - 2]?.userProfilePicture
                  }
                  position={"absolute"}
                  bottom={"0px"}
                  right={"-5px"}
                  padding="2px"
                ></Avatar>
              )}

              {post.replies[post.replies.length - 3] && (
                <Avatar
                  size={"xs"}
                  name={post.replies[post.replies.length - 3]?.username}
                  src={post.replies[post.replies.length - 3].userProfilePicture}
                  position={"absolute"}
                  bottom={"0px"}
                  left="5px"
                  padding="2px"
                ></Avatar>
              )}
            </Box>
          </Flex>

          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex
              justifyContent={"space-between"}
              alignItems={"flex-star"}
              w={"full"}
            >
              <Flex
                w={"full"}
                alignItems={"center"}
                onClick={(e) => e.preventDefault()}
              >
                <Text
                  fontSize={"sm"}
                  fontWeight={"bold"}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/@${user?.username}`);
                  }}
                >
                  {user?.username}
                </Text>
                {true && <Image w={4} h={4} ml={1} src="/verified.png"></Image>}
              </Flex>

              <Flex
                gap={2}
                alignItems={"center"}
                justifyContent={"space-between"}
                w={"200px"}
                onClick={(e) => e.preventDefault()}
              >
                <Text fontSize={"xs"} color={"gray.light"}>
                  {formatDistanceToNow(new Date(post?.createdAt))} ago
                </Text>
                <Menu>
                  <MenuButton>
                    <BsThreeDots className="icon-container" />
                  </MenuButton>
                  <Portal>
                    <MenuList>
                      {currentUser?._id === user?._id && (
                        <>
                          <MenuItem>Edit</MenuItem>
                          <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
                        </>
                      )}
                      {post?.text && (
                        <MenuItem onClick={getTextCopy}>Copy</MenuItem>
                      )}
                      {post?.image && <MenuItem>Download</MenuItem>}
                    </MenuList>
                  </Portal>
                </Menu>
              </Flex>
            </Flex>

            <Flex flexDirection={"column"} mt={-1} w={"60%"}>
              {post?.text && (
                <Text fontSize={"sm"} mb={2} ref={copyText}>
                  {post?.text}
                </Text>
              )}

              {post?.image && (
                <Box
                  borderRadius={6}
                  overflow={"hidden"}
                  border={"1px solid"}
                  borderColor={"gray.light"}
                >
                  <Image src={post?.image} w={"full"} />
                </Box>
              )}
            </Flex>

            <Flex gap={3} my={1}>
              <Actions post={post} />
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </div>
  );
};

export default memo(Post);
