import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = "Bạn muốn tìm kiếm gì?", onSearch, initialValue = "", className, compact = false }) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`relative group ${className !== undefined ? className : 'w-full max-w-3xl mx-auto mt-8'}`}>
            <div className={`absolute inset-y-0 left-0 flex items-center pointer-events-none z-10 ${compact ? 'pl-4' : 'pl-6'}`}>
                <Search className={`${compact ? 'h-5 w-5' : 'h-6 w-6'} text-pewter group-focus-within:text-ember-orange transition-colors`} />
            </div>
            
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full text-left rounded-full border border-paper bg-canvas-white text-graphite placeholder:text-pewter focus:outline-none focus:border-ember-orange focus:ring-4 focus:ring-ember-orange/10 transition-all ${
                    compact 
                        ? 'pl-[44px] pr-[110px] py-[12px] text-[14px] shadow-sm hover:shadow' 
                        : 'pl-[60px] pr-[140px] py-[18px] text-[16px] border-0 shadow-lg hover:shadow-xl'
                }`}
                placeholder={placeholder}
            />
            
            <button
                type="submit"
                className={`absolute bg-ember-orange hover:bg-orange-600 text-canvas-white font-medium rounded-full transition-colors shadow-sm ${
                    compact 
                        ? 'inset-y-1.5 right-1.5 px-5 text-[13px]' 
                        : 'inset-y-2 right-2 px-8 text-[16px]'
                }`}
            >
                Tìm kiếm
            </button>
        </form>
    );
};

export default SearchBar;
