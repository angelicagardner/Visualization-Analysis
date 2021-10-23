import React from 'react';
import TimeLine from './plots/TimeLine';
import WordCloud from './plots/WordCloud';
import SunBurst from './plots/SunBurst';
import { ReactComponent as StHimarkMap } from './maps/stHimark.svg';

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
        <div className="visualization">
          <StHimarkMap />
        </div>
      </div>
      <div className="timeline">
        <TimeLine />
      </div>
    </div>
  );
}

export default Dashboard;
