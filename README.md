## Login and Signup user endpoints 

>Run `node index.js`

### Endpoints

`Signup`

```
POST localhost:4000/user/signup
```

**Parameters**
```
    "email": String,
    "password": String,
    "confirmPassword": String
```

**Example Response**
```
{
    "email": "ios@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTQ1OTk3NjR9.bSyvxZ6GPxeArN5V9AHEKMA7Pgs_Emv2YFDG2lr-jMU"
}
```

>[!IMPORTANT]
>**Errors**
>
>"All fields must be filled"
>
>"Email is not valid"
>
>"Email *inserted e-mail* already exists"
>
>"Password is not strong enough"
>
>"Passwords don't match"

<br />

`Login`

```
POST localhost:4000/user/login
```

**Parameters**
```
    "email": String,
    "password": String,
```

**Example Response**
```
{
    "email": "ios@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTQ1OTk4NjN9.p8LhKzUKoduI0GPMBKcMaDrzPSIuhPQRTBoLlrzTFvg"
}
```

>[!IMPORTANT]
>**Errors**
>
>"All fields must be filled"
>
>"Email is not valid"
>
>"User not found"
>
>"Incorrect password"
