import React, { useRef, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowTaost";
import usePreviewImage from "../hooks/usePreviewImage";

const UpdateProfilePage = () => {
  const fileRef = useRef(null);
  const [user, setUser] = useRecoilState(userAtom);
  // console.log('update user profile page is', user);
  const initialState = {
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
    profilepicture: user.profilepicture,
  };
  const [formData, setFormData] = useState(initialState);
  const showToast = useShowToast();
  const { imageUrl, handleImageChange } = usePreviewImage();
  const [updating, setUpdating] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openFile = () => {
    fileRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log({ ...formData, profilepicture: imageUrl });
    if(updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/update/${user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ ...formData, profilepicture: imageUrl }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (data.message) {
        showToast("Success", data.message, "success");
        localStorage.setItem("user-threads", JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (error) {
      showToast("Error", "An error occured during upating profile", "error");
    }finally{
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Edit Profile
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imageUrl || formData.profilepicture}
                  name={formData.username}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={openFile}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel color={"gray"}>Name</FormLabel>
            <Input
              placeholder="johndoe"
              type="text"
              name="name"
              value={user?.name}
              disabled
            />
            <p
              style={{
                color: "gray",
                fontSize: "11px",
                marginTop: "8px",
                marginLeft: "2px",
              }}
            >
              Only after 30 days can change your name.
            </p>
          </FormControl>

          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="johndoe"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your bio."
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Link to="/">
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
              >
                Cancel
              </Button>
            </Link>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit" isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
};

export default UpdateProfilePage;
