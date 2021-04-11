import React, { useEffect } from 'react';

function Index({ user, userFollowStats }) {
  useEffect(() => {
    document.title = `Welcome, ${user.name}`;
  }, []);

  return <div>Home</div>;
}

export default Index;
