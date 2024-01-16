import { Avatar, Box, Flex, Menu, MenuButton, MenuList, MenuItem, Portal, Text, Image  } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import { Link } from "react-router-dom"
import Actions from "./Actions"
import { useState } from "react"



const UserPost = () => {
  return (
    <div>
      <Link>
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar
              size={"md"}
              name="mark-zuckerberg"
              src="/zuck-avatar.png"
            ></Avatar>
            <Box w="1px" h={"full"} bg="gray.light" my={8}></Box>
            <Box position={"relative"} w={"full"}>
              <Avatar
                size={"xs"}
                name="Dan Abrahmov"
                src="https://bit.ly/dan-abramov"
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding="2px"
              ></Avatar>

              <Avatar
                size={"xs"}
                name="Prosper Otemuyiwa"
                src="https://bit.ly/prosper-baba"
                position={"absolute"}
                bottom={"0px"}
                right={"-5px"}
                padding="2px"
              ></Avatar>

              <Avatar
                size={"xs"}
                name="Christian Nwamba"
                src="https://bit.ly/code-beast"
                position={"absolute"}
                bottom={"0px"}
                left="5px"
                padding="2px"
              ></Avatar>
            </Box>
          </Flex>

          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex
              justifyContent={"space-between"}
              alignItems={"flex-star"}
              w={"full"}
            >
              <Flex w={"full"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                  username
                </Text>
               {true &&  <Image w={4} h={4} ml={1} src="/verified.png"></Image>}
              </Flex>

              <Flex gap={2} alignItems={"center"}>
                <Text fontSize={"sm"} color={"gray.light"}>
                  1d
                </Text>
                <Menu>
                    <MenuButton>
                    <BsThreeDots className="icon-container" />
                    </MenuButton>
                    <Portal>
                    <MenuList>
                        <MenuItem
                        >Edit</MenuItem>
                        <MenuItem>Delete</MenuItem>
                        <MenuItem>Download</MenuItem>
                    </MenuList>
                    </Portal>
                </Menu>
              </Flex>
            </Flex>

            <Flex flexDirection={"column"} mt={-1}>
              <Text fontSize={"sm"} mb={2}>
                postTitle
              </Text>


                <Box
                  borderRadius={6}
                  overflow={"hidden"}
                  border={"1px solid"}
                  borderColor={"gray.light"}
                >
                  <Image src={'/post1.png'} w={"full"} />
                </Box>




            </Flex>

            <Flex gap={3} my={1}>
              <Actions  />
            </Flex>

            {/* <Flex gap={2} alignItems={"center"}>
              <Text color={"gray.light"} fontSize={"sm"}>
                {" "}
                 replies
              </Text>
              <Box
                w={0.5}
                h={0.5}
                borderRadius={"full"}
                bg={"gray.light"}
              ></Box>
              <Text color={"gray.light"} fontSize={"sm"}>
                {" "}
                 likes
              </Text>
            </Flex> */}
          </Flex>
        </Flex>
      </Link>
    </div>
  )
}

export default UserPost