import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import Signup from "./components/Signup";
import PersonnelForm from './components/PersonnelForm';
import PersonnelTable from './components/PersonnelTable';
import axios from "axios";
import { saveAs } from "file-saver";

const angolanRanks = [
  "Almirante", "Vice-Almirante", "Contra-Almirante", "Capitão de Mar e Guerra",
  "Capitão de Fragata", "Capitão de Corveta", "Tenete de Navio", "Tenente de Fragata", "Tenente de Corveta", "Guarda-Marinha", "Cadete", "Sargento Maior", "Sargento Chefe", "Sargento Ajudante", "Primeiro Sargento", "Segundo Sargento", "Sub-Sargento", "Cabo", "Marinheiro", "Grumete", "Civil"
];

export default function MilitaryLeaveCatalog() {
  const [token, setToken] = useState(() => localStorage.getItem("token")); // Load token from localStorage
  const [personnel, setPersonnel] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState(null); // State to hold the record being edited

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

  const handleEdit = (person) => {
    setEditingPersonnel(person); // Set the selected record as the one being edited
    setShowModal(true); // Open the modal
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza de que deseja excluir este registro?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/personnel/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPersonnel(); // Refresh the personnel list
      } catch (error) {
        console.error("Error deleting personnel:", error.message);
      }
    }
  };

  const handleWipeDatabase = async () => {
    if (window.confirm("Tem certeza de que deseja excluir todos os registros?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/wipe-database`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPersonnel(); // Refresh the personnel list
      } catch (error) {
        console.error("Error wiping database:", error.message);
      }
    }
  };

  const sortedPersonnel = [...personnel].sort((a, b) => {
    return angolanRanks.indexOf(a.rank) - angolanRanks.indexOf(b.rank);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="container">
        <div className="top-bar">
          {token && (
            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
          )}
        </div>
        <Routes>
          <Route
            path="/login"
            element={token ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/"
            element={
              token ? (
                <>
                  <PersonnelTable
                    personnel={sortedPersonnel}
                    onPrint={handlePrint}
                    onExport={handleExport}
                    onAddPersonnel={() => setShowModal(true)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onWipeDatabase={handleWipeDatabase}
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
                        <h2>{editingPersonnel ? "Editar" : "Adicionar"}</h2>
                        <PersonnelForm
                          initialData={editingPersonnel} // Pass the selected record as initial data
                          onSubmit={(formData) => {
                            setShowModal(false);
                            setEditingPersonnel(null);
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
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}


