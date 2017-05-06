var mongoose = require('mongoose');
var credentials = require('../lib/credentials');

mongoose.Promise = global.Promise;
mongoose.connect(credentials.mongo.development.connectString);

var Schema = mongoose.Schema;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    //succeed
});

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