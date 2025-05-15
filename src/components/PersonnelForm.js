import React, { useState } from "react";
import axios from "axios";

const PersonnelForm = ({ onSubmit, onClose, token, fetchPersonnel }) => {
  const [formData, setFormData] = useState({
    nip: "",
    fullName: "",
    rank: "",
    dob: "",
    placeOfWork: "",
    diagnosis: "",
    hospital: "",
    treatment: "",
    restPeriod: "",
    restStart: "",
  });

  const angolanRanks = [
    "Almirante", "Vice-Almirante", "Contra-Almirante", "Comodoro", "Capitão de Mar e Guerra",
    "Capitão de Fragata", "Capitão-Tenete", "Tenete de Marinha", "Segundo-Tenente", "Guarda-Marinha", "Subchefe Principal", "Subchefe de Primeira Classe", "Subchefe de Segunda Classe", "Sargento de Primeira Classe", "Sargento de Segunda Classe", "Marinheiro de Primeira Classe", "Marinheiro de Segunda Classe", "Marinheiro Recruta"
  ];
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate NIP (must be a number and not empty)
    if (!formData.nip || isNaN(formData.nip)) {
      newErrors.nip = "NIP must be a valid number.";
    }

    // Validate Full Name (must not be empty)
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    }

    // Validate Rank (must not be empty)
    if (!formData.rank.trim()) {
      newErrors.rank = "Rank is required.";
    }

    // Validate Date of Birth (must be a valid date)
    if (!formData.dob || isNaN(Date.parse(formData.dob))) {
      newErrors.dob = "Date of Birth must be a valid date.";
    }

    // Validate Place of Work (must not be empty)
    if (!formData.placeOfWork.trim()) {
      newErrors.placeOfWork = "Place of Work is required.";
    }

    // Validate Diagnosis (must not be empty)
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis is required.";
    }

    // Validate Hospital (must not be empty)
    if (!formData.hospital.trim()) {
      newErrors.hospital = "Hospital is required.";
    }

    // Validate Treatment (must not be empty)
    if (!formData.treatment.trim()) {
      newErrors.treatment = "Treatment is required.";
    }

    // Validate Rest Period (must be a positive number)
    if (!formData.restPeriod || isNaN(formData.restPeriod) || formData.restPeriod <= 0) {
      newErrors.restPeriod = "Rest Period must be a positive number.";
    }

    // Validate Rest Start Date (must be a valid date)
    if (!formData.restStart || isNaN(Date.parse(formData.restStart))) {
      newErrors.restStart = "Rest Start Date must be a valid date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const newEntry = {
        ...formData,
        age: new Date().getFullYear() - new Date(formData.dob).getFullYear(), // Calculate age
        estimatedReturn: new Date(
          new Date(formData.restStart).getTime() + formData.restPeriod * 24 * 60 * 60 * 1000
        ).toISOString().split("T")[0], // Calculate return date
      };

      await axios.post("http://military-leave-catalog-backend-production.up.railway.app/api/personnel", newEntry, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchPersonnel(); // Refresh the personnel list
      onSubmit(newEntry);
    } catch (error) {
      console.error("Error submitting personnel form:", error.message);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="personnel-form">
      <label>
        NIP:
        <input
          name="nip"
          value={formData.nip}
          onChange={handleChange}
          required
        />
        {errors.nip && <span className="error">{errors.nip}</span>}
      </label>
      <label>
        Nome Completo:
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        {errors.fullName && <span className="error">{errors.fullName}</span>}
      </label>
      <label>
        Posto:
        <select
          name="rank"
          value={formData.rank}
          onChange={handleChange}
          required
        >
          {angolanRanks.map((rank) => (
            <option key={rank} value={rank}>
              {rank}
            </option>
          ))}
        </select>
        {errors.rank && <span className="error">{errors.rank}</span>}
      </label>
      <label>
        Data de Nascimento:
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
        {errors.dob && <span className="error">{errors.dob}</span>}
      </label>
      <label>
        Unidade
        <input
          name="placeOfWork"
          value={formData.placeOfWork}
          onChange={handleChange}
          required
        />
        {errors.placeOfWork && <span className="error">{errors.placeOfWork}</span>}
      </label>
      <label>
        Diagnóstico Médico:
        <input
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          required
        />
        {errors.diagnosis && <span className="error">{errors.diagnosis}</span>}
      </label>
      <label>
        Hospital:
        <input
          name="hospital"
          value={formData.hospital}
          onChange={handleChange}
          required
        />
        {errors.hospital && <span className="error">{errors.hospital}</span>}
      </label>
      <label>
        Tratamento:
        <input
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          required
        />
        {errors.treatment && <span className="error">{errors.treatment}</span>}
      </label>
      <label>
        Período de Licença (dias):
        <input
          type="number"
          name="restPeriod"
          value={formData.restPeriod}
          onChange={handleChange}
          required
        />
        {errors.restPeriod && <span className="error">{errors.restPeriod}</span>}
      </label>
      <label>
        Início da Licença:
        <input
          type="date"
          name="restStart"
          value={formData.restStart}
          onChange={handleChange}
          required
        />
        {errors.restStart && <span className="error">{errors.restStart}</span>}
      </label>
      <button type="submit" className="submit-button">
        Adicionar
      </button>
    </form>
  );
};

export default PersonnelForm;
