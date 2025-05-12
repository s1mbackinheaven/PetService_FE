import React from 'react';

const OrderDetailModal = ({ order, onClose, formatCurrency, formatDate, updateOrderStatus }) => {
    // Hàm xử lý khi xác nhận hoàn thành đơn hàng
    const handleCompleteOrder = () => {
        updateOrderStatus(order.id, 'COMPLETED');
        onClose(); // Đóng modal sau khi xác nhận
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 1000 }}>
            {/* Overlay nền mờ nhẹ */}
            <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>

            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-[90%] max-h-[85vh] overflow-y-auto border border-gray-200">
                <div className="p-6">
                    {/* Header với nút đóng */}
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h3 className="text-xl font-semibold text-[#273172]">
                            Chi tiết đơn hàng #{order.id}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none hover:cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Thông tin chung */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-600">Khách hàng:</p>
                            <p className="font-medium">{order.userName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Ngày đặt hàng:</p>
                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Trạng thái:</p>
                            <p className={`inline-block px-2 py-1 rounded-full text-xs font-semibold 
                                ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${order.status === 'PAID' ? 'bg-blue-100 text-blue-800' : ''}
                                ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                                ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}`
                            }>
                                {order.statusDisplayValue}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Phương thức thanh toán:</p>
                            <p className="font-medium">{order.paymentMethod}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-gray-600">Địa chỉ giao hàng:</p>
                            <p className="font-medium">{order.shippingAddress}</p>
                        </div>
                        {order.paidAt && (
                            <div>
                                <p className="text-sm text-gray-600">Ngày thanh toán:</p>
                                <p className="font-medium">{formatDate(order.paidAt)}</p>
                            </div>
                        )}
                        {order.completedAt && (
                            <div>
                                <p className="text-sm text-gray-600">Ngày hoàn thành:</p>
                                <p className="font-medium">{formatDate(order.completedAt)}</p>
                            </div>
                        )}
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-lg mb-3">Sản phẩm đã đặt</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-2">Sản phẩm</th>
                                        <th scope="col" className="px-4 py-2">Giá</th>
                                        <th scope="col" className="px-4 py-2">Số lượng</th>
                                        <th scope="col" className="px-4 py-2">Giảm giá</th>
                                        <th scope="col" className="px-4 py-2">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="bg-white border-b">
                                            <td className="px-4 py-3">{item.itemName}</td>
                                            <td className="px-4 py-3">{formatCurrency(item.price)}</td>
                                            <td className="px-4 py-3">{item.quantity}</td>
                                            <td className="px-4 py-3">{item.discount}%</td>
                                            <td className="px-4 py-3 font-medium">{formatCurrency(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tổng cộng */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Tổng số lượng:</span>
                            <span>{order.totalItems} sản phẩm</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Tổng thanh toán:</span>
                            <span className="text-[#273172]">{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>

                    {/* Nút Xác nhận hoàn thành - chỉ hiển thị khi trạng thái là PAID */}
                    {order.status === 'PAID' && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleCompleteOrder}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md hover:cursor-pointer transition duration-200"
                            >
                                Xác nhận đã hoàn thành đơn hàng
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal; 