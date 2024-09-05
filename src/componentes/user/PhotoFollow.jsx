import React, { useContext, useState } from 'react';
import '../../assetss/css/PhotoFollow.css';
import { UserContext } from '../context/UserContext';

const PhotoFollow = () => {
  const { user, loading, error } = useContext(UserContext);
  const [hoveredUserId, setHoveredUserId] = useState(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleMouseEnter = (userId) => {
    setHoveredUserId(userId);
  };

  const handleMouseLeave = () => {
    setHoveredUserId(null);
  };

  return (
    <div className="following">
      <h5>Pronosticos</h5>
      <div className="following-list">
        {user.following && user.following.length > 0 ? (
          user.following.map((follower) => (
            <div 
              key={follower.id} 
              className="following-item"
              onMouseEnter={() => handleMouseEnter(follower.id)}
              onMouseLeave={handleMouseLeave}
            >
              <img src={follower.profilePhotoUrl} alt={`${follower.firstName} ${follower.lastName}`} className="following-avatar" />
              {hoveredUserId === follower.id && (
                <span className="following-name">{follower.firstName} {follower.lastName}</span>
              )}
            </div>
          ))
        ) : (
          <p>No sigues a nadie aún.</p>
        )}
      </div>
    </div>
  );
};

export default PhotoFollow;
