import React from 'react';
import HomeLayout from '../layouts/HomeLayout';
import { Link } from 'react-router-dom';

// Dummy data for tours based on design.md and Home.js style
const tours = [
    {
        id: 1,
        title: "Tour Phú Quốc 3 Ngày 2 Đêm",
        destination: "Phú Quốc, Việt Nam",
        price: "3,500,000",
        originalPrice: "4,500,000",
        discount: "-25%",
        image: "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=800&q=80",
        duration: "3 Ngày 2 Đêm",
        tags: ["Nổi bật", "Biển đảo"]
    },
    {
        id: 2,
        title: "Khám phá Hội An - Đà Nẵng",
        destination: "Hội An, Việt Nam",
        price: "2,800,000",
        originalPrice: null,
        discount: null,
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
        duration: "4 Ngày 3 Đêm",
        tags: ["Văn hóa", "Di sản"]
    },
    {
        id: 3,
        title: "Tour Sapa Săn Mây Trọn Gói",
        destination: "Sapa, Việt Nam",
        price: "2,100,000",
        originalPrice: "2,400,000",
        discount: "-15%",
        image: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?auto=format&fit=crop&w=800&q=80",
        duration: "2 Ngày 1 Đêm",
        tags: ["Khám phá", "Núi rừng"]
    }
];

const TourList = () => {
    return (
        <HomeLayout>
            <div className="bg-canvas-white font-sans text-slate-dark selection:bg-ember-orange selection:text-canvas-white pb-60">
                {/* Hero Banner for Tour List */}
                <section className="w-full bg-carbon-black py-40 mb-40 text-center">
                    <h1 className="text-heading-lg font-light text-canvas-white mb-4">Khám phá Tour</h1>
                    <p className="text-[18px] font-regular text-canvas-white/90 max-w-2xl mx-auto">
                        Lựa chọn hành trình tuyệt vời tiếp theo của bạn từ danh sách các tour hấp dẫn nhất.
                    </p>
                </section>

                <main className="max-w-[1200px] mx-auto px-6">
                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="flex gap-4 w-full md:w-auto overflow-x-auto scrollbar-hide pb-2">
                            <button className="px-6 py-2 bg-ember-orange text-canvas-white rounded-buttons text-body font-medium shrink-0">Tất cả</button>
                            <button className="px-6 py-2 bg-pearl text-slate-dark border border-paper rounded-buttons text-body font-medium hover:border-mist transition-colors shrink-0">Biển đảo</button>
                            <button className="px-6 py-2 bg-pearl text-slate-dark border border-paper rounded-buttons text-body font-medium hover:border-mist transition-colors shrink-0">Núi rừng</button>
                            <button className="px-6 py-2 bg-pearl text-slate-dark border border-paper rounded-buttons text-body font-medium hover:border-mist transition-colors shrink-0">Văn hóa</button>
                        </div>
                        <div className="w-full md:w-[300px] relative">
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm tour..." 
                                className="w-full bg-pearl border border-paper rounded-buttons py-3 px-6 text-body text-slate-dark outline-none focus:border-ember-orange transition-colors"
                            />
                            <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-pewter" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    {/* Tours Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map(tour => (
                            <Link to={`/tours/${tour.id}`} key={tour.id} className="block group">
                                <article className="bg-canvas-white border border-paper rounded-cards overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                                    <div className="relative h-[240px] p-4 pb-0">
                                        <div className="w-full h-full rounded-images overflow-hidden relative">
                                            <img 
                                                src={tour.image} 
                                                alt={tour.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                            />
                                            {tour.discount && (
                                                <div className="absolute top-3 left-3 bg-ember-orange text-canvas-white text-caption font-bold px-3 py-1 rounded-full">
                                                    {tour.discount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6 pt-4 flex flex-col flex-1">
                                        <div className="flex gap-2 mb-3 flex-wrap">
                                            {tour.tags.map(tag => (
                                                <span key={tag} className="text-caption font-medium px-3 py-1 bg-pearl border border-paper text-slate-dark rounded-badges">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-heading-sm font-medium text-graphite mb-1 line-clamp-2 group-hover:text-ember-orange transition-colors">{tour.title}</h3>
                                        <p className="text-body font-regular text-pewter mb-4 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {tour.destination}
                                        </p>
                                        
                                        <div className="mt-auto pt-4 border-t border-paper flex items-end justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-caption text-stone mb-1">{tour.duration}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-subheading font-bold text-ember-orange">{tour.price}đ</span>
                                                    {tour.originalPrice && (
                                                        <span className="text-body-sm text-steel line-through">{tour.originalPrice}đ</span>
                                                    )}
                                                </div>
                                            </div>
                                            <button className="w-10 h-10 rounded-full bg-pearl flex items-center justify-center text-slate-dark group-hover:bg-ember-orange group-hover:text-canvas-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </HomeLayout>
    );
};

export default TourList;
