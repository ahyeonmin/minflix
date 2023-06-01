import styled from "styled-components";
import { useRecoilState } from "recoil";
import { movieDetailState } from "../Routes/atoms";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { ICredits, IMovie, getCredits, getDetails } from '../Routes/api';
import { makeImagePath } from '../utils';
import { FaStar } from "react-icons/fa";

const Wrapper = styled(motion.div)`
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
    border-radius: 7px;
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
    color: ${(props) => props.theme.white.darker};
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
    color: ${(props) => props.theme.white.darker};
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
    color: ${(props) => props.theme.white.darker};
`;
const Credits = styled.div`
    position: relative;
    top: -145px;
    padding: 20px;
    color: ${(props) => props.theme.white.darker};
    font-size: 14px;
`;
const CreditsTitle = styled.div`
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

function Details() {
    const [ movieDetail ] = useRecoilState(movieDetailState);
    const detailsId = parseInt(movieDetail && movieDetail.id);
    const { data: detailsData } = useQuery<IMovie>(["details", detailsId], () => getDetails(detailsId)); // query key인 detailsId가 바뀌면 query 함수가 재실행된다. 이를 통해 새로고침 시, id에 맞는 데이터가 유실되어 렌더링하지 못하는 에러를 해결했다.
    const { data: creditsData } = useQuery<ICredits>(["credits", detailsId], () => getCredits(detailsId));
    return (
        <Wrapper>
            {movieDetail && (
                <>
                    <Cover
                        style={{
                            backgroundImage:
                                `linear-gradient(to top, #141414, transparent),
                                url(${makeImagePath(movieDetail.backdrop_path)})`,
                        }}
                    />
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
                            <CreditsTitle> 출연 </CreditsTitle>
                            <CreditsContainer>
                                {creditsData?.cast.slice(0, 19).map((movie) =>
                                    <CreditsBox>
                                        {movie.profile_path ? <CreditsImg profileImg={makeImagePath(movie.profile_path)} /> : <NoImg> 이미지 없음 </NoImg>}
                                        <CreditsNameBox>
                                            <CreditsName> {movie.name} </CreditsName>
                                            <CreditsCharacter> {movie.character} </CreditsCharacter>
                                        </CreditsNameBox>
                                    </CreditsBox>
                                )}
                            </CreditsContainer>
                        </Credits>
                    </>
                </>
            )}
        </Wrapper>
    );
}

export default Details;