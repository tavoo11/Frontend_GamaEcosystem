import React from 'react'
import Blog from './Blog';
import CompleteProfile from '../user/CompleteProfile';
import PhotoFollow from '../user/PhotoFollow';
import LatestUpdates from '../user/LatestUpdates';
import ActivityFeed from './ActivityFeed';
import '../../assetss/css/Principal.css';
import Superior from './Superior';

const Principal = () => {
  return (
    <div className="main-page">
      <Superior />
    <div className="main-container">
    <div className="sidebar">
      <Blog />
      <PhotoFollow />
    </div>
    <div className="activity-feed">
      <ActivityFeed />
    </div>
    <div className="right-sidebar">
      <CompleteProfile />
      <LatestUpdates />
    </div>
  </div>
  </div>
);
}

export default Principal