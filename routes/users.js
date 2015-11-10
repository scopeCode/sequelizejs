var express = require('express');
var router = express.Router();


/*
* 测试一下   sequelize  的 1:1 1:n  n:m的的测试
* */
var Sequelize = require('sequelize');


var config ={
  database:'baby',
  username:'root',
  password:'root',
  options:{
    pool: {
      max: 100,
      min: 0,
      idle: 10000
    },
    host:'127.0.0.1',
    port:'3306',
    dialect : 'mysql',
    timezone:'+08:00',
    define: {
      freezeTableName: true,
      timestamps:false
    }
  }
};

var dbStroage = new Sequelize(config.database, config.username, config.password, config.options);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


var User = dbStroage.define('user',
    {
      id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
      userName:{
        type:Sequelize.STRING,
        field:"userName"
      },
      userPwd:{
        type:Sequelize.STRING,
        field:"userPwd"
      },
      created:{
        type:Sequelize.DATE,
        field:'created',
        defaultValue :Sequelize.NOW
      }
    }
);

var UserInfo = dbStroage.define('userInfo',
    {
      id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
      uid:{
        type:Sequelize.BIGINT,
        field:"uid"
      },
      petid:{
        type:Sequelize.BIGINT,
        field:"petid"
      },
      name:{
        type:Sequelize.STRING,
        field:"name"
      },
      text:{
        type:Sequelize.STRING,
        field:"text"
      },
      desc:{
        type:Sequelize.STRING,
        field:"desc"
      }
    }
);

/*User.sync({force: true}).then(function () {
  return User.create({
    userName: 'admin@kfcode.cn',
    userPwd: 'e10adc3949ba59abbe56e057f20f883e'
  });
});

UserInfo.sync({force: true}).then(function () {
  return UserInfo.create({
        uid:1,
        petid:1,
        name:'名字1',
        text:'文字1',
        desc:'描述1'
      }
  );
});*/

User.hasMany(UserInfo,{as:'UserInfo',foreignKey:'uid'});
UserInfo.belongsTo(User,{as:'User',foreignKey:'uid'});

router.get('/getOne', function(req, res, next) {
    User.findOne({
      where: {
        id: req.query.id
      },
      include:{
        model:UserInfo,
        as:'UserInfo'
      }
    }).then(function(u){
      if(!u){
        res.send("不存在的用户.");
      }else{
        res.send(JSON.stringify(u));
      }
    }).catch(function(err){
      res.send(err.message);
    });
});


module.exports = router;