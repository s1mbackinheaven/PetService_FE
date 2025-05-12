import React, { useState, useEffect } from 'react'; // Import các hook cần thiết
import { useNavigate } from 'react-router-dom'; // Import hook điều hướng

const AppointmentApp = () => {
    const navigate = useNavigate(); // Hook để điều hướng

    // State quản lý form
    const [formData, setFormData] = useState({
        name: '',           // Tên người dùng
        petName: '',        // Tên thú cưng
        type: '',           // Loại thú cưng
        breed: '',          // Giống
        healthStatus: '',   // Tình trạng sức khỏe
        healthHistory: '',  // Tiền sử bệnh
        note: '',           // Ghi chú
        appointmentTime: '', // Thời gian hẹn
        preferredDoctorId: null // ID bác sĩ được chọn
    });

    // State cho danh sách bác sĩ
    const [doctors, setDoctors] = useState([]);

    // State cho trạng thái loading và thông báo
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success' // 'success' hoặc 'error'
    });

    // Hàm xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm xử lý thay đổi bác sĩ
    const handleDoctorChange = (e) => {
        const doctorId = parseInt(e.target.value) || null;
        setFormData(prev => ({
            ...prev,
            preferredDoctorId: doctorId
        }));
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

    // Fetch danh sách bác sĩ khi component mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/users/doctors');

                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách bác sĩ');
                }

                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                showNotification('Không thể lấy danh sách bác sĩ', 'error');
            }
        };

        fetchDoctors();
    }, []);

    // Hàm xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('Bạn cần đăng nhập để đặt lịch khám', 'error');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            // Giải mã token để lấy userId (giả định token JWT)
            // Trong thực tế, bạn cần xử lý token theo đúng cấu trúc của nó
            // Đây chỉ là cách đơn giản để demo
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const userId = tokenData.id;

            // Chuẩn bị dữ liệu gửi đi
            const appointmentData = {
                ...formData,
                // Sửa cách xử lý thời gian để đảm bảo đúng múi giờ
                appointmentTime: formData.appointmentTime // Sử dụng giá trị datetime-local trực tiếp
            };

            // Gửi request đặt lịch
            const response = await fetch(`http://localhost:8080/api/appointments/user/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(appointmentData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đặt lịch thất bại');
            }

            // Xử lý thành công
            showNotification('Đặt lịch khám thành công!', 'success');

            // Reset form
            setFormData({
                name: '',
                petName: '',
                type: '',
                breed: '',
                healthStatus: '',
                healthHistory: '',
                note: '',
                appointmentTime: '',
                preferredDoctorId: null
            });

            // Chuyển về trang homeLogin sau 2 giây
            setTimeout(() => {
                window.scrollTo(0, 0); // Reset vị trí scroll về đầu trang
                navigate('/homeLogin');
            }, 2000);

        } catch (error) {
            console.error('Error submitting appointment:', error);
            showNotification(error.message || 'Không thể đặt lịch khám', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Format minDate cho input date (ngày hiện tại trở đi)
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];

    return (
        <div className="pt-[100px] pb-[100px] bg-transparent bg-gradient-to-b from-white to-[#efefef]">
            {/* Hiển thị thông báo */}
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
                    <h2 className="text-2xl font-bold text-center mb-6 text-[#273172]">Đặt Lịch Khám</h2>

                    {/* Thông tin người đặt */}
                    <div className="flex flex-col mb-4">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="name">
                            Họ và tên người đặt lịch *
                        </label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            id="name"
                            name="name"
                            placeholder="Nhập họ và tên của bạn"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Thông tin thú cưng */}
                    <div className="flex flex-col mb-4">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="petName">
                            Tên thú cưng *
                        </label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            id="petName"
                            name="petName"
                            placeholder="Nhập tên thú cưng của bạn"
                            value={formData.petName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Loại thú cưng */}
                    <div className="flex flex-col mb-4">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="type">
                            Loại thú cưng *
                        </label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            id="type"
                            name="type"
                            placeholder="Ví dụ: Chó, Mèo, ..."
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Giống */}
                    <div className="flex flex-col mb-4">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="breed">
                            Giống *
                        </label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            id="breed"
                            name="breed"
                            placeholder="Ví dụ: Husky, Chihuahua, ..."
                            value={formData.breed}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Tình trạng sức khỏe */}
                    <div className="flex flex-col mb-4">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="healthStatus">
                            Tình trạng sức khỏe hiện tại *
                        </label>
                        <textarea
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            id="healthStatus"
                            name="healthStatus"
                            placeholder="Mô tả tình trạng sức khỏe hiện tại của thú cưng"
                            value={formData.healthStatus}
                            onChange={handleInputChange}
                            rows="3"
                            required
                        />
                    </div>

                    {/* Tiền sử bệnh */}
                    <div className="flex flex-col mb-4">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="healthHistory">
                            Tiền sử bệnh
                        </label>
                        <textarea
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            id="healthHistory"
                            name="healthHistory"
                            placeholder="Các bệnh trước đây, các lần điều trị trước (nếu có)"
                            value={formData.healthHistory}
                            onChange={handleInputChange}
                            rows="3"
                        />
                    </div>

                    {/* Thời gian hẹn */}
                    <div className="flex flex-col mb-4">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="appointmentTime">
                            Thời gian hẹn *
                        </label>
                        <input
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            type="datetime-local"
                            id="appointmentTime"
                            name="appointmentTime"
                            value={formData.appointmentTime}
                            onChange={handleInputChange}
                            min={`${minDate}T00:00`}
                            required
                        />
                    </div>

                    {/* Bác sĩ */}
                    <div className="flex flex-col mb-4">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="preferredDoctorId">
                            Bác sĩ (tùy chọn)
                        </label>
                        <select
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            id="preferredDoctorId"
                            name="preferredDoctorId"
                            value={formData.preferredDoctorId || ''}
                            onChange={handleDoctorChange}
                        >
                            <option value="">Chọn bác sĩ</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.fullname} - {doctor.experience}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ghi chú */}
                    <div className="flex flex-col mb-4">
                        <label className='text-[black] font-[600] text-[14px] mb-[10px]' htmlFor="note">
                            Ghi chú
                        </label>
                        <textarea
                            className='p-[10px] w-[500px] rounded-[5px] bg-neutral-200 text-[#445776] mb-[10px]'
                            id="note"
                            name="note"
                            placeholder="Thông tin bổ sung (nếu có)"
                            value={formData.note}
                            onChange={handleInputChange}
                            rows="3"
                        />
                    </div>

                    {/* Nút submit */}
                    <div className="flex justify-center mt-6">
                        <button
                            className='py-[10px] px-[80px] text-[14px] bg-[#efefef] text-[#000000] hover:cursor-pointer hover:text-[#efefef] hover:bg-[#273172] font-semibold rounded-[5px] shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed transition duration-300'
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đặt lịch khám'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentApp;
