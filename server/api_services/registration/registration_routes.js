const express = require('express');



const router = express.Router();
const checkVerification = require('../registration/controllers/check_verification');
const sendAnotherAuthCode = require('../registration/controllers/send_another_auth_code');
const signIn = require('../registration/controllers/sign_in');
const singUp = require('../registration/controllers/sign_up');


// signup
router.post('/signup',singUp.signup);

// login
router.post('/login',signIn.login);

// check verification
router.post('/check-verification',checkVerification.check_verification);

// send another auth_code message
router.get('/send-another-auth-code',sendAnotherAuthCode.send_another_auth_code);


module.exports = router;