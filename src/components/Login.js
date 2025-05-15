import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "./Login.css";
import axios from "axios";

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, credentials);
            onLogin(res.data.token); // Pass the token to the parent component
            navigate("/"); // Navigate to the PersonnelTable page
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            setErrorMessage(error.response?.data?.message || "Credenciais inválidas.");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Acesso Militar</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
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
                <p>
                    Não tem uma conta? <Link to="/signup">Registar</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;