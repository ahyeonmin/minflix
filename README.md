# 넷플릭스 클론
<br/>

<p align="center"><img src="https://user-images.githubusercontent.com/83111413/246801822-5709f51b-2dfc-4eaa-bf77-0cdd1e0d79af.png"></p>
<p align="center"><a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fahyeonmin%2Freact-netflix&count_bg=%23e5e5e5&title_bg=%232F2F2F&title=hits&edge_flat=false"/></a></p>

## 💁🏻&nbsp; 프로젝트 소개
> 리액트와 타입스크립트를 공부하면서 넷플릭스 사이트의 간단한 기능을 구현해 보았습니다.

<br/>

## 🖥️&nbsp; 데모
> GitHub Pages : <https://ahyeonmin.github.io/react-netflix/#/>

<br/>

## 🛠️&nbsp; 기술 스택
`Typescript`
`React Router`
`React Query`
`React Hook Form`
`Recoil`
`Styled Components`
`Framer Motion`

<br/>

## ⚙️&nbsp; 구성 및 기능
> 모든 콘텐츠 정보는 React Query를 이용하여 [The Movie Database](https://developer.themoviedb.org/reference/intro/getting-started)의 API 데이터를 가져와서 사용했습니다.
<br/>

### Home
<img width="1440" alt="netflix_home" src="https://github.com/ahyeonmin/react-netflix/assets/83111413/1d16452a-084c-4922-a3be-0d0b4cc87317">

- 메인 페이지로 인기 있는, 평가가 좋은, 새로 올라온, 다양한 장르의 영화를 슬라이드로 확인할 수 있습니다.
- 슬라이드 박스에 마우스를 올리면 해당 영화의 제목이 뜹니다.
- 슬라이드 박스를 클릭하면 해당 영화의 상세 정보 페이지로 넘어갑니다. 배너의 상세 정보 버튼 클릭 시에도 동일합니다.
<br/>

### Tv
<img width="1440" alt="netflix_series" src="https://github.com/ahyeonmin/react-netflix/assets/83111413/bba02d55-8e49-4475-be13-70ae306eb483">

- 메인 페이지와 기능은 같습니다.
<br/>

### Search
<img width="1440" alt="netflix_search" src="https://github.com/ahyeonmin/react-netflix/assets/83111413/4ac54e74-651d-444c-9649-b18d27b1fa39">

- 검색창에 값을 입력하고 엔터를 치면, 입력한 값과 함께 검색 페이지로 넘어갑니다.
  - `useLocation`을 사용해서 현재 페이지의 정보를 가져온 후, `URLSearchParams`로 url의 query에 들어간 값을 가져옵니다. 가져온 query 값으로 검색 결과를 띄웁니다.
- 데이터에 type을 지정해 영화와 시리즈를 구분했습니다.
<br/>

### Details
<img width="1440" alt="netflix_home_details" src="https://github.com/ahyeonmin/react-netflix/assets/83111413/0f9b1499-7cb6-467a-bd51-7cc8fd7618f7">

- 해당 콘텐츠에 대한 
- 오버레이 클릭 시에도 모달창을 닫을 수 있습니다.
- 시리즈 모달창엔 에피소드 개수도 추가했습니다.
