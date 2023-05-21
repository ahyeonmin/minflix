import styled from "styled-components";
import { useRecoilState } from "recoil";
import { movieDetailState } from "../Routes/atoms";
import { makeImagePath } from '../utils';

const Wrapper = styled.div``;

const BigCover = styled.div`
    width: 100%;
    height: 400px;
    background-size: cover;
    background-position: center center;
`;
const BigTitle = styled.h3`
    position: relative;
    top: -70px;
    padding: 20px;
    font-size: 28px;
    font-weight: 600;
    color: ${(props) => props.theme.white.lighter};
`;
const BigOverview = styled.p`
    position: relative;
    top: -70px;
    width: 70%;
    padding: 20px;
    font-size: 14px;
    line-height: 18px;
    color: ${(props) => props.theme.white.darker};
`;

function Details() {
    const [ movieDetail ] = useRecoilState(movieDetailState);
    return (
        <Wrapper>
            {movieDetail &&
                <>
                    <BigCover
                        style={{
                            backgroundImage:
                                `linear-gradient(to top, #141414, transparent),
                                url(${makeImagePath(movieDetail.backdrop_path)})`,
                        }}
                    />
                    <BigTitle>{movieDetail.title}</BigTitle>
                    <BigOverview>{movieDetail.overview}</BigOverview>
                </>
            }
        </Wrapper>
    );
}

export default Details;