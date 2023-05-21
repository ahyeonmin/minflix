import { atom } from 'recoil';

export const clickedBoxState = atom<any>({
    key: "clickedBoxState",
    default: "",
});