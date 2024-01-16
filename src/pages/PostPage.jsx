import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Spinner,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowTaost";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import refreshAtom from "../atoms/refreshAtom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { formatDistanceToNow } from "date-fns";
import userAtom from "../atoms/userAtom";

const PostPage = () => {
  const [post, setPost] = useState([]);
  const { pid } = useParams();
  const showToast = useShowToast();
  const { user, loading } = useGetUserProfile();
  const currentUser = useRecoilValue(userAtom); // logged in user lsw g
  const textRef = useRef(null);
  const navigate = useNavigate();
  const refresh = useRecoilValue(refreshAtom);

  const copyText = () => {
    navigator.clipboard
      .writeText(post?.text)
      .then(() => {
        showToast("", "copied", "success");
      })
      .catch(() => {
        showToast("", "something went wrong", "error");
      });
  };

  const handleDeletePost = async () => {
    // console.log(post._id);
    if (!post || !post._id) return showToast("", "", "error");
    try {
      const res = await fetch(`/api/posts/delete/${post?._id}`, {
        method: "DELETE",
        credentials: true,
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("done", data.message, "success");
      navigate(`/@${currentUser?.username}`);
    } catch (error) {
      showToast("Error", "An error occured while deleting post", "error");
    }
  };

  useEffect(() => {
    const getSinglePost = async () => {
      try {
        const res = await fetch(`/api/posts/` + pid, { credentials: true });
        const data = await res.json();
        // console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // showToast()
        setPost(data.post);
      } catch (error) {
        showToast(
          "Error",
          "An error occured while fetching single post",
          "error"
        );
      }
    };

    getSinglePost();
  }, [pid, showToast, refresh]);

  if (loading) {
    return (
      <Flex alignItems={"center"} justifyContent={"center"} h={"70vh"}>
        <Spinner size={"xl"} textAlign={"center"} />
      </Flex>
    );
  }
  if (!loading && !post) return <h1>not found!</h1>;

  if (!post && !user) return <NoPostFound />;
  return (
    <>
      <Flex py={4}>
        {/* 1stflex header starts */}
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={user?.profilepicture}
            size={"md"}
            name={user?.username}
          />

          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.name}
            </Text>
            <Image src="/verified.png" w="4" h="4" ml={1} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} color={"gray.light"}>
            {post.createdAt && formatDistanceToNow(new Date(post.createdAt))}{" "}
            ago
          </Text>
          <Menu>
            <MenuButton>
              <BsThreeDots />
            </MenuButton>
            <Portal>
              <MenuList>
                {currentUser?._id === user?._id && (
                  <>
                    <MenuItem>Edit</MenuItem>
                    <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
                  </>
                )}
                {post?.text && <MenuItem onClick={copyText}>Copy</MenuItem>}
                {post?.image && <MenuItem>Download</MenuItem>}
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </Flex>
      {/* 1stflex header ends */}

      {post?.text && (
        <Text my={2} ref={textRef}>
          {post?.text}{" "}
        </Text>
      )}

      {post?.image && (
        <Box
          border={"1px solid"}
          borderRadius={6}
          overflow={"hidden"}
          borderColor={"gray.light"}
        >
          <Image src={post?.image} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={2}>
        {" "}
        {/* 2nd flex starts here */}
        <Actions post={post} />
      </Flex>

      <Divider my={2} bg={"gray.light"}></Divider>

      <Flex justifyContent={"space-between"}>
        {/* flex 3rd starts here */}
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text fontSize={"md"} color={"gray.light"}>
            Get the app to like, reply and post
          </Text>
        </Flex>

        <Button>Get</Button>
      </Flex>
      {/* flex 4th ends here */}
      <Divider bg={"gray.light"} my={2} />

      {post?.replies
        ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((reply) => (
          <Comment
            reply={reply}
            key={reply._id}
            postId={post._id}
            lastReply={reply._id === post.replies[post.replies.length - 1]._id}
          />
        ))}
    </>
  );
};

export default PostPage;

const NoPostFound = () => {
  return (
    <Flex
      height="77vh"
      justifyContent="center"
      alignItems="center"
      backgroundImage="url('https://res.cloudinary.com/dupxvcm3h/image/upload/v1704350422/notfound_dbue5h.jpg')" // Replace with your image link
      backgroundSize="cover"
      backgroundPosition="center"
      color="white"
    >
      <Flex
        direction="column"
        alignItems="center"
        textAlign="center"
        p={8}
        bg="rgba(0, 0, 0, 0.7)" // Adjust the background color opacity if needed
        borderRadius="md"
      >
        <Image
          src="https://res.cloudinary.com/dupxvcm3h/image/upload/v1704350422/notfound_dbue5h.jpg" // Replace with your image link
          alt="No Post Found"
          mb={4}
          borderRadius={"10%"}
        />
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          No Post Found
        </Text>
        <Text fontSize="md" color="gray.300">
          Sorry, we couldn't find any post at the moment.
        </Text>
      </Flex>
    </Flex>
  );
};
