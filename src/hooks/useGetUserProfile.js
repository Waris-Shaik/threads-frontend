import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowTaost";
import { useRecoilValue } from "recoil";
import refreshAtom from "../atoms/refreshAtom";
import { server } from "../main";

//   username = username.split("@")[1];

const useGetUserProfile = () => {
  let { username } = useParams();
  username = username.split("@")[1];
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refresh = useRecoilValue(refreshAtom);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${server}/api/users/profile/${username}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          setTimeout(() => {
            showToast("Error", data.error, "error");
          }, 500);
          return;
        }

        //  if(currentUser){
        //   setTimeout(()=>{
        //     showToast("Success", "", "success");
        //   },1000);
        //  }
        setUser(data.user);
        // console.log(data.user);
      } catch (error) {
        showToast("Error", "An error occured during fetching user", "error");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    getUser();
  }, [username, refresh]);

  return { user, loading, setLoading };
};

export default useGetUserProfile;
