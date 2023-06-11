import styled from "styled-components";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { movieDetailState } from "../Routes/atoms";
import { motion } from "framer-motion";
import { IMovie, IGetMoviesResult, getDetails, getSimilar } from "../Routes/api";
import { FaStar } from "react-icons/fa";
import { makeImagePath } from '../utils';

const SimilarContainer = styled.div`
    height: 400px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    overflow-y: scroll;
    &::-webkit-scrollbar {
    width: 1rem;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #666666;
		border-radius: 1rem;
		background-clip: padding-box;
		border: 0.25rem solid transparent;
    }
    &::-webkit-scrollbar-track {
        background-color: #141414;
    }
`;
const SimilarBox = styled(motion.div)`
    width: 230px;
    height: 280px;
    display: flex;
    flex-direction: column;
    margin-bottom: 26px;
    background-color: ${(props) => props.theme.black.lighter};
    border-radius: 5px;
    font-size: 13px;
    cursor: default;
`;
const SimilarImg = styled.div<{bgPhoto: string}>`
    width: 100%;
    height: 130px;
    background-image: linear-gradient(to top, #2F2F2F, transparent), url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
`;
const SimilarNoImg = styled.div`
    background: linear-gradient(to top, #2F2F2F, transparent), #0e0e0e;
    height: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    font-size: 12px;
`;
const SimilarTitle = styled.div`
    position: relative;
    top: -18px;
    padding: 0 7px;
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
`;
const SimilarInfo = styled.div`
    display: flex;
    position: relative;
    top: -8.5px;
    left: 7px;
`;
const SimilarStar = styled.div`
    position: relative;
    top: -2.5px;
    color: #45d369;
    padding-right: 7px;
`;
const SimilarDate = styled.div`

`;
const SimilarOverview = styled.div`
    height: 110px;
    padding: 0 7px;
    overflow: hidden;
    line-height: 18px;
    font-weight: lighter;
`;
function Similar() {
    const [ movieDetail ] = useRecoilState(movieDetailState);
    var detailsId = parseInt(movieDetail && movieDetail.id);
    const { data: detailsData } = useQuery<IMovie>(["details", detailsId], () => getDetails(detailsId));
    const { data: similarData } = useQuery<IGetMoviesResult>(["similar", detailsId], () => getSimilar(detailsId));
    return (
        <SimilarContainer>
            {similarData?.results.slice(0, 20).map((movie) => (
                <SimilarBox key={movie.id}>
                    {movie.backdrop_path ? <SimilarImg bgPhoto={makeImagePath(movie.backdrop_path)} /> : <SimilarNoImg> 이미지 없음 </SimilarNoImg>}
                    <SimilarTitle> {movie.title}</SimilarTitle>
                    <SimilarInfo>
                        <SimilarStar>
                            <FaStar style={{ position: "relative", top: "2px", paddingRight: "3px" }}/>
                            {detailsData?.vote_average.toFixed(1)}
                        </SimilarStar>
                        <SimilarDate> {movie.release_date.slice(0, 4)} </SimilarDate>
                    </SimilarInfo>
                    <SimilarOverview> {movie.overview} </SimilarOverview>
                </SimilarBox>
            ))}
        </SimilarContainer>
    )
}

export default Similar;