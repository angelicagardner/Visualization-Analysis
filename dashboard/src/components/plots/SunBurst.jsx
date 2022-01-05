import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import { ColorService } from '../../services/color-service';

function SunBurst({ filters, data, update }) {
  const parent = useRef(null);
  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([
          parent?.current?.clientWidth ?? 0,
          parent?.current?.clientHeight ?? 0,
        ]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  const [plotData, updatePlotData] = useState([
    {
      type: 'sunburst',
      ...data,
      branchvalues: 'total',
      insidetextorientation: 'radial',
    },
  ]);

  useEffect(() => {
    updatePlotData([
      {
        type: 'sunburst',
        ...data,
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

  const [width, height] = useWindowSize();

  return (
    <div style={{ width: '100%', height: '100%' }} ref={parent}>
      <Plot
        data={plotData}
        layout={{
          sunburstcolorway: ColorService.getClusterColors(),
          paper_bgcolor: 'transparent',
          margin: { pad: 5, t: 5, b: 15, r: 0, l: 0 },
          font: {
            size: 14,
          },
          width,
          height,
        }}
        onClick={clickHandler}
      />
    </div>
  );
}

export default SunBurst;
