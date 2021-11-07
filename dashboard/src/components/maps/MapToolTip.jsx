import React, { useRef } from 'react';

function MapToolTip({ children, title, position, ref }) {
  const tooltipRef = useRef();
  console.log(tooltipRef);
  return (
    <div
      ref={tooltipRef}
      className="overlay_arrow"
      style={{
        left: position.left - (tooltipRef?.current?.clientWidth ?? 0) / 2,
        top: position.top - (tooltipRef?.current?.clientHeight ?? 0) - 25,
      }}
    >
      <div className="overlay_inner">
        <h1 className="overlay_title">{title}</h1>
        <div className="overlay_container">{children}</div>
      </div>
    </div>
  );
}

export default MapToolTip;
