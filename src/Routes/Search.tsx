import styled from 'styled-components';
import { useHistory, useLocation } from "react-router-dom";
import { IGetMoviesResult, IMovie, ITv, getSearch, isMovie } from "./api";
import { useQuery } from 'react-query';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useRecoilState } from 'recoil';
import { movieDetailState, tvDetailState } from './atoms';
import TvDetails from '../Components/TvDetails';
import MovieDetails from '../Components/MovieDetails';

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
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    padding: 25px 60px;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 130px;
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
const Overlay = styled(motion.div)`
    position: absolute;
    top: 0;
    width: 100vw;
    height: 250vh;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;
const BigContent = styled(motion.div)`
    z-index: 99;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 40vw;
    height: 85vh;
    border-radius: 7px;
    background-color: ${(props) => props.theme.black.darker};
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
    const { scrollY } = useScroll();
    const history = useHistory();
    const location = useLocation(); // 현재 url에 관한 정보를 가져옴 (search 가져오기)
    const keyword = new URLSearchParams(location.search).get("keyword");
    const type = new URLSearchParams(location.search).get("type");
    const id = new URLSearchParams(location.search).get("id");
    const [ movieDetail, setMovieDetail ] = useRecoilState(movieDetailState);
    const [ tvDetail, setTvDetail ] = useRecoilState(tvDetailState);
    const { data, isLoading } = useQuery<IGetMoviesResult>("search", () => getSearch(keyword || ""));
    const onOverlayClicked = () => history.push(`/search?keyword=${keyword}`);
    const onBoxClicked = (contentData: IMovie | ITv, contentId: any) => {
        if (isMovie(contentData)) {
			setMovieDetail(contentData);
			history.push(`/search?keyword=${keyword}&type=movie&id=${contentId}`);
		} else {
			setTvDetail(contentData);
			history.push(`/search?keyword=${keyword}&type=tv&id=${contentId}`);
		}
    };
    return (
        <Wrapper>
            {isLoading ? <Loader> 로딩 중... </Loader> : (
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
                            {data?.results.map((content) => (
                                <Box
                                    onClick={() => onBoxClicked(content, content.id)}
                                    layoutId={content.id + ""}
                                    key={content.id}
                                    variants={boxVariants}
                                    initial="normal"
                                    whileHover="hover"
                                    transition={{ type: "tween" }}
                                    bgPhoto={makeImagePath(content.backdrop_path || content.poster_path, "w500")}
                                >
                                    <Info variants={InfoVariants}>
                                        <h4>{content.title ? content.title : content.name || content.original_title || content.original_name}</h4>
                                    </Info>
                                </Box>
                            ))}
                        </Row>) : (
                            <NoSearchData> '{keyword}'에 대한 검색 결과가 없습니다. </NoSearchData>
                    )}
                </>
            )}
            <AnimatePresence>
                {type === "movie" && id && (
                    <>
                        <Overlay
                            onClick={onOverlayClicked}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <BigContent
                            layoutId={id}
                            style={{ top: scrollY.get() + 50 }} // 스크롤을 해도 따라오도록 하기 (값을 넣으면 위치가 고정됨), get()으로 실제값을 받아옴
                        >
                           <MovieDetails from={`search?keyword=${keyword}`} />
                        </BigContent>
                    </>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {type === "tv" && id && (
                        <>
                            <Overlay
                                onClick={onOverlayClicked}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                            <BigContent
                                layoutId={id}
                                style={{ top: scrollY.get() + 50 }} // 스크롤을 해도 따라오도록 하기 (값을 넣으면 위치가 고정됨), get()으로 실제값을 받아옴
                            >
                                <TvDetails from={`search?keyword=${keyword}`} />
                            </BigContent>
                        </>
                )}
            </AnimatePresence>
        </Wrapper>
    );
}

export default Search;