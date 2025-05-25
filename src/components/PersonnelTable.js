import React from "react";

export default function PersonnelTable({ personnel, onPrint, onExport, onAddPersonnel }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  };

  return (
    <div>
      <div className="table-header">
        <h1>Efetivos em Baixa Médica</h1>
        <div className="table-actions">
          <button onClick={onAddPersonnel}>Adicionar</button>
          <button onClick={onPrint}>Imprimir</button>
          <button onClick={onExport}>Exportar CSV</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>NIP</th>
            <th>Posto</th>
            <th>Nome Completo</th>
            <th>Idade</th>
            <th>Unidade</th>
            <th>Diagnóstico</th>
            <th>Unidade Sanitária</th>
            <th>Tratamento</th>
            <th>Período de Baixa</th>
            <th>Data de Início</th>
            <th>Data de Retorno</th>
          </tr>
        </thead>
        <tbody>
          {personnel.map((person) => (
            <tr key={person.id}>
              <td>{person.nip}</td>
              <td>{person.rank}</td>
              <td>{person.fullName}</td>
              <td>{person.age}</td>
              <td>{person.placeOfWork}</td>
              <td>{person.diagnosis}</td>
              <td>{person.hospital}</td>
              <td>{person.treatment}</td>
              <td>{person.restPeriod} dias</td>
              <td>{formatDate(person.restStart)}</td>
              <td>{formatDate(person.estimatedReturn)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}