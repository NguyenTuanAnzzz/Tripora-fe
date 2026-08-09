import React, { useState } from 'react';

const InputField = ({ label, type = "text", id, placeholder, icon, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleIconClick = () => {
    if (isPassword) {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={id} className="block text-body-sm font-medium text-slate-dark mb-2">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          type={inputType}
          id={id}
          className={`w-full bg-pearl border ${error ? 'border-ember-orange focus:border-ember-orange' : 'border-paper focus:border-mist'} rounded-cards px-6 py-4 text-body text-graphite placeholder:text-pewter focus:outline-none transition-colors duration-200 shadow-none`}
          placeholder={placeholder}
          {...props}
        />
        {(icon || isPassword) && (
          <div 
            className={`absolute inset-y-0 right-0 pr-6 flex items-center text-pewter hover:text-slate-dark transition-colors duration-200 ${isPassword ? 'cursor-pointer' : ''}`}
            onClick={isPassword ? handleIconClick : undefined}
          >
            {isPassword ? (
              showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )
            ) : (
              icon
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-body-sm text-ember-orange">{error}</p>
      )}
    </div>
  );
};

export default InputField;
