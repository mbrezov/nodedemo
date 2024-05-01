const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
require("dotenv").config();

const usersStorage = "users.json";

function loadUsers() {
    try {
        const data = fs.readFileSync(usersStorage);
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading users file", err);
        return [];
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(usersStorage, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Error writing users file", err);
    }
}

const createToken = (_id) => {
    const randomBytes = crypto.randomBytes(32);
    const jwtSecretKey = randomBytes.toString("base64");
    return jwt.sign({ _id }, jwtSecretKey);
};

// Signup controller function
const signupUser = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    try {
        if (!email || !password) {
            throw new Error("All fields must be filled");
        }
        if (!validator.isEmail(email)) {
            throw new Error("Email is not valid");
        }

        if (password !== confirmPassword) {
            throw new Error("Passwords don't match");
        }

        const users = loadUsers();

        const exists = users.find((user) => user.email === email);

        if (exists) {
            throw new Error(`Email ${email} already exists`);
        }

        if (!validator.isStrongPassword(password)) {
            throw new Error("Password is not strong enough");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = { email, password: hash };
        users.push(newUser);
        saveUsers(users);

        const token = createToken(newUser._id);

        res.status(200).json({ email, token });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: error.message });
    }
};

// Login controller function
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            throw new Error("All fields must be filled");
        }

        if (!validator.isEmail(email)) {
            throw new Error("Email is not valid");
        }

        const users = loadUsers();

        const user = users.find((user) => user.email === email);

        if (!user) {
            throw new Error("User not found");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new Error("Incorrect password");
        }

        const token = createToken(user._id);

        res.status(200).json({ email, token });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    signupUser,
    loginUser,
};
