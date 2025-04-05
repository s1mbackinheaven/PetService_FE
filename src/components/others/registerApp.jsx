import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterApp = () => {
    const navigate = useNavigate(); // Hook để điều hướng
    // State để quản lý form
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false); // State mới để quản lý trạng thái chuyển trang
    // State để quản lý popup thông báo
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    // Hàm hiển thị thông báo
    const showNotification = (message, type) => {
        setNotification({
            show: true,
            message,
            type
        });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // Hàm xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm xử lý chuyển hướng đến trang đăng nhập
    const handleLoginClick = () => {
        setIsNavigating(true); // Bắt đầu loading
        // Thêm delay 500ms để hiển thị loading
        setTimeout(() => {
            window.scrollTo(0, 0); // Reset vị trí scroll về đầu trang
            navigate('/login');
        }, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu có khớp nhau không
        if (formData.password !== formData.confirmPassword) {
            showNotification('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }

        setIsLoading(true);

        try {
            // Gọi API đăng ký
            const response = await fetch('http://localhost:8080/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    fullname: formData.fullname,
                    gender: formData.gender,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    password: formData.password
                }),
            });

            // Lấy text response trước
            const responseText = await response.text();

            // Thử parse JSON nếu có thể
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                // Nếu không parse được JSON, sử dụng text trực tiếp
                data = { message: responseText };
            }

            if (!response.ok) {
                // Nếu response không ok, hiển thị message từ backend
                showNotification(data.message, 'error');
                return;
            }

            // Nếu response ok
            showNotification('Đăng ký thành công!', 'success');
            // Reset form sau khi đăng ký thành công
            setFormData({
                username: '',
                fullname: '',
                gender: '',
                email: '',
                phone: '',
                address: '',
                password: '',
                confirmPassword: ''
            });

        } catch (error) {
            // Xử lý lỗi kết nối
            showNotification('Không thể kết nối đến server. Vui lòng thử lại sau.', 'error');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-[200px] pb-[100px] bg-transparent bg-gradient-to-b from-white to-[#efefef]">
            {/* Overlay loading khi chuyển trang */}
            {isNavigating && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273172] mb-4"></div>
                        <p className="text-[#273172] font-semibold">Đang chuyển trang...</p>
                    </div>
                </div>
            )}

            {/* Popup thông báo */}
            {notification.show && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in">
                    <div className={`p-4 rounded-lg shadow-lg ${notification.type === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                        }`}>
                        {notification.message}
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center p-[20px]">
                <form onSubmit={handleSubmit} className='p-[20px] bg-[rgba(255,255,255,1)] rounded-[5px] shadow-[0px_7px_20px_0px_rgba(0,_0,_0,_0.15)]'>
                    <div className="flex flex-col">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="username">Tên tài khoản *</label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            name="username"
                            placeholder="Nhập tên tài khoản"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="fullname">Họ và tên *</label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            name="fullname"
                            placeholder="Nhập họ và tên"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="gender">Giới tính *</label>
                        <select
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="email">Email *</label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            name="email"
                            type="email"
                            placeholder="Nhập email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="phone">Số điện thoại *</label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            name="phone"
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="address">Địa chỉ *</label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            name="address"
                            placeholder="Nhập địa chỉ"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="password">Mật khẩu *</label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            name="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            name="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center mb-[20px] mt-[20px]">
                        <button
                            className='py-[10px] px-[80px] text-[14px] bg-[#efefef] text-[#000000] hover:cursor-pointer hover:text-[#efefef] hover:bg-[#273172] font-semibold rounded-[5px] shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed'
                            type="submit"
                            disabled={isLoading || isNavigating}
                        >
                            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                        <button
                            className='py-[10px] px-[80px] text-[14px] bg-[#efefef] text-[#000000] hover:cursor-pointer hover:text-[#efefef] hover:bg-[#273172] font-semibold rounded-[5px] shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed'
                            type="button"
                            onClick={handleLoginClick}
                            disabled={isNavigating}
                        >
                            {isNavigating ? 'Đang chuyển...' : 'Đăng nhập'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterApp;
