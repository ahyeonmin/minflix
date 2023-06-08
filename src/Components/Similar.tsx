import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { movieDetailState } from "../Routes/atoms";
import { motion } from "framer-motion";
import { IGetMoviesResult, getSimilar } from "../Routes/api";
import { makeImagePath } from '../utils';

const SimilarBox = styled(motion.div)`
    width: 230px;
    height: 170px;
    display: flex;
    flex-direction: column;
    margin-bottom: 26px;
    background-color: ${(props) => props.theme.black.lighter};
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        div {
            color: #666666;
        }
    }
`;
const SimilarImg = styled.div<{bgPhoto: string}>`
    width: 100%;
    height: 130px;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
`;
const SimilarNoImg = styled.div`
    background-color: #0e0e0e;
    height: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    font-size: 12px;
`;
const SimilarTitle = styled.div`
    padding: 15px 0;
    text-align: center;
    font-size: 14px;
    transition: 0.3s;
`;
function Similar() {
    const history = useHistory();
    const [ movieDetail ] = useRecoilState(movieDetailState);
    var detailsId = parseInt(movieDetail && movieDetail.id);
    const { data: similarData } = useQuery<IGetMoviesResult>(["similar", detailsId], () => getSimilar(detailsId));
    return (
        <>
        </>
    )
}

export default Similar;