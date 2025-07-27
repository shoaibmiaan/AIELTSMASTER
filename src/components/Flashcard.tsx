import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const Flashcard = ({
  front,
  back,
  isFlipped,
  onFlip,
}: {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}) => {
  const { theme } = useTheme(); // Access the current theme

  return (
    <div
      className="w-full max-w-md mx-auto h-64 cursor-pointer perspective-1000"
      onClick={onFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front side of the card */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-xl shadow-lg p-6 flex items-center justify-center border ${
            theme === 'dark'
              ? 'bg-gray-800 text-white border-gray-700'
              : 'bg-white text-gray-900 border-gray-200'
          }`}
        >
          <h3 className="text-2xl font-bold text-center">
            {front}
          </h3>
        </div>

        {/* Back side of the card */}
        <div
          className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-lg p-6 flex items-center justify-center border ${
            theme === 'dark'
              ? 'bg-indigo-900/20 text-indigo-200 border-indigo-800'
              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
          }`}
        >
          <p className="text-xl text-center">
            {back}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
