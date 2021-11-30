function Navigator({ tab, update }) {
  return (
    <div class="navigator">
      <div class="tabs">
        <input type="radio" id="radio-1" onClick={() => update('Overview')} />
        <label class="tab" for="radio-1">
          Overview
        </label>
        <input type="radio" id="radio-2" onClick={() => update('Details')} />
        <label class="tab" for="radio-2">
          Messages
        </label>
        <span
          style={{
            transform: `translateX(${tab === 'Overview' ? '-50%' : '50%'})`,
          }}
          class="glider"
          onClick={() => update(tab === 'Overview' ? 'Details' : 'Overview')}
        >
          {tab}
        </span>
      </div>
    </div>
  );
}

export default Navigator;
