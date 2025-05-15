import React from "react";

export default function PersonnelTable({ personnel, onPrint, onExport, onAddPersonnel }) {
  return (
    <div>
      <div className="table-header">
        <h1>Pessoal Militar em Licença Médica</h1>
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
            <th>Hospital</th>
            <th>Tratamento</th>
            <th>Período de Descanso</th>
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
              <td>{person.restStart}</td>
              <td>{person.estimatedReturn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}