import { useState, useEffect } from 'react';
import ReactSearchBox from 'react-search-box';

function MessageTable({
  sortingOrder,
  searchQuery,
  data,
  update,
  itemPerRow = 100,
}) {
  const [tableData, updateTableData] = useState(data, 1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    updateTableData(data);
  }, [data]);

  const clickHandler = (sortBy, search) => {
    const delayDebounceFn = setTimeout(() => {
      update(sortBy, search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  };

  const reformatTime = (date) => {
    let d = new Date(date);
    let monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      d
    );
    let day = d.getDate();
    let hours = d.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = d.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${day} ${monthName} ${hours}:${minutes}`;
  };

  const lastPage = Math.ceil(tableData.length / itemPerRow) - 1;

  return (
    <div className="messageTable">
      <div className="table-fill">
        <table>
          <thead>
            <tr>
              <th
                width="7%"
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
              </th>
              <th
                width="8%"
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
              </th>
              <th
                width="10%"
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
              </th>
              <th width="70%">Messages</th>
              <th width="5%">Tags</th>
            </tr>
          </thead>
          {tableData.length ? (
            <tbody>
              {tableData
                .slice(
                  page * itemPerRow,
                  Math.min((page + 1) * itemPerRow, tableData.length)
                )
                .map((d) => (
                  <tr key={d.id}>
                    <td>{reformatTime(d.time)}</td>
                    <td>{d.location}</td>
                    <td>{d.account}</td>
                    <td>
                      {d.message.split(' ').map((m) => (
                        <span>
                          {m
                            .toLowerCase()
                            .replace('?', '')
                            .replace('!', '')
                            .replace('.', '')
                            .replace(',', '') === searchQuery ? (
                            <span className="search">{m} </span>
                          ) : (
                            m + ' '
                          )}
                        </span>
                      ))}
                    </td>
                    <td>{d.words.map((w) => w.name).join(', ')}</td>
                  </tr>
                ))}
            </tbody>
          ) : (
            <p className="no-data">No messages found.</p>
          )}
        </table>
      </div>
      <div className="table-footer">
        <ReactSearchBox
          placeholder={
            searchQuery === undefined || searchQuery === ''
              ? 'Search...'
              : searchQuery
          }
          data={data}
          onChange={(search) => {
            clickHandler(sortingOrder, search.toLowerCase());
          }}
        />
        <div className="pagination">
          <button onClick={() => setPage(0)} disabled={!page} title="first">
            {'<<<'}
          </button>
          <button
            onClick={() => setPage((page) => page - 1)}
            disabled={!page}
            title="previous"
          >
            {'<'}
          </button>

          <div className="page-number">
            {page + 1} / {lastPage + 1}
          </div>
          <button
            onClick={() => setPage((page) => page + 1)}
            title="next"
            disabled={page === lastPage}
          >
            {'>'}
          </button>
          <button
            onClick={() => setPage((page) => lastPage)}
            title="last"
            disabled={page === lastPage}
          >
            {'>>>'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageTable;
