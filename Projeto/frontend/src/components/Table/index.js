import './styles.css';

/**
 * Table component for reusable styled tables.
 * @param {Array} columns - Array of { label, accessor } objects.
 * @param {Array} data - Array of row objects.
 * @param {ReactNode} actions - Function(row) => ReactNode for actions column.
 * @param {boolean} loading - Show loading spinner if true.
 * @param {string} wrapperClassName - Extra class for wrapper div.
 */
function Table({ columns, data, actions, loading, wrapperClassName = '' }) {
  function getRowKey(row, idx) {
    return [row.id, row.codigo_cliente, row.codigo_usuario, row.codigo_servico, row.codigo_despesa, idx].filter(Boolean).join('-');
  }
  return (
    <div className={`servicos-table-wrapper ${wrapperClassName}`}>
      <table className="servicos-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.accessor}>{col.label}</th>
            ))}
            {actions && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center' }}>Carregando...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', color: '#888' }}>Nenhum registro encontrado.</td></tr>
          ) : (
            data.map((row, idx) => (
              <tr key={getRowKey(row, idx)}>
                {columns.map(col => (
                  <td key={col.accessor}>{col.render ? col.render(row) : row[col.accessor]}</td>
                ))}
                {actions && <td>{actions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
