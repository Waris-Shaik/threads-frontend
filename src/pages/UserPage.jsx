import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowTaost";
import { useRecoilValue } from "recoil";
import refreshAtom from "../atoms/refreshAtom";
import { Flex, Spinner, Image, Text, Box } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import toggleAtom from "../atoms/toggleAtom";
import RepliesPage from "./RepliesPage";
import { server } from "../main";

const UserPage = () => {
  let { username } = useParams();
  const toggleAtomStatus = useRecoilValue(toggleAtom);
  // const [user, setUser] = useState(null); // _
  const showToast = useShowToast();
  const refresh = useRecoilValue(refreshAtom);
  const currentUser = useRecoilValue(userAtom);
  const [myPosts, setMyPosts] = useState([]);
  const [myreplies, setMyReplies] = useState([]);
  username = username.split("@")[1];
  const { user, loading, setLoading } = useGetUserProfile();

  useEffect(() => {
    const getMyPosts = async () => {
      try {
        const res = await fetch(`${server}/api/posts/user/${username}`, {
          credentials: "include",
        });
        const data = await res.json();
        // console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMyPosts(data.posts);
      } catch (error) {
        showToast("Error", "An error occured while fetching my posts", "error");
      }
    };

    const getMyReplies = async () => {
      // if(!user) return null;
      try {
        const res = await fetch(`${server}/api/posts/myreplies`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.error) {
          showToast("error", data.message, "error");
          return;
        }

        setMyReplies(data.myreplies);
        // console.log(data.myreplies)
      } catch (error) {
        showToast(
          "Error",
          "An error occured while getting my replies",
          "error"
        );
      }
    };

    getMyPosts();
    getMyReplies();
  }, [username, refresh]);

  if (loading) {
    return (
      <Flex alignItems={"center"} justifyContent={"center"} h={"70vh"}>
        <Spinner size={"xl"} textAlign={"center"} />
      </Flex>
    );
  }

  if (!user && !loading) return <NoUserFound />;

  return (
    <>
      <UserHeader user={user} />
      {!loading && myPosts?.length === 0 && (
        <Box display={"flex"} justifyContent={"center"} my={8}>
          <Text>No posts to display post some posts.</Text>
        </Box>
      )}

      {toggleAtomStatus === "threads" ? (
        <>
          {myPosts &&
            myPosts.map((post) => (
              <Post key={post._id} post={post} postedby={post.postedby} />
            ))}
        </>
      ) : (
        <>
          {myreplies &&
            myreplies.map((post) =>
              post.replies.map((reply) => (
                <RepliesPage key={reply._id} reply={reply} replyInfo={post} />
              ))
            )}
        </>
      )}
    </>
  );
};

export default UserPage;

const NoUserFound = () => {
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
          alt="No User Found"
          mb={4}
          borderRadius={"10%"}
        />
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          No User Found
        </Text>
        <Text fontSize="md" color="gray.300">
          Sorry, we couldn't find any users at the moment.
        </Text>
      </Flex>
    </Flex>
  );
};
