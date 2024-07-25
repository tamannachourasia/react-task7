import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import bcrypt from 'bcryptjs';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./SignUp.css";

function SignUp() {
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

    const createUser = async () => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                alert('Email already exists');
                return;
            }

           // const hashedPassword = await bcrypt.hash(password, 10);
            await addDoc(collection(db, 'users'), {
                email: email,
                password: password,
                ip: ip,
                signupTime: new Date()
            });

            alert("You are signed up successfully");
            setEmail("");
            setPassword("");
            navigate("/login");
        } catch (error) {
            console.error("Error signing up:", error);
        }
    }

    return (
        <div className='sign-up'>
            <h1>Sign Up</h1>
            <label>Email</label>
            <input
                type='email'
                onChange={e => setEmail(e.target.value)}
                placeholder='Enter your email'
                value={email}
                required
            />
            <label>Password</label>
            <input
                type='password'
                onChange={e => setPassword(e.target.value)}
                placeholder='Enter your password'
                value={password}
                required
            />
            <button onClick={createUser}>Sign Up</button>
            <button onClick={() => navigate("/login")}>Login</button>
        </div>
    )
}

export default SignUp;
