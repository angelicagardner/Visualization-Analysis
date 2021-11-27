import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function SunBurst({ filters, data, update }) {
  const [plotData, updatePlotData] = useState([
    {
      type: 'sunburst',
      ...data,
      marker: { line: { width: 2 } },
      branchvalues: 'total',
      insidetextorientation: 'radial',
    },
  ]);

  useEffect(() => {
    updatePlotData([
      {
        type: 'sunburst',
        ...data,
        marker: { line: { width: 2 } },
        branchvalues: 'total',
        insidetextorientation: 'radial',
      },
    ]);
  }, [data]);

  const clickHandler = (e) => {
    const { currentPath, label, id } = e.points[0];

    setTimeout(() => {
      if (currentPath === undefined || id === filters.cluster.id) {
        // Unset the filter
        update(undefined, undefined);
      } else {
        if (currentPath === '/') {
          // Set new filter
          update(label, id);
        }
      }
    }, 1000);
  };

  return (
    <Plot
      data={plotData}
      layout={{
        // sunburstcolorway: dimensions.colors.map((m) => `hsl(${m},100%,60%)`),
        paper_bgcolor: 'transparent',
        margin: { pad: 0, t: 10, b: 10, r: 0, l: 0 },
      }}
      onClick={clickHandler}
    />
  );
}

export default SunBurst;
