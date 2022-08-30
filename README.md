# 토큰 ICO
> 토큰 판매를 위한 ICO 스마트컨트랙트와 프론트엔드 기능 구현

<img src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat&logo=Javascript&logoColor=white"/></a>
<img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=Vite&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Solidity-363636?style=flat&logo=Solidity&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Web3.js-F16822?style=flat&logo=Web3.js&logoColor=white"/></a>

## 설치 방법
### 클라이언트 실행
```
cd client
npm install
npm run dev
```

## 구현한 기능
- ERC20 토큰 스마트 컨트랙트
- 정해진 시간 내에서만 토큰을 구매
- 한 사람이 구매할 수 있는 총 토큰량 제한
- 목표 모금액 미달성 시 환불
- ICO가 진행 중일 때는 구매한 토큰을 사용하지 못하게 Token Lock 구현
