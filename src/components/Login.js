import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://military-leave-catalog-backend-production.up.railway.app/api/login", credentials);
            onLogin(res.data.token);
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            alert("Login failed: " + (error.response?.data?.message || "Please check your credentials and try again."));
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Acesso Militar</h2>
                <input 
                    type="text"
                    name="username"
                    placeholder="Nome de usuário"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                />
                <input 
                    type="password"
                    name="password"
                    placeholder="Palavra-passe"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;