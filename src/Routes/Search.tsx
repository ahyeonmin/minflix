import { useLocation } from "react-router-dom";
import styled from 'styled-components';

const Wrapper = styled.div`
    height: 200vh;
    background-color: ${(props) => props.theme.black.veryDark};
    color: white;
    padding-top: 70px;
`;
const ResultsTitle = styled.h3`
    padding: 60px;
    font-size: 16px;
    span:first-child {
        color: gray;
    }
`;

function Search() {
    const location = useLocation(); // 현재 url에 관한 정보를 가져옴 (search 가져오기)
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log(keyword);
    return (
        <Wrapper>
            <ResultsTitle>
                <span>{keyword}</span>
                <span>에 대한 검색 결과입니다.</span>
            </ResultsTitle>
        </Wrapper>
    );
}

export default Search;