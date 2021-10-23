import React from 'react';
import TimeLine from './plots/TimeLine';
import WordCloud from './plots/WordCloud';
import SunBurst from './plots/SunBurst';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="navigation">
        <h1>Visual Explorer</h1>
      </div>
      <div className="main-container">
        <div className="control">
          <WordCloud />
          <SunBurst />
        </div>
        <div className="visualization"></div>
      </div>
      <div className="timeline">
        <TimeLine />
      </div>
    </div>
  );
}

export default Dashboard;
