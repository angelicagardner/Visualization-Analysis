import React, { useState } from 'react';
import TimeLine from './plots/TimeLine';
import WordCloud from './plots/WordCloud';
import SunBurst from './plots/SunBurst';
import CustomMap from './maps/CustomMap';

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
        <div className="control">
          <div className="word-clouds">
            <WordCloud />
            {/* <WordCloud /> */}
          </div>
          <SunBurst
            timeRange={timeRange}
            location={selectedLocation}
            updateFilter={setSelectedFilter}
            filter={selectedFilter}
          />
        </div>
        <div className="visualization">
          <CustomMap
            timeRange={timeRange}
            filter={selectedFilter}
            selected={selectedLocation}
            updateLocation={setSelectedLocation}
          />
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