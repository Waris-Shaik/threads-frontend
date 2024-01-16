import { Container } from "@chakra-ui/react";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import Logout from "./components/Logout";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import RepliesPage from "./pages/RepliesPage";

const App = () => {
  // the main which checks lsw and throw auth
  const user = useRecoilValue(userAtom);
  // console.log('global level user is', user);
  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/update"
          element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
        />
        <Route path="/replies" element={<RepliesPage />} />
        <Route
          path="/:username"
          element={
            user ? (
              <>
                {" "}
                <UserPage /> <CreatePost />
              </>
            ) : (
              <UserPage />
            )
          }
        ></Route>
        <Route path="/:username/posts/:pid" element={<PostPage />}></Route>
      </Routes>
      {user && <Logout />}
    </Container>
  );
};

export default App;
