import { useState, useEffect } from 'react';
import { Table } from 'antd';

const AppointmentInfo = ({ userId }) => {
    // State để lưu danh sách lịch khám
    const [appointments, setAppointments] = useState([]);
    // State để quản lý trạng thái loading
    const [loading, setLoading] = useState(true);
    // State để quản lý lỗi
    const [error, setError] = useState(null);

    // Định nghĩa các cột cho bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: 'Người đặt lịch',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'Tên thú cưng',
            dataIndex: 'petName',
            key: 'petName',
            width: 150,
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 80,
        },
        {
            title: 'Giống',
            dataIndex: 'breed',
            key: 'breed',
            width: 120,
        },
        {
            title: 'Thời gian hẹn',
            dataIndex: 'appointmentTime',
            key: 'appointmentTime',
            width: 180,
            render: (text) => {
                // Định dạng ngày giờ thành dạng dễ đọc
                const date = new Date(text);
                return date.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        },
        {
            title: 'Bác sĩ ưu tiên',
            dataIndex: 'preferredDoctorName',
            key: 'preferredDoctorName',
            width: 150,
            render: (text) => text || 'Không có',
        },
        {
            title: 'Bác sĩ phụ trách',
            dataIndex: 'assignedDoctorName',
            key: 'assignedDoctorName',
            width: 150,
            render: (text) => text || 'Chưa phân công',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                let color = '';
                let text = '';

                switch (status) {
                    case 'SCHEDULED':
                        color = 'text-blue-500';
                        text = 'Đã đặt lịch';
                        break;
                    case 'CHECKED_IN':
                        color = 'text-green-500';
                        text = 'Đã xác nhận';
                        break;
                    case 'COMPLETED':
                        color = 'text-purple-500';
                        text = 'Đã hoàn thành';
                        break;
                    case 'CANCELLED':
                        color = 'text-red-500';
                        text = 'Đã hủy';
                        break;
                    default:
                        color = 'text-gray-500';
                        text = status;
                }

                return <span className={color}>{text}</span>;
            }
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            width: 200,
            render: (text) => text || 'Không có ghi chú',
        }
    ];

    // Hàm để lấy dữ liệu lịch khám từ API
    const fetchAppointments = async () => {
        try {
            setLoading(true);

            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token đăng nhập!');
            }

            // Gọi API để lấy danh sách lịch khám
            const response = await fetch(`http://localhost:8080/api/appointments/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể lấy dữ liệu lịch khám!');
            }

            const data = await response.json();

            // Cập nhật state với dữ liệu từ API
            setAppointments(data);
            setError(null);
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu lịch khám:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Lấy dữ liệu khi component được mount hoặc userId thay đổi
    useEffect(() => {
        if (userId) {
            fetchAppointments();
        }
    }, [userId]);

    return (
        <div className="absolute top-[-205px] left-[320px] w-[1000px] bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#273172] mb-4">Lịch Khám Của Tôi</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Table
                dataSource={appointments}
                columns={columns}
                rowKey="id"
                loading={loading}
                scroll={{ x: 'max-content', y: 400 }}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch khám`
                }}
                bordered
                size="middle"
                className="custom-table"
            />
        </div>
    );
};

export default AppointmentInfo; 