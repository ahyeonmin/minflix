import styled from 'styled-components';
import { useLocation } from "react-router-dom";
import { IGetMoviesResult, getSearch } from "./api";
import { useQuery } from 'react-query';
import { makeImagePath } from '../utils';
import { motion } from "framer-motion";

const Wrapper = styled.div`
    height: 200vh;
    background-color: ${(props) => props.theme.black.veryDark};
    color: white;
    padding-top: 70px;
`;
const Loader = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const ResultsTitle = styled.h3`
    padding: 60px;
    font-size: 16px;
    span:first-child {
        color: gray;
    }
`;
const Row = styled(motion.div)`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    padding: 25px 60px;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
    height: 150px;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    border-radius: 3px;
    cursor: pointer;
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

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -50,
        zIndex: 99,
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

function Search() {
    const location = useLocation(); // 현재 url에 관한 정보를 가져옴 (search 가져오기)
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log(keyword);
    const { data, isLoading } = useQuery<IGetMoviesResult>("search", () => getSearch(keyword || ""))
    return (
        <Wrapper>
            {isLoading ? <Loader>Loading...</Loader> : (
                <>
                    <ResultsTitle>
                        <span>{keyword}</span>
                        <span>에 대한 검색 결과입니다.</span>
                    </ResultsTitle>
                    <Row
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{type: "tween", duration: 0.7}} // spring(기본)이 아닌 linear 애니메이션으로 설정하기
                    >
                        {data?.results.map((movie) => (
                            <Box
                                key={movie.id}
                                variants={boxVariants}
                                initial="normal"
                                whileHover="hover"
                                transition={{ type: "tween" }}
                                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                            >
                                <Info variants={InfoVariants}>
                                    <h4>{movie.title}</h4>
                                </Info>
                            </Box>
                        ))}
                    </Row>
                </>
            )}
        </Wrapper>
    );
}

export default Search;