import styled from 'styled-components';
import { useQuery } from 'react-query';
import { AnimatePresence, motion, useViewportScroll } from 'framer-motion';
import { IGetMoviesResult, getNowPlaying, getPopular, getTopRated } from './api';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Slider from '../Components/Slider';
import { makeImagePath } from '../utils';
import { useRecoilState } from "recoil";
import { clickedBoxState } from '../Routes/atoms';

const Wrapper = styled.div`
    background-color: black;
    height: 170vh;
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
        linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        url(${(props) => props.bgPhoto})
    ;
    background-size: cover;
`;
const Title = styled.h2`
    margin-bottom: 20px;
    color: ${(prop) => prop.theme.white.darker};
    font-weight: 700;
    font-size: 50px;
`;
const Sliders = styled.div``;
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
    height: 170vh;
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
    const { scrollX, scrollY } = useViewportScroll();
    const history = useHistory();
    const onOverlayClicked = () => history.push("/");
    const { data: popularData, isLoading: isPopularLoading } = useQuery<IGetMoviesResult>(["movies", "popular"], getPopular);
    const { data: nowPlayingData, isLoading: isNowPlayingLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getNowPlaying);
    const { data: topRatedData, isLoading: isTopRatedLoading } = useQuery<IGetMoviesResult>(["movies", "topRated"], getTopRated);
    const [ clickedBoxRecoil, setClickedBoxRecoil ] = useRecoilState(clickedBoxState);
    const clickedBox = // bigMovieMatch가 존재한다면 같은 movie id를 반환 (number로 형 변환) 박스를 클릭했을 때 movieId 반환
        bigMovieMatch?.params.movieId && (
            popularData?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
                nowPlayingData?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
                    topRatedData?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId)
    );
    setClickedBoxRecoil(clickedBox);
    return (
        <Wrapper>
            {isNowPlayingLoading || isPopularLoading || isTopRatedLoading
                ? <Loader>로딩 중...</Loader> : (
                    // 배너에는 첫번쨰 항목 보여주기
                    <Banner bgPhoto={makeImagePath(nowPlayingData?.results[0].backdrop_path || "")}> {/* 만약 data가 없을 경우 빈 문자열로 */}
                        <Title>{nowPlayingData?.results[0].title}</Title>
                        <Overview>{nowPlayingData?.results[0].overview}</Overview>
                    </Banner>
            )}
            <Sliders>
                <Slider
                    title="지금 뜨는 영화"
                    data={popularData?.results}
                    sliderId="popular"
                />
                <Slider
                    title="새로 올라온 영화"
                    data={nowPlayingData?.results}
                    sliderId="nowPlaying"
                />
                <Slider
                    title="평단의 찬사를 받은 영화"
                    data={topRatedData?.results}
                    sliderId="topRated"
                />
            </Sliders>
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
                            {clickedBox &&
                                <>
                                    <BigCover
                                        style={{
                                            backgroundImage:
                                                `linear-gradient(to top, #141414, transparent),
                                                url(${makeImagePath(clickedBox.backdrop_path)})`,
                                        }}
                                    />
                                    <BigTitle>{clickedBox.title}</BigTitle>
                                    <BigOverview>{clickedBox.overview}</BigOverview>
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