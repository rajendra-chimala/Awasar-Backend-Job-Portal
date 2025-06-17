const express = require('express');
const router = express.Router();
const User = require('../DB/models/userModel');

router.post('/register', userRegister)


