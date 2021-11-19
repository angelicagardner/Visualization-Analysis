import React, { useState } from 'react';
import TimeLine from './plots/TimeLine';
import WordCloud from './plots/WordCloud';
import SunBurst from './plots/SunBurst';
import CustomMap from './maps/CustomMap';
import Details from './Details';

function Dashboard() {
  const [timeRange, setTimeRange] = useState({
    start: undefined,
    end: undefined,
  });

  const [selectedLocation, setSelectedLocation] = useState({
    name: undefined,
    id: undefined,
  });

  const [selectedFilter, setSelectedFilter] = useState({
    name: undefined,
    id: undefined,
    color: undefined,
  });

  const [layout, setLayout] = useState({
    page: 'OVERVIEW',
    map: {
      bottom: 0,
      left: '50vw',
    },
    wordCloud: {
      visible: true,
    },
    details: {
      visible: false,
    },
  });

  const rangeUpdateHandler = (start, end) => {
    setTimeRange({ start, end });
  };

  const switchTab = (name) => {
    switch (name) {
      case 'OVERVIEW':
        setLayout({
          ...layout,
          page: 'OVERVIEW',
          map: {
            bottom: 0,
            left: '50vw',
          },
          wordCloud: { visible: true },
          details: {
            visible: false,
          },
        });
        setSelectedLocation({
          start: undefined,
          end: undefined,
        });
        break;
      case 'MESSAGES':
        setLayout({
          ...layout,
          page: 'MESSAGES',
          map: {
            bottom: '35vh',
            left: '0vw',
          },
          wordCloud: { visible: false },
          details: {
            visible: true,
          },
        });
        break;
      default:
        console.log('Invalid tab name');
    }
  };

  return (
    <div className="dashboard">
      <div className="navigation">
        <h1>Visual Explorer</h1>
      </div>
      <div className="main-container">
        <div className="tabs">
          <button onClick={() => switchTab('OVERVIEW')}>Overview</button>
          <button onClick={() => switchTab('MESSAGES')}>Messages</button>
        </div>
        <div className="control">
          <WordCloud layout={layout} />
          <div className="sunburst" key="sunburst">
            <SunBurst
              timeRange={timeRange}
              location={selectedLocation}
              updateFilter={setSelectedFilter}
              filter={selectedFilter}
            />
          </div>
        </div>

        <CustomMap
          timeRange={timeRange}
          filter={selectedFilter}
          selected={selectedLocation}
          updateLocation={setSelectedLocation}
          layout={layout}
        />

        <Details layout={layout} />
      </div>
      <div className="timeline">
        <TimeLine
          callback={rangeUpdateHandler}
          filter={selectedFilter}
          timeRange={timeRange}
          location={selectedLocation}
        />
      </div>
    </div>
  );
}

export default Dashboard;
