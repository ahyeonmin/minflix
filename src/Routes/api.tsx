const API_KEY = "7d9c83b9b323d6b1153776b82e4053f9";
const BASE_PATH = "https://api.themoviedb.org/3/";

interface IMoive {
    backdrop_path: string;
    id: number;
    overview: string;
    poster_path: string;
    title: string;
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

export async function getMovies(){
    return await (await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`)).json();
}