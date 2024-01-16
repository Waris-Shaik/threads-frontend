import {
  Flex,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Text,
  ModalBody,
  FormControl,
  ModalFooter,
  Button,
  useDisclosure,
  CloseButton,
  Image,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowTaost";
import refreshAtom from "../atoms/refreshAtom";
import { BsImageFill } from "react-icons/bs";
import usePreviewImage from "../hooks/usePreviewImage";

const MAX_CHAR = 300;
const Actions = ({ post }) => {
  const currentUser = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(post?.likes?.includes(currentUser?._id));
  const showToast = useShowToast();
  const [refresh, setRefresh] = useRecoilState(refreshAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLiking, setIsLiking] = useState(false);
  const [reply, setReply] = useState("");
  const imageRef = useRef(null);
  const { imageUrl, handleImageChange, setImageUrl } = usePreviewImage();
  const [isReplying, setIsReplying] = useState(false);
  const [repost, setRepost] = useState(false);

  const toggleLikeUnlikePost = async () => {
    if (!currentUser)
      return showToast("Error", "You must be logged in to like post", "error");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`/api/posts/toggleLike/` + post?._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // showToast("Success", data.message, "success");
      setLiked(!liked);
      setRefresh(!refresh);
    } catch (error) {
      showToast("Error", "An error occured while liking post", "error");
    } finally {
      setIsLiking(false);
    }
  };

  const openImage = () => {
    imageRef.current.click();
  };

  const handleReplyChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setReply(truncatedText);
    } else {
      setReply(inputText);
    }
  };

  const handleReplyPost = async () => {
    if (!reply && !imageUrl)
      return showToast("error", "Field's value can't be empty", "error");

    setIsReplying(true);
    try {
      const replyPost = { text: reply, image: imageUrl };
      const res = await fetch("/api/posts/reply/" + post?._id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(replyPost),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setTimeout(() => {
        setRefresh(!refresh);
        showToast("Done", data.message, "success");
        setReply("");
        setImageUrl("");
        onClose();
      }, 1000);
    } catch (error) {
      showToast("Error", data.error, "error");
    } finally {
      setTimeout(() => {
        setIsReplying(false);
      }, 1000);
    }
  };
  const onOPEN = () => {
    if (!currentUser)
      return showToast("Error", "You must be logged in to reply post", "error");
    onOpen();
  };

  return (
    <Flex flexDirection="column">
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={toggleLikeUnlikePost}
        >
          <title>like</title>
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          onClick={onOPEN}
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Reply</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <Input
                  placeholder="Reply goes here..."
                  autoFocus
                  onChange={handleReplyChange}
                  name="reply"
                  value={reply}
                />
              </FormControl>
              <Text
                textAlign={"right"}
                fontSize={"sm"}
                fontWeight={"bold"}
                m={1}
                letterSpacing={1}
                color={"gray.200"}
                marginBottom={5}
              >
                {reply?.length}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsImageFill size={18} cursor={"pointer"} onClick={openImage} />

              {imageUrl && (
                <Flex mt={5} w={"full"} position={"relative"}>
                  <Image src={imageUrl} alt="select image" w={"full"} />
                  <CloseButton
                    onClick={() => setImageUrl(null)}
                    bg={"gray.900"}
                    position={"absolute"}
                    top={2}
                    right={2}
                    _hover={{ bg: "gray.500" }}
                  />
                </Flex>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                size={"sm"}
                colorScheme="blue"
                mr={3}
                onClick={handleReplyPost}
                isLoading={isReplying}
              >
                Reply
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <RepostSVG repost={repost} setRepost={setRepost} />
        <ShareSVG />
      </Flex>
      {/* actions -icons */}
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post?.replies?.length}{" "}
          {post?.replies?.length === 1 ? "reply" : "replies"}
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post?.likes?.length} {post?.likes?.length === 1 ? "like" : "likes"}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Actions;

const RepostSVG = ({ repost, setRepost }) => {
  return (
    <svg
      aria-label="Repost"
      color={repost ? "rgb(66, 103, 178)" : "rgb(255,255,255)"}
      fill={repost ? "rgb(66, 103, 178)" : "rgb(255,255,255)"}
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      onClick={() => setRepost(!repost)}
    >
      <title>Repost</title>
      <path
        fill=""
        d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
      ></path>
    </svg>
  );
};

const ShareSVG = () => {
  return (
    <svg
      aria-label="Share"
      color=""
      fill="rgb(243, 245, 247)"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
    >
      <title>Share</title>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="22"
        x2="9.218"
        y1="3"
        y2="10.083"
      ></line>
      <polygon
        fill="none"
        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
    </svg>
  );
};
