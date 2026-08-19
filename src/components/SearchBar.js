import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = "Bạn muốn tìm kiếm gì?", onSearch, initialValue = "" }) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                <Search className="h-6 w-6 text-pewter group-focus-within:text-ember-orange transition-colors" />
            </div>
            
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-[60px] pr-[140px] py-[18px] text-left rounded-full border-0 bg-canvas-white text-[16px] text-graphite placeholder:text-pewter focus:outline-none focus:ring-4 focus:ring-ember-orange/20 transition-all shadow-lg hover:shadow-xl"
                placeholder={placeholder}
            />
            
            <button
                type="submit"
                className="absolute inset-y-2 right-2 px-8 bg-ember-orange hover:opacity-90 text-canvas-white font-medium text-[16px] rounded-full transition-opacity shadow-sm"
            >
                Tìm kiếm
            </button>
        </form>
    );
};

export default SearchBar;
