var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');

router.post('/',
    passport.authenticate('local', {
        successRedirect: '#games',
        failureRedirect: '#failure'
    })
);

router.get("/*", function(req, res, next){
    var file = req.params[0] || '/assets/views/index.html';
    res.sendFile(path.join(__dirname, "../public", file));
});

module.exports = router;