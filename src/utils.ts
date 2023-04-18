export function makeImagePath(id: string, format?: string) { // 이미지 경로 알려주는 함수
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}