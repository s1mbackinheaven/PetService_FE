import { useEffect, useState } from 'react';
import AccountInfo from './AccountInfo';
import SecurityInfo from './SecurityInfo';
import PetInfo from './PetInfo';
import AddPetModal from './AddPetModal';
import AppointmentInfo from './AppointmentInfo';
import ArticleInfo from './ArticleInfo';
import OrderInfo from './OrderInfo';
import './user.css';

const User = () => {
    // Khai báo state để lưu thông tin người dùng
    const [userInfo, setUserInfo] = useState({
        id: '',
        username: '',
        fullName: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        created: '',
        status: 'ACTIVE',
        role: 'USER' // Thêm role mặc định là USER
    });

    // State để kiểm tra xem đang ở chế độ xem hay chế độ chỉnh sửa
    const [isEditing, setIsEditing] = useState(false);

    // State để lưu thông tin người dùng đang chỉnh sửa
    const [editUserInfo, setEditUserInfo] = useState({});

    // State để quản lý popup thông báo
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success' // 'success' hoặc 'error'
    });

    // State để kiểm soát việc hiển thị thông tin tài khoản
    const [showAccountInfo, setShowAccountInfo] = useState(false);

    // State để kiểm soát việc hiển thị thông tin bảo mật
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);

    // State để lưu thông tin thay đổi mật khẩu
    const [passwordInfo, setPasswordInfo] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // State để kiểm soát việc hiển thị thông tin thú cưng
    const [showPetInfo, setShowPetInfo] = useState(false);

    // State để kiểm soát việc hiển thị thông tin lịch khám
    const [showAppointmentInfo, setShowAppointmentInfo] = useState(false);

    // State để kiểm soát việc hiển thị thông tin bác sĩ
    const [showDoctorInfo, setShowDoctorInfo] = useState(false);

    // State để kiểm soát việc hiển thị thông tin lễ tân
    const [showReceptionistInfo, setShowReceptionistInfo] = useState(false);

    // State để lưu thông tin thú cưng đang được chọn
    const [selectedPet, setSelectedPet] = useState(null);

    // State để kiểm soát việc hiển thị popup thêm thú cưng
    const [showAddPetModal, setShowAddPetModal] = useState(false);

    // State để lưu thông tin thú cưng mới
    const [newPet, setNewPet] = useState({
        nickName: '',
        name: '',
        type: '',
        breed: '',
        gender: '',
        weight: 0,
        birthday: '',
        description: '',
        healthStatus: '',
        healthHistory: ''
    });

    // State để kiểm tra xem đang ở chế độ chỉnh sửa thú cưng hay không
    const [isEditingPet, setIsEditingPet] = useState(false);

    // State để lưu danh sách thú cưng của người dùng
    const [pets, setPets] = useState([]);

    // State để kiểm soát việc hiển thị thông tin bài viết
    const [showArticleInfo, setShowArticleInfo] = useState(false);

    // Thêm state trong component User để kiểm soát việc hiển thị thông tin đơn hàng
    const [showOrderInfo, setShowOrderInfo] = useState(false);

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

    // Hàm để lấy và giải mã token
    const getUserInfoFromToken = () => {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');

        if (token) {
            try {
                // Giải mã token (trong thực tế, bạn nên sử dụng thư viện jwt-decode)
                // Đây chỉ là cách đơn giản để demo
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);

                // Lấy thông tin người dùng từ API sử dụng ID từ token
                fetchUserInfoById(decodedToken.id, token);

            } catch (error) {
                console.error('Lỗi khi giải mã token:', error);
            }
        }
    };

    // Hàm để lấy thông tin người dùng từ API sử dụng ID
    const fetchUserInfoById = async (userId, token) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();

                // Cập nhật state với thông tin từ API
                setUserInfo({
                    id: userData.id || '',
                    username: userData.username || '',
                    fullName: userData.fullname || '',
                    gender: userData.gender === 'male' ? 'Nam' : 'Nữ' || 'Chưa cập nhật',
                    email: userData.email || '',
                    phone: userData.phone || 'Chưa cập nhật',
                    address: userData.address || 'Chưa cập nhật',
                    created: new Date(userData.created).toLocaleDateString('vi-VN') || '',
                    status: userData.status || 'ACTIVE',
                    role: userData.role || 'USER' // Thêm role từ API
                });

                // Khởi tạo state editUserInfo với thông tin từ API
                setEditUserInfo({
                    id: userData.id || '',
                    fullname: userData.fullname || '',
                    gender: userData.gender || 'male',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    status: userData.status || 'ACTIVE'
                });

                // Lấy danh sách thú cưng của người dùng
                fetchUserPets(userData.id, token);
            } else {
                console.error('Lỗi khi lấy thông tin người dùng:', await response.text());
            }
        } catch (error) {
            console.error('Lỗi khi gọi API lấy thông tin người dùng:', error);
        }
    };

    // Hàm để lấy danh sách thú cưng của người dùng
    const fetchUserPets = async (userId, token) => {
        try {
            const response = await fetch(`http://localhost:8080/api/pets/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const petsData = await response.json();
                setPets(petsData);
            } else {
                console.error('Lỗi khi lấy danh sách thú cưng:', await response.text());
            }
        } catch (error) {
            console.error('Lỗi khi gọi API lấy danh sách thú cưng:', error);
        }
    };

    // Hàm để lấy thông tin chi tiết của một thú cưng
    const fetchPetDetails = async (petId, token) => {
        try {
            const response = await fetch(`http://localhost:8080/api/pets/${petId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const petData = await response.json();
                setSelectedPet(petData);
            } else {
                console.error('Lỗi khi lấy thông tin thú cưng:', await response.text());
            }
        } catch (error) {
            console.error('Lỗi khi gọi API lấy thông tin thú cưng:', error);
        }
    };

    // Hàm xử lý khi thay đổi thú cưng được chọn
    const handlePetChange = (e) => {
        const petId = e.target.value;
        if (petId) {
            const token = localStorage.getItem('token');
            fetchPetDetails(petId, token);
        } else {
            setSelectedPet(null);
        }
    };

    // Hàm xử lý khi thay đổi giá trị input thú cưng mới
    const handleNewPetChange = (e) => {
        const { name, value } = e.target;
        setNewPet({
            ...newPet,
            [name]: value
        });
    };

    // Hàm xử lý khi thay đổi giá trị input thú cưng đang chỉnh sửa
    const handleEditPetChange = (e) => {
        const { name, value } = e.target;
        setSelectedPet({
            ...selectedPet,
            [name]: value
        });
    };

    // Hàm xử lý khi click vào nút Thêm Thú Cưng
    const handleAddPet = async () => {
        try {
            const token = localStorage.getItem('token');

            // Gửi request POST đến API sử dụng fetch
            const response = await fetch(
                `http://localhost:8080/api/pets/user/${userInfo.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newPet)
                }
            );

            // Nếu thêm thú cưng thành công
            if (response.ok) {
                const petData = await response.json();

                // Cập nhật danh sách thú cưng
                setPets([...pets, petData]);

                // Đặt thú cưng mới làm thú cưng được chọn
                setSelectedPet(petData);

                // Đóng popup thêm thú cưng
                setShowAddPetModal(false);

                // Reset form
                setNewPet({
                    nickName: '',
                    name: '',
                    type: '',
                    breed: '',
                    gender: '',
                    weight: 0,
                    birthday: '',
                    description: '',
                    healthStatus: '',
                    healthHistory: ''
                });

                // Hiển thị thông báo thành công
                showNotification('Thêm thú cưng thành công!', 'success');
            } else {
                // Nếu có lỗi từ server
                const errorData = await response.json();
                console.error('Lỗi từ server:', errorData);
                showNotification('Có lỗi xảy ra khi thêm thú cưng. Vui lòng thử lại sau!', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi thêm thú cưng:', error);
            showNotification('Có lỗi xảy ra khi thêm thú cưng. Vui lòng thử lại sau!', 'error');
        }
    };

    // Hàm xử lý khi click vào nút Cập Nhật Thú Cưng
    const handleUpdatePet = async () => {
        try {
            const token = localStorage.getItem('token');

            // Gửi request PUT đến API sử dụng fetch
            const response = await fetch(
                `http://localhost:8080/api/pets/${selectedPet.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nickName: selectedPet.nickName,
                        name: selectedPet.name,
                        type: selectedPet.type,
                        breed: selectedPet.breed,
                        gender: selectedPet.gender,
                        weight: selectedPet.weight,
                        birthday: selectedPet.birthday,
                        description: selectedPet.description,
                        healthStatus: selectedPet.healthStatus,
                        healthHistory: selectedPet.healthHistory
                    })
                }
            );

            // Nếu cập nhật thú cưng thành công
            if (response.ok) {
                const updatedPet = await response.json();

                // Cập nhật danh sách thú cưng
                setPets(pets.map(pet => pet.id === updatedPet.id ? updatedPet : pet));

                // Cập nhật thú cưng được chọn
                setSelectedPet(updatedPet);

                // Chuyển về chế độ xem
                setIsEditingPet(false);

                // Hiển thị thông báo thành công
                showNotification('Cập nhật thú cưng thành công!', 'success');
            } else {
                // Nếu có lỗi từ server
                const errorData = await response.json();
                console.error('Lỗi từ server:', errorData);
                showNotification('Có lỗi xảy ra khi cập nhật thú cưng. Vui lòng thử lại sau!', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật thú cưng:', error);
            showNotification('Có lỗi xảy ra khi cập nhật thú cưng. Vui lòng thử lại sau!', 'error');
        }
    };

    // Gọi hàm lấy thông tin khi component được mount
    useEffect(() => {
        getUserInfoFromToken();
    }, []);

    // Hàm xử lý khi click vào nút Cập Nhật
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Hàm xử lý khi thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditUserInfo({
            ...editUserInfo,
            [name]: value
        });
    };

    // Hàm xử lý khi thay đổi giá trị input mật khẩu
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordInfo({
            ...passwordInfo,
            [name]: value
        });
    };

    // Hàm xử lý khi click vào nút Lưu
    const handleSaveClick = async () => {
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');

            // Gửi request PUT đến API sử dụng fetch
            const response = await fetch(
                `http://localhost:8080/api/users/${editUserInfo.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editUserInfo)
                }
            );

            // Nếu cập nhật thành công
            if (response.ok) {
                // Lấy thông tin người dùng mới nhất từ API
                await fetchUserInfoById(editUserInfo.id, token);

                // Chuyển về chế độ xem
                setIsEditing(false);

                // Hiển thị thông báo thành công
                showNotification('Cập nhật thông tin thành công!', 'success');
            } else {
                // Nếu có lỗi từ server
                const errorData = await response.json();
                console.error('Lỗi từ server:', errorData);
                showNotification('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau!', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            showNotification('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau!', 'error');
        }
    };

    // Hàm xử lý khi click vào nút Hủy
    const handleCancelClick = () => {
        // Chuyển về chế độ xem
        setIsEditing(false);

        // Khôi phục lại thông tin ban đầu
        setEditUserInfo({
            id: userInfo.id,
            fullname: userInfo.fullName,
            gender: userInfo.gender === 'Nam' ? 'male' : 'female',
            email: userInfo.email,
            phone: userInfo.phone,
            address: userInfo.address,
            status: userInfo.status
        });
    };

    // Hàm xử lý khi click vào menu Tài Khoản
    const handleAccountClick = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        setShowAccountInfo(!showAccountInfo); // Đảo ngược trạng thái hiển thị
        setShowSecurityInfo(false); // Ẩn thông tin bảo mật
        setShowPetInfo(false); // Ẩn thông tin thú cưng
        setShowAppointmentInfo(false); // Ẩn thông tin lịch khám
        setShowDoctorInfo(false); // Ẩn thông tin bác sĩ
        setShowReceptionistInfo(false); // Ẩn thông tin lễ tân
        setShowArticleInfo(false); // Ẩn thông tin bài viết
        setShowOrderInfo(false); // Ẩn thông tin đơn hàng
    };

    // Hàm xử lý khi click vào menu Bảo Mật
    const handleSecurityClick = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        setShowSecurityInfo(!showSecurityInfo); // Đảo ngược trạng thái hiển thị
        setShowAccountInfo(false); // Ẩn thông tin tài khoản
        setShowPetInfo(false); // Ẩn thông tin thú cưng
        setShowAppointmentInfo(false); // Ẩn thông tin lịch khám
        setShowDoctorInfo(false); // Ẩn thông tin bác sĩ
        setShowReceptionistInfo(false); // Ẩn thông tin lễ tân
        setShowArticleInfo(false); // Ẩn thông tin bài viết
        setShowOrderInfo(false); // Ẩn thông tin đơn hàng
    };

    // Hàm xử lý khi click vào menu Thú Cưng
    const handlePetClick = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        setShowPetInfo(!showPetInfo); // Đảo ngược trạng thái hiển thị
        setShowAccountInfo(false); // Ẩn thông tin tài khoản
        setShowSecurityInfo(false); // Ẩn thông tin bảo mật
        setShowAppointmentInfo(false); // Ẩn thông tin lịch khám
        setShowDoctorInfo(false); // Ẩn thông tin bác sĩ
        setShowReceptionistInfo(false); // Ẩn thông tin lễ tân
        setShowArticleInfo(false); // Ẩn thông tin bài viết
        setShowOrderInfo(false); // Ẩn thông tin đơn hàng
    };

    // Hàm xử lý khi click vào nút Đổi Mật Khẩu
    const handleChangePassword = async () => {
        // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp nhau không
        if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            showNotification('Mật khẩu mới và xác nhận mật khẩu không khớp!', 'error');
            return;
        }

        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');

            // Gửi request POST đến API sử dụng fetch
            const response = await fetch(
                `http://localhost:8080/api/users/${userInfo.id}/change-password`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        oldPassword: passwordInfo.oldPassword,
                        newPassword: passwordInfo.newPassword
                    })
                }
            );

            // Nếu thay đổi mật khẩu thành công
            if (response.ok) {
                // Hiển thị thông báo thành công
                showNotification('Thay đổi mật khẩu thành công!', 'success');

                // Reset form
                setPasswordInfo({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                // Nếu có lỗi từ server
                const errorData = await response.json();
                console.error('Lỗi từ server:', errorData);
                showNotification('Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng thử lại sau!', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi thay đổi mật khẩu:', error);
            showNotification('Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng thử lại sau!', 'error');
        }
    };

    // Hàm xử lý khi click vào nút Chỉnh Sửa Thú Cưng
    const handleEditPetClick = () => {
        setIsEditingPet(true);
    };

    // Hàm xử lý khi click vào nút Hủy Chỉnh Sửa Thú Cưng
    const handleCancelPetEditClick = () => {
        setIsEditingPet(false);

        // Khôi phục lại thông tin ban đầu
        if (selectedPet) {
            const token = localStorage.getItem('token');
            fetchPetDetails(selectedPet.id, token);
        }
    };

    // Hàm xử lý khi click vào menu Lịch Khám
    const handleAppointmentClick = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        setShowAppointmentInfo(!showAppointmentInfo); // Đảo ngược trạng thái hiển thị
        setShowAccountInfo(false); // Ẩn thông tin tài khoản
        setShowSecurityInfo(false); // Ẩn thông tin bảo mật
        setShowPetInfo(false); // Ẩn thông tin thú cưng
        setShowDoctorInfo(false); // Ẩn thông tin bác sĩ
        setShowReceptionistInfo(false); // Ẩn thông tin lễ tân
        setShowArticleInfo(false); // Ẩn thông tin bài viết
        setShowOrderInfo(false); // Ẩn thông tin đơn hàng
    };

    // Hàm xử lý khi click vào menu Bác Sĩ
    const handleDoctorClick = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        setShowDoctorInfo(!showDoctorInfo); // Đảo ngược trạng thái hiển thị
        setShowAccountInfo(false); // Ẩn thông tin tài khoản
        setShowSecurityInfo(false); // Ẩn thông tin bảo mật
        setShowPetInfo(false); // Ẩn thông tin thú cưng
        setShowAppointmentInfo(false); // Ẩn thông tin lịch khám
        setShowReceptionistInfo(false); // Ẩn thông tin lễ tân
        setShowArticleInfo(false); // Ẩn thông tin bài viết
        setShowOrderInfo(false); // Ẩn thông tin đơn hàng
    };

    // Hàm xử lý khi click vào menu Lễ Tân
    const handleReceptionistClick = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        setShowReceptionistInfo(!showReceptionistInfo); // Đảo ngược trạng thái hiển thị
        setShowAccountInfo(false); // Ẩn thông tin tài khoản
        setShowSecurityInfo(false); // Ẩn thông tin bảo mật
        setShowPetInfo(false); // Ẩn thông tin thú cưng
        setShowAppointmentInfo(false); // Ẩn thông tin lịch khám
        setShowDoctorInfo(false); // Ẩn thông tin bác sĩ
        setShowArticleInfo(false); // Ẩn thông tin bài viết
        setShowOrderInfo(false); // Ẩn thông tin đơn hàng
    };

    // Hàm xử lý khi click vào menu Bài Viết
    const handleArticleClick = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        setShowArticleInfo(!showArticleInfo); // Đảo ngược trạng thái hiển thị
        setShowAccountInfo(false); // Ẩn thông tin tài khoản
        setShowSecurityInfo(false); // Ẩn thông tin bảo mật
        setShowPetInfo(false); // Ẩn thông tin thú cưng
        setShowAppointmentInfo(false); // Ẩn thông tin lịch khám
        setShowDoctorInfo(false); // Ẩn thông tin bác sĩ
        setShowReceptionistInfo(false); // Ẩn thông tin lễ tân
        setShowOrderInfo(false); // Ẩn thông tin đơn hàng
    };

    // Thêm hàm xử lý khi click vào menu Đơn Hàng
    const handleOrderClick = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        setShowOrderInfo(!showOrderInfo); // Đảo ngược trạng thái hiển thị
        setShowAccountInfo(false); // Ẩn thông tin tài khoản
        setShowSecurityInfo(false); // Ẩn thông tin bảo mật
        setShowPetInfo(false); // Ẩn thông tin thú cưng
        setShowAppointmentInfo(false); // Ẩn thông tin lịch khám
        setShowDoctorInfo(false); // Ẩn thông tin bác sĩ
        setShowReceptionistInfo(false); // Ẩn thông tin lễ tân
        setShowArticleInfo(false); // Ẩn thông tin bài viết
    };

    return (
        <div className="bg-transparent bg-gradient-to-b from-white to-[#efefef] px-[100px] py-[200px]">
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

            {/* Popup thêm thú cưng */}
            <AddPetModal
                showAddPetModal={showAddPetModal}
                setShowAddPetModal={setShowAddPetModal}
                newPet={newPet}
                handleNewPetChange={handleNewPetChange}
                handleAddPet={handleAddPet}
            />

            <div className="h-[800px] text-[36px] font-[700] leading-[36px] p-[20px] bg-[rgba(255,255,255,1)] rounded-[5px] shadow-[0px_7px_20px_0px_rgba(0,_0,_0,_0.15)]">
                <div>
                    <i className="text-[rgb(73,179,244)] drop-shadow-lg transform -rotate-2 text-shadow-custom-second">Pet Service</i>
                    <h2 className="text-[18px] font-[600] text-[#424242]">Trang Tài Khoản</h2>
                </div>
                <div className="mt-[36px]">
                    <div className="w-[300px] h-[550px] border-r border-[#273172]">
                        <div className="flex items-center gap-[10px]">
                            <img className="w-[70px] h-[70px] rounded-full" src="https://i.vietgiaitri.com/2021/3/5/jisoo-black-pink-duoc-lua-chon-la-nu-than-tuong-so-huu-guong-mat-ly-tuong-nhat-6af-5615536.jpg" alt="" />
                            <i className="text-[18px] ml-[5px] font-[500] text-[#424242] ">{userInfo.username}</i>
                        </div>
                        <div className="grid grid-rows-7 text-[15px] font-[500] uppercase mt-[20px]">
                            <div className="relative border-t border-b border-[#273172] ">
                                <a
                                    className={`flex w-[300px] h-full hover:cursor-pointer hover:bg-[#efefef] hover:text-[#53a0e8] hover:border-r-4 hover:border-[#273171] ${showAccountInfo ? 'bg-[#efefef] text-[#53a0e8] border-r-4 border-[#273171]' : ''}`}
                                    href=""
                                    onClick={handleAccountClick}
                                >
                                    Tài Khoản
                                </a>
                                {showAccountInfo && (
                                    <AccountInfo
                                        userInfo={userInfo}
                                        isEditing={isEditing}
                                        editUserInfo={editUserInfo}
                                        handleInputChange={handleInputChange}
                                        handleEditClick={handleEditClick}
                                        handleSaveClick={handleSaveClick}
                                        handleCancelClick={handleCancelClick}
                                    />
                                )}
                            </div>
                            <div className="border-b border-[#273172] relative">
                                <a
                                    className={`flex w-[300px] h-full hover:cursor-pointer hover:bg-[#efefef] hover:text-[#53a0e8] hover:border-r-4 hover:border-[#273171] ${showSecurityInfo ? 'bg-[#efefef] text-[#53a0e8] border-r-4 border-[#273171]' : ''}`}
                                    href=""
                                    onClick={handleSecurityClick}
                                >
                                    Bảo Mật
                                </a>
                                {showSecurityInfo && (
                                    <SecurityInfo
                                        passwordInfo={passwordInfo}
                                        handlePasswordChange={handlePasswordChange}
                                        handleChangePassword={handleChangePassword}
                                    />
                                )}
                            </div>
                            <div className="border-b border-[#273172] relative">
                                <a
                                    className={`flex w-[300px] h-full hover:cursor-pointer hover:bg-[#efefef] hover:text-[#53a0e8] hover:border-r-4 hover:border-[#273171] ${showPetInfo ? 'bg-[#efefef] text-[#53a0e8] border-r-4 border-[#273171]' : ''}`}
                                    href=""
                                    onClick={handlePetClick}
                                >
                                    Thú Cưng
                                </a>
                                {showPetInfo && (
                                    <PetInfo
                                        pets={pets}
                                        selectedPet={selectedPet}
                                        isEditingPet={isEditingPet}
                                        handlePetChange={handlePetChange}
                                        handleEditPetChange={handleEditPetChange}
                                        handleEditPetClick={handleEditPetClick}
                                        handleUpdatePet={handleUpdatePet}
                                        handleCancelPetEditClick={handleCancelPetEditClick}
                                        setShowAddPetModal={setShowAddPetModal}
                                    />
                                )}
                            </div>
                            <div className="border-b border-[#273172] relative">
                                <a
                                    className={`flex w-[300px] h-full hover:cursor-pointer hover:bg-[#efefef] hover:text-[#53a0e8] hover:border-r-4 hover:border-[#273171] ${showAppointmentInfo ? 'bg-[#efefef] text-[#53a0e8] border-r-4 border-[#273171]' : ''}`}
                                    href=""
                                    onClick={handleAppointmentClick}
                                >
                                    Lịch Khám
                                </a>
                                {showAppointmentInfo && (
                                    <AppointmentInfo userId={userInfo.id} />
                                )}
                            </div>
                            {/* Tab Bác Sĩ - chỉ hiển thị với vai trò DOCTOR hoặc ADMIN */}
                            {(userInfo.role === 'DOCTOR' || userInfo.role === 'ADMIN') && (
                                <div className="border-b border-[#273172] relative">
                                    <a
                                        className={`flex w-[300px] h-full hover:cursor-pointer hover:bg-[#efefef] hover:text-[#53a0e8] hover:border-r-4 hover:border-[#273171] ${showDoctorInfo ? 'bg-[#efefef] text-[#53a0e8] border-r-4 border-[#273171]' : ''}`}
                                        href=""
                                        onClick={handleDoctorClick}
                                    >
                                        Bác Sĩ
                                    </a>
                                    {showDoctorInfo && (
                                        <div className="absolute top-[-170px] left-[320px] w-[800px] bg-white p-6 rounded-lg shadow-md">
                                            <h2 className="text-xl font-semibold text-[#273172] mb-4">Quản Lý Bác Sĩ</h2>
                                            <p className="mb-6">Chức năng dành cho bác sĩ giúp quản lý lịch khám, ghi chú kết quả khám và lưu trữ lịch sử thăm khám.</p>

                                            <div className="mt-8">
                                                <a
                                                    href="/doctor-dashboard"
                                                    className="py-[10px] px-[30px] text-[14px] bg-[#273172] text-white hover:cursor-pointer hover:opacity-90 font-semibold rounded-[5px] shadow-[0px_5px_15px_0px_rgba(0,0,0,0.15)] transition duration-300"
                                                >
                                                    Chuyển đến trang quản lý dành cho bác sĩ
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Tab Lễ Tân - chỉ hiển thị với vai trò RECEPTIONIST hoặc ADMIN */}
                            {(userInfo.role === 'RECEPTIONIST' || userInfo.role === 'ADMIN') && (
                                <div className="border-b border-[#273172] relative">
                                    <a
                                        className={`flex w-[300px] h-full hover:cursor-pointer hover:bg-[#efefef] hover:text-[#53a0e8] hover:border-r-4 hover:border-[#273171] ${showReceptionistInfo ? 'bg-[#efefef] text-[#53a0e8] border-r-4 border-[#273171]' : ''}`}
                                        href=""
                                        onClick={handleReceptionistClick}
                                    >
                                        Lễ Tân
                                    </a>
                                    {showReceptionistInfo && (
                                        <div className="absolute top-[-210px] left-[320px] w-[800px] bg-white p-6 rounded-lg shadow-md">
                                            <h2 className="text-xl font-semibold text-[#273172] mb-4">Quản Lý Lễ Tân</h2>
                                            <p className="mb-6">Chức năng dành cho lễ tân giúp quản lý lịch hẹn, check-in và phân công bác sĩ.</p>

                                            <div className="mt-8">
                                                <a
                                                    href="/receptionist-dashboard"
                                                    className="py-[10px] px-[30px] text-[14px] bg-[#273172] text-white hover:cursor-pointer hover:opacity-90 font-semibold rounded-[5px] shadow-[0px_5px_15px_0px_rgba(0,0,0,0.15)] transition duration-300"
                                                >
                                                    Chuyển đến trang quản lý dành cho lễ tân
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="border-b border-[#273172] relative">
                                <a
                                    className={`flex w-[300px] h-full hover:cursor-pointer hover:bg-[#efefef] hover:text-[#53a0e8] hover:border-r-4 hover:border-[#273171] ${showOrderInfo ? 'bg-[#efefef] text-[#53a0e8] border-r-4 border-[#273171]' : ''}`}
                                    href=""
                                    onClick={handleOrderClick}
                                >
                                    Đơn Hàng
                                </a>
                                {showOrderInfo && <OrderInfo userId={userInfo.id} />}
                            </div>
                            <div className="border-b border-[#273172] relative">
                                <a
                                    className={`flex w-[300px] h-full hover:cursor-pointer hover:bg-[#efefef] hover:text-[#53a0e8] hover:border-r-4 hover:border-[#273171] ${showArticleInfo ? 'bg-[#efefef] text-[#53a0e8] border-r-4 border-[#273171]' : ''}`}
                                    href=""
                                    onClick={handleArticleClick}
                                >
                                    Bài Viết
                                </a>
                                {showArticleInfo && <ArticleInfo userId={userInfo.id} />}
                            </div>
                            <div className="">
                                <a className="flex w-[300px] h-full hover:cursor-pointer hover:bg-[#efefef] hover:text-[#53a0e8] hover:border-r-4 hover:border-[#273171]" href="">Đăng Xuất</a>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}

export default User;
