import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "./Signup.css";
import axios from "axios";

const Signup = () => {
    console.log("Rendering signup...");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/signup`, formData);
            setSuccessMessage("Conta criada com sucesso! Redirecionando para login...");
            setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
        } catch (error) {
            console.error("Signup failed:", error.response?.data?.message || error.message);
            setErrorMessage(error.response?.data?.message || "Erro ao criar conta.");
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Registar</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <input
                    type="text"
                    name="username"
                    placeholder="Nome de utilizador"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Palavra-passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Registar</button>
                <p>
                    Já tem uma conta? <Link to="/login">Entrar</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;