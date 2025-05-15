import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import PersonnelForm from './components/PersonnelForm';
import PersonnelTable from './components/PersonnelTable';
import axios from "axios";
import { saveAs } from "file-saver";

const angolanRanks = [
  "Almirante", "Vice-Almirante", "Contra-Almirante", "Comodoro", "Capitão de Mar e Guerra",
  "Capitão de Fragata", "Capitão-Tenete", "Tenete de Marinha", "Segundo-Tenente", "Guarda-Marinha", "Subchefe Principal", "Subchefe de Primeira Classe", "Subchefe de Segunda Classe", "Sargento de Primeira Classe", "Sargento de Segunda Classe", "Marinheiro de Primeira Classe", "Marinheiro de Segunda Classe", "Marinheiro Recruta"
];

export default function MilitaryLeaveCatalog() {
  const [token, setToken] = useState(() => localStorage.getItem("token")); // Load token from localStorage
  const [personnel, setPersonnel] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (token) {
      fetchPersonnel();
    }
  }, [token]);

  const fetchPersonnel = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/personnel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPersonnel(res.data);
    } catch (error) {
      console.error("Error fetching personnel:", error.message);
      if (error.response && error.response.status === 401) {
        setToken(null); // Clear token if unauthorized
        localStorage.removeItem("token");
      }
    }
  };

  const handleLogin = (receivedToken) => {
    setToken(receivedToken);
    localStorage.setItem("token", receivedToken); // Save token to localStorage
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const headers = ["NIP", "Full Name", "Rank", "Age", "Place of Work", "Diagnosis", "Hospital", "Rest Period", "Start Date", "Return Date", "Treatment"];
    const rows = personnel.map(p => [
      p.nip, p.fullName, p.rank, p.age, p.placeOfWork, p.diagnosis, p.hospital, p.restPeriod, p.restStart, p.estimatedReturn, p.treatment
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "military_leave_personnel.csv");
  };

  const sortedPersonnel = [...personnel].sort((a, b) => {
    return angolanRanks.indexOf(a.rank) - angolanRanks.indexOf(b.rank);
  });

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="container">
        <div className="top-bar">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/"
            element={
              token ? <>
                <PersonnelTable
                  personnel={sortedPersonnel}
                  onPrint={handlePrint}
                  onExport={handleExport}
                  onAddPersonnel={() => setShowModal(true)}
                />
                {showModal && (
                  <div
                    className="modal-overlay"
                    onClick={(e) => {
                      if (e.target.className === "modal-overlay") {
                        setShowModal(false);
                      }
                    }}
                  >
                    <div className="modal-content">
                      <h2>Adicionar</h2>
                      <PersonnelForm
                        onSubmit={(formData) => {
                          setShowModal(false);
                          fetchPersonnel();
                        }}
                        onClose={() => setShowModal(false)}
                        token={token}
                        fetchPersonnel={fetchPersonnel}
                      />
                    </div>
                  </div>
                )}
              </>
                : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}


