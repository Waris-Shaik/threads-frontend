import { atom } from "recoil";

const refreshAtom = atom({
  key: "refreshAtom",
  default: false,
});

export default refreshAtom;
