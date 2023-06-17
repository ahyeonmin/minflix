import  styled from 'styled-components';
import { useEffect, useState } from 'react';
import { motion, spring, useAnimation, useViewportScroll } from 'framer-motion';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AiFillCaretDown } from 'react-icons/ai'

interface IForm {
    keyword: string;
}

const Nav = styled(motion.nav)`
    z-index: 98;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    height: 70px;
    font-size: 14px;
    color: white;
`;
const Col = styled.div`
    display: flex;
    align-items: center;
`;
const Logo = styled(motion.svg)`
    width: 95px;
    height: 25px;
    padding-left: 60px;
    margin-right: 40px;
    fill: ${(prop) => prop.theme.red};
    cursor: pointer;
`;
const Items = styled.ul`
    display: flex;
    align-items: center;
`;
const Item = styled.li`
    position: relative;
    margin-right: 22px;
    color: ${(prop) => prop.theme.white.lighter};
    font-weight: 200;
    :hover {
        color: ${(prop) => prop.theme.white.darker};
        transition: ease-in-out 0.2s;
    }
`;
const Circle = styled(motion.span)`
    position: absolute;
    bottom: 13px;
    right: -8px;
    background-color: ${(prop) => prop.theme.red};
    width: 5px;
    height: 5px;
    border-radius: 2.5px;
`;
const Search = styled.form `
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 5px;
    color: ${(props) => props.theme.white.lighter};
    svg { height: 25px; };
    cursor: pointer;
`;
const Input = styled(motion.input)`
    width: 160px;
    transform-origin: right; // 변화가 시작하는 위치
    position: absolute;
    left: -150px;
    background: ${(props) => props.theme.black.darker};
    border: ${(props) => props.theme.white.lighter} 1px solid;
    padding: 8px;
    padding-right: 10px;
    color: ${(props) => props.theme.white.lighter};
    font-size: 13px;
    outline: none;
`;
const Profile = styled.div`
    display: flex;
    align-items: center;
    padding-right: 60px;
    cursor: pointer;
`;
const ProfileImg = styled.div`
    width: 30px;
    height: 30px;
    margin-left: 15px;
    margin-right: 10px;
    background-image: url('http://occ-0-1361-988.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABQ1Xu1M5W1QlQ3G13lGsLHck5DEEF4dpLIaSeSGc2SSEIkGU52ElM0dajnWD-5Uvu4V4HckTGUVH1hRzlIWZshU1ph6wnQJAFnWH.png?r=ec1');
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
`;
const ProfileCaret = styled(motion.div)`
    font-size: 12px;
`;

const logoVariants = {
    normal: {
        fillOpacity: 1,
    },
    active: { // 깜빡이는 애니메이션
        fillOpacity: [ 0, 1, 0 ],
        transition: {
            repeat: Infinity,
        },
    },
};
const navVariants = {
    top: {
        backgroundColor: "rgba(0, 0, 0, 0)",
    },
    scroll: {
        backgroundColor: "rgba(20, 20, 20, 1)",
    },
}

function Header() {
    const [searchOpen, setSearchOpen] = useState(false);
    const toggleSearh = () => {setSearchOpen((prev) => !prev)};
    const homeMatch = useRouteMatch("/"); {/* 페이지 이동 표시 */}
    const tvMatch = useRouteMatch("/tv"); {/* 페이지 이동 표시 */}
    const navAnimation = useAnimation();  {/* 특정 코드로 애니메이션 실행 */}
    const { scrollY } = useViewportScroll(); {/* 스크롤 모션 값 */}
    useEffect(() => {
        scrollY.onChange(() => {
            if (scrollY.get() > 80) {
                navAnimation.start("scroll");
            } else {
                navAnimation.start("top");
            }
        });
    }, [scrollY, navAnimation]);
    const history = useHistory();
    const { register, handleSubmit } = useForm<IForm>({
        defaultValues: {
            keyword: "",
        },
    });
    const onLogoClicked = () => {
        history.push(`/`);
    };
    const onValid = (data: IForm) => { // data를 인자로 받아온다
        history.push(`/search?keyword=${data.keyword}`); // 검색 버튼 클릭시 search 페이지로 이동
        window.location.reload(); // 새로고침을 해야만 reload 되는 문제를 해결. 그러나 깜빡임 문제가 있음. 이 문제는 react-router-dom V6 업그레이드 후 navigate로 다시 시도해봐야겠다.
    };
    return (
        <Nav variants={navVariants} initial="top" animate={navAnimation} transition={{type: "spring"}}>
            <Col>
                <Logo
                    onClick={onLogoClicked}
                    variants={logoVariants}
                    initial="normal"
                    whileHover="active"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1024"
                    height="276.742"
                    viewBox="0 0 1024 276.742"
                >
                    <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
                </Logo>
                <Items>
                    <Item>
                        <Link to="/">
                            홈 { homeMatch?.isExact && <Circle layoutId='circle' /> } {/* 동그라미 이동 애니메이션 */}
                        </Link>
                    </Item>
                    <Item>
                        <Link to="/tv">
                            시리즈 { tvMatch && <Circle layoutId='circle' /> } {/* 동그라미 이동 애니메이션 */}
                        </Link>
                    </Item>
                </Items>
            </Col>
            <Col>
                <Search onSubmit={handleSubmit(onValid)}>
                    <motion.svg
                        onClick={toggleSearh}
                        animate={{ x: searchOpen ? -180 : 0 }} // 클릭: x축 방향으로 이동/원위치
                        transition={{ type: "linear" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/motion.svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        ></path>
                    </motion.svg>
                    <Input
                        {...register("keyword", { required: "true", minLength: 1 })}
                        initial={false} // 새로고침시 제자리에서 시작
                        animate={{ scaleX: searchOpen ? 1 : 0 }} // 클릭: 검색입력창 보여주기/닫기
                        transition={{ type: "linear" }}
                        placeholder='영화/시리즈를 검색해보세요.'
                    />
                </Search>
                <Profile>
                    <ProfileImg />
                    <ProfileCaret whileHover={{ rotateZ: 180 }} transition={{ type: "linear" }}>
                        <AiFillCaretDown/>
                    </ProfileCaret>
                </Profile>
            </Col>
        </Nav>
    );
}

export default Header;