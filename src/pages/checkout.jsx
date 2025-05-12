import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Radio, Button, Card, List, Spin, notification } from 'antd';
import AppHeader from '../components/layout/header/header';
import Footer from '../components/layout/footer/footer';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [invoiceData, setInvoiceData] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formSubmitEnabled, setFormSubmitEnabled] = useState(true);

    // Lấy thông tin giỏ hàng từ localStorage khi component được render
    useEffect(() => {
        const savedCartData = localStorage.getItem('cart');
        if (savedCartData) {
            try {
                const cartData = JSON.parse(savedCartData);
                if (cartData.expiration && new Date().getTime() <= cartData.expiration) {
                    setCart(cartData.items || []);
                } else if (!cartData.expiration) {
                    setCart(Array.isArray(cartData) ? cartData : []);
                } else {
                    // Giỏ hàng đã hết hạn, chuyển về trang shop
                    notification.error({
                        message: 'Giỏ hàng đã hết hạn',
                        description: 'Vui lòng thêm sản phẩm vào giỏ hàng lại.',
                        duration: 3
                    });
                    navigate('/shop');
                }
            } catch (error) {
                console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
                notification.error({
                    message: 'Lỗi đọc dữ liệu giỏ hàng',
                    description: 'Không thể đọc thông tin giỏ hàng. Vui lòng thử lại.',
                    duration: 3
                });
                navigate('/shop');
            }
        } else {
            // Không có giỏ hàng, chuyển về trang shop
            notification.info({
                message: 'Giỏ hàng trống',
                description: 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.',
                duration: 3
            });
            navigate('/shop');
        }
    }, [navigate]);

    // Định dạng số tiền thành chuỗi có dấu phân cách
    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN') + ' đ';
    };

    // Tính tổng tiền của giỏ hàng
    const calculateCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.discountedPrice || item.price;
            return total + price * (item.quantity || 1);
        }, 0);
    };

    // Tính tổng số lượng sản phẩm
    const calculateTotalItems = () => {
        return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    };

    // Kiểm tra trạng thái form trước khi submit
    const checkFormBeforeSubmit = (values) => {
        console.log("Form values trước khi gửi:", values);

        // Hiển thị thông báo xác nhận
        notification.info({
            message: 'Đang xử lý',
            description: 'Đang xử lý đơn hàng của bạn...',
            duration: 2
        });

        return true; // Cho phép form tiếp tục submit
    };

    // Xử lý khi submit form
    const handleSubmit = async (values) => {
        if (!checkFormBeforeSubmit(values) || !formSubmitEnabled) {
            return;
        }

        console.log("Bắt đầu xử lý đặt hàng...");
        setLoading(true);
        setFormSubmitEnabled(false); // Vô hiệu hóa nút submit để tránh nhấn nhiều lần

        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            console.log("Token hiện tại:", token ? "Có token" : "Không có token");

            // Lấy thông tin user từ localStorage (dự phòng)
            const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

            // Khai báo biến để lưu userID
            let userId = userInfo.id;

            if (!token) {
                notification.warning({
                    message: 'Chưa đăng nhập',
                    description: 'Bạn sẽ đặt hàng với tư cách khách. Để theo dõi đơn hàng tốt hơn, hãy đăng nhập trước khi đặt hàng.',
                    duration: 5
                });
                // Tiếp tục với userID mặc định thay vì chuyển hướng
            } else {
                // Giải mã token để lấy userID
                try {
                    // Lấy phần payload của token (phần thứ 2)
                    const base64Payload = token.split('.')[1];
                    // Giải mã base64
                    const jsonPayload = decodeURIComponent(atob(base64Payload).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    const decodedToken = JSON.parse(jsonPayload);
                    console.log("Token đã giải mã:", decodedToken);
                    // Kiểm tra xem token có chứa id không
                    if (decodedToken.id) {
                        userId = decodedToken.id;
                        console.log("UserID từ token:", userId);
                    } else {
                        console.log("Token không chứa userId, sử dụng userID từ userInfo");
                    }
                } catch (tokenError) {
                    console.error("Lỗi khi giải mã token:", tokenError);
                }
            }

            // Chuẩn bị dữ liệu cho API
            const requestData = {
                userId: userId,
                items: cart.map(item => ({
                    itemId: item.id,
                    quantity: item.quantity || 1
                })),
                shippingAddress: values.shippingAddress,
                paymentMethod: values.paymentMethod
            };

            console.log("Dữ liệu gửi đi:", requestData);

            // Gọi API tạo đơn hàng
            console.log("Đang gọi API...");

            // Thiết lập timeout để ngắt kết nối nếu API quá lâu
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout sau 10 giây

            try {
                const response = await fetch('http://localhost:8080/api/invoices', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    body: JSON.stringify(requestData),
                    signal: controller.signal
                });

                clearTimeout(timeoutId); // Xóa timeout vì đã nhận được phản hồi
                console.log("Kết quả API - status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Dữ liệu trả về:", data);
                    setInvoiceData(data);

                    // Xử lý theo phương thức thanh toán
                    if (values.paymentMethod === 'BANKING') {
                        setShowQRCode(true);
                    } else {
                        setOrderComplete(true);
                        // Xóa giỏ hàng sau khi đặt hàng thành công
                        localStorage.removeItem('cart');

                        notification.success({
                            message: 'Đặt hàng thành công',
                            description: 'Đơn hàng của bạn đã được đặt thành công. Cảm ơn bạn đã mua hàng!',
                            duration: 5
                        });
                    }
                } else {
                    let errorMessage = 'Lỗi khi tạo đơn hàng';
                    try {
                        const errorData = await response.json();
                        console.error("Lỗi API:", errorData);
                        errorMessage = errorData.message || errorMessage;
                    } catch (parseError) {
                        console.error("Không thể parse lỗi JSON:", parseError);
                    }

                    notification.error({
                        message: 'Lỗi đặt hàng',
                        description: errorMessage,
                        duration: 5
                    });
                }
            } catch (fetchError) {
                clearTimeout(timeoutId);
                console.error("Lỗi fetch API:", fetchError);

                if (fetchError.name === 'AbortError') {
                    notification.error({
                        message: 'Kết nối bị gián đoạn',
                        description: 'Máy chủ không phản hồi. Vui lòng thử lại sau.',
                        duration: 5
                    });
                } else {
                    notification.error({
                        message: 'Lỗi kết nối',
                        description: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra API endpoint.',
                        duration: 5
                    });
                }

                // Xử lý dự phòng cho trường hợp API không hoạt động (chỉ dùng cho demo)
                handleFallbackOrderCreation(values, requestData);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API tạo đơn hàng:', error);
            notification.error({
                message: 'Lỗi kết nối',
                description: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.',
                duration: 5
            });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setFormSubmitEnabled(true); // Cho phép submit lại sau 2 giây
            }, 2000);
        }
    };

    // Xử lý khi người dùng xác nhận thanh toán banking
    const handleConfirmPayment = () => {
        setOrderComplete(true);
        // Xóa giỏ hàng sau khi đặt hàng thành công
        localStorage.removeItem('cart');

        notification.success({
            message: 'Xác nhận thanh toán',
            description: 'Cảm ơn bạn đã đặt hàng! Đơn hàng sẽ được xử lý sau khi chúng tôi nhận được thanh toán.',
            duration: 5
        });
    };

    // Xử lý khi người dùng quay lại cửa hàng
    const handleBackToShop = () => {
        navigate('/shop');
    };

    // Hiển thị hóa đơn chi tiết
    const renderInvoiceDetails = () => {
        if (!invoiceData) return null;

        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-[#273171] mb-4">Chi tiết đơn hàng #{invoiceData.id}</h2>

                <div className="mb-4">
                    <p><span className="font-semibold">Khách hàng:</span> {invoiceData.userName}</p>
                    <p><span className="font-semibold">Địa chỉ giao hàng:</span> {invoiceData.shippingAddress}</p>
                    <p><span className="font-semibold">Phương thức thanh toán:</span> {invoiceData.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}</p>
                    <p><span className="font-semibold">Trạng thái:</span> {invoiceData.statusDisplayValue}</p>
                    <p><span className="font-semibold">Ngày đặt hàng:</span> {new Date(invoiceData.createdAt).toLocaleString('vi-VN')}</p>
                </div>

                <div className="border-t border-b py-4 my-4">
                    <h3 className="font-semibold mb-2">Sản phẩm đã đặt:</h3>
                    <List
                        itemLayout="horizontal"
                        dataSource={invoiceData.items}
                        renderItem={item => (
                            <List.Item>
                                <div className="flex justify-between w-full">
                                    <div>
                                        <p className="font-medium">{item.itemName}</p>
                                        <p className="text-sm text-gray-500">
                                            Số lượng: {item.quantity} x {formatPrice(item.price)}
                                            {item.discount > 0 && ` (Giảm giá: ${item.discount}%)`}
                                        </p>
                                    </div>
                                    <p className="font-bold">{formatPrice(item.subtotal)}</p>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <div className="text-right">
                        <p className="font-semibold">Tổng số lượng: {invoiceData.totalItems}</p>
                        <p className="text-xl font-bold text-[#273171]">Tổng thanh toán: {formatPrice(invoiceData.items.reduce((total, item) => total + item.subtotal, 0))}</p>
                    </div>
                </div>
            </div>
        );
    };

    // Hiển thị QR code thanh toán
    const renderQRPayment = () => {
        if (!showQRCode || !invoiceData) return null;

        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-bold text-[#273171] mb-4">Quét mã QR để thanh toán</h2>
                <div className="flex justify-center">
                    <div className="border p-4 rounded-lg inline-block">
                        <img
                            src="/qrbankBack.png"
                            alt="QR Code Thanh Toán"
                            className="max-w-[300px]"
                        />
                    </div>
                </div>
                <div className="mt-4 text-left">
                    <p className="font-semibold">Hướng dẫn thanh toán:</p>
                    <ol className="list-decimal list-inside mt-2 text-gray-700">
                        <li>Mở ứng dụng ngân hàng hoặc ví điện tử của bạn</li>
                        <li>Quét mã QR để thanh toán</li>
                        <li className="font-medium text-red-600">Quan trọng: Vui lòng điền ID đơn hàng {invoiceData.id} trong nội dung chuyển khoản</li>
                        <li>Hoàn tất giao dịch theo hướng dẫn của ngân hàng</li>
                        <li>Nhấn nút "Xác nhận đã thanh toán" sau khi hoàn tất</li>
                    </ol>
                </div>
                <div className="mt-6">
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleConfirmPayment}
                        className="bg-[#273171] hover:bg-[#53a0e8] text-white"
                    >
                        Xác nhận đã thanh toán
                    </Button>
                </div>
            </div>
        );
    };

    // Hiển thị màn hình hoàn tất đơn hàng
    const renderOrderComplete = () => {
        if (!orderComplete) return null;

        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-green-500 text-6xl mb-4">
                    <i className="fas fa-check-circle"></i>
                </div>
                <h2 className="text-2xl font-bold text-[#273171] mb-4">Đặt hàng thành công!</h2>
                <p className="mb-6">Cảm ơn bạn đã mua sắm tại Pet Service. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
                <p className="font-medium mb-2">Mã đơn hàng: #{invoiceData?.id}</p>
                <p className="text-gray-600 mb-6">Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi" trong tài khoản.</p>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleBackToShop}
                    className="bg-[#273171] hover:bg-[#53a0e8] text-white"
                >
                    Tiếp tục mua sắm
                </Button>
            </div>
        );
    };

    // Xử lý dự phòng cho trường hợp API không hoạt động (chỉ dùng cho demo)
    const handleFallbackOrderCreation = (values, requestData) => {
        console.log("Đang tạo đơn hàng dự phòng...");

        // Tạo dữ liệu mẫu dựa trên thông tin giỏ hàng
        const mockInvoiceData = {
            id: Math.floor(Math.random() * 1000) + 1,
            userId: requestData.userId,
            userName: JSON.parse(localStorage.getItem('user') || '{}').name || "Khách hàng",
            items: cart.map(item => ({
                id: Math.floor(Math.random() * 1000) + 1,
                itemId: item.id,
                itemName: item.name,
                quantity: item.quantity || 1,
                price: item.price,
                discount: item.discount || 0,
                subtotal: (item.discountedPrice || item.price) * (item.quantity || 1)
            })),
            totalItems: calculateTotalItems(),
            totalAmount: calculateCartTotal(),
            status: "PENDING",
            statusDisplayValue: "Đang thanh toán",
            shippingAddress: values.shippingAddress,
            paymentMethod: values.paymentMethod,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paidAt: null,
            completedAt: null
        };

        console.log("Đơn hàng dự phòng đã tạo:", mockInvoiceData);
        setInvoiceData(mockInvoiceData);

        // Xử lý theo phương thức thanh toán
        if (values.paymentMethod === 'BANKING') {
            setShowQRCode(true);
            notification.info({
                message: 'Demo Mode',
                description: 'API không hoạt động. Đang hiển thị thanh toán mẫu cho demo.',
                duration: 5
            });
        } else {
            setOrderComplete(true);
            // Xóa giỏ hàng
            localStorage.removeItem('cart');

            notification.info({
                message: 'Demo Mode',
                description: 'API không hoạt động. Đơn hàng đã được tạo ở chế độ demo.',
                duration: 5
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="relative z-50">
                <AppHeader />
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 py-8 flex-1 mt-[136px]">
                <h1 className="text-2xl font-bold text-[#273171] mb-6">Thanh toán</h1>

                {/* Hiển thị màn hình hoàn tất hoặc QR code thanh toán nếu có */}
                {orderComplete ? renderOrderComplete() : showQRCode ? (
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2">
                            {renderInvoiceDetails()}
                        </div>
                        <div className="md:w-1/2">
                            {renderQRPayment()}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Form thanh toán */}
                        <div className="md:w-1/2">
                            <Card title="Thông tin thanh toán" className="mb-6">
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        paymentMethod: 'COD'
                                    }}
                                >
                                    <Form.Item
                                        name="shippingAddress"
                                        label="Địa chỉ giao hàng"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập địa chỉ giao hàng' },
                                            { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự' }
                                        ]}
                                    >
                                        <Input.TextArea
                                            rows={4}
                                            placeholder="Nhập địa chỉ chi tiết để giao hàng"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="paymentMethod"
                                        label="Phương thức thanh toán"
                                        rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
                                    >
                                        <Radio.Group>
                                            <div className="flex flex-col gap-4">
                                                <Radio value="COD" className="p-3 border rounded hover:bg-gray-50">
                                                    <div className="ml-2">
                                                        <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                                                        <p className="text-sm text-gray-500">Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng</p>
                                                    </div>
                                                </Radio>
                                                <Radio value="BANKING" className="p-3 border rounded hover:bg-gray-50">
                                                    <div className="ml-2">
                                                        <p className="font-medium">Chuyển khoản ngân hàng</p>
                                                        <p className="text-sm text-gray-500">Thanh toán qua chuyển khoản đến tài khoản ngân hàng của chúng tôi</p>
                                                    </div>
                                                </Radio>
                                            </div>
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            loading={loading}
                                            disabled={!formSubmitEnabled}
                                            className="w-full bg-[#273171] hover:bg-[#53a0e8]"
                                            onClick={() => console.log("Nút đặt hàng được click")}
                                        >
                                            Xác nhận đặt hàng
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </div>

                        {/* Chi tiết đơn hàng */}
                        <div className="md:w-1/2">
                            <Card title="Chi tiết đơn hàng" className="mb-6">
                                {cart.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p>Giỏ hàng của bạn đang trống</p>
                                    </div>
                                ) : (
                                    <>
                                        <List
                                            className="mb-4"
                                            itemLayout="horizontal"
                                            dataSource={cart}
                                            renderItem={item => (
                                                <List.Item>
                                                    <div className="flex w-full">
                                                        <img
                                                            src={item.imageUrl || 'https://via.placeholder.com/50'}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded mr-4"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-medium">{item.name}</h3>
                                                            <div className="flex justify-between mt-2">
                                                                <span>
                                                                    {item.quantity || 1} x {formatPrice(item.discountedPrice || item.price)}
                                                                </span>
                                                                <span className="font-bold">
                                                                    {formatPrice((item.discountedPrice || item.price) * (item.quantity || 1))}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </List.Item>
                                            )}
                                        />

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between mb-2">
                                                <span>Tổng số lượng:</span>
                                                <span>{calculateTotalItems()} sản phẩm</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Tổng thanh toán:</span>
                                                <span>{formatPrice(calculateCartTotal())}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CheckoutPage; 