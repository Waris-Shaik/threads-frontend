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
  import { formatDistanceToNow } from "date-fns";
  import { useEffect, useState } from "react";
  import { BsThreeDots } from "react-icons/bs";
  import useShowToast from "../hooks/useShowTaost";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
  
  const RepliesPage = ({ reply, replyInfo }) => {
    const showToast = useShowToast();
    const [user, setUser] = useState([]);
    const [repliedUser, setRepliedUser] = useState([]);
    const currentUser = useRecoilValue(userAtom);
  
    useEffect(() => {
      const getUser = async () => {
        try {
          const res = await fetch(`/api/users/profile/` + reply?.userId.toString());
          const data = await res.json();
  
          if (data.error) {
            showToast("", data.message, "error");
            return;
          }
          setUser(data.user);
        } catch (error) {
          showToast("", "An error occurred during fetching user", "error");
        }
      };
  
      const getThatUser = async () => {
        try {
          const res = await fetch(`/api/users/profile/` + replyInfo?.postedby.toString());
          const data = await res.json();
  
          if (data.error) {
            showToast("", data.message, "error");
            return;
          }
          setRepliedUser(data.user);
        } catch (error) {
          showToast("", "An error occurred during fetching user", "error");
        }
      };
  
      getUser();
      getThatUser();
    }, [replyInfo, showToast]);

    if(!currentUser) return null;
  
    return (
     <Link to={`/@${repliedUser?.username}/posts/${replyInfo?._id.toString()}`}>
      <Flex borderBottom="1px solid" borderColor="gray.light" pb={4} mb={4} direction="column">
        <Flex alignItems="center">
          <Avatar onClick={(e)=> e.preventDefault()} size="md" src={user?.profilepicture} _hover={{ cursor: "pointer" }} />
          <Flex flex={1} flexDirection="column" gap={2} ml={3}>
            <Flex justifyContent="space-between" alignItems="center" w="full">
              <Text onClick={(e)=> e.preventDefault()} fontSize="sm" fontWeight="bold">
                {user?.name}
              </Text>
              <Flex onClick={(e)=> e.preventDefault()} gap={2} alignItems="center">
                <Text fontSize="xs" color="gray.light">
                  {formatDistanceToNow(new Date(reply?.createdAt))} ago
                </Text>
                <Menu >
                  <MenuButton>
                    <BsThreeDots onClick={(e)=> e.preventDefault()} className="icon-container" />
                  </MenuButton>
                  <Portal>
                    <MenuList>
                      <MenuItem>Edit</MenuItem>
                      <MenuItem>Delete</MenuItem>
                      <MenuItem>Copy</MenuItem>
                      <MenuItem>Download</MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </Flex>
            </Flex>
            <Flex flexDirection="column" mt={-1}>
              <Text>
                replying to{" "}
                <span style={{ color: "#00a8ff", opacity: 0.9 }}>@{repliedUser?.username}</span>
              </Text>
              <Text fontSize="sm" mb={2}>
                {reply?.text}
              </Text>
              {reply?.image && (
                <Box
                  borderRadius={6}
                  overflow="hidden"
                  border="1px solid"
                  borderColor="gray.light"
                >
                  <Image src={reply?.image} w="full" />
                </Box>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
     </Link>
    );
  };
  
  export default RepliesPage;
  