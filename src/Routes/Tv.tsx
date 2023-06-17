import styled from 'styled-components';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { IGetTvResult, getGenreTv, getOnTheAir, getTvPopular, getTvTopRated } from './api';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { tvDetailState } from '../Routes/atoms';
import Slider from '../Components/Slider';
import TvDetails from '../Components/TvDetails';
import { BiInfoCircle } from "react-icons/bi"
import { makeImagePath } from '../utils';
import { clickedSliderState } from '../Routes/atoms';

const Wrapper = styled.div`
    background-color: ${(props) => props.theme.black.veryDark};
    height: 250vh;
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
    height: 95vh;
    background-image:
        linear-gradient(rgba(0, 0, 0, 0.7), rgba(20, 20, 20, 0), rgba(0, 0, 0, 0), rgba(20, 20, 20, 1)),
        url(${(props) => props.bgPhoto});
    background-size: cover;
    color: ${(prop) => prop.theme.white.lighter};
`;
const Title = styled.h2`
    margin-bottom: 20px;
    font-weight: 700;
    font-size: 50px;
    text-shadow: 1px 1px 1px #2F2F2F;
`;
const Overview = styled.p`
    width: 40%;
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: lighter;
    line-height: 22px;
    text-shadow: 1px 1px 1px #2F2F2F;
`;
const BannerInfo = styled(motion.div)`
    display: flex;
    align-items: center;
    width: 100px;
    background-color: #666666be;
    font-size: 16px;
    text-align: center;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #6666666d;
        transition: 0.1s;
    }
`;
const Sliders = styled.div``;
const Overlay = styled(motion.div)`
    position: absolute;
    top: 0;
    width: 100vw;
    height: 250vh;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;
const BigMovie = styled(motion.div)`
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

function Tv() {
    const [ clickedSlider, setClickedSlider ] = useRecoilState(clickedSliderState);
    const bigMovieMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
    const { scrollY } = useScroll();
    const history = useHistory();
    const { data: tvAnimeData, isLoading: isTvAnimeLoading } = useQuery<IGetTvResult>(["tv", "tvAnime"], () => getGenreTv(16));
    const { data: tvPopularData, isLoading: isTvPopularLoading } = useQuery<IGetTvResult>(["tv", "tvPopular"], getTvPopular);
    const { data: tvTopRatedData, isLoading: isTvTopRatedLoading } = useQuery<IGetTvResult>(["tv", "tvTopRated"], getTvTopRated);
    const { data: onTheAirData, isLoading: isOnTheAirLoading } = useQuery<IGetTvResult>(["tv", "onTheAir"], getOnTheAir);
    const { data: tvActionData, isLoading: isTvActionLoading } = useQuery<IGetTvResult>(["tv", "tvAction"], () => getGenreTv(10759));
    const { data: tvSfFantasyData, isLoading: isTvSfFantasyLoading } = useQuery<IGetTvResult>(["tv", "tvSfFantasy"], () => getGenreTv(10765));
    const [ tvDetail, setTvDetail ] = useRecoilState(tvDetailState);
    const clickedBox = // bigMovieMatch가 존재한다면 같은 movie id를 반환 (number로 형 변환) 박스를 클릭했을 때 tvId 반환
        bigMovieMatch?.params.tvId && (
            tvAnimeData?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId) ||
                tvPopularData?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId) ||
                    tvTopRatedData?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId) ||
                            onTheAirData?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId) ||
                                tvActionData?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId) ||
                                    tvSfFantasyData?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId)
    );
    setTvDetail(clickedBox);
    useEffect(() => { // 슬라이드 박스 클릭시 스크롤을 막고 고정시킨다!
        bigMovieMatch
            ? (document.body.style.overflowY = "hidden")
            : (document.body.style.overflowY = "auto");
    }, [bigMovieMatch]);
    const onOverlayClicked = () => history.push("/tv");
    const onBannerInfoClicked = (bannerId: any) => {
        setClickedSlider("banner");
        history.push(`/tv/${bannerId}`);
    }
    return (
        <Wrapper>
            {isTvAnimeLoading || isTvPopularLoading || isTvTopRatedLoading || isOnTheAirLoading || isTvActionLoading || isTvSfFantasyLoading
                ? <Loader> 로딩 중... </Loader> : (
                    // 배너에는 첫번쨰 항목 보여주기
                    <Banner bgPhoto={makeImagePath(onTheAirData?.results[12].backdrop_path || "")}> {/* 만약 data가 없을 경우 빈 문자열로 */}
                        <Title>{onTheAirData?.results[12].name}</Title>
                        <Overview>{onTheAirData?.results[12].overview}</Overview>
                        <BannerInfo
                            onClick={() => onBannerInfoClicked(onTheAirData?.results[12].id)}
                        >
                            <BiInfoCircle style={{ fontSize: "23px", paddingRight: "8px" }}/> 상세 정보
                        </BannerInfo>
                    </Banner>
            )}
            <Sliders>
                <Slider
                    title="아니메 시리즈"
                    data={tvAnimeData?.results}
                    sliderId="tvAime"
                />
                <Slider
                    title="지금 뜨는 콘텐츠"
                    data={tvPopularData?.results}
                    sliderId="tvPopular"
                />
                <Slider
                    title="어워드 수상 시리즈"
                    data={tvTopRatedData?.results}
                    sliderId="tvTopRated"
                />
                <Slider
                    title="새로 올라온 콘텐츠"
                    data={onTheAirData?.results}
                    sliderId="onTheAir"
                />
                <Slider
                    title="액션 & 어드벤처 시리즈"
                    data={tvActionData?.results}
                    sliderId="tvAction"
                />
                <Slider
                    title="상상력 넘치는 SF & 판타지 시리즈"
                    data={tvSfFantasyData?.results}
                    sliderId="tvFantasy"
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
                            style={{ top: scrollY.get() + 50 }} // 스크롤을 해도 따라오도록 하기 (값을 넣으면 위치가 고정됨), get()으로 실제값을 받아옴
                            layoutId={clickedSlider + "_" + bigMovieMatch.params.tvId} // Slider와 layoutId 연결
                        >
                            <TvDetails />
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
        </Wrapper>
    );
}

export default Tv;