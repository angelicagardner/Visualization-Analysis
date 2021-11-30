import { useState } from 'react';
import ReactSearchBox from 'react-search-box';

function MessageTable({ data }) {
  let [filteredData, setFilteredData] = useState(data, 1);
  const filterData = (search) => {
    return data.filter((item) => item.message.toLowerCase().includes(search));
  };
  return (
    <div className="messageTable">
      <div className="table-title">
        <h3>Data Table</h3>
        <ReactSearchBox
          placeholder="Search..."
          message=""
          data={data}
          onChange={(search) =>
            setFilteredData(filterData(search.toLowerCase()))
          }
        />
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
          {filteredData.length ? (
            <tbody>
              {filteredData.map((d) => (
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
            <p className="no-data">No messages found.</p>
          )}
        </table>
      </div>
    </div>
  );
}

export default MessageTable;
