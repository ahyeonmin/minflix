import styled from "styled-components";
import { useRecoilState } from "recoil";
import { movieDetailState } from "../Routes/atoms";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { IMovie, getDetails } from '../Routes/api';
import { makeImagePath } from '../utils';
import { FaStar } from "react-icons/fa";
import { useEffect } from "react";

const Wrapper = styled(motion.div)`
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
const InfoWrapper = styled.div`
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

function Details() {
    const [ movieDetail ] = useRecoilState(movieDetailState);
    const detailsId = parseInt(movieDetail && movieDetail.id);
    const { data } = useQuery<IMovie>(["details", detailsId], () => getDetails(detailsId)); // query key인 detailsId가 바뀌면 query 함수가 재실행된다. 이를 통해 새로고침 시, id에 맞는 데이터가 유실되어 렌더링하지 못하는 에러를 해결했다.
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
                        <Title> {data?.title} </Title>
                        <Tagline>  {data?.tagline} </Tagline>
                        <InfoWrapper>
                            <Info style={{ position: "relative", top: "-1px", color: "#45d369" }}>
                                <FaStar style={{ paddingRight: "3px" }}/>
                                {data?.vote_average.toFixed(1)}
                            </Info>
                            <Info> · </Info>
                            <Info> {data?.release_date.slice(0, 4)} </Info>
                            <Info> · </Info>
                            <Info>
                                {data?.genres.map((g) => (
                                    <>
                                        <div key={g.id}> {g.name} </div>
                                        <div> / </div>
                                    </>
                                ))}
                            </Info>
                        </InfoWrapper>
                        <Overview> {data?.overview} </Overview>
                    </>
                </>
            )}
        </Wrapper>
    );
}

export default Details;