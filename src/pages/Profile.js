import React from 'react';
import HomeLayout from '../layouts/HomeLayout';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  const userInfo = user || {};
  if (user.role == "ADMIN") {
    userInfo.role = "Admin";
  }
  if (user.role == "STAFF") {
    userInfo.role = "Nhân viên";
  }
  if (user.role == "CUSTOMER") {
    userInfo.role = "Khách hàng";
  }

  return (
    <HomeLayout>
      <div className="bg-canvas-white font-sans text-slate-dark selection:bg-ember-orange selection:text-canvas-white pb-60">
        <main className="max-w-5xl mx-auto px-24 py-60 md:px-48">
          {/* Profile Hero */}
          <section className="flex flex-col md:flex-row items-start md:items-center gap-40 mb-60 md:mb-80">
            <div className="relative shrink-0">
              <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>

            </div>

            <div className="flex-1">
              <div className="flex items-center gap-16 mb-8">
                <h2 className="text-heading md:text-heading-lg font-extrabold text-carbon-black tracking-tight">{userInfo?.name || 'Đang tải...'}</h2>
                {userInfo?.role && (
                  <span className="px-12 py-4 bg-paper rounded-badges text-caption font-bold text-slate-dark tracking-wider">{userInfo.role}</span>
                )}
              </div>
              <p className="text-subheading text-stone mb-24 font-regular">Thành viên của hệ thống</p>

              <div className="flex flex-col md:flex-row gap-24 md:gap-40 mb-36">
                <div className="flex flex-col">
                  <span className="text-body-sm text-pewter font-medium uppercase tracking-widest mb-4">Email</span>
                  <span className="text-[20px] font-bold text-carbon-black">{userInfo?.email || 'Đang tải...'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-body-sm text-pewter font-medium uppercase tracking-widest mb-4">Số điện thoại</span>
                  <span className="text-[20px] font-bold text-carbon-black">{userInfo?.phone || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-16">
                <button className="px-32 py-12 bg-carbon-black text-canvas-white rounded-buttons font-medium hover:bg-slate-dark transition-colors duration-200">
                  Cập nhật thông tin
                </button>
                <button className="px-32 py-12 bg-canvas-white text-carbon-black border border-fog rounded-buttons font-medium hover:border-stone transition-colors duration-200">
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </section>

          {/* Tabs (Giao diện giữ nguyên phong cách landing page) */}
          <nav className="flex gap-40 border-b border-paper mb-48 overflow-x-auto scrollbar-hide">
            <button className="text-body font-bold text-carbon-black border-b-2 border-carbon-black pb-12 whitespace-nowrap">
              Hoạt động gần đây
            </button>
            <button className="text-body font-medium text-pewter hover:text-stone pb-12 whitespace-nowrap transition-colors duration-200">
              Chuyến đi của tôi
            </button>
            <button className="text-body font-medium text-pewter hover:text-stone pb-12 whitespace-nowrap transition-colors duration-200">
              Yêu thích
            </button>
          </nav>

          {/* Activity / Portfolio Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-36">
            {/* Card 1 */}
            <article className="group cursor-pointer flex flex-col">
              <div className="overflow-hidden rounded-cards mb-20 shadow-md bg-pearl h-208 relative">
                <img
                  src="https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=800&q=80"
                  alt="Chuyến đi Phú Quốc"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
              </div>
              <div className="flex justify-between items-start">
                <div className="pr-16">
                  <h3 className="text-subheading font-bold text-carbon-black mb-4 group-hover:text-ember-orange transition-colors duration-200">Kỳ nghỉ tại Phú Quốc</h3>
                  <p className="text-body text-stone">Chuyến đi gia đình đáng nhớ vào tháng trước.</p>
                </div>
                <span className="shrink-0 px-16 py-8 bg-paper rounded-badges text-caption font-semibold text-slate-dark">Hoàn thành</span>
              </div>
            </article>

            {/* Card 2 */}
            <article className="group cursor-pointer flex flex-col">
              <div className="overflow-hidden rounded-cards mb-20 shadow-md bg-pearl h-208 relative">
                <img
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80"
                  alt="Chuyến đi Hội An"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
              </div>
              <div className="flex justify-between items-start">
                <div className="pr-16">
                  <h3 className="text-subheading font-bold text-carbon-black mb-4 group-hover:text-ember-orange transition-colors duration-200">Khám phá Hội An</h3>
                  <p className="text-body text-stone">Lịch trình đã lên cho chuyến đi cuối tuần tới.</p>
                </div>
                <span className="shrink-0 px-16 py-8 bg-ember-orange/10 text-ember-orange rounded-badges text-caption font-semibold">Sắp tới</span>
              </div>
            </article>
          </section>
        </main>
      </div>
    </HomeLayout>
  );
};

export default Profile;
