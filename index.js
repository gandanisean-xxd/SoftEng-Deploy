import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import UserModel from './User.js';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB 
mongoose.connect("mongodb://localhost:27017/dbtagle");

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email })
    .then(user => {
      if (user) {
        // Compare the entered password with the hashed password stored in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error checking password' });
          }

          if (isMatch) {
            res.json({
              success: true,
              email: user.email,
              username: user.email.split('@')[0], // Get username from email
              role: user.role
            });
          } else {
            res.json({ success: false, message: 'Password incorrect!' });
          }
        });
      } else {
        res.json({ success: false, message: 'This user does not exist!' });
      }
    })
    .catch(err => {
      console.error('Error during login:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    });
});


app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds

  const userData = {
    email,
    password: hashedPassword,  // Store the hashed password
    role
  };

  try {
    const newUser = await UserModel.create(userData);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

  
  app.post('/auth/google', async (req, res) => {
    const { email, name, picture, sub } = req.body;
  
    try {
      let user = await UserModel.findOne({ googleId: sub });
  
      if (!user) {
        user = new UserModel({
          googleId: sub,
          email,
          name,
          picture,
          role: "User"
        });
        await user.save();
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error('Error saving Google user:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Test Route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});