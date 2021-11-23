import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { DataService } from '../../services/data-service';

function SunBurst({ filter, updateFilter, data, timeRange, location }) {
  const [dimensions, updateDimensions] = useState({
    ids: [],
    labels: [],
    parents: [],
    values: [],
    colors: [],
  });

  const clickHandler = (e) => {
    const { currentPath, label, id } = e.points[0];

    setTimeout(() => {
      if (currentPath === undefined || id === filter.id) {
        // Unset the filter
        updateFilter({
          name: undefined,
          id: undefined,
          color: undefined,
        });
      } else {
        if (currentPath === '/') {
          // Set new filter
          updateFilter({
            name: label,
            id,
            color: dimensions.colors[dimensions.ids.indexOf(id)],
          });
        }
      }
    }, 1000);
  };

  useEffect(() => {
    const loadData = async () => {
      let result = await DataService.getCluster(data, []);
      console.log('dsdsds');
      updateDimensions({ ...result });
    };

    loadData();
  }, [data]);

  return (
    <Plot
      data={[
        {
          type: 'sunburst',
          ...dimensions,
        },
      ]}
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
