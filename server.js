const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy data
const users = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    referralCode: "alex2025",
    donationsRaised: 2450.75,
    rank: 2,
    joinDate: "2024-01-15",
    level: "Silver Fundraiser"
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@example.com", 
    referralCode: "sarah2025",
    donationsRaised: 3200.50,
    rank: 1,
    joinDate: "2024-01-10",
    level: "Gold Fundraiser"
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    email: "mike@example.com",
    referralCode: "mike2025", 
    donationsRaised: 1875.25,
    rank: 3,
    joinDate: "2024-01-20",
    level: "Bronze Fundraiser"
  },
  {
    id: 4,
    name: "Emma Thompson",
    email: "emma@example.com",
    referralCode: "emma2025",
    donationsRaised: 1650.00,
    rank: 4,
    joinDate: "2024-01-25",
    level: "Bronze Fundraiser"
  },
  {
    id: 5,
    name: "David Kim",
    email: "david@example.com",
    referralCode: "david2025",
    donationsRaised: 1420.80,
    rank: 5,
    joinDate: "2024-02-01",
    level: "Bronze Fundraiser"
  }
];

const rewards = [
  {
    id: 1,
    title: "Welcome Badge",
    description: "Complete your first donation referral",
    threshold: 100,
    unlocked: true,
    icon: "🎖️"
  },
  {
    id: 2,
    title: "Rising Star",
    description: "Raise $500 in donations",
    threshold: 500,
    unlocked: true,
    icon: "⭐"
  },
  {
    id: 3,
    title: "Community Champion", 
    description: "Raise $1000 in donations",
    threshold: 1000,
    unlocked: true,
    icon: "🏆"
  },
  {
    id: 4,
    title: "Fundraising Hero",
    description: "Raise $2500 in donations", 
    threshold: 2500,
    unlocked: false,
    icon: "🦸"
  },
  {
    id: 5,
    title: "Impact Legend",
    description: "Raise $5000 in donations",
    threshold: 5000,
    unlocked: false,
    icon: "👑"
  }
];

// API Routes
app.get('/api/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

app.get('/api/leaderboard', (req, res) => {
  const sortedUsers = users.sort((a, b) => b.donationsRaised - a.donationsRaised);
  res.json(sortedUsers);
});

app.get('/api/rewards/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const userRewards = rewards.map(reward => ({
    ...reward,
    unlocked: user.donationsRaised >= reward.threshold
  }));
  
  res.json(userRewards);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Dummy authentication - just check if email exists
  const user = users.find(u => u.email === email);
  
  if (user) {
    res.json({ 
      success: true, 
      user: user,
      token: 'dummy-jwt-token'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    return res.status(400).json({ 
      success: false, 
      message: 'User already exists' 
    });
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    referralCode: `${name.toLowerCase().replace(/\s+/g, '')}2025`,
    donationsRaised: 0,
    rank: users.length + 1,
    joinDate: new Date().toISOString().split('T')[0],
    level: "New Intern"
  };
  
  users.push(newUser);
  
  res.json({ 
    success: true, 
    user: newUser,
    token: 'dummy-jwt-token'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});