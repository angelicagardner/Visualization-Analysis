import React, { useState } from 'react';
import Plot from 'react-plotly.js';

const mockData = [
  {
    id: 1,
    label: 'Cluster 0',
    color: 165,
    keywords: [
      { keyword: 'repair', weight: 455 },
      { keyword: 'failure', weight: 455 },
      { keyword: 'help', weight: 455 },
      { keyword: 'damages', weight: 12 },
    ],
  },
  {
    id: 2,
    label: 'Cluster 1',
    color: 200,
    keywords: [
      { keyword: 'nuclear', weight: 768 },
      { keyword: 'hospital', weight: 492 },
      { keyword: 'energy', weight: 484 },
      { keyword: 'there', weight: 421 },
    ],
  },
  {
    id: 3,
    label: 'Cluster 2',
    color: 45,
    keywords: [
      { keyword: 'fatalities', weight: 982 },
      { keyword: 'news', weight: 752 },
      { keyword: 'days', weight: 602 },
    ],
  },
  {
    id: 4,
    label: 'Cluster 3',
    color: 120,
    keywords: [
      { keyword: 'food', weight: 719 },
      { keyword: 'water', weight: 602 },
      { keyword: 'away', weight: 538 },
      { keyword: 'bad', weight: 493 },
    ],
  },
  {
    id: 5,
    label: 'Cluster 4',
    color: 260,
    keywords: [
      { keyword: 'rumble', weight: 708 },
      { keyword: 'water', weight: 620 },
      { keyword: 'collapsed', weight: 505 },
      { keyword: 'building', weight: 498 },
    ],
  },
  {
    id: 6,
    label: 'Cluster 5',
    color: 334,
    keywords: [
      { keyword: 'water', weight: 592 },
      { keyword: 'run', weight: 519 },
      { keyword: 'talk', weight: 465 },
      { keyword: 'stocked', weight: 420 },
    ],
  },
  {
    id: 29,
    label: 'Cluster 6',
    color: 334,
    keywords: [
      { keyword: 'closed', weight: 592 },
      { keyword: 'bridge', weight: 519 },
      { keyword: 'routes', weight: 465 },
      { keyword: 'safety', weight: 420 },
    ],
  },
  {
    id: 112,
    label: 'Cluster 7',
    color: 334,
    keywords: [
      { keyword: 'nuclear', weight: 592 },
      { keyword: 'power', weight: 519 },
      { keyword: 'hss', weight: 465 },
      { keyword: 'plant', weight: 420 },
    ],
  },
  {
    id: 75,
    label: 'Cluster 8',
    color: 334,
    keywords: [
      { keyword: 'service', weight: 592 },
      { keyword: 'look', weight: 519 },
      { keyword: 'annoyed', weight: 465 },
      { keyword: 'years', weight: 420 },
    ],
  },
];

function SunBurst({ filter, updateFilter }) {
  const prepare = () => ({
    data: {
      type: 'sunburst',
      ids: [
        ...mockData.map((m) => m.label),
        ...mockData.reduce(
          (a, c) => [
            ...a,
            ...c.keywords.map((k) => c.label + ' - ' + k.keyword),
          ],
          []
        ),
      ],
      labels: [
        ...mockData.map((m) => m.label),
        ...mockData.reduce(
          (a, c) => [...a, ...c.keywords.map((k) => k.keyword)],
          []
        ),
      ],
      parents: [
        ...mockData.map((m) => ''),
        ...mockData.reduce(
          (a, c) => [...a, ...c.keywords.map((k) => c.label)],
          []
        ),
      ],
      values: [
        ...mockData.map((m) => 1),
        ...mockData.reduce(
          (a, c) => [...a, ...c.keywords.map((k) => k.weight)],
          []
        ),
      ],
      sort: false,
    },
    colors: mockData.map((m) => m.color),
  });

  const [clusters, updateClusters] = useState(prepare());

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
            color: clusters.colors[clusters.data.ids.indexOf(id)],
          });
        }
      }
    }, 750);
  };

  return (
    <Plot
      data={[clusters.data]}
      layout={{
        sunburstcolorway: clusters.colors.map((m) => `hsl(${m},100%,60%)`),
        paper_bgcolor: 'transparent',
        margin: { pad: 0, t: 10, b: 10, r: 0, l: 0 },
      }}
      onClick={clickHandler}
    />
  );
}

export default SunBurst;
