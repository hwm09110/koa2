const Koa = require('koa');
const bodyParser = require('koa-better-body');
const convert = require('koa-convert');
const cors = require('koa2-cors');
const router = require('./router');


const app = new Koa();

const corsOptions = {
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return '*'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}

app.use(convert(bodyParser()))
app.use(cors(corsOptions)) //位置放置router中间件之前
app.use(router.routes())


// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
})

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
})

// response
// app.use(async ctx => {
//   	if (ctx.url === '/' && ctx.method === 'GET') {
        
//     } else if (ctx.url === '/' && ctx.method === 'POST') {
//         let postData = ctx.request.body
//         ctx.body = ctx.request.body
//         // ctx.body = postData
//     } else {
//         ctx.body = '<h2>404</h2>'
//     }
// })


app.listen(3000)
console.log('server run in port 3000')

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx)
});
