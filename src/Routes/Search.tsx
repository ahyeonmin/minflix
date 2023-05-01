import { useLocation } from "react-router-dom";
import styled from 'styled-components';

const Wrapper = styled.div`
    height: 200vh;
    background-color: ${(props) => props.theme.black.veryDark};
    color: white;
`;

function Search() {
    const location = useLocation(); // 현재 url에 관한 정보를 가져옴 (search 가져오기)
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log(keyword);
    return (
        <Wrapper>
            '{keyword}'로 검색한 결과입니다.
        </Wrapper>
    );
}

export default Search;