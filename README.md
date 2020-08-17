# Nodejs-Starter
Node.js 시작을 위한 정리

## 설치
* macOS: `brew install nodejs`
* Windows: `scoop install nodejs`
* Ubuntu: `apt-get install -y nodejs`

## 실행
main.js
``` javascript
console.log('Hello Node!');
```

실행: `node main.js`

## npm
### npm이란?
Node.js 패키지(모듈) 관리자

### 설치
보통 nodejs를 설치하면 npm이 깔려있지만 터미널에서 `npm -v` 했을 때 에러가 나온다면 설치 필요.
* macOS: `brew install npm`
* Windows: `scoop install npm`
* Ubuntu: `apt-get install -y npm`

### 기본 명령어 Set
* 모듈 설치: `npm install 모듈명`
* 모듈 제거: `npm uninstall 모듈명`
* 모듈 검색: `npm search 모듈명`

### package.json
Java Web 프레임워크인 Spring과 비교하면 pom.xml 로 생각하면 편함.   
`npm install` 명령을 통해서 해당 파일에 정의된 dependency 들을 모두 설치할 수 있다.

## 모듈
### express


### body-parser


### Serverless
AWS Lambda 배포/관리 프레임워크   
* 설치: `npm install -g serverless`
