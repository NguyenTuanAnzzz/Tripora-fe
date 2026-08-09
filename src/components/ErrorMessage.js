import React from 'react';

const ErrorMessage = ({ message}) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-ember-orange p-4 rounded-md flex items-start w-full mb-6 shadow-sm transition-all duration-300">
      <div className="flex-shrink-0 mt-0.5">
        <svg className="h-5 w-5 text-ember-orange" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <p className="text-body-sm text-red-800 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
