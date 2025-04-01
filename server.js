const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: true }));

mongoose.connect('mongodb://127.0.0.1:27017/authDB', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({ username: String, password: String });
const User = mongoose.model('User', UserSchema);

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send(`<h2>Welcome ${req.session.user.username}!</h2>`);
    } else {
        res.redirect('/');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
