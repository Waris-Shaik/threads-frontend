import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useShowToast from "../hooks/useShowTaost";
import Post from "../components/Post";
import { useRecoilValue } from "recoil";
import refreshAtom from "../atoms/refreshAtom";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const refresh = useRecoilValue(refreshAtom);

  useEffect(() => {
    const getFeedPosts = async () => {
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        // console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
          // showToast("Success", "", "success");
        setPosts(data.posts);
      } catch (error) {
        showToast(
          "Error",
          "An error occured while fetching feed posts",
          "error"
        );
      } finally {
          setLoading(false);
      }
    };

    getFeedPosts();
  }, [refresh]);

  if (loading) {
    return (
      <Flex alignItems={"center"} justifyContent={"center"} h={"70vh"}>
        <Spinner size={"xl"} textAlign={"center"} />
      </Flex>
    );
  }

  if (!loading && posts?.length === 0) {
    return (
      <Box display={"flex"} justifyContent={"center"} >
        <Text>No posts to display please follow some accounts.</Text>
      </Box>
    );
  }

  return (
    <>
      {posts?.map((post)=>(
        <Post post={post} key={post._id} postedby={post.postedby} />
      ))}
    </>
  );
};

export default HomePage;
