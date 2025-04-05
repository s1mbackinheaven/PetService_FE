import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginApp = () => {
  const navigate = useNavigate(); // Hook để điều hướng
  // State để quản lý form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State để quản lý trạng thái loading
  const [isNavigating, setIsNavigating] = useState(false); // State mới để quản lý trạng thái chuyển trang
  // State để quản lý popup thông báo
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' // 'success' hoặc 'error'
  });

  // Hàm xử lý chuyển hướng đến trang đăng ký
  const handleRegisterClick = () => {
    setIsNavigating(true); // Bắt đầu loading
    // Thêm delay 500ms để hiển thị loading
    setTimeout(() => {
      window.scrollTo(0, 0); // Reset vị trí scroll về đầu trang
      navigate('/register');
    }, 500);
  };

  // Hàm hiển thị thông báo
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Bắt đầu loading
    setErrorMessage(''); // Reset error message

    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
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

      // Lưu token vào localStorage
      localStorage.setItem('token', data.token);
      // Nếu chọn tự động đăng nhập, lưu thêm thông tin user
      if (autoLogin) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      showNotification('Đăng nhập thành công!', 'success');

      // Thêm delay 500ms để hiển thị thông báo thành công
      setTimeout(() => {
        setIsNavigating(true); // Bắt đầu loading chuyển trang
        // Thêm delay 500ms để hiển thị loading
        setTimeout(() => {
          window.scrollTo(0, 0); // Reset vị trí scroll về đầu trang
          navigate('/homeLogin'); // Chuyển hướng đến trang homeLogin
        }, 500);
      }, 1000);

    } catch (error) {
      // Xử lý lỗi kết nối
      showNotification('Không thể kết nối đến server. Vui lòng thử lại sau.', 'error');
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Kết thúc loading
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
              placeholder="Nhập tên tài khoản của bạn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="password">Mật khẩu *</label>
            <input
              className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
              type="password"
              id="password"
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="">
            <label className='text-[gray] font-[500] text-[14px] mb-[10px] flex items-center'>
              <input
                className='mr-[5px] h-[14px] w-[14px]'
                type="checkbox"
                checked={autoLogin}
                onChange={() => setAutoLogin(!autoLogin)}
              />
              Tự động đăng nhập
            </label>
          </div>

          <div className="flex justify-between items-center mb-[20px]">
            <button
              className='py-[10px] px-[80px] text-[14px] bg-[#efefef] text-[#000000] hover:cursor-pointer hover:text-[#efefef] hover:bg-[#273172] font-semibold rounded-[5px] shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed'
              type="submit"
              disabled={isLoading || isNavigating}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <button
              className='py-[10px] px-[80px] text-[14px] bg-[#efefef] text-[#000000] hover:cursor-pointer hover:text-[#efefef] hover:bg-[#273172] font-semibold rounded-[5px] shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed'
              type="button"
              onClick={handleRegisterClick}
              disabled={isNavigating}
            >
              {isNavigating ? 'Đang chuyển...' : 'Đăng ký'}
            </button>
          </div>

          <div className="flex justify-center items-center text-[gray] font-[500] text-[14px]">
            <a href="#" className="hover:text-[#273172]">Lấy lại mật khẩu?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginApp;
