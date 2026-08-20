import React from 'react';

const SelectField = ({ options = [], value, onChange, className = '' }) => {
    return (
        <div className={`relative w-full sm:w-[170px] ${className}`}>
            <select 
                value={value}
                onChange={onChange}
                className="block w-full appearance-none bg-pearl border border-transparent text-slate-dark py-2.5 px-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-ember-orange/50 focus:bg-canvas-white text-[13px] font-medium cursor-pointer transition-all"
            >
                {options.map((opt, index) => (
                    <option key={index} value={opt.value !== undefined ? opt.value : opt.label}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-pewter">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default SelectField;