import styled from 'styled-components';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { AnimatePresence, motion, useViewportScroll } from 'framer-motion';
import { IGetMoviesResult, getMovieDetails, getNowPlaying } from './api';
import { makeImagePath } from '../utils';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight} from "react-icons/fa";

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
const Slider = styled.div`
    position: relative;
    top: -150px;
    margin: 0 60px;
`;
const RowTitle = styled(motion.div)`
    color: white;
    font-size: 20px;
    padding-bottom: 12px;
`;
const Row = styled(motion.div)`
    width: 100%;
    position: absolute;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
    width: 100%;
    height: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    &:hover {
        background-image: linear-gradient(to top, #141414, transparent), url(${(props) => props.bgPhoto});
    }
`;
const Info = styled(motion.div)`
    position: absolute;
    bottom: 0;
    padding: 10px 0;
    div {
        color: ${(props) => props.theme.white.lighter};
        text-align: center;
        font-size: 13px;
        font-weight: 500;
    }
    opacity: 0;
`;
const SliderBtnLeft = styled(motion.div)`
    position: absolute;
    left: 15px;
    bottom: 30px;
    color: white;
    font-size: 35px;
    cursor: pointer;
`;
const SliderBtnRight = styled(motion.div)`
    position: absolute;
    right: 15px;
    bottom: 30px;
    color: white;
    font-size: 35px;
    cursor: pointer;
`;

const rowVariants = { // 사용자 화면 크기 받아오기 (=window.innerWidth)
    hidden: (right: number) => {
        return {
            x: right === 1 ? window.outerWidth : -window.outerWidth,
        };
    },
    visible: {
        x: 0,
    },
    exit: (right: number) => {
        return {
            x: right === 1 ? -window.outerWidth : window.outerWidth,
        };
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

const offset = 6; // 슬라이드에 보여주고 싶은 영화 개수

function Home() {
    const [ isRight, setIsRight ] = useState(1); // left = 0, right = 1
    const [ index, setIndex ] = useState(0);
    const [ leaving, setLeaving ] = useState(false); // 슬라이드 연속 클릭시 간격 늘어나는 문제 해결하기
    const history = useHistory(); // URL 이동
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    const changeIndex = (right: number) => {
        if (data) {
            if (leaving) return;
            setIsRight(right);
            toggleLeaving(); // Exit이 끝나면 호출되고, leaving을 false로 바꾸기
            const totalMovies = data?.results.length - 1; // 배너에 사용한 영화 하나 제외
            const maxIndex = totalMovies % offset === 0 // 총 영화 개수와 보여줄 값이 딱 떨어진다면
                ? Math.floor(totalMovies / offset) - 1
                    : Math.floor(totalMovies / offset);
            right === 1 // 오른쪽 버튼: 마지막 페이지에 도달하면 되돌린다. 왼쪽 버튼: 첫번째 페이지에서 뒤로 넘어갈 경우 마지막 영화를 보여준다.
                ? setIndex((prev) => prev === maxIndex ? 0 : prev + 1)
                    : setIndex((prev) => prev === 0 ? maxIndex : prev - 1)
        }
    }
    const toggleLeaving = () => setLeaving((prev) => !prev); // 항상 true인 leaving 상태를 반전
    const onClickSliderBtn = (right: number) => {
        if(!leaving) {
            changeIndex(right);
        }
    }
    const onBoxClicked = (movieId: number) => {
        history.push(`/movies/${movieId}`);
    };
    const onOverlayClicked = () => history.push("/");
    const { scrollX, scrollY } = useViewportScroll();
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getNowPlaying);
    const clickedMovie = // bigMovieMatch가 존재한다면 같은 movie id를 반환 (number로 형 변환)
        bigMovieMatch?.params.movieId &&
        data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
    const { data: movieDetailsData, isLoading: isMovieDetailsLoading } = useQuery<IGetMoviesResult>("movieDetails", () => getMovieDetails(bigMovieMatch?.params.movieId || "")); // useQuery hook을 2개 이상 사용할 경우 data와 isLoading에 이름을 설정한다. (중복 문제)
    console.log(movieDetailsData);
    return (
        <Wrapper>
            {isLoading ? <Loader>Loading...</Loader> : (
                // 배너에는 첫번쨰 항목 보여주기
                <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}> {/* 만약 data가 없을 경우 빈 문자열로 */}
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
            )}
            <SliderBtnLeft onClick={() => onClickSliderBtn(-1)} whileHover={{ scale: 1.4 }}>
                <FaChevronLeft/>
            </SliderBtnLeft>
            <SliderBtnRight onClick={() => onClickSliderBtn(1)} whileHover={{ scale: 1.4 }}>
                <FaChevronRight/>
            </SliderBtnRight>
            <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}> {/* 새로고침시 제자리에서 시작, leaving이 항상 true인 문제 해결하기 */}
                    <RowTitle> 새로 올라온 영화 </RowTitle>
                    <Row
                        key={index}
                        variants={rowVariants}
                        custom={isRight}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{type: "tween", duration: 0.7}} // spring(기본)이 아닌 linear 애니메이션으로 설정하기
                    >
                        {data?.results
                            .slice(1)
                            .slice(offset*index, offset*index+offset)
                            .map((movie) => (
                                <>
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
                                        <div>{movie.title}</div>
                                    </Info>
                                </Box>
                                </>
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
                        >
                            {clickedMovie &&
                                <>
                                    <BigCover
                                        style={{
                                            backgroundImage:
                                                `linear-gradient(to top, #141414, transparent),
                                                url(${makeImagePath(clickedMovie.backdrop_path)})`,
                                        }}
                                    />
                                    <BigTitle>{clickedMovie.title}</BigTitle>
                                    <BigOverview>{clickedMovie.overview}</BigOverview>
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