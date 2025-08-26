import { classNames } from '../config';
import React, { useState } from 'react';

const Avatar = ({ name = '', avatarUrl, className }) => {
  const [imgError, setImgError] = useState(false);
  const fallbackLetter = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div
      className={classNames(
        'w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-lg font-semibold overflow-hidden text-white',
        className
      )}>
      {avatarUrl && !imgError ? (
        <img
          src={avatarUrl}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{fallbackLetter}</span>
      )}
    </div>
  );
};

export default Avatar;
