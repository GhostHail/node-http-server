var express = require('express');
var router = express.Router();
const connection = require('../ext/mysql')
const submit = require('../ext/submit')
// 获取全部用户
router.get('/', function (req, res) {
  connection.query('select * from user', (err, result) => {
    if (err) return console.log(err.message)
    res.send(result)
  })
});
// 通过ID/Name模糊搜索用户
router.get('/:search', (req, res) => {
  console.log(req.params)
  res.send(req.params)
})
// 添加用户
router.post('/', (req, res) => {
  console.log(req.body)
  // 用户名和密码不为空
  if (!req.body.account || !req.body.password) return res.send(submit.send(null, 2))
  // 用户名不为空 
  if (req.body.account.trim().length === 0) return res.send(submit.send(null, 3))
  // 密码不为空
  if (req.body.password.trim().length === 0) return res.send(submit.send(null, 4))
  // 密码长度6位以上
  if (req.body.password.trim().length < 6) return res.send(submit.send(null, 5))
  // 查询用户是否存在
  connection.query('select count(id) as count from user where account = ?', req.body.account, (err, result) => {
    if (err) return console.log(err.message)
    if (result[0].count > 0) {
      // 用户已存在
      return res.send(submit.send(null, 6))
    } else {
      // 添加用户
      connection.query('insert into user set ?', req.body, (err, result) => {
        if (err) return console.log(err.message)
        if (result.affectedRows < 1) {
          return result.send(submit.send(null, 1))
        }
        res.send(submit.send(null, 0))
      })
    }
  })
})
// 通过ID修改用户密码
router.put('/', (req, res) => {
  console.log(req.body.id)
  // 用户不存在
  connection.query('select count(id) as count from user where id = ?', req.body.id, (err, result) => {
    if (err) return console.log(err.message)
        if (result.affectedRows < 1) {
          // 用户已存在
          return res.send(submit.send(null, 6))
        }
  }).then(
    function(err, result){
      console.log(err, result)
    }
  )
  // 密码不为空
  // 密码长度6位以上
  // console.log(req.params)
  // res.send(req.params)
})

module.exports = router;
