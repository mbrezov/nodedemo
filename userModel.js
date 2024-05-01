const fs = require("fs");
const bcrypt = require("bcrypt");
const validator = require("validator");

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

const User = {
    async signup(email, password) {
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

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = { email, password: hash };
        users.push(newUser);
        saveUsers(users);
        return newUser;
    },

    async login(email, password) {
        if (!email || !password) {
            throw new Error("All fields must be filled");
        }

        const users = loadUsers();

        const user = users.find((user) => user.email === email);

        if (!user) {
            throw new Error("Incorrect email");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new Error("Incorrect password");
        }

        return user;
    },
};

module.exports = User;
