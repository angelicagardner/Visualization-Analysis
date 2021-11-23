import React, { useState } from 'react';
import TimeLine from './plots/TimeLine';
import WordCloud from './plots/WordCloud';
import SunBurst from './plots/SunBurst';
import CustomMap from './maps/CustomMap';
import Details from './Details';

function Dashboard({ messages }) {
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
      left: '40vw',
      width: '60%',
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
            left: '40vw',
            width: '60%',
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
            width: '40%',
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
          <WordCloud layout={layout} data={messages} />
          <div className="sunburst" key="sunburst">
            <SunBurst
              data={messages}
              timeRange={timeRange}
              location={selectedLocation}
              filter={selectedFilter}
              updateFilter={setSelectedFilter}
            />
          </div>
        </div>

        <CustomMap
          data={messages}
          timeRange={timeRange}
          filter={selectedFilter}
          selected={selectedLocation}
          updateLocation={setSelectedLocation}
          layout={layout}
        />

        <Details layout={layout} data={messages} location={selectedLocation}/>
      </div>
      <div className="timeline">
        <TimeLine
          data={messages}
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
