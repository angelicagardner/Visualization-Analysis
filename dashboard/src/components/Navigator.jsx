function Navigator({ tab, update }) {
  return (
    <div className="navigator">
      <div className="tabs">
        <input type="radio" id="radio-1" onClick={() => update('Overview')} />
        <label className="tab" htmlFor="radio-1">
          Overview
        </label>
        <input type="radio" id="radio-2" onClick={() => update('Details')} />
        <label className="tab" htmlFor="radio-2">
          Messages
        </label>
        <span
          style={{
            transform: `translateX(${tab === 'Overview' ? '0' : '100%'})`,
          }}
          className="glider"
          onClick={() => update(tab === 'Overview' ? 'Details' : 'Overview')}
        >
          {tab}
        </span>
      </div>
    </div>
  );
}

export default Navigator;
