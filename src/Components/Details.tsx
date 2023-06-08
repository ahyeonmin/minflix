import styled from "styled-components";
import { useRecoilState } from "recoil";
import { movieDetailState } from "../Routes/atoms";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { IGetMoviesResult, ICredits, IMovie, getCredits, getSimilar, getDetails } from '../Routes/api';
import { useHistory } from "react-router-dom";
import { makeImagePath } from '../utils';
import { FaStar } from "react-icons/fa";
import { VscClose } from "react-icons/vsc";

const Wrapper = styled(motion.div)`
    color: ${(props) => props.theme.white.darker};
    height: 100%;
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
const Cover = styled.div`
    width: 100%;
    height: 400px;
    background-size: cover;
    background-position: center center;
    border-top-left-radius: 7px;
`;
const CloseBtn = styled.div`
    position: relative;
    top: 15px;
    left: 520px;
    width: 25px;
    height: 25px;
    background-color: ${(props) => props.theme.black.darker};
    border-radius: 50%;
    padding: 3px;
    font-size: 25px;
    cursor: pointer;
`;
const Title = styled.h3`
    position: relative;
    top: -70px;
    padding: 20px;
    font-size: 28px;
    font-weight: 600;
    color: ${(props) => props.theme.white.lighter};
`;
const Tagline = styled.h4`
    position: relative;
    top: -98px;
    padding: 20px;
    font-size: 14px;
    font-weight: lighter;
`;
const InfoContainer = styled.div`
    position: relative;
    top: -115px;
    padding: 20px;
    display: flex;
`;
const Info = styled.div`
    display: flex;
    font-size: 14px;
    padding-right: 8px;
    div:last-child {
        display: none;
    }
`;
const Overview = styled.p`
    position: relative;
    top: -145px;
    padding: 20px;
    font-size: 14px;
    font-weight: lighter;
    line-height: 18px;
`;
const Credits = styled.div`
    position: relative;
    top: -145px;
    padding: 20px;
    color: ${(props) => props.theme.white.lighter};
    font-size: 14px;
`;
const InfoTitle = styled.div`
    padding-bottom: 15px;
    font-size: 18px;
`;
const CreditsContainer = styled.div`
    height: 160px;
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
const CreditsBox = styled.div`
    width: 230px;
    display: flex;
    padding-bottom: 20px;
`;
const CreditsImg = styled.div<{profileImg: string}>`
    width: 60px;
    height: 60px;
    background-image: url(${(props) => props.profileImg});
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
    margin-right: 7px;
`;
const NoImg = styled.div`
    background-color: #0e0e0e;
    width: 60px;
    height: 60px;
    border-radius: 5px;
    margin-right: 7px;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const CreditsNameBox = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 5px;
`;
const CreditsName = styled.div`
    padding-bottom: 5px;
`;
const CreditsCharacter = styled.div`
    font-size: 12px;
    font-weight: lighter;
`;
const Similar = styled.div`
    height: 43%;
    position: relative;
    top: -160px;
    padding: 20px;
`;
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
    height: 170px;
    display: flex;
    flex-direction: column;
    margin-bottom: 26px;
    background-color: ${(props) => props.theme.black.lighter};
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        div {
            color: #666666;
        }
    }
`;
const SimilarImg = styled.div<{bgPhoto: string}>`
    width: 100%;
    height: 130px;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
`;
const SimilarNoImg = styled.div`
    background-color: #0e0e0e;
    height: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    font-size: 12px;
`;
const SimilarTitle = styled.div`
    padding: 15px 0;
    text-align: center;
    font-size: 14px;
    transition: 0.3s;
`;

function Details() {
    const history = useHistory();
    const [ movieDetail, setMovieDetail ] = useRecoilState(movieDetailState);
    var detailsId = parseInt(movieDetail && movieDetail.id);
    const { data: detailsData } = useQuery<IMovie>(["details", detailsId], () => getDetails(detailsId)); // query key인 detailsId가 바뀌면 query 함수가 재실행된다. 이를 통해 새로고침 시, id에 맞는 데이터가 유실되어 렌더링하지 못하는 에러를 해결했다.
    const { data: creditsData } = useQuery<ICredits>(["credits", detailsId], () => getCredits(detailsId));
    const { data: similarData } = useQuery<IGetMoviesResult>(["similar", detailsId], () => getSimilar(detailsId));
    const onCloseBtnClicked = () => {
        history.push(`/`);
    }
    const onSimilarBoxClicked = (contentData: IMovie, movieId: number) => (
        setMovieDetail(null),
        detailsId = movieId, // API에 보낼 detailsId를 movieId와 일치시킨 후 푸쉬해보자...
        history.push(`/movies/${detailsId}`) // 응 안됨 정상적으로 안넘어가고 NaN값으로 넘겨져서 에러남
    );
    return (
        <Wrapper>
            {movieDetail && (
                <>
                    <Cover
                        style={{
                            backgroundImage:
                                `linear-gradient(to top, #181818, transparent),
                                url(${makeImagePath(movieDetail.backdrop_path)})`,
                        }}
                    >
                        <CloseBtn onClick={onCloseBtnClicked}>
                            <VscClose />
                        </CloseBtn>
                    </Cover>
                    <>
                        <Title> {detailsData?.title} </Title>
                        <Tagline>  {detailsData?.tagline} </Tagline>
                        <InfoContainer>
                            <Info style={{ position: "relative", top: "-1px", color: "#45d369" }}>
                                <FaStar style={{ paddingRight: "3px" }}/>
                                {detailsData?.vote_average.toFixed(1)}
                            </Info>
                            <Info> · </Info>
                            <Info> {detailsData?.release_date.slice(0, 4)} </Info>
                            <Info> · </Info>
                            <Info>
                                {detailsData?.genres.map((g) => (
                                    <>
                                        <div key={g.id}> {g.name} </div>
                                        <div> / </div>
                                    </>
                                ))}
                            </Info>
                        </InfoContainer>
                        <Overview> {detailsData?.overview} </Overview>
                        <Credits>
                            <InfoTitle> 제작 </InfoTitle>
                            <CreditsContainer>
                                {creditsData?.crew.slice(0, 10).map((movie) => (
                                    <CreditsBox>
                                        {movie.profile_path ? <CreditsImg profileImg={makeImagePath(movie.profile_path)} /> : <NoImg> 이미지 없음 </NoImg>}
                                        <CreditsNameBox>
                                            <CreditsName> {movie.name} </CreditsName>
                                            <CreditsCharacter> {movie.known_for_department} </CreditsCharacter>
                                        </CreditsNameBox>
                                    </CreditsBox>
                                ))}
                            </CreditsContainer>
                            <InfoTitle style={{ paddingTop: "20px"}}> 출연 </InfoTitle>
                            <CreditsContainer>
                                {creditsData?.cast.slice(0, 20).map((movie) => (
                                    <CreditsBox>
                                        {movie.profile_path ? <CreditsImg profileImg={makeImagePath(movie.profile_path)} /> : <NoImg> 이미지 없음 </NoImg>}
                                        <CreditsNameBox>
                                            <CreditsName> {movie.name} </CreditsName>
                                            <CreditsCharacter> {movie.character} </CreditsCharacter>
                                        </CreditsNameBox>
                                    </CreditsBox>
                                ))}
                            </CreditsContainer>
                        </Credits>
                        <Similar>
                            <InfoTitle> 함께 시청된 영화 </InfoTitle>
                            <SimilarContainer>
                                {similarData?.results.slice(0, 20).map((movie) => (
                                    <SimilarBox
                                        key={movie.id}
                                        onClick={() => onSimilarBoxClicked(movie, movie.id)}
                                    >
                                        {movie.backdrop_path ? <SimilarImg bgPhoto={makeImagePath(movie.backdrop_path)} /> : <SimilarNoImg> 이미지 없음 </SimilarNoImg>}
                                        <SimilarTitle> {movie.title}</SimilarTitle>
                                    </SimilarBox>
                                ))}
                            </SimilarContainer>
                        </Similar>
                    </>
                </>
            )}
        </Wrapper>
    );
}

export default Details;