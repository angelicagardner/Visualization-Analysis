import Plot from 'react-plotly.js';

const trace1 = {
  points: 'none',
  side: 'positive',
  type: 'violin',
  scalemode: 'count',
  y0: 'Thursday',
  x: [
    10.07, 34.83, 10.65, 12.43, 24.08, 13.42, 12.48, 29.8, 14.52, 11.38, 20.27,
    11.17, 12.26, 18.26, 8.51, 10.33, 14.15, 13.16, 17.47, 27.05, 16.43, 8.35,
    18.64, 11.87, 19.81, 43.11, 13.0, 12.74, 13.0, 16.4, 16.47, 18.78,
  ],
  orientation: 'h',
};
const trace3 = {
  points: 'none',
  scalemode: 'count',
  side: 'positive',
  type: 'violin',
  y0: 'Friday',
  x: [5.75, 16.32, 22.75, 11.35, 15.38, 13.42, 15.98, 16.27, 10.09],
  orientation: 'h',
};
const trace5 = {
  points: 'none',
  scalemode: 'count',
  side: 'positive',
  type: 'violin',
  span: [0],
  y0: 'Saturday',
  x: [
    20.29, 15.77, 19.65, 15.06, 20.69, 16.93, 26.41, 16.45, 3.07, 17.07, 26.86,
    25.28, 14.73, 44.3, 22.42, 20.92, 14.31, 7.25, 10.59, 10.63, 12.76, 13.27,
    28.17, 12.9, 30.14, 22.12, 35.83, 27.18,
  ],
  orientation: 'h',
};
const trace6 = {
  points: 'none',
  scalemode: 'count',
  side: 'positive',
  type: 'violin',
  span: [0],
  y0: 'Sunday',
  x: [
    16.99, 24.59, 35.26, 14.83, 10.33, 16.97, 10.29, 34.81, 25.71, 17.31, 29.85,
    25.0, 13.39, 16.21, 17.51, 9.6, 20.9, 18.15,
  ],
  orientation: 'h',
};

const data = [trace1, trace3, trace5, trace6];

function RidgeLine() {
  return (
    <div className="ridgeLine">
      <Plot
        data={data}
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
