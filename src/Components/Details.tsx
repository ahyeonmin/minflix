import styled from "styled-components";
import { useRecoilState } from "recoil";
import { movieDetailState } from "../Routes/atoms";
import { useQuery } from "react-query";
import { IMovie, getDetails } from '../Routes/api';
import { makeImagePath } from '../utils';
import { FaStar } from "react-icons/fa";

const Wrapper = styled.div``;

const Cover = styled.div`
    width: 100%;
    height: 400px;
    background-size: cover;
    background-position: center center;
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
    top: -95px;
    padding: 20px;
    font-size: 14px;
    color: ${(props) => props.theme.white.darker};
`;
const InfoWrapper = styled.div`
    position: relative;
    top: -110px;
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
    top: -140px;
    padding: 20px;
    font-size: 14px;
    font-weight: 300;
    line-height: 18px;
    color: ${(props) => props.theme.white.darker};
`;

function Details() {
    const [ movieDetail ] = useRecoilState(movieDetailState);
    const detailsId = parseInt(movieDetail && movieDetail.id);
    const { data } = useQuery<IMovie>("details", () => getDetails(detailsId));
    console.log(data);
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
                                {data && data?.vote_average.toFixed(1)}
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