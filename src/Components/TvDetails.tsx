import styled from "styled-components";
import { useRecoilState } from "recoil";
import { tvDetailState } from "../Routes/atoms";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { ITv, getTvDetails } from '../Routes/api';
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

function TvDetails() {
    const history = useHistory();
    const [ tvDetail, setTvDetail ] = useRecoilState(tvDetailState);
    var detailsId = parseInt(tvDetail && tvDetail.id);
    const { data: detailsData } = useQuery<ITv>(["details", detailsId], () => getTvDetails(detailsId)); // query key인 detailsId가 바뀌면 query 함수가 재실행된다. 이를 통해 새로고침 시, id에 맞는 데이터가 유실되어 렌더링하지 못하는 에러를 해결했다.
    const onCloseBtnClicked = () => {
        history.push(`/tv`);
    }
    return (
        <Wrapper>
            {tvDetail && (
                <>
                    <Cover
                        style={{
                            backgroundImage:
                                `linear-gradient(to top, #181818, transparent),
                                url(${makeImagePath(tvDetail.backdrop_path)})`,
                        }}
                    >
                        <CloseBtn onClick={onCloseBtnClicked}>
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
                        </InfoContainer>
                        <Overview> {detailsData?.overview} </Overview>
                    </>
                </>
            )}
        </Wrapper>
    );
}

export default TvDetails;