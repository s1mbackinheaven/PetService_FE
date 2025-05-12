import { useState, useEffect } from 'react';
import OrderDetailModal from './OrderDetailModal';

const OrderInfo = ({ userId }) => {
    // State để lưu danh sách đơn hàng
    const [orders, setOrders] = useState([]);
    // State để quản lý phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5);
    // State để quản lý chi tiết đơn hàng
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    // State để quản lý thông báo
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Hàm để lấy danh sách đơn hàng của người dùng
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Lấy token từ localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Không tìm thấy token trong localStorage');
                    return;
                }

                const response = await fetch(`http://localhost:8080/api/invoices/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error('Lỗi khi lấy danh sách đơn hàng:', await response.text());
                }
            } catch (error) {
                console.error('Lỗi khi gọi API lấy danh sách đơn hàng:', error);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    // Hàm để lấy chi tiết đơn hàng
    const fetchOrderDetail = async (orderId) => {
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Không tìm thấy token trong localStorage');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/invoices/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedOrder(data);
                setShowDetailModal(true);
            } else {
                console.error('Lỗi khi lấy chi tiết đơn hàng:', await response.text());
            }
        } catch (error) {
            console.error('Lỗi khi gọi API lấy chi tiết đơn hàng:', error);
        }
    };

    // Hàm để cập nhật trạng thái đơn hàng
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Không tìm thấy token trong localStorage');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/invoices/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Cập nhật trạng thái trong danh sách đơn hàng
                setOrders(orders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus, statusDisplayValue: newStatus === 'COMPLETED' ? 'Đã hoàn thành' : 'Đã thanh toán' }
                        : order
                ));

                // Hiển thị thông báo thành công
                setNotification({
                    show: true,
                    message: 'Cập nhật trạng thái đơn hàng thành công',
                    type: 'success'
                });

                // Ẩn thông báo sau 3 giây
                setTimeout(() => {
                    setNotification({ show: false, message: '', type: '' });
                }, 3000);
            } else {
                console.error('Lỗi khi cập nhật trạng thái đơn hàng:', await response.text());

                // Hiển thị thông báo lỗi
                setNotification({
                    show: true,
                    message: 'Cập nhật trạng thái đơn hàng thất bại',
                    type: 'error'
                });

                // Ẩn thông báo sau 3 giây
                setTimeout(() => {
                    setNotification({ show: false, message: '', type: '' });
                }, 3000);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API cập nhật trạng thái đơn hàng:', error);

            // Hiển thị thông báo lỗi
            setNotification({
                show: true,
                message: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng',
                type: 'error'
            });

            // Ẩn thông báo sau 3 giây
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
        }
    };

    // Hàm định dạng số tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Hàm định dạng ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Tính toán phân trang
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    // Hàm để thay đổi trang
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Hàm để chuyển đến trang trước
    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    // Hàm để chuyển đến trang sau
    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="absolute top-[-300px] left-[320px] w-[800px] bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#273172] mb-4">Đơn Hàng Của Tôi</h2>

            {/* Hiển thị thông báo */}
            {notification.show && (
                <div className={`mb-4 p-3 rounded-md ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {notification.message}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                </div>
            ) : (
                <div>
                    <div className="overflow-x-auto relative">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Mã đơn hàng</th>
                                    <th scope="col" className="px-6 py-3">Tổng tiền</th>
                                    <th scope="col" className="px-6 py-3 w-[140px]">Trạng thái</th>
                                    <th scope="col" className="px-6 py-3 w-[200px]">Ngày tạo</th>
                                    <th scope="col" className="px-6 py-3">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.map((order) => (
                                    <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4">{formatCurrency(order.totalAmount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${order.status === 'PAID' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                                                ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}`
                                            }>
                                                {order.statusDisplayValue}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => fetchOrderDetail(order.id)}
                                                className="font-medium text-blue-600 hover:text-blue-900 hover:cursor-pointer"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-4 space-x-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:cursor-pointer'}`}
                            >
                                Trước
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 rounded-md hover:cursor-pointer ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:cursor-pointer'}`}
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal chi tiết đơn hàng */}
            {showDetailModal && selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setShowDetailModal(false)}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    updateOrderStatus={updateOrderStatus}
                />
            )}
        </div>
    );
};

export default OrderInfo; 