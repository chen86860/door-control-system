var mongoose = require('mongoose');
var credentials = require('../lib/credentials');

var credentials = require('../lib/credentials');
var nodemailer = require('nodemailer');

mongoose.Promise = global.Promise;
mongoose.connect(credentials.mongo.development.connectString);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    //succeed
});

/**
 * 系统配置
 */
var config = mongoose.model('config', new mongoose.Schema({
    puinished: {
        type: Array,
        default: ['chen86860@163.com']
    },
    lang: {
        type: String
    }
}, {
        collection: 'config'
    }))

/**
 * 尝试次数
 */
var attempTime = mongoose.model('attempTime', new mongoose.Schema({
    time: {
        type: Number,
        default: 0,
        expires: 20 * 60
    }
}))
/**
 * 用户Model
 */
var userInfo = mongoose.model('userinfo', new mongoose.Schema({
    username: String,
    password: {
        type: String,
        minlength: 4
    },
    address: {
        type: Array
    },
    mobile: {
        type: String
    }
}, {
        collection: 'userinfo'
    }));

/**
 * 日志记录
 */
var log = mongoose.model('log', new mongoose.Schema({
    username: {
        type: String
    },
    ipAdd: {
        type: String
    },
    logTime: {
        type: Number,
        default: 0
    },
    trusted: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}))

/**
 * 管理员后台
 */
var admin = mongoose.model('admin', new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    initTime: {
        type: Date,
        default: Date.now
    }
}))


/**
 * 用户注册
 * @param{username,password}
 */
exports.adminReg = (data, callback) => {
    admin.find({ username: data.username }, (err, result) => {
        if (err) {
            callback(true, {
                code: 100
            })
        } else if (result.length == 0) {
            let user = {}
            user.username = data.username
            user.password = md5(data.password + data.username)
            user.email = data.user.email
            user = new admin(user);
            user.save((err, res) => {
                if (err) {
                    callback(true, {
                        code: 101
                    })
                } else {
                    callback(false, {
                        code: 0,
                        msg: res
                    })
                }
            })
        } else {
            callback(true, {
                code: 102
            })
        }
    })

}
/**
 * 用户登录
 * @param{username,password}
 */
exports.adminLogin = (data, callback) => {
    admin.findOne({ username: data.username, password: data.password }, (err, res) => {
        if (err) {
            callback(true, {
                code: 100
            })
        } else {
            callback(false, {
                code: 0,
                msg: res
            })
        }
    })
}

/**
 * 检查是否超过最大检查次数 5 
 */
exports.prevCheck = (data, callback) => {
    attempTime.findOne({}, { attempTime: 1 }, (err, res) => {
        if (err) {
            callback(true, {
                code: 0
            })
        } else {
            callback(false, {
                code: 0,
                msg: res[0].attempTime > 5
            })
        }
    })
}
/**
 * 重置次数
 */
exports.resetCount = (callback) => {
    attempTime.update({}, { attempTime: 0 }, (err, res) => {
        if (err) {
            callback(true, {
                code: 100
            })
        } else {
            callback(false, {
                code: 0
            })
        }
    })
}

/**
 * 日志记录
 */
exports.logging = (data, callback) => {
    if (!data.trusted) {
        prevCheck(null, (err, res) => {
            if (err) {
                callback(true, {
                    code: 100
                })
            } else if (res.msg) {
                sendEmail('chen86860@163.com', '【警报】门禁系统短时间内已被大量非法尝试', new Date() + '] 门禁系统短时间内已被大量非法尝试，请注意财产安全', 'html', (status, details) => {
                    callback(true, {
                        code: 0,
                        msg: details
                    })
                })
            }
        })
        attempTime.update({}, { $inc: { attempTime: 1 } }, (err, callback) => {
            if (err) {
                callback(true, {
                    code: 100
                })
            }
        })
    } else {
        attempTime.update({}, { attempTime: 0 }, (err, callback) => {
            if (err) {
                callback(true, {
                    code: 100
                })
            }
        })
    }
    let logg = {}
    logg.key = data.key
    logg.ipAdd = data.ipAdd
    logg.trusted = data.trusted
    logg = new log(logg)
    logg.save((err, res) => {
        if (err) {
            callback(true, {
                code: 100
            })
        } else {
            callback(false, {
                code: 0
            })
        }
    })
}
/**
 * 发送邮件
 * @param{recipitnes,subject,conten,mailType,callback}
 */
exports.sendEmail = (recipients, subject, content, mailType, callback) => {
    var mailType = mailType || 'text';

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(credentials.stmp.stmpSecert);

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Jams" <chen86860@yeah.net', // sender address
        to: recipients, // list of receivers
        subject: subject // Subject line
        // mailType: content // plaintext body
    };
    mailOptions[mailType] = content;

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        var status = '';
        var details = '';
        if (error) {
            status = 'err';
            details = (typeof (info) != 'undefined') ? info : 'Mail Server Refuse'
        }
        else {
            status = 'ok';
            details = (typeof (info) != 'undefined') ? info : 'Mail Server Refuse'
        }

        if (callback && typeof (callback) == 'function') {
            callback(status, details);
        }
    });
}