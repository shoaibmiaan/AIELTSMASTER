import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
