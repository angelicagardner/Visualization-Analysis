import React from 'react';
import Plot from 'react-plotly.js';

function SunBurst() {
  return (
      <Plot
        data={[
          {
            type: 'sunburst',
            ids: [
              'North America',
              'Europe',
              'Australia',
              'North America - Football',
              'Soccer',
              'North America - Rugby',
              'Europe - Football',
              'Rugby',
              'Europe - American Football',
              'Australia - Football',
              'Association',
              'Australian Rules',
              'Autstralia - American Football',
              'Australia - Rugby',
              'Rugby League',
              'Rugby Union',
            ],
            labels: [
              'North<br>America',
              'Europe',
              'Australia',
              'Football',
              'Soccer',
              'Rugby',
              'Football',
              'Rugby',
              'American<br>Football',
              'Football',
              'Association',
              'Australian<br>Rules',
              'American<br>Football',
              'Rugby',
              'Rugby<br>League',
              'Rugby<br>Union',
            ],
            parents: [
              '',
              '',
              '',
              'North America',
              'North America',
              'North America',
              'Europe',
              'Europe',
              'Europe',
              'Australia',
              'Australia - Football',
              'Australia - Football',
              'Australia - Football',
              'Australia - Football',
              'Australia - Rugby',
              'Australia - Rugby',
            ],
            outsidetextfont: { size: 20, color: '#377eb8' },
            // leaf: {opacity: 0.4},
            marker: { line: { width: 2 } },
          },
        ]}
        config={{
          responsive: true,
        }}
        layout={{
          autosize: true,
          margin: { l: 0, r: 0, b: 0, t: 0 },
          sunburstcolorway: ['#636efa', '#ef553b', '#00cc96'],
          paper_bgcolor:'transparent'
        }}
        style={{}}
      />
  );
}

export default SunBurst;
