import { atom } from "recoil";

const toggleAtom = atom({
  key: "toggleAtom",
  default: "threads",
});

export default toggleAtom;
