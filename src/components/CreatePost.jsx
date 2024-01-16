import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
  Text,
  FormControl,
  Textarea,
  Input,
  Image,
  Flex,
  CloseButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsImageFill } from "react-icons/bs";
import usePreviewImage from "../hooks/usePreviewImage";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowTaost";
import refreshAtom from "../atoms/refreshAtom";

const MAX_CHAR = 500;
const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imageRef = useRef(null);
  const { handleImageChange, imageUrl, setImageUrl } = usePreviewImage();
  const [postText, setPostText] = useState("");
  const currentUser = useRecoilValue(userAtom); // logged in user lsw; globally
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useRecoilState(refreshAtom);

  const openImage = () => {
    imageRef.current.click();
  };

  const handlTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
    } else {
      setPostText(inputText);
    }
  };

  const handleCreatePost = async () => {
    const postData = {
      text: postText,
      image: imageUrl,
      postedby: currentUser?._id,
    };
    if (!postText && !imageUrl) {
      setLoading(false);
      showToast("Error", "Can't post empty field's", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: true,
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", "Can't post empty field's", "error");
        return;
      }

      setTimeout(() => {
        setRefresh(!refresh);
        setPostText("");
        setImageUrl("");
        onClose();
        showToast("Success", data.message, "success");
      }, 2000);
    } catch (error) {
      showToast("Error", "An error occured during post created", "error");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md", md: "lg" }}
      >
        Post
      </Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                scrollBehavior={"smooth"}
                placeholder="Post Content goes here.."
                autoFocus
                value={postText}
                onChange={handlTextChange}
              ></Textarea>
              <Text
                textAlign={"right"}
                fontSize={"sm"}
                fontWeight={"bold"}
                m={1}
                letterSpacing={1}
                color={"gray.200"}
                marginBottom={5}
              >
                {postText.length}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsImageFill size={18} cursor={"pointer"} onClick={openImage} />
            </FormControl>

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
              onClick={handleCreatePost}
              colorScheme="blue"
              mr={3}
              isLoading={loading}
            >
              Post
            </Button>
            {/* <Button variant='ghost'>Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
