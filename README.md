# Nodejs-Starter
Node.js 시작을 위한 정리

## 설치
### nodejs 설치
> macOS: `brew install node`  
> Windows: `scoop install nodejs`  
> Ubuntu: `apt-get install -y nodejs`  

### nodejs 실행
> ``` javascript
> /* main.js */
> console.log('Hello Node!');
> ```
> 터미널 실행 명령어: `node main.js`

### npm 설치
> Node.js 패키지(모듈) 관리자  
> 보통 nodejs를 설치하면 npm이 깔려있지만 터미널에서 `npm -v` 했을 때 에러가 나온다면 설치 필요.  
>
> macOS: `brew install npm`  
> Windows: `scoop install npm`  
> Ubuntu: `apt-get install -y npm`  

## npm
### npm 프로젝트 설정
> 프로젝트 초기화 명령어: `npm init`  
> 초기화 명령을 통해서 프로젝트를 생성하면 package.json 파일이 생성된 것을 확인할 수 있다.  
> package.json: Java Web 프레임워크인 Spring과 비교하면 pom.xml 로 생각하면 편함.   
> `npm install` 명령을 통해서 `package.json` 파일에 정의된 dependency 들을 모두 설치할 수 있다.

### 모듈 설치
>모듈 설치: `npm install 모듈명`  
>모듈 제거: `npm uninstall 모듈명`  
>모듈 검색: `npm search 모듈명`  

## 모듈
### express
> nodejs 웹 프레임워크  
> 설치: `npm install express`  

### handlebars
> client(Internet Browser)에 정보를 나타내주기 위한 view template    
> 설치: `npm install express3-handlebars`  
>
> 프로젝트 디렉터리 아래 views 디렉터리 아래 `.handlebars` 확장자 파일 생성.
> `views/layouts` 디렉터리 아래 view 에서 사용하는 공통 레이아웃(ex: 회사 로고 및 메뉴들이 존재하는 최 상단바) 페이지 생성.
>   
> static 파일들 (ex: image, css, js 등) 은 프로젝트 디렉터리 아래 `public` 디렉터리 아래 생성.  

### nodemon
> js 수정시 node 자동 restart  
> 설치: `npm install --save-dev nodemon`

### mocha
> javascript unit test framework  
> 설치: `npm install --save-dev mocha`

### chai
> Test Assertion library  
> 설치: `npm install --save-dev chai`

### zombie
> 브라우저 테스트, 예를 들어 링크 클릭 등 자동화  
> 설치: `npm install --save-dev zombie`

### jshint
> javascript 문법 체크, 정상 사용을 위해서 프로젝트 루트 디렉터리에 `.jshintrc` 파일을 만들고 내용에 다음과 같이 넣어준다.
> ```json
> {
>     "esversion": 6
> }
> ```
> 설치: `npm install -g jshint`  
> 사용법: `jshint index.js`

### grunt
> 종합 Test 자동화 프로그램, logic 테스트, cross-page 테스트, lint(문법 체크) 등의 QA 작업을 자동화시켜준다.
>  
> 클라이언트 설치: `npm install -g grunt-cli`   
> 프로젝트 라이브러리 설치: `npm install --save-dev grunt`
>  
> 플러그인 설치 - mocha, jshint, shell 명령어 테스트를 자동화하기 위한 플러그인을 설치한다.
> ```shell script
> npm install --save-dev grunt-cafe-mocha
> npm install --save-dev grunt-contrib-jshint
> npm install --save-dev grunt-exec
> ```

### body-parser
> POST로 요청된 body를 쉽게 추출할 수 있는 모듈  
> 설치: `npm install body-parser`     
> 사용
> ```javascript
> const express = require('express');
> const bodyParser = require('body-parser');
> const app = express();
> 
> app.use(bodyParser.json());
> app.use(bodyParser.urlencoded({extended: false}));
> ```
> <b>URL encoding 이란?</b>   
> URL에 사용되는 문자열을 encoding 하는 것, 알파벳의 경우 인코딩이 되어도 알파벳 그대로지만 공백이나 한글 및 특수문자의 경우
% 로 시작하는 문자로 인코딩하여 통신에 사용한다. 그래서 bodyParser.urlencoded 를 사용하여 URL 문자열을 받아 디코딩하여 사용하도록 옵션을 지정한다.   
> <b>ex)</b> 안녕 을 URL encoding 하면 -> %ec%95%88%eb%85%95   
[온라인 URL 인코더](https://www.convertstring.com/ko/EncodeDecode/UrlEncode) 페이지에서 확인할 수 있다.  
>
> extended 옵션: `qs` 모듈 사용 여부이며 `querystring` 모듈 보다 조금 더 확장된 기능을 제공한다.   
> express 4.16.0 버전 부터 body-parser 의 일부 기능이 익스프레스에 내장되어서 req body 가 JSON 포멧 혹은 url encoded 포멧인 경우 다음과 같이 사용한다.
> ```javascript
> const express = require('express');
> const app = express();
> 
> app.use(express.json());
> app.use(express.urlencoded({extended: false}));
> ```
>
> 하지만 body 가 버퍼 데이터 혹은 텍스트 데이터인 경우 body-parser를 이용한다.
> ``` javascript
> // raw: 버퍼 데이터인 경우
> app.use(bodyParser.raw());
> // text: 텍스트 데이터인 경우
> app.use(bodyParser.text());
> ```
> body-parser 를 통해 파싱된 request의 body는 req.body 를 통해서 사용할 수 있다.
> 출처1: [body-parser 모듈 (urlencoded, extended 옵션)](https://sjh836.tistory.com/154)
> 출처2: [Node - Express 미들웨어 body-parser](https://backback.tistory.com/336) 

### Formidable
> multipart(파일 관련) middleware  
> 설치: `npm install formidable`  
> 사용: `formidable.IncomingForm()` 함수를 통해서 form 객체를 얻어올 수 있으며 `parse()` 메서드를 통해서 
> 서버로 전달받은 파일의 정보를 쉽게 볼 수 있다.   
> ```javascript
> let formidable = require('formidable');
> app.post('/contest/vacation-photo/:year/:month', (req, res) => { 
>    let form = new formidable.IncomingForm();
>    form.parse(req, (err, fields, files) => {
>        if(err) return res.redirect(303, '/error'); 
>        console.log('received fields:'); 
>        console.log(fields);
>        console.log('received files:'); 
>        console.log(files);
>        res.redirect(303, '/thank-you'); 
>    });
> });
> ```

### cookie-parser
> 쿠키(브라우저에서 저장하는 세션 정보) 사용을 위한 middleware  
> 설치: `npm install cookie-parser`  
> 사용  
> ```javascript
> let cookieParser = require('cookie-parser');
> app.use(cookieParser(credentials.cookieSecret));
> app.get('/cookie-test', (req, res) => {
>     res.cookie('name', req.query.name);
>     res.cookie('email', req.query.email, {signed: true});
>     ...
> });
> ```

### express-session
> 서버에서 저장하는 세션 정보 사용을 위한 middleware  
> 설치: `npm install express-session`  
> 사용: req 에만 session 이 존재하게 되면 res 에는 session 이 없다.  
> ```javascript
> let session = require('express-session');
> app.use(session({
>     secret: credentials.cookieSecret,
>     proxy: true,
>     resave: true,
>     saveUninitialized: true
> }));
> 
> app.use((req, res, next) => {
>     res.locals.flash = req.session.flash;
>     delete req.session.flash;
>     next();
> });
> ```

### express-basic-auth
> 기본 인증(basic authentication) 제공 / HTTPS 에서만 사용을 권장. 아니면 보안상 문제가 큼. 
> 설치: `npm install express-basic-auth`  
> 사용:  
> ```javascript
> const basicAuth = require('express-basic-auth');
> app.use(basicAuth({
>      users: {'username': 'password'},
>      challenge: true,    /* true: browser shows the prompt for UI */
>  }));
> ```

### compression
> response content 를 client 에 돌려줄 때 gzip 을 통해서 압축하여 돌려주도록 하는 middleware  
> 설치: `npm install compression`  
> 사용: 모든 url 에 대하여 default 설정의 gzip compress 적용  
> ```javascript
> const compression = require('compression');
> app.use(compression(null));
> ```  
> 커스텀 설정이 필요할 시 참조 사이트: [링크](https://github.com/expressjs/compression)

### nodemailer
> E-mail sender for nodejs
> mail send 객체 생성 
> ```javascript
> let mailTranport = nodemailer.createTransport({
>     service: 'Gmail',   /* Hotmail, iCloud, Yahoo, SendGrid, etc... */
>     auth: {
>         user: 'email address',
>         pass: 'email password'
>     }
> });
> ```
> 
> mail send
> ```javascript
> mailTranport.sendMail({
>     from: 'fromAddress@outlook.com',
>     to: 'toAddress@gmail.com',
>     subject: 'This is subject for mail',
>     html: '<h1>This is body</h1><br/><p>You can send html message.</p>',
>     generateTextFromHtml: true  /* Alternative text */
> }, err => {
>     if (err) console.error('Unable to send email: ' + err);
> });
> ```
> 참조사이트: [Nodemailer - Github](https://github.com/lavie/Nodemailer)

### winston
> logging 모듈
> 설치: `npm install winston` 
> 참조사이트: [NodeJS 인기있는 Logging 모듈 Winston](https://basketdeveloper.tistory.com/42)

### morgan
> logging 모듈  
> compact, colorful 로깅 출력        
> 설치: `npm install --save-dev morgan`  

### ~~express-logger~~ 
> <b>주의!: 2014년에 마지막 업데이트 된 것이라 daily rolling 부분에서 정상 동작하지 않는다.</b>  
> ~~log4j 처럼 daily rolling 기능 제공~~  
> ~~설정 변경은 node_modules/express-logger/logger.js 를 수정한다.~~  

## domain
> Uncaught Exception Handling Middleware
> 주의: 이 미들웨어는 가장 처음에 놓아서 req, res, next 모두 domain 체인에 연결한다.
> on('error', handler) 를 통해서 uncaught exception 발생 시 처리할 로직을 정의한다.  
> domain.add() 로 req, res 뿐 아니라 next 도 체인을 걸었기 때문에 다음에 나오는 미들웨어들 모두 domain 체인에 연결된다.
> 설치: 필요 없음.  
> 예시: uncaught exception 발생 시 5초 후 서버 cluster process 종료, 5초 동안 worker 로 신규 request 가 들어오지 못하도록 disconnect, 
> 신규 connection 이 연결되지 못하도록 server close, 500 으로 error 넘기기(next(err);)
> ```javascript
> let server;
> app.use((req, res, next) => {
>     let domain = require('domain').create();
>     domain.on('error', err => {
>         winston.error('DOMAIN ERROR CAUGHT\n', err.stack);
>         try {
>             setTimeout(() => {
>                 winston.error('Failsafe shutdown.');
>                 process.exit(1);
>             }, 5000);
>             let worker = require('cluster').worker;
>             if (worker) worker.disconnect();
>             server.close();
> 
>             try {
>                 next(err);
>             } catch (err) {
>                 winston.error('Express error mechanism failed.\n', err.stack);
>                 res.statusCode = 500;
>                 res.setHeader('content-type', 'text/plain');
>                 res.end('Server error.');
>             }
>         } catch (err) {
>             winston.error('Unable to send 500 response.\n', err.stack);
>         }
>     });
> 
>     domain.add(req);
>     domain.add(res);
> 
>     domain.run(next);
> });
> ...
> app.use((err, req, res, next) => {
>     winston.error(err.stack);
>     res.status(500).render('500');
> });
>
> const startServer = () => {
>     server = http.createServer(app).listen(app.get('port'), () => {
>         winston.info(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
>     });
> }
> ...
> ```

### Serverless
> AWS Lambda 배포/관리 프레임워크   
> 설치: `npm install -g serverless`

## Scaling out / Clustering
### index.js
> 기존 http.createServer(app).listen(...); 문장을 함수로 감싼 후 직접 실행의 경우와 require 요청의 경우로 분리
> ```javascript
> const startServer = () => {
>     http.createServer(app).listen(app.get('port'), () => {
>         winston.info(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
>     });
> }
> 
> if (require.main === module) {
>     /* application run directly; start app server */
>     startServer();
> } else {
>     /* application imported as a module via "require": export function to create server */
>     module.exports = startServer;
> }
> ```
### index_cluster.js
> ```javascript
> const winston = require('./config/winston');
> const cluster = require('cluster');
> 
> const startWorker = () => {
>     let worker = cluster.fork();
>     winston.info(`CLUSTER: Worker ${worker.id} started`);
> }
> 
> if (cluster.isMaster) {
>     require('os').cpus().forEach(() => {
>         startWorker();
>     });
> 
>     /* disconnect -> exit */
>     cluster.on('disconnect', worker => {
>         winston.info(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`);
>     });
>     cluster.on('exit', (worker, code, signal) => {
>         winston.info(`CLUSTER Worker ${worker.id} died with exit code ${code} (${signal})`);
>         startWorker();
>     });
> } else {    /* It's not the Master then start server */
>     require('./index')();
> }
> ```

## Handlebar
> View Template Engine

### 주석
> 브라우저에 남지 않는 Handlebar 주석  
> `{{! this is handlebar's secret comment }}`  

### partials
> 각 페이지에 삽입하기 위한 조각 페이지  
> `views/partials/weather.handlebars` 참조  
> ```javascript
> app.use((req, res, next) => {
>     if (!res.locals.partials) res.locals.partials = {};
>     res.locals.partials.weather = weather.getData();
>     next();
> });
> ```

### section
> handlebar create 함수에서 `helpers` 의 인자로 `section` 추가 (<b>주의</b>: 람다식 사용시 동작 안함)  
> `localhost:3000/jquery-test` 에서 동작 확인
> ```javascript
> let express_handlebars = require('express3-handlebars');
>  
> let app = express();
> let handlebars = express_handlebars.create({
>     defaultLayout: 'main',
>     helpers: {
>         section: function(name, options) {  /* 주의: 람다식 사용시 동작 안함. */
>             if(!this._sections) this._sections = {}
>             this._sections[name] = options.fn(this)
>             return null
>         }
>     }
> });
> ```
