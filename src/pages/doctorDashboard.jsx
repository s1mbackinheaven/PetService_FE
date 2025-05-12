import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Modal, message, notification, Tag, Form, Input as AntInput, Divider } from 'antd';
import { SearchOutlined, UserOutlined, InfoCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import HeaderLogin from "../components/layout/header/headerLogin";
import Footer from "../components/layout/footer/footer";

const { TextArea } = AntInput;

// Cấu hình global cho notification
notification.config({
    placement: 'topRight', // Hiển thị ở góc trên bên phải
    duration: 4, // Thời gian hiển thị (giây)
    // maxCount: 3, // Số thông báo tối đa hiển thị cùng lúc
});

const DoctorDashboard = () => {
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success', // 'success' hoặc 'error' hoặc 'info'
        description: '' // Thêm trường description
    });

    const showNotification = (type, message, description) => {
        setNotification({
            show: true,
            type,
            message,
            description
        });
        // Tự động ẩn thông báo sau 3 giây
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
    };
    // State cho dữ liệu lịch hẹn
    const [appointments, setAppointments] = useState([]);
    // State cho trạng thái loading
    const [loading, setLoading] = useState(false);
    // State cho trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // State cho kết quả tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    // State cho tên bác sĩ
    const [doctorName, setDoctorName] = useState('');
    // State cho ID bác sĩ
    const [doctorId, setDoctorId] = useState(null);
    // State cho số phòng
    const [roomNumber, setRoomNumber] = useState('');
    // State cho modal nhập số phòng
    const [roomModalVisible, setRoomModalVisible] = useState(true);
    // State cho form nhập số phòng
    const [roomForm] = Form.useForm();
    // State cho modal thông tin bệnh nhân
    const [patientModalVisible, setPatientModalVisible] = useState(false);
    // State cho thông tin bệnh nhân hiện tại
    const [currentPatient, setCurrentPatient] = useState(null);
    // State cho modal xem chi tiết lịch khám
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    // State cho lịch khám đang xem chi tiết
    const [appointmentDetail, setAppointmentDetail] = useState(null);
    // State cho form ghi chú
    const [noteForm] = Form.useForm();
    // State cho biết có đang submit ghi chú hay không
    const [submittingNote, setSubmittingNote] = useState(false);

    // Lấy thông tin từ token khi component mount
    useEffect(() => {
        // Hiển thị thông báo kiểm tra khi component mount
        showNotification('info', 'Hệ thống đã sẵn sàng', 'Chào mừng đến với hệ thống quản lý của bác sĩ.');

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
                setDoctorName(decodedToken.fullname || decodedToken.username);
                setDoctorId(decodedToken.id);
            } catch (error) {
                console.error('Lỗi khi giải mã token:', error);
                showNotification('error', 'Lỗi xác thực', 'Không thể xác thực. Vui lòng đăng nhập lại!');
            }
        } else {
            showNotification('error', 'Chưa đăng nhập', 'Vui lòng đăng nhập để truy cập trang này!');
        }
    }, []);

    // Hàm lấy danh sách lịch hẹn đã hoàn thành
    const fetchCompletedAppointments = async () => {
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
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Không thể lấy dữ liệu lịch hẹn';
                showNotification('error', 'Lỗi dữ liệu', errorMessage);
                console.error('Chi tiết lỗi từ server:', errorData);
                return;
            }

            const data = await response.json();
            // Lọc những lịch hẹn đã hoàn thành và được phân công cho bác sĩ này
            const filtered = data.filter(appointment =>
                appointment.status === 'COMPLETED' &&
                appointment.assignedDoctorId === doctorId
            );
            setAppointments(filtered);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
            showNotification('error', 'Lỗi kết nối', 'Không thể lấy danh sách lịch hẹn: ' + error.message);
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
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Không thể tìm kiếm lịch hẹn';
                showNotification('error', 'Lỗi tìm kiếm', errorMessage);
                console.error('Chi tiết lỗi từ server:', errorData);
                return;
            }

            const data = await response.json();
            // Lọc những lịch hẹn đã hoàn thành và được phân công cho bác sĩ này
            const filtered = data.filter(appointment =>
                appointment.status === 'COMPLETED' &&
                appointment.assignedDoctorId === doctorId
            );
            setAppointments(filtered);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm lịch hẹn:', error);
            showNotification('error', 'Lỗi kết nối', 'Không thể tìm kiếm lịch hẹn: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Hàm gọi bệnh nhân tiếp theo
    const callNextPatient = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/appointments/next-for-doctor/${doctorId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Đọc nội dung phản hồi dưới dạng text trước
            const responseText = await response.text();
            console.log('Response text:', responseText);

            // Chuyển response text thành JSON nếu có thể
            let responseData;
            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                responseData = { message: responseText || 'Không có dữ liệu phản hồi' };
            }

            if (!response.ok) {
                // Kiểm tra lỗi 404 và hiển thị thông báo
                if (response.status === 404) {
                    showNotification('info', 'Thông báo', 'Không có lịch hẹn phù hợp cho bác sĩ. Tất cả lịch hẹn đều chỉ định bác sĩ khác.');
                } else {
                    const errorMessage = responseData.message || `Lỗi ${response.status}: Không thể gọi bệnh nhân tiếp theo`;
                    showNotification('error', 'Lỗi', errorMessage);
                }
                // console.log('Chi tiết phản hồi từ server:', responseData);   
                return;
            }

            // Nếu thành công, hiển thị modal bệnh nhân với dữ liệu nhận được
            setCurrentPatient(responseData);
            setPatientModalVisible(true);

            // Hiển thị thông báo thành công
            showNotification('success', 'Gọi bệnh nhân thành công', `Đã gọi bệnh nhân ${responseData.name} với thú cưng ${responseData.petName}`);

            // Tách ghi chú của bệnh nhân
            const patientNote = responseData.note || '';

            // Thiết lập giá trị ban đầu cho form ghi chú
            noteForm.setFieldsValue({
                patientNote: patientNote,
                doctorNote: ''
            });
        } catch (error) {
            console.error('Lỗi khi gọi bệnh nhân tiếp theo:', error);
            showNotification('error', 'Lỗi kết nối', 'Không thể gọi bệnh nhân tiếp theo: ' + error.message);
        }
    };

    // Hàm cập nhật ghi chú
    const updateNote = async (appointmentId, patientNote, doctorNote) => {
        try {
            const token = localStorage.getItem('token');

            // Tạo ghi chú kết hợp: ghi chú bệnh nhân + ghi chú bác sĩ
            const combinedNote = `[GHI CHÚ BỆNH NHÂN]\n${patientNote || 'Không có'}\n\n[KẾT QUẢ KHÁM - BÁC SĨ ${doctorName}]\n${doctorNote}`;

            // API cập nhật ghi chú sử dụng PUT
            const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/update-note`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ note: combinedNote })
            });

            if (!response.ok) {
                const responseText = await response.text();
                let errorData;
                try {
                    errorData = responseText ? JSON.parse(responseText) : {};
                } catch (e) {
                    errorData = { message: responseText || 'Không có dữ liệu phản hồi' };
                }
                const errorMessage = errorData.message || `Lỗi ${response.status}: Không thể cập nhật ghi chú`;
                console.error('Chi tiết lỗi từ server:', errorData);
                throw new Error(errorMessage);
            }

            return true;
        } catch (error) {
            console.error('Lỗi khi cập nhật ghi chú:', error);
            showNotification('error', 'Lỗi ghi chú', 'Không thể cập nhật ghi chú: ' + error.message);
            return false;
        }
    };

    // Hàm hoàn tất khám bệnh
    const completeExamination = async () => {
        try {
            setSubmittingNote(true);
            // Kiểm tra xem đã có ghi chú của bác sĩ chưa
            const values = await noteForm.validateFields();
            if (!values.doctorNote || values.doctorNote.trim() === '') {
                showNotification('error', 'Thiếu thông tin', 'Vui lòng thêm ghi chú kết quả khám bệnh!');
                setSubmittingNote(false);
                return;
            }

            // Bước 1: Cập nhật ghi chú
            const noteUpdated = await updateNote(
                currentPatient.id,
                values.patientNote,
                values.doctorNote
            );

            if (!noteUpdated) {
                setSubmittingNote(false);
                return; // Dừng lại nếu cập nhật ghi chú thất bại
            }

            // Bước 2: Hoàn tất khám bệnh
            const token = localStorage.getItem('token');

            // API mới để hoàn tất khám bệnh - thay đổi PUT thành POST
            const response = await fetch(`http://localhost:8080/api/appointments/${currentPatient.id}/complete?doctorId=${doctorId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Log response status để debug
            console.log('Response status:', response.status);

            const responseText = await response.text();
            console.log('Response text:', responseText);

            // Chuyển response text thành JSON nếu có thể
            let errorData;
            try {
                errorData = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                errorData = { message: responseText || 'Không có dữ liệu phản hồi' };
            }

            if (!response.ok) {
                const errorMessage = errorData.message || `Lỗi ${response.status}: Không thể hoàn tất khám bệnh`;
                showNotification('error', 'Lỗi hoàn tất', errorMessage);
                console.error('Chi tiết lỗi từ server:', errorData);
                setSubmittingNote(false);
                return;
            }

            showNotification('success', 'Thành công', 'Đã hoàn tất khám bệnh!');
            setPatientModalVisible(false);
            // Làm mới danh sách lịch hẹn
            fetchCompletedAppointments();
        } catch (error) {
            console.error('Lỗi khi hoàn tất khám bệnh:', error);
            showNotification('error', 'Lỗi xử lý', 'Không thể hoàn tất khám bệnh: ' + error.message);
        } finally {
            setSubmittingNote(false);
        }
    };

    // Hàm xử lý thay đổi giá trị tìm kiếm
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            // Nếu ô tìm kiếm trống, lấy tất cả lịch hẹn
            fetchCompletedAppointments();
        } else {
            // Ngược lại, tìm kiếm theo tên
            searchAppointments(value);
        }
    };

    // Hàm xử lý khi nhập số phòng
    const handleRoomSubmit = () => {
        roomForm.validateFields()
            .then(values => {
                setRoomNumber(values.roomNumber);
                setRoomModalVisible(false);
                // Sau khi có số phòng, fetch danh sách lịch hẹn
                fetchCompletedAppointments();
                showNotification('success', 'Đã thiết lập phòng khám', `Phòng khám số ${values.roomNumber} đã sẵn sàng.`);
            })
            .catch(errorInfo => {
                console.log('Validation failed:', errorInfo);
            });
    };

    // Hàm xem chi tiết lịch khám
    const viewAppointmentDetail = (appointment) => {
        setAppointmentDetail(appointment);
        setDetailModalVisible(true);
    };

    // Hàm định dạng và phân tách ghi chú
    const formatNote = (note) => {
        if (!note) return 'Không có ghi chú';

        // Kiểm tra xem note có định dạng phân tách không
        if (note.includes('[GHI CHÚ BỆNH NHÂN]') && note.includes('[KẾT QUẢ KHÁM - BÁC SĨ')) {
            // Phân tách các phần ghi chú
            const patientNoteMatch = note.match(/\[GHI CHÚ BỆNH NHÂN\]([\s\S]*?)\n\n\[KẾT QUẢ KHÁM - BÁC SĨ/);
            const doctorNoteMatch = note.match(/\[KẾT QUẢ KHÁM - BÁC SĨ[^\]]*\]([\s\S]*)/);

            return (
                <div>
                    <div className="mb-2">
                        <p className="font-semibold text-blue-600">Ghi chú của bệnh nhân:</p>
                        <div className="p-2 bg-blue-50 rounded-md">
                            {patientNoteMatch ? patientNoteMatch[1].trim() : 'Không có'}
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-green-600">Kết quả khám của bác sĩ:</p>
                        <div className="p-2 bg-green-50 rounded-md">
                            {doctorNoteMatch ? doctorNoteMatch[1].trim() : 'Không có'}
                        </div>
                    </div>
                </div>
            );
        }

        // Nếu là ghi chú cũ không phân tách
        return (
            <div className="p-2 bg-gray-50 rounded-md">
                {note}
            </div>
        );
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
            title: 'Bác sĩ thăm khám',
            dataIndex: 'assignedDoctorName',
            key: 'assignedDoctorName',
            render: text => text || 'Chưa phân công',
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
                    case 'IN_PROGRESS':
                        color = 'orange';
                        text = 'Đang khám';
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
                { text: 'Đã hoàn thành', value: 'COMPLETED' },
            ],
            onFilter: (value, record) => record.status === value,
            width: 120,
        },
        {
            title: 'Chi tiết',
            key: 'detail',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    className="bg-[#273172]"
                    onClick={() => viewAppointmentDetail(record)}
                >
                    Xem chi tiết
                </Button>
            ),
            width: 100,
        },
    ];

    return (
        <div>
            <HeaderLogin />
            {/* Hiển thị thông báo nếu show = true */}
            {notification.show && (
                <div className={`fixed top-24 right-4 z-50 p-4 rounded-md shadow-lg transition-all duration-300 transform translate-x-0 ${notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
                    notification.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
                        'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
                    }`}>
                    <div className="flex items-center">
                        <div className="mr-3">
                            {notification.type === 'success' ? (
                                <CheckCircleOutlined className="text-2xl text-green-500" />
                            ) : notification.type === 'error' ? (
                                <ExclamationCircleOutlined className="text-2xl text-red-500" />
                            ) : (
                                <InfoCircleOutlined className="text-2xl text-blue-500" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold">{notification.message}</h3>
                            {notification.description && <p>{notification.description}</p>}
                        </div>
                        <button
                            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                            className="ml-auto text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
            <div className="pt-[150px] pb-[100px] bg-transparent bg-gradient-to-b from-white to-[#efefef] mt-[50px]">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-[#273172]">Trang Của Bác Sĩ</h1>
                            {roomNumber && (
                                <div className="text-xl font-bold text-center text-[#273172]">
                                    Phòng khám số: {roomNumber}
                                </div>
                            )}
                            {roomNumber && (
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<UserOutlined />}
                                    className="bg-[#273172]"
                                    onClick={callNextPatient}
                                >
                                    Gọi bệnh nhân tiếp theo
                                </Button>
                            )}
                        </div>

                        <p className="text-gray-600 mb-6">Xin chào, {doctorName}!</p>

                        {roomNumber && (
                            <>
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
                                        onClick={fetchCompletedAppointments}
                                    >
                                        Làm mới dữ liệu
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal nhập số phòng */}
            <Modal
                title="Tạo phòng khám"
                open={roomModalVisible}
                onOk={handleRoomSubmit}
                onCancel={() => { }}
                closable={false}
                maskClosable={false}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <Form
                    form={roomForm}
                    layout="vertical"
                    initialValues={{ roomNumber: '' }}
                >
                    <Form.Item
                        name="roomNumber"
                        label="Số phòng khám"
                        rules={[{ required: true, message: 'Vui lòng nhập số phòng khám!' }]}
                    >
                        <AntInput placeholder="Ví dụ: 101" />
                    </Form.Item>
                    <p className="text-gray-500 italic">Vui lòng nhập số phòng khám để bắt đầu phiên làm việc.</p>
                </Form>
            </Modal>

            {/* Modal thông tin bệnh nhân */}
            <Modal
                title="Thông tin bệnh nhân"
                open={patientModalVisible}
                onOk={completeExamination}
                onCancel={() => { }}
                width={700}
                okText="Hoàn tất khám bệnh"
                cancelText="Đóng"
                confirmLoading={submittingNote}
                closable={false}
                maskClosable={false}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                {currentPatient && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">Tên người đặt:</p>
                                <p>{currentPatient.name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tên thú cưng:</p>
                                <p>{currentPatient.petName}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Loại:</p>
                                <p>{currentPatient.type}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Giống:</p>
                                <p>{currentPatient.breed}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tình trạng sức khỏe:</p>
                                <p>{currentPatient.healthStatus}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tiền sử bệnh:</p>
                                <p>{currentPatient.healthHistory || 'Không có'}</p>
                            </div>
                        </div>

                        <Form form={noteForm} layout="vertical">
                            <Form.Item
                                name="patientNote"
                                label={<span className="text-blue-600 font-semibold">Ghi chú của bệnh nhân</span>}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Ghi chú của bệnh nhân..."
                                    className="bg-blue-50"
                                    disabled
                                />
                            </Form.Item>

                            <Divider className="my-2" />

                            <Form.Item
                                name="doctorNote"
                                label={<span className="text-green-600 font-semibold">Kết quả khám và chẩn đoán của bác sĩ</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập kết quả khám!' }]}
                            >
                                <TextArea
                                    rows={6}
                                    placeholder="Nhập kết quả khám, chẩn đoán và đơn thuốc..."
                                    className="bg-green-50"
                                />
                            </Form.Item>
                            <p className="text-red-500 font-semibold">* Lưu ý: Bạn không thể đóng cửa sổ này cho đến khi hoàn tất khám bệnh.</p>
                        </Form>
                    </div>
                )}
            </Modal>

            {/* Modal xem chi tiết lịch khám */}
            <Modal
                title="Chi tiết lịch khám"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Đóng
                    </Button>,
                ]}
                width={700}
            >
                {appointmentDetail && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">ID:</p>
                                <p>{appointmentDetail.id}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tên người đặt:</p>
                                <p>{appointmentDetail.name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tên thú cưng:</p>
                                <p>{appointmentDetail.petName}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Loại:</p>
                                <p>{appointmentDetail.type}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Giống:</p>
                                <p>{appointmentDetail.breed}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tình trạng sức khỏe:</p>
                                <p>{appointmentDetail.healthStatus}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tiền sử bệnh:</p>
                                <p>{appointmentDetail.healthHistory || 'Không có'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Thời gian hẹn:</p>
                                <p>{new Date(appointmentDetail.appointmentTime).toLocaleString('vi-VN')}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Thời gian check-in:</p>
                                <p>{appointmentDetail.checkInTime ? new Date(appointmentDetail.checkInTime).toLocaleString('vi-VN') : 'Chưa check-in'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Bác sĩ thăm khám:</p>
                                <p>{appointmentDetail.assignedDoctorName}</p>
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold">Ghi chú và kết quả khám:</p>
                            {formatNote(appointmentDetail.note)}
                        </div>
                    </div>
                )}
            </Modal>

            <Footer />
        </div>
    );
};

export default DoctorDashboard; 