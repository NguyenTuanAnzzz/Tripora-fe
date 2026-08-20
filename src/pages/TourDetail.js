import React from 'react';
import HomeLayout from '../layouts/HomeLayout';
import { useParams, Link } from 'react-router-dom';

const TourDetail = () => {
    const { id } = useParams();

    // Mock data for display based on design.md
    return (
        <HomeLayout>
            <div className="bg-canvas-white font-sans text-slate-dark selection:bg-ember-orange selection:text-canvas-white pb-60">
                
                {/* Breadcrumb */}
                <div className="w-full max-w-[1200px] mx-auto px-6 py-[15px] flex items-center gap-2 text-[14px] font-regular text-pewter">
                    <Link to="/" className="hover:text-ember-orange transition-colors">Trang chủ</Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <Link to="/tours" className="hover:text-ember-orange transition-colors">Danh sách Tour</Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <span className="text-slate-dark font-medium">Chi tiết tour</span>
                </div>

                {/* Hero Banner - As specified in design.md */}
                <section className="w-full px-6 flex justify-center mb-[80px]">
                    <div className="w-full max-w-[1200px] bg-carbon-black rounded-[20px] relative overflow-hidden flex flex-col items-center justify-center text-center h-[400px] md:h-[480px]">
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-50"
                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=1200&q=80')` }}
                        ></div>
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
                            <h1 className="text-[46px] md:text-[50px] font-light text-canvas-white mb-4">Tour Phú Quốc 3 Ngày 2 Đêm</h1>
                            <p className="text-[18px] font-regular text-canvas-white max-w-2xl">
                                Trọn gói đưa đón tham quan đảo ngọc, lặn ngắm san hô bằng cano cao tốc và thưởng thức hải sản địa phương.
                            </p>
                        </div>
                    </div>
                </section>

                <main className="max-w-[1200px] mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-[24px]">
                        
                        {/* Main Content (Left Column) */}
                        <div className="flex-1">
                            {/* Tags */}
                            <div className="flex gap-2 mb-6">
                                <span className="bg-transparent border border-ember-orange text-ember-orange text-[12px] font-medium px-[14px] py-[4px] rounded-[20px]">
                                    Nổi bật
                                </span>
                                <span className="bg-transparent border border-ember-orange text-ember-orange text-[12px] font-medium px-[14px] py-[4px] rounded-[20px]">
                                    Biển đảo
                                </span>
                            </div>

                            {/* Section Heading */}
                            <h2 className="text-[40px] font-light text-graphite leading-[1.34] mb-4">Tổng quan hành trình</h2>
                            <p className="text-[18px] font-regular text-slate-dark mb-8">
                                Trải nghiệm một Phú Quốc thu nhỏ với lịch trình được tối ưu hóa cho gia đình và nhóm bạn. 
                                Chúng tôi sẽ lo toàn bộ việc di chuyển, vé tham quan và lưu trú.
                            </p>

                            <div className="bg-canvas-white border border-paper rounded-[20px] p-[40px] mb-[80px]">
                                <h3 className="text-[24px] font-medium text-graphite mb-6">Thông tin chi tiết</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                                    <div>
                                        <p className="text-[14px] font-medium text-pewter uppercase tracking-wider mb-2">Thời gian</p>
                                        <p className="text-[16px] font-regular text-slate-dark">3 Ngày 2 Đêm</p>
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-medium text-pewter uppercase tracking-wider mb-2">Phương tiện</p>
                                        <p className="text-[16px] font-regular text-slate-dark">Máy bay khứ hồi, Ô tô đời mới</p>
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-medium text-pewter uppercase tracking-wider mb-2">Khởi hành</p>
                                        <p className="text-[16px] font-regular text-slate-dark">Hàng ngày từ TP.HCM / Hà Nội</p>
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-medium text-pewter uppercase tracking-wider mb-2">Chính sách hủy</p>
                                        <p className="text-[16px] font-regular text-slate-dark text-ember-orange">Non-refundable (Xem chi tiết)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Right Column) */}
                        <div className="w-full lg:w-[400px]">
                            {/* Elevated Card with Shadow */}
                            <div className="bg-canvas-white rounded-[20px] shadow-md p-[40px] sticky top-8">
                                <div className="flex items-end gap-2 mb-6">
                                    <span className="text-[32px] font-bold text-graphite">3,500,000đ</span>
                                    <span className="text-[16px] font-regular text-pewter pb-1">/ người</span>
                                </div>
                                
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[16px] font-regular text-slate-dark">Tiền cọc (Deposit)</span>
                                        <span className="text-[16px] font-bold text-graphite">30%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[16px] font-regular text-slate-dark">Hạn thanh toán nốt</span>
                                        <span className="text-[16px] font-bold text-graphite">Trước 15 ngày</span>
                                    </div>
                                </div>

                                <button className="w-full bg-ember-orange text-canvas-white font-medium text-[16px] px-[24px] py-[14px] rounded-[30px] shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:bg-orange-600 transition-colors mb-4">
                                    Đặt tour ngay
                                </button>
                                
                                <button className="w-full bg-pearl text-slate-dark font-medium text-[16px] px-[24px] py-[14px] rounded-[30px] hover:bg-paper transition-colors">
                                    Yêu cầu tư vấn
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </HomeLayout>
    );
};

export default TourDetail;
