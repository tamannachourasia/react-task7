import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from 'bcryptjs';
import axios from 'axios';
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ip, setIp] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIp = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setIp(response.data.ip);
            } catch (error) {
                console.error('Error fetching IP address:', error);
            }
        };

        fetchIp();
    }, []);

    const signInUser = async () => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('No user found with this email');
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            //const isPasswordValid = await bcrypt.compare(password, userData.password);
            
            if (!password) {
                alert('Invalid password');
                return;
            }

            alert("You are successfully logged in");
            setEmail("");
            setPassword("");
            navigate("/todoList", { state: { email: email } });
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className='sign-in'>
            <h1>Login Page</h1>
            <label>Email</label>
            <input
                type='email'
                placeholder='Enter your email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
            />
            <label>Password</label>
            <input
                type='password'
                placeholder='Enter your password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
            />
            <button onClick={signInUser}>Login</button>
        </div>
    );
}

export default Login;
