import { useState } from "react";
import useShowToast from "./useShowTaost";

const usePreviewImage = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const showToast = useShowToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      showToast(
        "Invalid File Type",
        "Please Selecyt only jpg/jpeg/png/svg files only",
        "error"
      );
      setImageUrl(null);
    }
  };

  return { imageUrl, setImageUrl, handleImageChange };
};
export default usePreviewImage;
