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
> `npm i`(install) 명령을 통해서 `package.json` 파일에 정의된 dependency 들을 모두 설치할 수 있다.

### Middleware 설치
> 모듈 설치: `npm i 모듈명`   
> 모듈 전역 설치: `npm i -g 모듈명`  
> 모듈 dev 설치: `npm i --save-dev 모듈명`  
> 모듈 제거: `npm uninstall 모듈명`   
> 모듈 검색: `npm search 모듈명`   

## Middleware
### express
> nodejs 웹 프레임워크  
> 설치: `npm i express`  

### handlebars
> client(Internet Browser)에 정보를 나타내주기 위한 view template    
> 설치: `npm i express3-handlebars`  
>
> * 프로젝트 디렉터리 아래 `views` 디렉터리 아래 `.hbs` 확장자 파일 생성.  
> * `views/layouts` 디렉터리 아래 view 에서 사용하는 공통 레이아웃(ex: 회사 로고 및 메뉴들이 존재하는 최 상단바) 페이지 생성.
> * static 파일들 (ex: image, css, js 등) 은 프로젝트 디렉터리 아래 `public` 디렉터리 아래 생성.
> * 사용
> ```javascript
> let hbs = require('express3-handlebars');
> ...
> app.engine(
>     '.hbs',     /* 확장자명: 'handlebars' 혹은 'hbs' 사용 가능 */
>     hbs({
>         defaultLayout: 'main',    /* views/layouts 에서 기본 레이아웃 파일명: views/layouts/main.handlebars 파일로 지정 */
>         helpers: {
>             /* section 설정
>              * main.handlebars 에 section 을 선언하고 각 view 로 사용할 .handlebars 파일 마다 
>              * 해당 섹션에 다른 값을 넣을 수 있다. 
>              * section 을 사용하면 아래 정의한 함수를 거치게 된다.
>              */
>             section: function(name, options) {       
>                 if (!this._sections) this._sections = {};
>                 this._sections[name] = options.fn(this);
>                 return null;
>             }
>         }
>     })
> );
> app.set('view engine', '.hbs');
> ```
> * <b>주의</b>: helpers 아래 section 의 function 부분에서는 화살표 함수 사용시 정상 동작하지 않으니 function() 형태로 정의해야한다.   
> 추천 참조 사이트: [nodejs #7 express-handlebars (1) 템플릿엔진?](https://velog.io/@hwang-eunji/nodejs-7-express-handlebars-%ED%85%9C%ED%94%8C%EB%A6%BF%EC%97%94%EC%A7%84)

### nodemon
> js 수정시 node 자동 restart  
> 설치: `npm i -g nodemon`  
> 사용  
> * 기존 노드 실행: `node index.js`  
> * nodemon 으로 노드 실행: `nodemon index.js`

### mocha
> javascript unit test framework  
> 설치: `npm i --save-dev mocha`

### chai
> Test Assertion library  
> 설치: `npm i --save-dev chai`

### zombie
> 브라우저 테스트, 예를 들어 링크 클릭 등 자동화  
> 설치: `npm i --save-dev zombie`

### jshint
> javascript 문법 체크, 정상 사용을 위해서 프로젝트 루트 디렉터리에 `.jshintrc` 파일을 만들고 내용에 다음과 같이 넣어준다.
> ```json
> {
>     "esversion": 6
> }
> ```
> 설치: `npm i -g jshint`  
> 사용법: `jshint app.js`

### grunt
> 종합 Test 자동화 프로그램, logic 테스트, cross-page 테스트, lint(문법 체크) 등의 QA 작업을 자동화시켜준다.
>  
> 클라이언트 설치: `npm i -g grunt-cli`   
> 프로젝트 라이브러리 설치: `npm i --save-dev grunt`
>  
> 플러그인 설치 - mocha, jshint, shell 명령어 테스트를 자동화하기 위한 플러그인을 설치한다.
> ```shell script
> npm i --save-dev grunt-mocha-test
> npm i --save-dev grunt-contrib-jshint
> ```

### body-parser
> POST로 요청된 body를 쉽게 추출할 수 있는 모듈  
> 설치: `npm i body-parser`     
> 사용
> ```javascript
> const express = require('express');
> const bodyParser = require('body-parser');
> const app = express();
> 
> app.use(bodyParser.json());
> app.use(bodyParser.urlencoded({extended: false}));
> ``` 
>
> POST JSON Body 로 요청이 온 경우 및 form data 로 요청이 온 경우 모두 다음과 같이 `req.body`를 사용한다.  
> ex) { userId: 'jujin', password: '1234' }
> ```javascript
> app.post('/', (req, res) => {
>       let userId = req.body.userId;
>       let password = req.body.password;
> });
> ```
> 혹은
> ```javascript
> app.post('/', (req, res) => {
>       let { userId, password } = req.body;
> });
> ```
> 
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
> 설치: `npm i formidable`  
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
> 설치: `npm i cookie-parser`  
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
> 설치: `npm i express-session`  
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
> 설치: `npm i express-basic-auth`  
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
> 설치: `npm i compression`  
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
> 설치: `npm i winston` 
> 참조사이트: [NodeJS 인기있는 Logging 모듈 Winston](https://basketdeveloper.tistory.com/42)

### morgan
> logging 모듈  
> compact, colorful 로깅 출력        
> 설치: `npm i --save-dev morgan`  

### ~~express-logger~~ 
> <b>주의!: 2014년에 마지막 업데이트 된 것이라 daily rolling 부분에서 정상 동작하지 않는다.</b>  
> ~~log4j 처럼 daily rolling 기능 제공~~  
> ~~설정 변경은 node_modules/express-logger/logger.js 를 수정한다.~~  

### domain
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

### mongoose
> MongoDB ODM(Object Document Mapper) 모듈  
> 설치: `npm i mongoose`  
> 사용:  
> ```javascript
> /* DAO + DTO like other ORM(Object Relational Mapping) */
> const mongoose = require('mongoose');
> /* DB Schema like make class in java */
> let vacationSchema = mongoose.Schema({
>       name: String,   /* Element Name and Type*/
>       slug: String,
>       category: String,
>       sku: String,
>       description: String,
>       priceInCents: Number,
>       tags: [String],
>       inSeason: Boolean,
>       available: Boolean,
>       requiresWaiver: Boolean,
>       maximumGuests: Number,
>       notes: String,
>       packagesSold: Number,
> });
> /* Add model's method like DAO */
> vacationSchema.methods.getDisplayPrice = () => {
>       return `$${(this.priceInCents/100).toFixed(2)}`;
> };
> /* Make instance like in java */
> let Vacation = mongoose.model('Vacation', vacationSchema);
> module.exports = Vacation;
> ```

### connect-mongo
> monogo DB 를 session storage 로 사용하기 위한 모듈  
> 설치: `npm i connect-mongo`  
> 사용:  
> ```javascript
> const mongoose = require('mongoose');
> const session = require('express-session');
> const MongoStore = require('connect-mongo')(session);
> ...
> const opts = {
>     keepAlive: 1,
>     poolSize: 2,
>     useUnifiedTopology: true,
>     useNewUrlParser: true,
>     promiseLibrary: global.Promise,
> };
>
> mongoose.connect('mongodb://yourMongoDBURL/DB', opts).then(() => {
>       console.log('Connected to DEV MongoDB by mongoose');
> });
> app.use(session({
>     secret: credentials.cookieSecret,
>     proxy: true,
>     resave: true,
>     saveUninitialized: true,
>     store: new MongoStore({mongooseConnection: mongoose.connection}),
> }));
> ```

### vhost
> subdomain 사용을 위한 미들웨어   
> subdomain 예시) 웹 페이지를 위한 서브도메인: www.jujin.com,   
> API 제공을 위한 서브도메인: api.jujin.com,  
> 관리자 페이지를 위한 서브도메인: admin.jujin.com  
> 설치: `npm i vhost`  
> 사용:  
> ```javascript
> const vhost = require('vhost');
> 
> /* admin. 으로 시작하는 subdomain routing 하기: app.get() 대신 admin.get() 으로 사용하도록 정의 */
> let admin = express.Router();
> app.use(vhost('*.admin.com', admin));
> 
> admin.get('/', (req, res) => {
>       res.render('admin/home');
> });
> 
> admin.get('/users', (req, res) => {
>       res.render('admin/users');
> });
> ```

### cors
> 외부에 REST API 를 제공하는 경우 외부에서 해당 API 에 접근할 수 있도록 허용 옵션 middleware  
> 설치: `npm i cors`  
> 사용:   
> ```javascript
> const cors = require('cors');
> let whitelist = ['http://localhost:3000', 'http://example2.com']
> let corsOptionsDelegate = function (req, callback) {
>       let corsOptions;
>       if (whitelist.indexOf(req.header('Origin')) !== -1) {
>             corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
>       } else {
>             corsOptions = { origin: false } // disable CORS for this request
>       }
>       callback(null, corsOptions) // callback expects two parameters: error and options
> }
> 
> app.get('/yourApiUrl', cors(corsOptionsDelegate), (req, res) => {
>       /* your api process */
>       ...
> });
> ```

### axios
> node.js 의 http client
> 설치(테스트용): `npm i --save-dev axios`
> 사용: 
> ```javascript
> const rest = require('axios');
>
> let requestBody = {
>     elem1: 'Request Body',
>     elem2: 'Sample',
> };
> let requestHeader = {
>     authorization: 'Your Request Header',
> }; 
> axios.post('http://server.url', requestBody, { header: requestHeader }).then(res => {
>     console.log('response:', res);
> }).catch(reason => {
>     console.log('error:', reason);
> });
> ```

### underscore
> model - viewModel 변환 과정에서 중복 코드 제거
> 설치: `npm i underscore`
> 사용:  
> model/customer.js
> ```javascript
> let mongoose = require('mongoose');
> let Orders = require('./order');
> 
> let customerSchema = mongoose.Schema({
>   fileName: String,
>   lastName: String,
>   email: String,
>   address1: String,
>   address2: String,
>   city: String,
>   state: String,
>   zip: String,
>   phone: String,
>   salesNotes: [{
>       date: Date,
>       salespersonId: Number,
>       notes: String,
>   }],
> });
> 
> customerSchema.methos.getOrders = () => {
>   return Orders.find({customerId: this._id});
> };
> 
> let Customer = mongoose.model('Customer', customerSchema);
> module.exports = Customer;
> ```
>
> viewModel/customer.js
> ```javascript
> let Customer = require('../models/customer');
> let _ = require('underscore');
> 
> const smartJoin = (arr, separator) => {
> if (!separator) separator = ' ';
>   return arr.filter(elt => {
>   return elt !== undefined &&
>   elt !== null &&
>   elt.toString().trim() !== '';
>   }).join(separator);
> };
> 
> module.exports = customerId => {
> let customer = Customer.findById(customerId);
> if (!customer) return {error: 'Unknown customer ID:', req.params.customerId};
> let orders = customer.getOrders().map(order => {
>   return {
>     orderNumber: order.orderNumber,
>     date: order.date,
>     status: order.status,
>     url: `/orders/${order.orderNumber}`
>   }
> });
> /* underscore 를 사용하기 이전 */
> return {
>     firstName: customer.firstName,
>     lastName: customer.lastName,
>     name: smartJoin([customer.firstName, customer.lastName]),
>     email: customer.email,
>     address1: customer.address1,
>     address2: customer.address2,
>     city: customer.city,
>     state: customer.state,
>     zip: customer.zip,
>     fullAddress: smartJoin([
>         customer.address1,
>         customer.address2,
>         `${customer.city}, ${customer.state} ${customer.zip}`
>     ], '<br/>'),
>     phone: customer.phone,
>     orders: orders,
> };
>  
> /* underscore 사용으로 대체 */
> let vm = _.omit(customer, 'salesNotes');
> return _.extend(vm, {
>   name: smartJoin([customer.firstName, customer.lastName]),
>   fullAddress: smartJoin([
>   customer.address1,
>   customer.address2,
>   `${customer.city}, ${customer.state} ${customer.zip}`
>   ], '<br/>'),
>   orders: orders,
> });
> ```

### csurf
> CSRF(Cross-Site Request forgery) 공격  
> * 웹사이트 취약점 공격의 하나로, 사용자가 자신의 의지와는 무관하게 공격자가 의도한 행위(수정, 삭제, 등록 등)를 특정 웹사이트에 요청하게 하는 공격을 말한다.
> 
> 설치: `npm i csurf`  
> 사용: 
> ```javascript
> // this must come after we link in cookie-parser and connect-session
> // cookie-parser 와 connect-session 사용 아래에 선언한다.
> app.use(require('csurf')()); 
> app.use(function(req, res, next){
>   res.locals._csrfToken = req.csrfToken();
>   next(); 
> });
> ```
> 
> view 에서 form 에 hidden 으로 _csrf input 을 선언
> ```html
> <input type="hidden" name="_csrf" value="{{_csrfToken}}">
> ```

### passport
> Authentication middleware  
> 설치: `npm i passport`  
> 
> Google OAuth 2.0 을 통한 login 기능 사용   
> 설치: `npm i passport-google-oauth20`  
> Google Developers Console 에 접속하여 Application 생성: [SNS 개발 - passport.js를 이용한 구글 로그인 준비](https://edu.goorm.io/learn/lecture/557/%ED%95%9C-%EB%88%88%EC%97%90-%EB%81%9D%EB%82%B4%EB%8A%94-node-js/lesson/386090/sns-%EA%B0%9C%EB%B0%9C-passport-js%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EA%B5%AC%EA%B8%80-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%A4%80%EB%B9%84) 참조    

## Scaling out / Clustering
### app.js
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
### app_cluster.js
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
