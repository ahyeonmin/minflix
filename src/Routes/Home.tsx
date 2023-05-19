import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { AnimatePresence, motion, useViewportScroll } from 'framer-motion';
import { IGetMoviesResult, getDetails, getNowPlaying, getPopular } from './api';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Slider from '../Components/Slider';
import { makeImagePath } from '../utils';

const Wrapper = styled.div`
    background-color: black;
    height: 200vh;
    overflow: hidden; // 초과되는 내용은 가려서 스크롤바를 없앤다
`;
const Loader = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 60px;
    height: 100vh;
    background-image:
        linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
        url(${(props) => props.bgPhoto})
    ;
    background-size: cover;
`;
const Title = styled.h2`
    margin-bottom: 20px;
    color: ${(prop) => prop.theme.white.darker};
    font-weight: 700;
    font-size: 40px;
`;
const Overview = styled.p`
    width: 50%;
    color: ${(prop) => prop.theme.white.darker};
    font-size: 16px;
    line-height: 22px;
`;

const Overlay = styled(motion.div)`
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;
const BigMovie = styled(motion.div)`
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 40vw;
    height: 85vh;
    background-color: ${(props) => props.theme.black.veryDark};
    border-radius: 7px;
`;
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

function Home() {
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    /*
    const [ getId, setGetId ] = useState(0); // movieId를 state로 관리한다.
    const { data: detailsData, isLoading: isDetailsLoading } = useQuery<IGetMoviesResult>("details", () => getDetails(getId)); // getId를 API로 넘긴다.
    */
    const { scrollX, scrollY } = useViewportScroll();
    const history = useHistory();
    const onOverlayClicked = () => history.push("/");
    const { data: nowPlayingData, isLoading: isNowPlayingLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getNowPlaying);
    const { data: popularData, isLoading } = useQuery<IGetMoviesResult>(["movies", "popular"], getPopular);
    const clickedNowPlaying = // bigMovieMatch가 존재한다면 같은 movie id를 반환 (number로 형 변환)
        bigMovieMatch?.params.movieId &&
        nowPlayingData?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
    const clickedPopular =
        bigMovieMatch?.params.movieId &&
        popularData?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
    return (
        <Wrapper>
            {isNowPlayingLoading ? <Loader>Loading...</Loader> : (
                // 배너에는 첫번쨰 항목 보여주기
                <Banner bgPhoto={makeImagePath(nowPlayingData?.results[0].backdrop_path || "")}> {/* 만약 data가 없을 경우 빈 문자열로 */}
                    <Title>{nowPlayingData?.results[0].title}</Title>
                    <Overview>{nowPlayingData?.results[0].overview}</Overview>
                </Banner>
            )}
            <Slider
                title="새로 올라온 영화"
                data={nowPlayingData?.results}
            />
            <AnimatePresence>
                {bigMovieMatch ? (
                    <>
                        <Overlay
                            onClick={onOverlayClicked}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <BigMovie
                            layoutId={bigMovieMatch.params.movieId}
                            style={{ top: scrollY.get() + 50 }} // 스크롤을 해도 따라오도록 하기 (값을 넣으면 위치가 고정됨), get()으로 실제값을 받아옴
                        >
                            {clickedNowPlaying &&
                                <>
                                    <BigCover
                                        style={{
                                            backgroundImage:
                                                `linear-gradient(to top, #141414, transparent),
                                                url(${makeImagePath(clickedNowPlaying.backdrop_path)})`,
                                        }}
                                    />
                                    <BigTitle>{clickedNowPlaying.title}</BigTitle>
                                    <BigOverview>{clickedNowPlaying.overview}</BigOverview>
                                </>
                            }
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
        </Wrapper>
    );
}

export default Home;