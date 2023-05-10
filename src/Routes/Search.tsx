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
    padding-bottom: 20px;
    font-size: 16px;
    span:first-child {
        color: gray;
    }
`;
const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
    padding: 25px 60px;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;
    margin-bottom: 55px;
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
    h4 {
        color: ${(props) => props.theme.white.lighter};
        text-align: center;
        font-size: 13px;
        font-weight: 500;
    }
    opacity: 0;
`;
const NoSearchData = styled.div`
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
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
    const { data, isLoading } = useQuery<IGetMoviesResult>("search", () => getSearch(keyword || ""));
    return (
        <Wrapper>
            {isLoading ? <Loader>Loading...</Loader> : (
                <>
                    <ResultsTitle>
                        <span>{keyword}</span>
                        <span>에 대한 검색 결과입니다.</span>
                    </ResultsTitle>
                    {data && data.results.length > 0 ? (
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
                                    bgPhoto={makeImagePath(movie.backdrop_path || movie.poster_path, "w500")}
                                >
                                    <Info variants={InfoVariants}>
                                        <h4>{movie.title ? movie.title : movie.original_title || movie.original_name}</h4>
                                    </Info>
                                </Box>
                            ))}
                        </Row>) : (
                            <NoSearchData> '{keyword}'에 대한 검색 결과가 없습니다. </NoSearchData>
                    )}
                </>
            )}
        </Wrapper>
    );
}

export default Search;