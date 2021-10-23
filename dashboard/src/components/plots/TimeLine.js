import React from 'react';
import Plot from 'react-plotly.js';

function TimeLine() {
  let x1 = [];
  let x2 = [];
  let y1 = [];
  let y2 = [];
  for (let i = 1; i < 500; i++) {
    const k = Math.random();
    x1.push(k * 5);
    x2.push(k * 10);
    y1.push(k);
    y2.push(k * 2);
  }
  let trace1 = {
    x: x1,
    y: y1,
    name: 'control',
    autobinx: false,
    histnorm: 'count',
    marker: {
      color: '#FB8072',
      line: {
        color: '#FF5042',
        width: 1,
      },
    },
    opacity: 0.5,
    type: 'histogram',
    xbins: {
      end: 2.8,
      size: 0.06,
      start: 0.5,
    },
  };
  let trace2 = {
    x: x2,
    y: y2,
    autobinx: false,
    marker: {
      color: '#B3DE69',
      line: {
        color: 'rgba(100, 200, 102, 1)',
        width: 1,
      },
    },
    name: 'experimental',
    opacity: 0.75,
    type: 'histogram',
    xbins: {
      end: 4,
      size: 0.06,
      start: -3.2,
    },
  };
  let data = [trace1, trace2];
  return (
      <Plot
        data={data}
        layout={{
          responsive: true,
          showlegend:false,
          bargap: 0.02,
          bargroupgap: 0.2,
          barmode: 'stack',
          title: {
            text:'Message Distribution',
          },
          margin:{l:25, r:25, t:35, b:25},
          paper_bgcolor:'transparent',
          plot_bgcolor:'transparent',
          yaxis: {
            gridcolor: "rgba(255,255,255,0.25)",
            gridwidth: 1,
            zerolinecolor: "rgba(255,255,255,0.5)",
            zerolinewidth: 1,
          },
          xaxis: {
            gridcolor: "rgba(255,255,255,0.25)",
            gridwidth: 1,  
            zerolinecolor: "rgba(255,255,255,0.5)",
            zerolinewidth: 1, 
          },
          font:{color:'white'}
        }}
        config={{
          frameMargins:0,
        }}
        style={{
          maxHeight:250,
          margin:0,
          padding:0,
        }}
      />  );
}

export default TimeLine;
