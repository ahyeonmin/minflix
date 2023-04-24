import styled from 'styled-components';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { AnimatePresence, motion, useViewportScroll } from 'framer-motion';
import { IGetMoviesResult, getMovies } from './api';
import { makeImagePath } from '../utils';
import { useHistory, useRouteMatch } from 'react-router-dom';

const Wrapper = styled.div`
    background-color: black;
    height: 200vh;
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
const Slider = styled.div`
    position: relative;
    top: -150px;
`;
const Row = styled(motion.div)`
    position: absolute;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    width: 100%;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
    background-color: white;
    height: 150px;
    border-radius: 3px;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    cursor: pointer;
    &:first-child { // 가려지는 박스는 시작하는 위치를 바꿔준다
        transform-origin: center left;
    };
    &:last-child {
        transform-origin: center right;
    }
`;
const Info = styled(motion.div)`
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px 0;
    background-color: ${(props) => props.theme.black.lighter};
    h4 {
        color: ${(props) => props.theme.white.lighter};
        text-align: center;
        font-size: 15px;
    }
    opacity: 0;
`;

const rowVariants = {
    hidden: {
        x: window.outerWidth, // 사용자 화면 크기 받아오기 (=window.innerWidth)
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth,
    },
}
const boxVariants = {
    normal: { // 커서를 치우면 딜레이 없음이 바로 반응
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -50,
        zIndex: 99, // 다른 박스들 위에 있도록 하기
        transition: {
            type: "tween",
            delay: 0.5,
            duration: 0.3,
        },
    },
}
const InfoVariants = {
    hover: {
        opacity: 1,
        transition: {
            type: "tween",
            delay: 0.5,
            duration: 0.3,
        },
    },
};

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
    background-color: whitesmoke;
`;

const offset = 6; // 슬라이드에 보여주고 싶은 영화 개수

function Home() {
    const [ index, setIndex ] = useState(0);
    const [ leaving, setLeaving ] = useState(false); // 슬라이드 연속 클릭시 간격 늘어나는 문제 해결하기
    const history = useHistory(); // URL 이동
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving(); // Exit이 끝나면 호출되고, leaving을 false로 바꾸기
            const totalMovies = data?.results.length - 1; // 배너에 사용한 영화 하나 제외
            const maxIndex = Math.floor(totalMovies / offset) - 1; // 0에서부터 시작하는 페이지
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1); // 마지막 페이지에 도달하면 되돌리기
        }
    }
    const toggleLeaving = () => setLeaving((prev) => !prev); // 항상 true인 leaving 상태를 반전
    const onBoxClicked = (movieId: number) => {
        history.push(`/movies/${movieId}`);
    };
    const onOverlayClicked = () => history.push("/");
    const { scrollX, scrollY } = useViewportScroll();
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    return (
        <Wrapper>
            {isLoading ? <Loader>Loading...</Loader> :
                // 배너에는 첫번쨰 항목 보여주기
                <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}> {/* 만약 data가 없을 경우 빈 문자열로 */}
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
            }
            <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}> {/* 새로고침시 제자리에서 시작, leaving이 항상 true인 문제 해결하기 */}
                    <Row
                        key={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{type: "tween", duration: 0.7}} // spring(기본)이 아닌 linear 애니메이션으로 설정하기
                    >
                        {data?.results
                            .slice(1)
                            .slice(offset*index, offset*index+offset)
                            .map((movie) => (
                                <Box
                                    key={movie.id}
                                    layoutId={movie.id + ""} // 문자열로 변환
                                    onClick={() => onBoxClicked(movie.id)}
                                    variants={boxVariants}
                                    initial="normal"
                                    whileHover="hover"
                                    transition={{ type: "tween" }}
                                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                >
                                    <Info variants={InfoVariants}> {/* 부모 컴포넌트의 hover를 상속받음 */}
                                        <h4>{movie.title}</h4>
                                    </Info>
                                </Box>
                        ))}
                    </Row>
                </AnimatePresence>
            </Slider>
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
                        />
                    </>
                ) : null}
            </AnimatePresence>
        </Wrapper>
    );
}

export default Home;