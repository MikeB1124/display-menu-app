import React, { useEffect, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {useSignIn, useIsAuthenticated} from "react-auth-kit"

function Login() {
    const navigate = useNavigate()
    const signIn = useSignIn()
    const isAuthenticated = useIsAuthenticated()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const auth = isAuthenticated();
        return auth ? navigate("/home") : navigate("/")
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        let account = {
            "username": username,
            "password": password
        }
        fetch('/api/auth/login', {
            method: "POST",
            headers:{
                "Authorization": `Basic ${process.env.REACT_APP_AUTH_TOKEN}`
            },
            body: JSON.stringify(account)
        })
        .then(response => response.json())
        .then(data => {
            if(data["token"]){
                signIn({
                    token: data["token"],
                    expiresIn: 60,
                    tokenType: "Bearer",
                    authState: {username: username}
                })
                navigate("/home")
            }else{
                alert(`Error: ${data["result"]}`)
            }
        })
        .catch(error => console.error(error));
    }

    return (
        <>
        <div style={{backgroundColor: "#E6EEFF"}}>
            <form style={formStyle} onSubmit={handleSubmit}>
                <div style={formBackground}>
                    <div style={headingContainer}>
                        <Typography style={headingStyle} variant="h5" component="h5">Welcome Back</Typography>
                        <Typography style={subtitleStyle} variant="h6" component="h6">Enter your credentials to access your account.</Typography>
                    </div>
                    {errorMessage && <div style={errorMessageStyle}>{errorMessage}</div>}
                    <OutlinedInput
                        placeholder='Username'
                        style={inputStyle}
                        startAdornment={
                            <InputAdornment position="start">
                                <PersonIcon style={iconStyle}/>
                            </InputAdornment>
                        }
                        value={username} 
                        onChange={event => setUsername(event.target.value)}
                    />
                    <br/>
                    <OutlinedInput
                        placeholder='Password'
                        type='password'
                        style={inputStyle}
                        startAdornment={
                            <InputAdornment position="start">
                                <LockIcon style={iconStyle}/>
                            </InputAdornment>
                        }
                        value={password} 
                        onChange={event => setPassword(event.target.value)}
                    />
                    <br/>
                    <button style={buttonStyle} type="submit">Log in</button>
                </div>
            </form>
        </div>
    </>
    );
};

export default Login;


const formStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
};

const formBackground = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '250px',
    padding: '64px',
    backgroundColor: 'white',
    borderRadius: '16px'
}

const inputStyle = {
    height: "32px",
    width: "200px"
}

const buttonStyle = {
    borderRadius: '4px',
    backgroundColor: '#2662FF',
    border: 'none',
    color: 'white',
    padding: '6px 12px',
    fontSize: '14px',
    width: '100px',
    cursor: 'pointer'
};

const headingContainer = {
    margin: '32px 0px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: "#324567"
}

const headingStyle = {
    fontWeight:'bold',
    textAlign:'center',
}

const subtitleStyle = {
    color: "#7889A4", 
    textAlign: "center", 
    margin: "8px",
    fontSize: "16px"
}

const iconStyle = {
    color: "#2662FF"
}

const errorMessageStyle = {
    color: 'red',
    fontSize: '16px',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '8px 0px'
};