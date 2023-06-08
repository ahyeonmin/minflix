import { atom } from 'recoil';
import { IMovie } from './api';

export const movieDetailState = atom<any>({
    key: "movieDetail",
    default: "",
});

export const clickedSliderState = atom({
    key: "clickedSlider",
    default: "",
});