import React from 'react';

const ButtonField = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'outline' 
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = "w-full font-medium text-body py-[14px] px-6 rounded-buttons flex justify-center items-center transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-ember-orange text-canvas-white shadow-md hover:opacity-90",
    outline: "bg-pearl hover:bg-cloud/30 text-slate-dark",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonField;
