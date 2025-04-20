import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import UserModel from './User.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB 
mongoose.connect("mongodb://localhost:27017/dbtagle");

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  UserModel.findOne({email: email})
  .then(users => {
    if (users) {
      if(users.password === password) {
        res.json("Success")
      }else {
        res.json("Password incorrect!")
      }
    } else {
      res.json("This user does not exist!")
    }
  })
})

app.post('/register', (req, res) => {
    console.log('Request body:', req.body); // 🔍 DEBUG THIS
    UserModel.create(req.body)
      .then(user => res.json(user))
      .catch(err => res.json(err));
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