import React, { useState } from 'react';
import Plot from 'react-plotly.js';

const mockData = [
  {
    id: 1,
    label: 'Cluster 2',
    color: 165,
    keywords: [
      { keyword: "n't", weight: 1268 },
      { keyword: 'did', weight: 613 },
      { keyword: 'like', weight: 568 },
      { keyword: 'just', weight: 498 },
      { keyword: 'time', weight: 442 },
      { keyword: 'good', weight: 424 },
    ],
  },
  {
    id: 2,
    label: 'Cluster 1',
    color: 200,
    keywords: [
      { keyword: "n't", weight: 768 },
      { keyword: 'water', weight: 492 },
      { keyword: 'do', weight: 484 },
      { keyword: 'day', weight: 421 },
      { keyword: 'good', weight: 414 },
      { keyword: 'make', weight: 399 },
      { keyword: 'just', weight: 389 },
    ],
  },
  {
    id: 3,
    label: 'Cluster 4',
    color: 45,
    keywords: [
      { keyword: 'power', weight: 982 },
      { keyword: 'nuclear', weight: 752 },
      { keyword: 'help', weight: 602 },
      { keyword: 'plant', weight: 507 },
      { keyword: 'just', weight: 498 },
      { keyword: 'build', weight: 477 },
    ],
  },
  {
    id: 4,
    label: 'Cluster 5',
    color: 120,
    keywords: [
      { keyword: 'work', weight: 719 },
      { keyword: "n't", weight: 602 },
      { keyword: 'i', weight: 538 },
      { keyword: 'do', weight: 493 },
      { keyword: 'come', weight: 458 },
      { keyword: 'think', weight: 457 },
    ],
  },
  {
    id: 5,
    label: 'Cluster 0',
    color: 260,
    keywords: [
      { keyword: 'rumbl', weight: 708 },
      { keyword: 'bridg', weight: 620 },
      { keyword: 'use', weight: 505 },
      { keyword: 'damag', weight: 498 },
      { keyword: 'repair', weight: 479 },
      { keyword: 'hous', weight: 424 },
      { keyword: 'inspect', weight: 407 },
    ],
  },
  {
    id: 6,
    label: 'Cluster 3',
    color: 334,
    keywords: [
      { keyword: "n't", weight: 592 },
      { keyword: 'say', weight: 519 },
      { keyword: 'fatal', weight: 465 },
      { keyword: 'it', weight: 420 },
      { keyword: 'friend', weight: 411 },
      { keyword: 'i', weight: 394 },
    ],
  },
];

function SunBurst({ filter, updateFilter }) {
  const prepare = (data) => ({
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
        autosize: true,
        responsive: true,
        margin: { l: 50, r: 50, b: 50, t: 50 },
        sunburstcolorway: clusters.colors.map((m) => `hsl(${m},100%,60%)`),
        paper_bgcolor: 'transparent',
      }}
      onClick={clickHandler}
    />
  );
}

export default SunBurst;
