import React from 'react';

type LoadingProps = {
  className?: string;
};

const Loading: React.FC<LoadingProps> = ({ className = 'min-h-screen' }) => {
  const pulseStyle = (delay: string) => ({
    animationDelay: delay,
  });

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex space-x-2">
        <div
          style={pulseStyle('0.1s')}
          className="w-3 h-3 bg-gray-800 rounded-full animate-pulse"
        />
        <div
          style={pulseStyle('0.2s')}
          className="w-3 h-3 bg-gray-800 rounded-full animate-pulse"
        />
        <div
          style={pulseStyle('0.3s')}
          className="w-3 h-3 bg-gray-800 rounded-full animate-pulse"
        />
      </div>
    </div>
  );
};

export default Loading;
