function MessageTable({ data }) {
  return (
    <div className="messageTable">
      <div className="table-title">
        <h3>Data Table</h3>
      </div>
      <div className="table-fill">
        <table>
          <thead>
            <tr>
              <td>Time</td>
              <td>Location</td>
              <td>User</td>
              <td>Messages</td>
              <td>Tags</td>
            </tr>
          </thead>
          {data.length ? (
            <tbody>
              {data.map((d) => (
                <tr key={d.id}>
                  <td>{d.time}</td>
                  <td>{d.location}</td>
                  <td>{d.account}</td>
                  <td>{d.message}</td>
                  <td>{d.words.map((w) => w.name).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            ''
          )}
        </table>
      </div>
    </div>
  );
}

export default MessageTable;
