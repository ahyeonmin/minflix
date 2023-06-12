import { useState } from "react";
import { useHistory } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { makeImagePath } from '../utils';
import { FaChevronLeft, FaChevronRight} from "react-icons/fa";
import { useRecoilState } from "recoil";
import { clickedSliderState, movieDetailState } from "../Routes/atoms";
import { IMovie } from "../Routes/api";

interface ISlider {
    title: string;
    data: any;
    sliderId: string;
}

const Wrapper = styled.div`
    position: relative;
    top: -150px;
    margin: 0 60px;
    margin-bottom: 190px;
`;
const Buttons = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;
const Button = styled(motion.button)`
    position: absolute;
    top: 75px;
    z-index: 1;
    background: none;
    color: ${(props) => props.theme.white.darker};
    border: none;
    font-size: 35px;
    cursor: pointer;
    &:nth-child(2) {
        right: 0;
    }
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 130px;
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

const rowVariants = { // 사용자 화면 크기 받아오기 (= window.innerWidth)
    hidden: (custom: boolean) => {
        return {
            x: custom ? -window.window.outerWidth : window.outerWidth,
        };
    },
    visible: {
        x: 0,
    },
    exit: (custom: boolean) => {
        return {
            x: custom ? window.window.outerWidth : -window.outerWidth,
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

function Slider({ title, data, sliderId }: ISlider) {
    const [ clickedSlider, setClickedSlider ] = useRecoilState(clickedSliderState);
    const [ movieDetail, setMovieDetail ] = useRecoilState(movieDetailState);
    const [ goingback, setGoingback ] = useState(false); // 왼쪽 버튼 클릭시, 왼쪽으로 넘어가는 모션
    const [ index, setIndex ] = useState(0);
    const [ leaving, setLeaving ] = useState(false); // 슬라이드 연속 클릭시, 간격 늘어나는 문제 해결하기
    const toggleLeaving = () => setLeaving((prev) => !prev); // 항상 true인 leaving 상태를 반전
    const history = useHistory(); // URL 이동
    const offset = 6; // 슬라이드에 보여주고 싶은 영화 개수
    const increaseIndex = () => { // 오른쪽 버튼!
        if (data) {
            if (leaving) return;
            toggleLeaving(); // Exit이 끝나면 호출되고, leaving을 false로 바꾸기
            setGoingback(false);
            const totalMovies = data?.length - 2; // 배너에 사용한 영화 하나 제외
            const maxIndex = totalMovies % offset === 0 // 총 영화 개수와 보여줄 값이 딱 떨어진다면...
                ? Math.floor(totalMovies / offset) - 1
                    : Math.floor(totalMovies / offset);
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1) // 마지막 페이지에 도달하면 되돌린다.
        }
    }
    const decreaseIndex = () => { // 왼쪽 버튼!
        if (data) {
            if (leaving) return;
            setGoingback(true);
            toggleLeaving(); // Exit이 끝나면 호출되고, leaving을 false로 바꾸기
            const totalMovies = data?.length - 1; // 배너에 사용한 영화 하나 제외
            const maxIndex = totalMovies % offset === 0 // 총 영화 개수와 보여줄 값이 딱 떨어진다면...
                ? Math.floor(totalMovies / offset) - 1
                    : Math.floor(totalMovies / offset);
            setIndex((prev) => prev ===  0 ? maxIndex : prev - 1) // 첫번째 페이지에서 뒤로 넘어갈 경우 마지막 영화를 보여준다.
        }
    }
    const onBoxClicked = (contentData: IMovie, movieId: number) => { // 박스를 클릭할 때 해당 sliderId를 recoil에 담고, bigMovie에 넘긴다. layoutId를 연결하기 위해..
        setClickedSlider(sliderId);
        setMovieDetail(contentData);
        history.push(`/movies/${movieId}`);
    };
    return (
        <Wrapper>
            {data && (
                <>
                <RowTitle> {title} </RowTitle>
                <AnimatePresence // 새로고침시 제자리에서 시작, leaving이 항상 true인 문제 해결하기
                    custom={goingback}
                    initial={false}
                    onExitComplete={toggleLeaving}
                >
                    <Buttons>
                        <Button onClick={decreaseIndex} whileHover={{ scale: 1.4 }}>
                            <FaChevronLeft/>
                        </Button>
                        <Button onClick={increaseIndex} whileHover={{ scale: 1.4 }}>
                            <FaChevronRight/>
                        </Button>
                    </Buttons>
                    <Row
                        key={index}
                        variants={rowVariants}
                        custom={goingback}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{type: "tween", duration: 0.7}} // spring(기본)이 아닌 linear 애니메이션으로 설정하기
                    >
                        {data
                            .slice(1)
                            .slice(offset*index, offset*index+offset)
                            .map((movie: any) => (
                                <Box
                                    key={movie.id}
                                    layoutId={sliderId + "_" + (movie.id + "")} // 다른 데이터와 겹치는 영화를 구분하기 위해 sliderId 추가, id는 문자열로 변환
                                    onClick={() => onBoxClicked(movie, movie.id)}
                                    variants={boxVariants}
                                    initial="normal"
                                    whileHover="hover"
                                    transition={{ type: "tween", duration: 0.3 }}
                                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                >
                                    <Info variants={InfoVariants}> {/* 부모 컴포넌트의 hover를 상속받음 */}
                                        <div>{movie.title}</div>
                                    </Info>
                                </Box>
                        ))}
                    </Row>
                </AnimatePresence>
                </>
            )}  
        </Wrapper>
    );
}

export default Slider;