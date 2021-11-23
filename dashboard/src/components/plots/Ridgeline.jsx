import Plot from 'react-plotly.js';
import { DataService } from '../../services/data-service';

function RidgeLine({ data }) {
  const keywords = DataService.getKeywordWeights(data);
  const traces = Object.keys(keywords).map((i) => ({
    points: 'none',
    scalemode: 'width',
    side: 'positive',
    type: 'violin',
    y0: i,
    x: keywords[i],
    orientation: 'h',
  }));

  return (
    <div className="ridgeLine">
      <Plot
        data={traces}
        layout={{
          yaxis: {
            showgrid: true,
            zeroline: false,
            gridcolor: '#0003',
          },
          xaxis: {
            showgrid: true,
            zeroline: false,
            gridcolor: '#0003',
            autorange: true,
            autotick: true,
          },
          autosize: true,
          responsive: true,
          margin: { l: 100, r: 25, b: 25, t: 50, pad: 5 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
        }}
      />
    </div>
  );
}

export default RidgeLine;
