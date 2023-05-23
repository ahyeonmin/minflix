import { atom } from 'recoil';

export const movieDetailState = atom<any>({
    key: "movieDetail",
    default: "",
});

export const clickedSliderState = atom({
    key: "clickedSlider",
    default: "",
});