import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileComponent = () => {
  const { user } = useAuth();

  return (
    <div>
    </div>
  );
};

export default ProfileComponent;
