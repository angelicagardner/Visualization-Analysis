import { useState } from 'react';
import Plot from 'react-plotly.js';
import Moment from 'moment';

function TimeLine({ update, timeRange, location, data, cluster }) {
  const [range, setRange] = useState([]);

  const updateHandler = (e) => {
    if (e['xaxis.range[0]'] && e['xaxis.range[1]']) {
      update(
        Moment(e['xaxis.range[0]']).format('YYYY-MM-DD HH:MM:ss'),
        Moment(e['xaxis.range[1]']).format('YYYY-MM-DD HH:MM:ss')
      );
    }
    setRange([e['xaxis.range[0]'], e['xaxis.range[1]']]);
  };

  const plotData = [
    {
      x: data.main,
      name: 'Messages',
      autobins: true,
      histnorm: 'count',
      marker: {
        color: '#FFF',
        line: {
          color: '#FFF',
          width: 1,
        },
      },
      opacity: 0.75,
      type: 'histogram',
    },
  ];

  if (data?.cluster) {
    plotData.push({
      x: data.cluster,
      name: cluster.name,
      histnorm: 'count',
      marker: {
        color: '#F25',
        line: {
          color: '#F25',
          width: 1,
        },
      },
      opacity: 0.75,
      type: 'histogram',
    });
  }

  if (data?.location) {
    plotData.push({
      x: data.location,
      name: location.name,
      histnorm: 'count',
      marker: {
        color: '#3E5',
        line: {
          color: '#3E5',
          width: 1,
        },
      },
      opacity: 0.75,
      type: 'histogram',
    });
  }

  if (data?.full) {
    plotData.push({
      x: data.full,
      name: `${location.name} & ${location.cluster}`,
      histnorm: 'count',
      marker: {
        color: '#37D',
        line: {
          color: '#37D',
          width: 1,
        },
      },
      opacity: 0.75,
      type: 'histogram',
    });
  }

  return (
    <Plot
      data={plotData}
      // data={[{}]}
      layout={{
        bargap: 0.02,
        bargroupgap: 0.2,
        barmode: 'group',
        title: {
          text: 'Message Distribution',
        },
        margin: { l: 30, r: 30, t: 45, b: 45 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        yaxis: {
          gridcolor: 'rgba(255,255,255,0.25)',
          gridwidth: 1,
          zerolinecolor: 'rgba(255,255,255,0.5)',
          zerolinewidth: 1,
        },
        xaxis: {
          gridcolor: 'rgba(255,255,255,0.25)',
          gridwidth: 1,
          zerolinecolor: 'rgba(255,255,255,0.5)',
          zerolinewidth: 1,
          range,
        },
        font: { color: 'white' },
        autosize: true,
        responsive: true,
        showlegend: true,
        legend: {
          orientation: 'h',
          y: 100,
        },
      }}
      style={{
        margin: 0,
        padding: 0,
        height: '20vh',
      }}
      onRelayout={updateHandler}
      onDoubleClick={() => update(undefined, undefined)}
    />
  );
}

export default TimeLine;
