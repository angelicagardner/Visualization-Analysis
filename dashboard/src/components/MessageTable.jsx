import { useState, useEffect } from 'react';
import ReactSearchBox from 'react-search-box';

function MessageTable({ sortingOrder, searchQuery, data, update }) {
  const [tableData, updateTableData] = useState(data, 1);

  useEffect(() => {
    updateTableData(data);
  }, [data]);

  const clickHandler = (sortBy, search) => {
    const delayDebounceFn = setTimeout(() => {
      update(sortBy, search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  };

  return (
    <div className="messageTable">
      <div className="table-title">
        <h3>Data Table</h3>
        <ReactSearchBox
          placeholder="Search..."
          message=""
          data={data}
          onChange={(search) => {
            clickHandler(sortingOrder, search.toLowerCase());
          }}
        />
      </div>
      <div className="table-fill">
        <table>
          <thead>
            <tr>
              <td
                className={
                  'span-sort' +
                  (sortingOrder === undefined ||
                  sortingOrder === 'timeASC' ||
                  sortingOrder === 'timeDESC'
                    ? ' sorted'
                    : '')
                }
                onClick={() =>
                  sortingOrder !== 'timeASC'
                    ? clickHandler('timeASC', searchQuery)
                    : clickHandler('timeDESC', searchQuery)
                }
              >
                Time
                {sortingOrder !== 'timeDESC' ? <span>▼</span> : <span>▲</span>}
              </td>
              <td
                className={
                  'span-sort' +
                  (sortingOrder === 'locationASC' ||
                  sortingOrder === 'locationDESC'
                    ? ' sorted'
                    : '')
                }
                onClick={() =>
                  sortingOrder !== 'locationASC'
                    ? clickHandler('locationASC', searchQuery)
                    : clickHandler('locationDESC', searchQuery)
                }
              >
                Location
                {new Set(tableData.map((item) => item.location)).size > 1 ? (
                  sortingOrder !== 'locationDESC' ? (
                    <span>▼</span>
                  ) : (
                    <span>▲</span>
                  )
                ) : (
                  ''
                )}
              </td>
              <td
                className={
                  'span-sort' +
                  (sortingOrder === 'accountASC' ||
                  sortingOrder === 'accountDESC'
                    ? ' sorted'
                    : '')
                }
                onClick={() =>
                  sortingOrder !== 'accountASC'
                    ? clickHandler('accountASC', searchQuery)
                    : clickHandler('accountDESC', searchQuery)
                }
              >
                User{' '}
                {sortingOrder !== 'accountDESC' ? (
                  <span>▼</span>
                ) : (
                  <span>▲</span>
                )}
              </td>
              <td>Messages</td>
              <td>Tags</td>
            </tr>
          </thead>
          {tableData.length ? (
            <tbody>
              {tableData.map((d) => (
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