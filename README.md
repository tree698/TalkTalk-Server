<div align = center>
<img width="380" alt="heading2" src="https://user-images.githubusercontent.com/53497516/219250095-efea0217-bc8a-4062-8ffc-f3b6956388dd.png">
</div>


## :bulb:&nbsp;&nbsp;소개
- [프로크리에이트](https://apps.apple.com/kr/app/procreate/id425073498) 등을 활용하여 예술/창작 활동을 하는 분들을 위한 <strong>온라인 커뮤니케이션 플랫폼</strong>
- TalkTalk에 회원 가입 후, 자신의 창작물을 업로드한 뒤 다른 회원과 실시간 채팅으로 피드백 등을 받아,
- 자신의 창작 능력 향상과 다른 회원의 작품을 감상하는 기회 제공

</br></br>

## :computer:&nbsp;&nbsp;기술 스택
- 프론트엔드 </br>
![React](https://img.shields.io/badge/-React-007ACC?style=flat&logo=React)
![ReactRouter](https://img.shields.io/badge/-ReactRouter-yellowgreen?style=flat&logo=ReactRouter) 
![PostCSS](https://img.shields.io/badge/-PostCSS-green?style=flat&logo=PostCss) 
![JavaScript](https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=flate&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23F7DF1C) 
![HTML](https://img.shields.io/badge/-HTML5-F05032?style=flate&logo=html5&logoColor=ffffff) 
![socketIO](https://img.shields.io/badge/-socketIO-blueviolet?style=flat&logo=socketIO) 
![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS-lightgrey?style=flat&logo=TailwindCSS) 
![TanStack_Query](https://img.shields.io/badge/-TanStack_Query-orange?style=flat&logo=TanStack_Query) </br>
![uuid](https://img.shields.io/badge/-uuid-blueviolet?style=flat&logo=uuid) 
![axios](https://img.shields.io/badge/-axios-lightgrey?style=flat&logo=axios) 
![react_dropzone](https://img.shields.io/badge/-react_dropzone-blue?style=flat&logo=react_dropzone) 
![react_hot_toast](https://img.shields.io/badge/-react_hot_toast-green?style=flat&logo=react_hot_toast) 
![react_icons](https://img.shields.io/badge/-react_icons-orange?style=flat&logo=react_icons) 
![react_material_ui_carousel](https://img.shields.io/badge/-react_material_ui_carousel-9cf?style=flat&logo=react_material_ui_carousel) 
![timeago](https://img.shields.io/badge/-timeago-yellowgreen?style=flat&logo=timeago)

- 백엔드 </br>
![Node.js](https://img.shields.io/badge/-Node.js-grey?style=flat&logo=Node.js) 
![MySQL](https://img.shields.io/badge/-MySQL-lightgrey?style=flat&logo=MySQL) 
![Sequelize](https://img.shields.io/badge/-Sequelize-green?style=flat&logo=Sequelize) 
![Express](https://img.shields.io/badge/-Express-yellow?style=flat&logo=Express) 
![Postman](https://img.shields.io/badge/-Postman-grey?style=flat&logo=Postman) 
![socketIO](https://img.shields.io/badge/-socketIO-blueviolet?style=flat&logo=socketIO) 
![JavaScript](https://img.shields.io/badge/-JavaScript-%23F7DF1Cstyle=flate&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23F7DF1C) 
![cors](https://img.shields.io/badge/-cors-orange?style=flat&logo=cors) 
![helmet](https://img.shields.io/badge/-helmet-brightgreen?style=flat&logo=helmet) </br>
![bcrypt](https://img.shields.io/badge/-bcrypt-lightgrey?style=flat&logo=bcrypt) 
![jsonwebtoken](https://img.shields.io/badge/-jsonwebtoken-blue?style=flat&logo=jsonwebtoken) 
![morgan](https://img.shields.io/badge/-morgan-green?style=flat&logo=morgan) 
![cookie_parser](https://img.shields.io/badge/-cookie_parser-lightgrey?style=flat&logo=cookie_parser) 
![dotenv](https://img.shields.io/badge/-dotenv-orange?style=flat&logo=dotenv) 
![multer](https://img.shields.io/badge/-multer-green?style=flat&logo=multer)

- 테스트 </br>
![Jest](https://img.shields.io/badge/-Jest-007ACC?style=flate&logo=Jest)
![React_Testing_Library](https://img.shields.io/badge/-React_Testing_Library-brightgreen?style=flate&logo=React_Testing_Library)
![axios](https://img.shields.io/badge/-axios-lightgrey?style=flat&logo=axios) 
![cypress](https://img.shields.io/badge/-cypress-blue?style=flate&logo=cypress)
![node_mock_http](https://img.shields.io/badge/-node_mock_http-orange?style=flate&logo=node_mock_http)
![faker](https://img.shields.io/badge/-faker-red?style=flate&logo=faker)

</br></br>

## :sparkles:&nbsp;&nbsp;주요 기능
- 회원 가입, 로그인 및 로그아웃 기능
- 이미지 업로드 및 삭제 기능
- 업로드된 창작물의 검색 기능
- 각 창작물에 대한 실시간 채팅 기능
- 채팅 참여자별 채팅 내용 분류 기능
- 자신의 채팅 내용 삭제 기능

</br></br>

## :raised_hands:&nbsp;&nbsp;주요 특징
|**순번**|**프론트엔드**|**백엔드**|
|:--:|:--|:--|
|1|리액트 라우터 활용|MVC 패턴 구현|
|2|리액트 쿼리 활용|Restful APIs 디자인|
|3|클린 코드를 위한 리팩토링|유효성 검사 구현|
|4|반응형 웹 구현|API rate limiting 구현|
|5|XSS, CSRF 공격 대비|XSS, CSRF 공격 대비|
|6|테스트 코드 작성|테스트 코드 작성|

</br></br>

## :key:&nbsp;&nbsp; APIs
### 1) Auth
|**HTTP 요청 메서드**|**URL**|**설명**|
|:--:|:--|:--|
|POST|/auth/signup|회원 가입|
|POST|/auth/login|로그인|
|POST|/auth/logout|로그아웃|
|GET|/auth/me|로그인 상태 확인|
|GET|/auth/csrf-token|csrf 토큰 제공|

### 2) Tweet
|**HTTP 요청 메서드**|**URL**|**설명**|
|:--:|:--|:--|
|GET|/tweets|모든 트윗(채팅) 가져오기|
|GET|/tweets?username=:username| 특정 유저에 대한 트윗 가져오기|
|POST|/tweets|트윗 생성|
|DELETE|/tweets/:id|특정 id의 트윗 삭제|

### 3) Work
|**HTTP 요청 메서드**|**URL**|**설명**|
|:--:|:--|:--|
|GET|/work|회원의 작품(이미지 파일)과 설명 등을 가져오기|
|GET|/work/search|검색 결과 가져오기|
|POST|/work|회원의 작품과 설명 등을 서버에 업로드|
|POST|/work/image|회원의 작품 업로드 </br> * Heroku에서는 파일 시스템이 제공되지 않아 배포시에는 Cloudinary를 사용하여 업로드 </br>* 기존에는 multer를 사용|
|DELETE|/work/:id|특정 id의 작품과 설명 등 삭제|

</br></br>

## :test_tube:&nbsp;&nbsp;테스트 코드
|**백엔드 - 유닛 테스트, 통합 테스트 커버리지**|
|:--:|
|<img width="600" alt="heading2" src="https://user-images.githubusercontent.com/53497516/226173195-683c159b-8f97-4681-8cd8-5f825575320f.png">|

|**프론트엔드 - 유닛 테스트, 통합 테스트 커버리지**|
|:--:|
|<img width="600" alt="heading2" src="https://user-images.githubusercontent.com/53497516/226173222-4ad6c958-016c-47aa-bf19-fbd226f571b4.png">|

|****|**프론트엔드 - E2E 테스트**|
|:--:|:--:|
|Cypress 폴더|Cypress 실행 예시|
|<img width="200" alt="heading2" src="https://user-images.githubusercontent.com/53497516/226173336-ebc1d1ae-5a37-4124-9d95-93d84109ee74.png">|<img width="700" alt="heading2" src="https://user-images.githubusercontent.com/53497516/226173355-286ecc16-0599-4548-b9a8-4489a6b84c0c.png">|

</br></br>

## :film_projector:&nbsp;&nbsp;데모 영상 및 배포
- 데모 영상: [YouTube](https://www.youtube.com/watch?v=f7ROFzpLYPs)
- 배포(Deploy): 잠시 중단

</br></br>

## :octocat:&nbsp;&nbsp;레포지토리
- 프론트엔드: [TalkTalk-Client](https://github.com/tree698/TalkTalk-Client)
- 백엔드: [TalkTalk-Server](https://github.com/tree698/TalkTalk-Server)

</br></br>

## :desktop_computer:&nbsp;&nbsp;스크린 샷
|**TalkTalk - 온라인 커뮤니케이션 플랫폼**|
|:--:|
|<img width="700" alt="heading2" src="https://user-images.githubusercontent.com/53497516/219944802-ade6cc41-cec5-4cd8-8a8b-39f96a8a46d3.jpg">|

</br></br>

<div align = left>
<img width="40" alt="heading2" src="https://user-images.githubusercontent.com/53497516/219231327-87e54a2e-d00b-48bd-83b2-49ccc5b6ffc4.png"> <span>Thanks~</span>
</div>
