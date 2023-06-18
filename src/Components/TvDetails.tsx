import styled from "styled-components";
import { useRecoilState } from "recoil";
import { tvDetailState } from "../Routes/atoms";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { ICredits, ITv, getTvCredits, getTvDetails } from '../Routes/api';
import { useHistory } from "react-router-dom";
import { makeImagePath } from '../utils';
import { FaStar } from "react-icons/fa";
import { VscClose } from "react-icons/vsc";
import TvSimilar from "./TvSimilar";

interface IDetails {
    from?: string;
}

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
    &:hover {
        background-color: #18181892;
        transition: 0.1s;
    }
`;
const Title = styled.h3`
    position: relative;
    top: -70px;
    padding: 20px;
    font-size: 28px;
    font-weight: 600;
    color: ${(props) => props.theme.white.lighter};
`;
const InfoContainer = styled.div`
    position: relative;
    top: -90px;
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
    top: -120px;
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
const SimilarWrapper = styled.div`
    height: 43%;
    position: relative;
    top: -160px;
    padding: 20px;
`;

function TvDetails({ from = "tv" }: IDetails) {
    const history = useHistory();
    const [ tvDetail ] = useRecoilState(tvDetailState);
    var detailsId = parseInt(tvDetail && tvDetail.id);
    const { data: detailsData } = useQuery<ITv>(["details", detailsId], () => getTvDetails(detailsId)); // query key인 detailsId가 바뀌면 query 함수가 재실행된다. 이를 통해 새로고침 시, id에 맞는 데이터가 유실되어 렌더링하지 못하는 에러를 해결했다.
    const { data: creditsData } = useQuery<ICredits>(["credits", detailsId], () => getTvCredits(detailsId));
    return (
        <Wrapper
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {tvDetail && (
                <>
                    <Cover
                        style={{
                            backgroundImage:
                                `linear-gradient(to top, #181818, transparent),
                                url(${makeImagePath(tvDetail.backdrop_path)})`,
                        }}
                    >
                        <CloseBtn onClick={() => history.push(`/${from}`)}>
                            <VscClose />
                        </CloseBtn>
                    </Cover>
                    <>
                        <Title> {detailsData?.name} </Title>
                        <InfoContainer>
                            <Info style={{ position: "relative", top: "-1px", color: "#45d369" }}>
                                <FaStar style={{ paddingRight: "3px" }}/>
                                {detailsData?.vote_average.toFixed(1)}
                            </Info>
                            <Info> {detailsData?.first_air_date.slice(0, 4)} </Info>
                            <Info> 에피소드 {detailsData?.last_episode_to_air.episode_number}개 </Info>
                            <Info>
                                {detailsData?.genres.map((g) => (
                                    <>
                                        <div
                                            style={{position: "relative", top: "-4px", backgroundColor: "rgba(150, 150, 150, 0.2)", padding: "4px 4px", marginRight: "5px", borderRadius: "2px"}}
                                            key={g.id}
                                        >
                                            {g.name}
                                        </div>
                                    </>
                                ))}
                            </Info>
                            <Info>  </Info>
                        </InfoContainer>
                        <Overview> {detailsData?.overview} </Overview>
                        <Credits>
                            <InfoTitle> 제작 </InfoTitle>
                            <CreditsContainer>
                                {creditsData?.crew.slice(0, 10).map((tv) => (
                                    <CreditsBox>
                                        {tv.profile_path ? <CreditsImg profileImg={makeImagePath(tv.profile_path)} /> : <NoImg> 이미지 없음 </NoImg>}
                                        <CreditsNameBox>
                                            <CreditsName> {tv.name} </CreditsName>
                                            <CreditsCharacter> {tv.known_for_department} </CreditsCharacter>
                                        </CreditsNameBox>
                                    </CreditsBox>
                                ))}
                            </CreditsContainer>
                            <InfoTitle style={{ paddingTop: "20px"}}> 출연 </InfoTitle>
                            <CreditsContainer>
                                {creditsData?.cast.slice(0, 20).map((tv) => (
                                    <CreditsBox>
                                        {tv.profile_path ? <CreditsImg profileImg={makeImagePath(tv.profile_path)} /> : <NoImg> 이미지 없음 </NoImg>}
                                        <CreditsNameBox>
                                            <CreditsName> {tv.name} </CreditsName>
                                            <CreditsCharacter> {tv.character} </CreditsCharacter>
                                        </CreditsNameBox>
                                    </CreditsBox>
                                ))}
                            </CreditsContainer>
                        </Credits>
                        <SimilarWrapper>
                            <InfoTitle> 함께 시청된 콘텐츠 </InfoTitle>
                            <TvSimilar />
                        </SimilarWrapper>
                    </>
                </>
            )}
        </Wrapper>
    );
}

export default TvDetails;