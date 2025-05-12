import React, { useState, useEffect } from 'react';
import { Table, Input, Checkbox, Button, message, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import HeaderLogin from "../components/layout/header/headerLogin";
import Footer from "../components/layout/footer/footer";

const ReceptionistDashboard = () => {
    // State cho dữ liệu lịch hẹn
    const [appointments, setAppointments] = useState([]);
    // State cho trạng thái loading
    const [loading, setLoading] = useState(true);
    // State cho trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // State cho kết quả tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    // State cho tên lễ tân
    const [receptionistName, setReceptionistName] = useState('');

    // Lấy thông tin từ token khi component mount
    useEffect(() => {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Giải mã token để lấy thông tin người dùng
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);
                setReceptionistName(decodedToken.fullname || decodedToken.username);

                // Tải dữ liệu lịch hẹn
                fetchAppointments();
            } catch (error) {
                console.error('Lỗi khi giải mã token:', error);
                message.error('Không thể xác thực. Vui lòng đăng nhập lại!');
            }
        } else {
            message.error('Vui lòng đăng nhập để truy cập trang này!');
        }
    }, []);

    // Hàm lấy danh sách tất cả lịch hẹn
    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/appointments', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể lấy dữ liệu lịch hẹn');
            }

            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
            message.error('Không thể lấy danh sách lịch hẹn!');
        } finally {
            setLoading(false);
        }
    };

    // Hàm tìm kiếm lịch hẹn theo tên
    const searchAppointments = async (name) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/appointments/search?name=${encodeURIComponent(name)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tìm kiếm lịch hẹn');
            }

            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm lịch hẹn:', error);
            message.error('Không thể tìm kiếm lịch hẹn!');
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý check-in
    const handleCheckIn = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/check-in`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể check-in lịch hẹn');
            }

            // Lấy thông tin mới nhất của lịch hẹn
            const updatedAppointmentResponse = await fetch(`http://localhost:8080/api/appointments/${appointmentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!updatedAppointmentResponse.ok) {
                throw new Error('Không thể lấy thông tin lịch hẹn');
            }

            const updatedAppointment = await updatedAppointmentResponse.json();

            // Cập nhật danh sách lịch hẹn với trạng thái mới
            setAppointments(prevAppointments =>
                prevAppointments.map(appointment =>
                    appointment.id === appointmentId ? updatedAppointment : appointment
                )
            );

            message.success('Check-in thành công!');
        } catch (error) {
            console.error('Lỗi khi check-in lịch hẹn:', error);
            message.error('Không thể check-in lịch hẹn!');
        }
    };

    // Hàm xử lý thay đổi giá trị tìm kiếm
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            // Nếu ô tìm kiếm trống, lấy tất cả lịch hẹn
            fetchAppointments();
        } else {
            // Ngược lại, tìm kiếm theo tên
            searchAppointments(value);
        }
    };

    // Định nghĩa các cột cho bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            width: 80,
        },
        {
            title: 'Tên người đặt',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            filteredValue: searchTerm ? [searchTerm] : null,
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
            width: 150,
        },
        {
            title: 'Tên thú cưng',
            dataIndex: 'petName',
            key: 'petName',
            sorter: (a, b) => a.petName.localeCompare(b.petName),
            width: 150,
        },
        {
            title: 'Bác sĩ ưu tiên',
            dataIndex: 'preferredDoctorName',
            key: 'preferredDoctorName',
            render: text => text || 'Không có',
            filters: Array.from(new Set(appointments.map(item => item.preferredDoctorName))).filter(name => name !== null).map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.preferredDoctorName === value,
            width: 150,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                let color = '';
                let text = '';

                switch (status) {
                    case 'SCHEDULED':
                        color = 'blue';
                        text = 'Đã đặt lịch';
                        break;
                    case 'CHECKED-IN':
                        color = 'green';
                        text = 'Đã check-in';
                        break;
                    case 'COMPLETED':
                        color = 'purple';
                        text = 'Đã hoàn thành';
                        break;
                    case 'CANCELLED':
                        color = 'red';
                        text = 'Đã hủy';
                        break;
                    default:
                        color = 'default';
                        text = status;
                }

                return <Tag color={color}>{text}</Tag>;
            },
            filters: [
                { text: 'Đã đặt lịch', value: 'SCHEDULED' },
                { text: 'Đã check-in', value: 'CHECKED-IN' },
                { text: 'Đã hoàn thành', value: 'COMPLETED' },
                { text: 'Đã hủy', value: 'CANCELLED' },
            ],
            onFilter: (value, record) => record.status === value,
            width: 120,
        },
        {
            title: 'Check-in',
            key: 'checkIn',
            render: (_, record) => (
                <Checkbox
                    checked={record.status !== 'SCHEDULED'}
                    onChange={() => record.status === 'SCHEDULED' && handleCheckIn(record.id)}
                    disabled={record.status !== 'SCHEDULED'}
                />
            ),
            width: 100,
        },
    ];

    return (
        <div>
            <HeaderLogin />
            <div className="pt-[150px] pb-[100px] bg-transparent bg-gradient-to-b from-white to-[#efefef]">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h1 className="text-3xl font-bold text-[#273172] mb-2">Trang Của Lễ Tân</h1>
                        <p className="text-gray-600 mb-6">Xin chào, {receptionistName}!</p>

                        <div className="mb-6">
                            <Input
                                placeholder="Tìm kiếm theo tên người đặt lịch..."
                                prefix={<SearchOutlined />}
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full md:w-1/2 lg:w-1/3"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <Table
                                dataSource={appointments}
                                columns={columns}
                                rowKey="id"
                                loading={loading}
                                pagination={{
                                    current: currentPage,
                                    onChange: setCurrentPage,
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '50'],
                                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch hẹn`
                                }}
                                size="middle"
                                bordered
                                scroll={{ x: 'max-content' }}
                            />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button
                                type="primary"
                                className="bg-[#273172] text-white hover:opacity-90"
                                onClick={fetchAppointments}
                            >
                                Làm mới dữ liệu
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ReceptionistDashboard; 