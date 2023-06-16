const API_KEY = "7d9c83b9b323d6b1153776b82e4053f9";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface ICrew {
    known_for_department: string;
    name: string;
    profile_path: string;
}

export interface ICast {
    name: string;
    profile_path: string;
    character: string;
}

export interface ICredits {
    id: number;
    cast: ICast[];
    crew: ICrew[];
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

export interface ITv {
    backdrop_path: string;
    first_air_date: string;
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    profile_path: string;
    genres: {
		id: number;
		name: string;
	}[];
}

export interface IGetTvResult {
    results: ITv[];
}

export function isMovie(data: IMovie | ITv): data is IMovie {
	return (data as IMovie).title !== undefined;
}

export async function getNowPlaying() {
    return await (await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=2`)).json();
}

export async function getPopular() {
    return await (await fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getTopRated() {
    return await (await fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getGenreMovies(genreId: number) {
    return await (await fetch(`${BASE_PATH}/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&with_genres=${genreId}`)).json();
}

export async function getDetails(movieId: number) {
    return await (await fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getCredits(movieId: number) {
    return await (await fetch(`${BASE_PATH}/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getSimilar(movieId: number) {
    return await (await fetch(`${BASE_PATH}/movie/${movieId}/similar?api_key=${API_KEY}&language=ko-KR`)).json();
} 

export async function getOnTheAir() {
    return await (await fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko-KR&page=4`)).json();
}

export async function getTvPopular() {
    return await (await fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR&page=6`)).json();
}

export async function getTvTopRated() {
    return await (await fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getGenreTv(genreId: number) {
    return await (await fetch(`${BASE_PATH}/discover/tv?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&with_genres=${genreId}&page=2`)).json();
}

export async function getTvDetails(tvId: number) {
    return await (await fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getTvCredits(tvId: number) {
    return await (await fetch(`${BASE_PATH}/tv/${tvId}/credits?api_key=${API_KEY}&language=ko-KR`)).json();
}

export async function getTvSimilar(tvId: number) {
    return await (await fetch(`${BASE_PATH}/tv/${tvId}/similar?api_key=${API_KEY}&language=ko-KR`)).json();
} 

export async function getSearch(keyword: string) {
    return await (await fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko-KR&query=${keyword}&page=1&include_adult=false`)).json();
}