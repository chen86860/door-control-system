var express = require('express');
var router = express.Router();

var credentials = require('../lib/credentials');
var nodemailer = require('nodemailer');
var md5 = require('md5');
var uuid = require('uuid');
var ip = require('ip');
var Model = require('../models/model');


/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.session.userinfo) {
        res.render('usercenter', {
            usename: req.session.userinfo
        });
    } else {
        res.redirect('/');
    }
});

router.route('/logout')
    .get(function (req, res, next) {
        req.session.userinfo = null;
        res.redirect('/');
    });

router.route('/signup')
    .get(function (req, res, next) {
        if (req.session.userinfo) {
            res.redirect('/');
        } else {
            res.render('signup');
        }

    })
    .post(function (req, res, next) {
        if (req.session.userinfo) {
            res.redirect('/')
        } else {
            if (req.body && req.body.username.length > 4 && req.body.password.length > 4 && req.body.email.match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)) {
                Model.adminReg(req.body, (err, result) => {
                    if (err) {
                        res.render('signup', {
                            code: 100,
                            msg: '网络错误'
                        })
                    } else if (result.code == 0) {
                        res.session.username = username
                        res.redirect('/reg-succeed')
                    } else {
                        res.render('signup', {
                            code: 100,
                            msg: '用户已存在'
                        })
                    }
                })
            }
            else {
                res.render('signup', {
                    status: "BAD",
                    details: "email address is invalid"
                })
            }
        }
    });


router.route('/login')
    .get(function (req, res, next) {
        res.render('login');
    })
    .post(function (req, res, next) {
        var user = {
            username: req.body.username,
            password: md5(req.body.password + req.body.username)
        };
        //查询数据
        Model.adminLogin(user, (err, result) => {
            if (err) {
                res.render('login', {
                    mag: '网络错误'
                })
            } else if (res.code === 0) {
                // 登录成功！
                res.session.userinfo.username = user.username
                res.session.userinfo.email = result.email
                res.redirect('/')
            } else {
                res.render('login', {
                    code: 102,
                    msg: '用户名或密码不正确'
                })
            }
        })
    });

router.route('/update')
    .get(function (req, res, next) {
        if (req.session.userinfo) {
            res.render('update');
        }
        else {
            res.redirect('/');
        }
    })

    .post(function (req, res) {
        var oldpassword = {
            password: req.body.oldpassword
        };
        var newpassword = {
            $set: {
                password: req.body.newpassword
            }
        };

        // userDoc.update()
        userDoc.update(oldpassword, newpassword, function (err, result) {
            if (err) return console.log(err);
            res.render('update', {
                // oldpsw: req.body.oldpassword,
                newpsw: req.body.newpassword,
                result: result
            })
        })
    });

router.route('/remove')
    .get(function (req, res, next) {
        res.render('remove')
    })
    .post(function (req, res, next) {
        var removeitem = {
            username: req.body.username
        };

        userDoc.remove(removeitem, function (err, result) {
            if (err) return console.error(err);
            res.render('remove', {
                status: result
            });
        })
    });

router.route('/sendmail')
    .get(function (req, res) {
        if (req.session && req.session.userinfo) {
            res.render('sendmail');
        }
        else {
            res.redirect('/');
        }
    })
    .post(function (req, res) {
        if (req.session.userinfo == null) {
            res.redirect('/');
        } else {
            if (req.body.recipients.match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/) != null) {
                var recipients = req.body.recipients;
                var subject = req.body.subject == "" ? "(No Subject)" : req.body.subject;
                var content = req.body.content == "" ? "" : req.body.content;
                sendMail(recipients, subject, content, 'html', function (status, details) {
                    if (status == 'err') {
                        if (req.xhr) {
                            res.send({
                                statusCode: 202,
                                details: details
                            })
                        } else {
                            res.render('sendmail', {
                                status: "发送失败.",
                                details: details
                            })
                        }
                    } else if (status == 'ok') {
                        if (req.xhr) {
                            res.send("OK");
                        } else {
                            res.render('sendmail', {
                                status: '发送成功！',
                                details: details
                            })
                        }
                    }
                });
            }
            else {
                res.render('sendmail', {
                    status: '邮箱格式不正确哈～',
                    details: "邮箱格式错误。再检查遍哈～"
                })
            }
        }
    }
    );





module.exports = router;