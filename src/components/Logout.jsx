import { Button, useToast } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowTaost";
import { useState } from "react";

const Logout = () => {
  const clearUser = useSetRecoilState(userAtom);
  const showTaost = useShowToast();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: true,
      });

      const data = await res.json();
      setTimeout(() => {
        // clearing global user && lsw null;
        localStorage.removeItem("user-threads");
        clearUser(null);
        showTaost("Done", data.message, "success");
      }, 2000);
    } catch (error) {
      showTaost("Error", "Something went wrong.", "error");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
  return (
    <Button
      position={"fixed"}
      top={"37.5px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
      isLoading={loading}
    >
      <FiLogOut />
    </Button>
  );
};

export default Logout;
