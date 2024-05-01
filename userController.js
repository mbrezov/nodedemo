const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
require("dotenv").config();

const usersFilePath = "users.json";

function loadUsers() {
    try {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading users file", err);
        return [];
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Error writing users file", err);
    }
}

// Helper function to create JWT token
const createToken = (_id) => {
    return jwt.sign({ _id }, "dadasdadasda", { expiresIn: "30d" });
};

// Signup controller function
const signupUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validation
        if (!email || !password) {
            throw new Error("All fields must be filled");
        }

        if (!validator.isEmail(email)) {
            throw new Error("Email is not valid");
        }

        const users = loadUsers();

        const exists = users.find((user) => user.email === email);

        if (exists) {
            throw new Error(`Email ${email} already exists`);
        }

        if (!validator.isStrongPassword(password)) {
            throw new Error("Password is not strong enough");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Add new user to the array
        const newUser = { email, password: hash };
        users.push(newUser);
        saveUsers(users);

        // Create JWT token
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
        // Validation
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

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new Error("Incorrect password");
        }

        // Create JWT token
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
