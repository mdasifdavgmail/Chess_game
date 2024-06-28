

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user');

const router = express.Router();


router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
  
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

   
    user = new User({
      username,
      password
    });

   
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

  
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
   
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, 'jwtSecret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
