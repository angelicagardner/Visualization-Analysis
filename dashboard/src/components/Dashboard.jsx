import React, { useState } from 'react';
import TimeLine from './plots/TimeLine';
import WordCloud from './plots/WordCloud';
import SunBurst from './plots/SunBurst';
import CustomMap from './maps/CustomMap';
import RidgeLine from './plots/Ridgeline';

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

  const rangeUpdateHandler = (start, end) => {
    setTimeRange({ start, end });
  };

  return (
    <div className="dashboard">
      <div className="navigation">
        <h1>Visual Explorer</h1>
      </div>
      <div className="main-container">
        <div className="tabs">
          <button>Overview</button>
          <button>Messages</button>
        </div>
        <div className="control">
          <div className="word-clouds">
            <WordCloud />
          </div>
          <div className="sunburst">
            <SunBurst
              timeRange={timeRange}
              location={selectedLocation}
              updateFilter={setSelectedFilter}
              filter={selectedFilter}
            />
          </div>
        </div>
        <div className="visualization">
          <CustomMap
            timeRange={timeRange}
            filter={selectedFilter}
            selected={selectedLocation}
            updateLocation={setSelectedLocation}
          />
          {/* <RidgeLine /> */}
        </div>
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
