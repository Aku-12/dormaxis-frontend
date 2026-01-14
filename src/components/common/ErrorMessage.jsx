import React from 'react';

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 text-lg">Error: {error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 bg-[#4A90B8] text-white rounded-lg hover:bg-[#3A7A9A]"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
