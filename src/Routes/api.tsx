const API_KEY = "7d9c83b9b323d6b1153776b82e4053f9";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMoive {
    backdrop_path: string;
    id: number;
    overview: string;
    poster_path: string;
    title: string;
    original_title: string;
    original_name: string;
    tagline: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: number;
        minimum: number;
    },
    page: number;
    results: IMoive[];
    total_pages: number;
    total_results: number;
}

export async function getNowPlaying() {
    return await (await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getMovieDetails(movieId: string) {
    return await (await fetch(`${BASE_PATH}/movie/${movieId}?api_key=7d9c83b9b323d6b1153776b82e4053f9&language=ko-KR`)).json();
}

export async function getSearch(keyword: string) {
    return await (await fetch(`${BASE_PATH}search/multi?api_key=${API_KEY}&language=ko-KR&query=${keyword}&page=1&include_adult=false`)).json();
}