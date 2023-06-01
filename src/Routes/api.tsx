const API_KEY = "7d9c83b9b323d6b1153776b82e4053f9";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface ICast {
    name: string;
    profile_path: string;
    character: string;
}

export interface ICrew {
    department: string;
}

export interface ICredits {
    id: number;
    cast: ICast[];
    crew: {
        department: ICrew[];
    }
}

export interface IMovie {
    backdrop_path: string;
    id: number;
    overview: string;
    poster_path: string;
    title: string;
    original_title: string;
    original_name: string;
    tagline: string;
    release_date: string;
    runtime: number;
    vote_average: number;
    genres: {
		id: number;
		name: string;
	}[];
    profile_path: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: number;
        minimum: number;
    },
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export async function getNowPlaying() {
    return await (await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getPopular() {
    return await (await fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getTopRated() {
    return await (await fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getDetails(movieId: number) {
    return await (await fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getCredits(movieId: number) {
    return await (await fetch(`${BASE_PATH}/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getSearch(keyword: string) {
    return await (await fetch(`${BASE_PATH}search/multi?api_key=${API_KEY}&language=ko-KR&query=${keyword}&page=1&include_adult=false`)).json();
}