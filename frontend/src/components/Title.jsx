import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-lg sm:text-xl text-gray-600 font-light tracking-wide">
        {text1}{' '}
        <span className="text-gray-900 font-semibold">{text2}</span>
      </h2>
      <div className="flex-1 h-[1.5px] sm:h-[2px] bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400" />
    </div>
  );
};

export default Title;
