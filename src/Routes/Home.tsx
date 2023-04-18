import styled from 'styled-components';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { IGetMoviesResult, getMovies } from './api';
import { makeImagePath } from '../utils';

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
    gap: 10px;
    width: 100%;
`;
const Box = styled(motion.div)`
    background-color: white;
    height: 200px;
    color: red;
    font-size: 30px;
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

function Home() {
    const [ index, setIndex ] = useState(0);
    const increaseIndex = () => setIndex((prev) => prev + 1);
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    console.log(data, isLoading);
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
                <AnimatePresence>
                    <Row
                        key={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{type: "tween", duration: 0.7}} // spring(기본)이 아닌 linear 애니메이션으로 설정하기
                    >
                        {[1, 2, 3, 4, 5, 6].map((i) => <Box key={i}>{i}</Box>)}
                    </Row>
                </AnimatePresence>
            </Slider>
        </Wrapper>
    );
}

export default Home;