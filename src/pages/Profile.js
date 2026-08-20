import React, { useState, useEffect, useRef } from 'react';
import HomeLayout from '../layouts/HomeLayout';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const Profile = () => {
  const { user, token, getMyProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Avatar states
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || ''
      });
      const userAvatar = user.avatar || user.picture || user.avatarUrl || user.imageUrl;
      if (userAvatar) {
        setAvatarPreview(userAvatar);
      }
    }
  }, [user]);

  const userInfo = user ? { ...user } : {};
  if (user?.role === "ADMIN") {
    userInfo.role = "Admin";
  }
  if (user?.role === "STAFF") {
    userInfo.role = "Nhân viên";
  }
  if (user?.role === "CUSTOMER") {
    userInfo.role = "Khách hàng";
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }
      
      const response = await fetch('http://localhost:8080/api/update-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // Fallback if server doesn't return JSON (e.g. 404 HTML page or 500 without JSON)
        data = { message: `Lỗi phản hồi từ server: ${response.status} ${response.statusText}` };
      }
      
      if (response.ok) {
        await getMyProfile();
        setIsEditing(false);
        alert('Cập nhật thông tin thành công!');
      } else {
        setError(data.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error("Chi tiết lỗi API update-profile:", err);
      setError(`Lỗi kết nối: ${err.message || 'Không thể kết nối đến server'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeLayout>
      <div className="bg-canvas-white font-sans text-slate-dark selection:bg-ember-orange selection:text-canvas-white pb-60">
        <main className="max-w-5xl mx-auto px-24 py-60 md:px-48">
          {/* Profile Hero */}
          <section className="flex flex-col md:flex-row items-start md:items-center gap-40 mb-60 md:mb-80">
            
            {/* Avatar Section */}
            <div className="relative shrink-0 group">
              <div 
                className={`w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden bg-pearl flex items-center justify-center border-4 border-canvas-white shadow-md relative ${isEditing ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <svg className="w-24 h-24 md:w-32 md:h-32 text-pewter" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}

                {/* Overlay on hover when editing */}
                {isEditing && (
                  <div className="absolute inset-0 bg-carbon-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="w-8 h-8 text-canvas-white mb-2" />
                    <span className="text-canvas-white text-sm font-medium">Thay đổi ảnh</span>
                  </div>
                )}
              </div>
              
              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center gap-16 mb-8">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-heading md:text-heading-lg font-extrabold text-carbon-black tracking-tight border-b-2 border-carbon-black outline-none bg-transparent"
                    placeholder="Tên của bạn"
                  />
                ) : (
                  <h2 className="text-heading md:text-heading-lg font-extrabold text-carbon-black tracking-tight">{userInfo?.name || 'Đang tải...'}</h2>
                )}
                {userInfo?.role && !isEditing && (
                  <span className="px-12 py-4 bg-paper rounded-badges text-caption font-bold text-slate-dark tracking-wider">{userInfo.role}</span>
                )}
              </div>
              <p className="text-subheading text-stone mb-24 font-regular">Thành viên của hệ thống</p>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <div className="flex flex-col md:flex-row gap-24 md:gap-40 mb-36">
                <div className="flex flex-col">
                  <span className="text-body-sm text-pewter font-medium uppercase tracking-widest mb-4">Email</span>
                  <span className="text-[20px] font-bold text-carbon-black">{userInfo?.email || 'Đang tải...'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-body-sm text-pewter font-medium uppercase tracking-widest mb-4">Số điện thoại</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="text-[20px] font-bold text-carbon-black border-b-2 border-carbon-black outline-none bg-transparent"
                      placeholder="Số điện thoại"
                    />
                  ) : (
                    <span className="text-[20px] font-bold text-carbon-black">{userInfo?.phone || 'Chưa cập nhật'}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-16">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave}
                      disabled={loading}
                      className="px-32 py-12 bg-carbon-black text-canvas-white rounded-buttons font-medium hover:bg-slate-dark transition-colors duration-200 disabled:opacity-50">
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          phone: user?.phone || ''
                        });
                        setError('');
                      }}
                      className="px-32 py-12 bg-canvas-white text-carbon-black border border-fog rounded-buttons font-medium hover:border-stone transition-colors duration-200">
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-32 py-12 bg-carbon-black text-canvas-white rounded-buttons font-medium hover:bg-slate-dark transition-colors duration-200">
                      Cập nhật thông tin
                    </button>
                    <button className="px-32 py-12 bg-canvas-white text-carbon-black border border-fog rounded-buttons font-medium hover:border-stone transition-colors duration-200">
                      Đổi mật khẩu
                    </button>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin/dashboard" className="px-32 py-12 bg-ember-orange text-canvas-white rounded-buttons font-medium hover:bg-orange-600 transition-colors duration-200">
                        Vào Dashboard
                      </Link>
                    )}
                    {user?.role === 'STAFF' && (
                      <Link to="/staff/dashboard" className="px-32 py-12 bg-ember-orange text-canvas-white rounded-buttons font-medium hover:bg-orange-600 transition-colors duration-200">
                        Vào Dashboard
                      </Link>
                    )}
                  </>
                )}
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
