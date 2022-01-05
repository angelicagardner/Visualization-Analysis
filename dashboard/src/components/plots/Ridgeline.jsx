import { useLayoutEffect, useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import { DataService } from '../../services/data-service';

function RidgeLine({ data }) {
  const parent = useRef(null);
  const keywords = DataService.getKeywordWeights(data);
  const traces = Object.keys(keywords)
    .map((i) => ({
      points: false,
      scalemode: 'width',
      side: 'positive',
      type: 'violin',
      y0: i,
      x: keywords[i],
      orientation: 'h',
      showlegend: false,
      width: 1.5,
      hoverinfo: 'skip',
      spanmode: 'soft',
      marker: {
        color: '#333',
      },
      meanline: {
        visible: true,
      },
      box: {
        visible: true,
      },
    }))
    .filter((v) => v.x.length > 3) // remove occurrence less than 3
    .sort((a, b) => b.x.length - a.x.length) // Sort based on number of values
    .slice(0, 10); // Show only the first 10

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
  const [width, height] = useWindowSize();

  return (
    <div className="ridgeLine" ref={parent}>
      <Plot
        data={traces}
        layout={{
          yaxis: {
            showgrid: true,
            zeroline: false,
            gridcolor: '#0002',
          },
          xaxis: {
            showgrid: true,
            zeroline: false,
            gridcolor: '#0002',
            autorange: true,
            autotick: true,
          },
          autosize: true,
          responsive: true,
          margin: { l: 100, r: 45, b: 50, t: 5, pad: 10 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          height,
          width,
        }}
      />
    </div>
  );
}

export default RidgeLine;
