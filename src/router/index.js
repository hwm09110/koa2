const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const multer = require('koa-multer');
const mysql = require('../mysql').client;
const router = new Router();

const { writeJson, readJson } = require('../utils/writejson.js');


//文件上传 
//配置 
var storage = multer.diskStorage({ 
  //文件保存路径 
  destination: function (req, file, cb) { 
    cb(null, 'public/uploads/') 
  }, 
  //修改文件名称 
  filename: function (req, file, cb) { 
    var fileFormat = (file.originalname).split("."); 
    //以点分割成数组，数组的最后一项就是后缀名 
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]); 
  } 
}); 
//加载配置 
var upload = multer({ storage: storage });


router.get('/',(ctx, next) => {
  let html = `
        <h2>This is demo2</h2>
        <form method="POST" action="/adduser" enctype="multipart/form-data">
            <p>username:</p>
            <input name="username">
            <p>age:</p>
            <input name="age">
            <p>website</p>
            <input name="website">
            <p>portrait</p>
            <input type="file" name="myfile">
            <button type="submit">submit</button>                 
        </form>;
        `
  ctx.body = html
})

router.post('/adduser',async (ctx,next)=>{
  let filesData = ctx.request.files;
  let fieldsData = ctx.request.fields;

  const file = filesData[0]; // 获取上传文件
  const reader = fs.createReadStream(file.path); // 创建可读流
  const ext = file.name.split('.').pop(); // 获取上传文件扩展名
  const upStream = fs.createWriteStream(`public/uploads/${Math.random().toString()}.${ext}`); // 创建可写流
  reader.pipe(upStream); // 可读流通过管道写入可写流

  ctx.body = fieldsData;
})

router.get('/getuser',async (ctx,next)=>{
  let json = {
    'code': 200,
    'message': '获取成功',
    'extraData':[
      {'name':'张三','age':23},
      {'name':'李四','age':25},
      {'name':'王五','age':20}
    ]
  }
  ctx.body = json
})


router.get('/getsup',async (ctx,next)=>{
    let query = ctx.query;
    let btimestamp = (+new Date(query.time || '2018/5/1'))/1000;
    let sql = `select a.*,b.time as login_time from member as a 
            left join bk_login as b on a.memberId = b.memberId where b.time > ${btimestamp} and telPhone=?`;
    console.log(query);
    let flag = null;
    let tmp = await mysql.query(sql, [18202038213]).then((result) =>{
      flag = true;
      return result;
    }, (error)=>{
      flag = false;
      return error;
    });
    let ret = {};
        ret['code'] = 200;
        ret['message'] = flag?'拉取成功':'接口报错';
        ret['extraData'] = tmp;
    ctx.body = ret;
})

router.post('/postinfo',async (ctx,next)=>{
  let query = ctx.query;
})


router.get('/readjson',async (ctx,next)=>{
  // let query = ctx.query;
  // var params = { "id":5, "name":"白眉鹰王" };
  // writeJson(params);
  let filePath = path.resolve(__dirname, '../mock/person.json');
  // console.log(filePath);
  let json = await readJson(filePath);
  // console.log(json);
  ctx.body = json
})


module.exports = router