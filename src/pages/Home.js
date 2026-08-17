import React, { useState, useEffect } from 'react';
import HomeLayout from '../layouts/HomeLayout';

const slides = [
    {
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
        title: "Khám phá thế giới theo cách của bạn.",
        subtitle: "Hàng ngàn điểm đến tuyệt đẹp đang chờ đón. Đặt phòng, chuyến bay và trải nghiệm một cách dễ dàng với nền tảng của chúng tôi."
    },
    {
        image: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=1200&q=80",
        title: "Hành trình ngàn dặm bắt đầu từ một bước chân.",
        subtitle: "Hãy để chúng tôi đồng hành cùng bạn trên mọi nẻo đường, mang đến những trải nghiệm không thể nào quên."
    },
    {
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
        title: "Đi để tìm lại chính mình.",
        subtitle: "Mở rộng tầm mắt và trái tim với những vùng đất mới, văn hóa mới và những con người tuyệt vời."
    }
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <HomeLayout>
            {/* Hero Banner Section */}
                <section className="w-full px-6 flex justify-center mt-4">
                    <div className="w-full max-w-[1200px] bg-carbon-black rounded-cards relative overflow-hidden flex flex-col items-center justify-center text-center h-[400px] md:h-[480px]">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                            >
                                <div 
                                    className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-[10000ms]"
                                    style={{ 
                                        backgroundImage: `url('${slide.image}')`,
                                        transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)'
                                    }}
                                ></div>
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
                                    <h1 className={`text-heading-lg font-light text-canvas-white mb-6 transition-all duration-1000 delay-300 ${
                                        index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                    }`}>
                                        {slide.title}
                                    </h1>
                                    <p className={`text-[18px] font-regular text-canvas-white/90 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${
                                        index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                    }`}>
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Search Section */}
                <section className="w-full max-w-[1200px] mx-auto px-6 mt-[24px] md:mt-[40px]">
                    <div className="bg-canvas-white border border-paper rounded-[32px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-stretch gap-3 relative z-20">
                        
                        {/* Location */}
                        <div className="flex-1 w-full bg-pearl hover:bg-paper/50 transition-colors rounded-[24px] p-4 flex items-center gap-4 cursor-text group border border-transparent hover:border-paper">
                            <div className="bg-canvas-white p-3 rounded-full shadow-sm text-ember-orange group-focus-within:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div className="flex-1">
                                <label className="block text-caption font-bold text-slate-dark uppercase tracking-wider mb-0.5">Địa điểm</label>
                                <input type="text" placeholder="Bạn muốn đi đâu?" className="w-full bg-transparent border-none text-slate-dark placeholder-pewter text-body font-medium outline-none" />
                            </div>
                        </div>
                        
                        {/* Date */}
                        <div className="flex-1 w-full bg-pearl hover:bg-paper/50 transition-colors rounded-[24px] p-4 flex items-center gap-4 cursor-text group border border-transparent hover:border-paper">
                            <div className="bg-canvas-white p-3 rounded-full shadow-sm text-ember-orange group-focus-within:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <div className="flex-1">
                                <label className="block text-caption font-bold text-slate-dark uppercase tracking-wider mb-0.5">Khởi hành</label>
                                <input type="text" placeholder="Thêm ngày" className="w-full bg-transparent border-none text-slate-dark placeholder-pewter text-body font-medium outline-none" />
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="flex-1 w-full bg-pearl hover:bg-paper/50 transition-colors rounded-[24px] p-4 flex items-center gap-4 cursor-text group border border-transparent hover:border-paper">
                            <div className="bg-canvas-white p-3 rounded-full shadow-sm text-ember-orange group-focus-within:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <div className="flex-1">
                                <label className="block text-caption font-bold text-slate-dark uppercase tracking-wider mb-0.5">Số khách</label>
                                <input type="text" placeholder="Thêm khách" className="w-full bg-transparent border-none text-slate-dark placeholder-pewter text-body font-medium outline-none" />
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="w-full md:w-auto h-full flex items-stretch pt-2 md:pt-0">
                            <button className="w-full md:w-[160px] bg-ember-orange text-canvas-white font-medium text-[18px] px-6 py-4 rounded-[24px] shadow-[0_4px_15px_rgba(255,90,47,0.3)] hover:opacity-90 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 h-full min-h-[72px]">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <span className="md:hidden lg:block">Tìm kiếm</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Trending Destinations Section */}
                <section className="w-full bg-pearl mt-[80px] py-[80px]">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="flex justify-between items-end mb-[40px]">
                            <div>
                                <h2 className="text-heading font-light text-graphite mb-2">Điểm đến thịnh hành</h2>
                                <p className="text-subheading font-regular text-slate-dark">Những địa điểm được yêu thích nhất do cộng đồng bình chọn</p>
                            </div>
                            <button className="hidden md:flex items-center gap-2 text-ember-orange font-medium text-body hover:opacity-80 transition-opacity">
                                Xem tất cả
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                            {/* Card 1 */}
                            <div className="bg-canvas-white border border-paper rounded-cards overflow-hidden flex flex-col group cursor-pointer transition-colors hover:bg-pearl">
                                <div className="p-4 pb-0">
                                    <div className="h-[240px] rounded-images overflow-hidden relative">
                                        <img src="https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=600&q=80" alt="Phú Quốc" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="p-[24px] pt-[20px]">
                                    <h3 className="text-heading-sm font-medium text-graphite mb-1">Phú Quốc</h3>
                                    <p className="text-body font-regular text-pewter mb-4">Việt Nam</p>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-transparent border border-ember-orange text-ember-orange text-caption font-medium px-[14px] py-[4px] rounded-badges">
                                            Nổi bật
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-canvas-white border border-paper rounded-cards overflow-hidden flex flex-col group cursor-pointer transition-colors hover:bg-pearl">
                                <div className="p-4 pb-0">
                                    <div className="h-[240px] rounded-images overflow-hidden relative">
                                        <img src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80" alt="Hội An" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="p-[24px] pt-[20px]">
                                    <h3 className="text-heading-sm font-medium text-graphite mb-1">Hội An</h3>
                                    <p className="text-body font-regular text-pewter mb-4">Việt Nam</p>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-transparent border border-ember-orange text-ember-orange text-caption font-medium px-[14px] py-[4px] rounded-badges">
                                            Văn hóa
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-canvas-white border border-paper rounded-cards overflow-hidden flex flex-col group cursor-pointer transition-colors hover:bg-pearl">
                                <div className="p-4 pb-0">
                                    <div className="h-[240px] rounded-images overflow-hidden relative">
                                        <img src="https://images.unsplash.com/photo-1504457047772-27faf1c00561?auto=format&fit=crop&w=600&q=80" alt="Sapa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="p-[24px] pt-[20px]">
                                    <h3 className="text-heading-sm font-medium text-graphite mb-1">Sapa</h3>
                                    <p className="text-body font-regular text-pewter mb-4">Việt Nam</p>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-transparent border border-ember-orange text-ember-orange text-caption font-medium px-[14px] py-[4px] rounded-badges">
                                            Khám phá
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Special Offers Section */}
                <section className="w-full bg-canvas-white py-[80px]">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="flex justify-between items-end mb-[40px]">
                            <div>
                                <h2 className="text-heading font-light text-graphite mb-2">Ưu đãi đặc biệt</h2>
                                <p className="text-subheading font-regular text-slate-dark">Những chương trình khuyến mãi tốt nhất dành riêng cho bạn</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                            <div className="bg-pearl border border-paper rounded-cards overflow-hidden flex flex-col md:flex-row group cursor-pointer transition-shadow hover:shadow-lg h-auto md:h-[240px]">
                                <div className="w-full md:w-[40%] h-[200px] md:h-full relative overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80" alt="Resort" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4 bg-ember-orange text-canvas-white text-caption font-bold px-3 py-1 rounded-full">
                                        -25%
                                    </div>
                                </div>
                                <div className="w-full md:w-[60%] p-6 flex flex-col justify-center">
                                    <h3 className="text-heading-sm font-medium text-graphite mb-2 group-hover:text-ember-orange transition-colors">Nghỉ dưỡng 5 sao tại Bali</h3>
                                    <p className="text-body font-regular text-pewter mb-4 line-clamp-2">Tận hưởng không gian sang trọng với mức giá ưu đãi nhất trong năm. Áp dụng cho các đặt phòng sớm.</p>
                                    <div className="mt-auto">
                                        <button className="text-ember-orange font-medium text-body hover:underline flex items-center gap-2">
                                            Khám phá ngay
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-pearl border border-paper rounded-cards overflow-hidden flex flex-col md:flex-row group cursor-pointer transition-shadow hover:shadow-lg h-auto md:h-[240px]">
                                <div className="w-full md:w-[40%] h-[200px] md:h-full relative overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=600&q=80" alt="Tour" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4 bg-ember-orange text-canvas-white text-caption font-bold px-3 py-1 rounded-full">
                                        -15%
                                    </div>
                                </div>
                                <div className="w-full md:w-[60%] p-6 flex flex-col justify-center">
                                    <h3 className="text-heading-sm font-medium text-graphite mb-2 group-hover:text-ember-orange transition-colors">Tour Châu Âu mùa thu</h3>
                                    <p className="text-body font-regular text-pewter mb-4 line-clamp-2">Hành trình khám phá vẻ đẹp lãng mạn của mùa thu Châu Âu qua Pháp, Thụy Sĩ, và Ý.</p>
                                    <div className="mt-auto">
                                        <button className="text-ember-orange font-medium text-body hover:underline flex items-center gap-2">
                                            Khám phá ngay
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="w-full bg-pearl py-[80px]">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="text-center mb-[60px]">
                            <h2 className="text-heading font-light text-graphite mb-2">Tại sao chọn chúng tôi?</h2>
                            <p className="text-subheading font-regular text-slate-dark max-w-2xl mx-auto">Chúng tôi cam kết mang đến những trải nghiệm du lịch tuyệt vời và đáng nhớ nhất.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-canvas-white rounded-full flex items-center justify-center text-ember-orange shadow-sm mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-heading-sm font-medium text-graphite mb-3">Mạng lưới toàn cầu</h3>
                                <p className="text-body font-regular text-pewter">Khám phá hàng nghìn điểm đến trên toàn thế giới với hệ thống đối tác rộng lớn của chúng tôi.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-canvas-white rounded-full flex items-center justify-center text-ember-orange shadow-sm mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <h3 className="text-heading-sm font-medium text-graphite mb-3">An toàn & Tin cậy</h3>
                                <p className="text-body font-regular text-pewter">Mọi giao dịch và thông tin cá nhân của bạn đều được bảo mật tối đa với công nghệ tiên tiến.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-canvas-white rounded-full flex items-center justify-center text-ember-orange shadow-sm mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-heading-sm font-medium text-graphite mb-3">Giá cả cạnh tranh</h3>
                                <p className="text-body font-regular text-pewter">Cam kết mức giá tốt nhất thị trường cùng nhiều ưu đãi hấp dẫn được cập nhật mỗi ngày.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="w-full bg-canvas-white py-[80px] mb-8">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="text-center mb-[60px]">
                            <h2 className="text-heading font-light text-graphite mb-2">Đánh giá từ khách hàng</h2>
                            <p className="text-subheading font-regular text-slate-dark max-w-2xl mx-auto">Hàng ngàn người đã tin tưởng và lựa chọn nền tảng của chúng tôi</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                            <div className="bg-canvas-white border border-paper rounded-cards p-8 hover:border-ember-orange/30 transition-colors">
                                <div className="flex gap-1 text-ember-orange mb-4">
                                    {[1,2,3,4,5].map(i => (
                                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <p className="text-body font-regular text-slate-dark italic mb-6">"Giao diện cực kỳ thân thiện và dễ sử dụng. Tôi đã đặt được chuyến bay và khách sạn cho kỳ nghỉ gia đình chỉ trong vòng 15 phút. Sẽ tiếp tục sử dụng!"</p>
                                <div className="flex items-center gap-4">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Minh Tuấn" className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <h4 className="text-[16px] font-medium text-graphite">Minh Tuấn</h4>
                                        <p className="text-caption text-pewter">Travel Blogger</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-canvas-white border border-paper rounded-cards p-8 hover:border-ember-orange/30 transition-colors">
                                <div className="flex gap-1 text-ember-orange mb-4">
                                    {[1,2,3,4,5].map(i => (
                                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <p className="text-body font-regular text-slate-dark italic mb-6">"Dịch vụ khách hàng tuyệt vời. Khi chuyến bay của tôi bị hoãn, đội ngũ hỗ trợ đã giúp tôi sắp xếp lại lịch trình nhanh chóng mà không mất thêm phí."</p>
                                <div className="flex items-center gap-4">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Hải Yến" className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <h4 className="text-[16px] font-medium text-graphite">Hải Yến</h4>
                                        <p className="text-caption text-pewter">Nhân viên văn phòng</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-canvas-white border border-paper rounded-cards p-8 hover:border-ember-orange/30 transition-colors">
                                <div className="flex gap-1 text-ember-orange mb-4">
                                    {[1,2,3,4,5].map(i => (
                                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <p className="text-body font-regular text-slate-dark italic mb-6">"Các gói ưu đãi thực sự hấp dẫn. Nhờ vậy tôi có thể đưa cả gia đình đi nghỉ dưỡng tại khách sạn 5 sao với mức giá thấp hơn nhiều so với dự kiến."</p>
                                <div className="flex items-center gap-4">
                                    <img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" alt="Đức Trí" className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <h4 className="text-[16px] font-medium text-graphite">Đức Trí</h4>
                                        <p className="text-caption text-pewter">Doanh nhân</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        </HomeLayout>
    );
};

export default Home;
