var express = require('express');
var router = express.Router();
var Model = require('../models/model')

/* GET home page. */
router
    .get('/', function (req, res, next) {
        res.render('index', { title: 'Express', content: 'Hello world' });
    });


router.get('/chatroom', function (req, res, next) {
    res.render('inde')
});
router.post('/log', (req, res, next) => {
    let payload = {
        key: req.body.key,
        ipAdd: req.ip,
        trusted: req.body.trusted
    }
    Model.logging(payload, (err, result) => {
        if (err) {
            res.json({
                code: 100,
                msg: 'bad'
            })
        } else {
            res.json({
                code: 0,
                msg: 'OK'
            })
        }
    })
})

//get usragent
router.get('/about/useragent', function (req, res, next) {
    // res.set('Content-Type', 'text.plain');
    var s = '';
    for (var name in req.headers) s += name + ':' + req.headers[name] + '\n';
    res.render('userAgent', { title: "useragent", content: s })
});


module.exports = router;
