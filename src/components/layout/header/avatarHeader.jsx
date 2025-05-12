import { BellOutlined, AppstoreOutlined, ShoppingCartOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';

const AvatarHeader = () => {
    const navigate = useNavigate(); // Hook để điều hướng
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    // Lấy thông tin giỏ hàng từ localStorage khi component được render
    useEffect(() => {
        const savedCartData = localStorage.getItem('cart');
        if (savedCartData) {
            try {
                const cartData = JSON.parse(savedCartData);
                if (cartData.expiration) {
                    // Nếu có thời gian hết hạn
                    if (new Date().getTime() > cartData.expiration) {
                        // Giỏ hàng đã hết hạn, xóa khỏi localStorage
                        localStorage.removeItem('cart');
                        setCart([]);
                    } else {
                        // Giỏ hàng chưa hết hạn, sử dụng lại
                        setCart(cartData.items || []);
                    }
                } else {
                    // Định dạng cũ, không có thời gian hết hạn
                    setCart(Array.isArray(cartData) ? cartData : []);
                }
            } catch (error) {
                console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
                localStorage.removeItem('cart');
                setCart([]);
            }
        }
    }, []);

    // Cập nhật giỏ hàng khi localStorage thay đổi
    useEffect(() => {
        const handleStorageChange = () => {
            const savedCartData = localStorage.getItem('cart');
            if (savedCartData) {
                try {
                    const cartData = JSON.parse(savedCartData);
                    if (cartData.expiration && new Date().getTime() <= cartData.expiration) {
                        setCart(cartData.items || []);
                    } else if (!cartData.expiration) {
                        setCart(Array.isArray(cartData) ? cartData : []);
                    }
                } catch (error) {
                    console.error('Lỗi khi đọc giỏ hàng từ localStorage trong event listener:', error);
                }
            } else {
                setCart([]);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Hàm xử lý đăng xuất
    const handleLogout = async () => {
        try {
            setIsLoading(true);
            // Xóa token và thông tin user từ localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Hiển thị thông báo đăng xuất thành công (có thể thêm sau)

            // Chuyển hướng về trang chủ
            window.scrollTo(0, 0); // Reset vị trí scroll về đầu trang
            navigate('/homepage');
            window.location.reload(); // Load lại trang
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý chuyển hướng đến trang thông tin cá nhân
    const handleNavigateToUserProfile = () => {
        window.scrollTo(0, 0); // Reset vị trí scroll về đầu trang
        navigate('/userDetail');
    };

    // Hàm xử lý hiển thị/ẩn giỏ hàng
    const handleToggleCart = () => {
        setShowCart(!showCart);
    };

    // Hàm xử lý chuyển hướng đến trang cửa hàng
    const handleNavigateToShop = () => {
        window.scrollTo(0, 0);
        navigate('/shop');
    };

    // Hàm định dạng số tiền
    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN') + ' đ';
    };

    // Hàm tính tổng số lượng sản phẩm trong giỏ hàng
    const getTotalItems = () => {
        return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    };

    // Hàm tính tổng tiền giỏ hàng
    const calculateCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.discountedPrice || item.price;
            return total + price * (item.quantity || 1);
        }, 0);
    };

    // Hàm thay đổi số lượng sản phẩm trong giỏ hàng
    const updateCartItemQuantity = (productId, newQuantity) => {
        let updatedCart;
        if (newQuantity <= 0) {
            updatedCart = cart.filter(item => item.id !== productId);
        } else {
            updatedCart = cart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        }
        setCart(updatedCart);

        // Lưu giỏ hàng và thời gian hết hạn (2 giờ từ hiện tại)
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 2);

        const cartData = {
            items: updatedCart,
            expiration: expiration.getTime()
        };

        localStorage.setItem('cart', JSON.stringify(cartData));

        // Tạo sự kiện custom để thông báo giỏ hàng đã thay đổi
        window.dispatchEvent(new Event('storage'));
    };

    // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);

        // Lưu giỏ hàng và thời gian hết hạn (2 giờ từ hiện tại)
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 2);

        const cartData = {
            items: updatedCart,
            expiration: expiration.getTime()
        };

        localStorage.setItem('cart', JSON.stringify(cartData));

        // Tạo sự kiện custom để thông báo giỏ hàng đã thay đổi
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className='flex items-center'>
            <div
                className='flex ml-[35px] justify-center items-center rounded-full w-[40px] h-[40px] border border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)] relative'
                onClick={handleToggleCart}
            >
                <ShoppingCartOutlined style={{ backgroundColor: '' }} />
                {cart.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {getTotalItems()}
                    </div>
                )}
            </div>

            {/* Giỏ hàng popup - Sử dụng chính xác thiết kế từ shop.jsx */}
            <div
                className={`fixed top-[110px] right-0 w-[350px] bg-white shadow-xl z-50 transition-transform duration-300 transform ${showCart ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-[#273171]">Giỏ hàng</h2>
                        <button
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => setShowCart(false)}
                        >
                            ✕
                        </button>
                    </div>

                    {cart.length === 0 ? (
                        <p className="text-center py-4">Giỏ hàng của bạn còn trống</p>
                    ) : (
                        <>
                            <div className="max-h-[400px] overflow-y-auto">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-3 mb-4 pb-4 border-b">
                                        <img
                                            src={item.imageUrl || 'https://via.placeholder.com/50'}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border rounded">
                                                    <button
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateCartItemQuantity(item.id, (item.quantity || 1) - 1);
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2">{item.quantity || 1}</span>
                                                    <button
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateCartItemQuantity(item.id, (item.quantity || 1) + 1);
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm">
                                                        {formatPrice((item.discountedPrice || item.price) * (item.quantity || 1))}
                                                    </span>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveItem(item.id);
                                                        }}
                                                        aria-label="Xóa sản phẩm"
                                                    >
                                                        <DeleteOutlined />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between font-bold">
                                    <span>Tổng cộng:</span>
                                    <span>{formatPrice(calculateCartTotal())}</span>
                                </div>
                                <button
                                    className="mt-4 w-full bg-[#273171] text-white py-2 rounded hover:bg-[#53a0e8] transition-colors"
                                    onClick={() => {
                                        setShowCart(false);
                                        navigate('/checkout');
                                    }}
                                >
                                    Tiến hành thanh toán
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className='flex ml-[10px] justify-center items-center rounded-full w-[40px] h-[40px] border border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)]'>
                <AppstoreOutlined style={{ backgroundColor: '' }} />
            </div>
            <div className='flex ml-[10px] justify-center items-center rounded-full w-[40px] h-[40px] border border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)]'>
                <BellOutlined style={{ backgroundColor: '' }} />
            </div>

            <div className="relative group ml-[10px]">
                <div className="flex justify-center items-center rounded-full w-[40px] h-[40px] border border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)]">
                    <img className='w-full h-full object-cover rounded-full' src="https://pbs.twimg.com/media/FoUoGo3XsAMEPFr?format=jpg&name=4096x4096" alt="" />
                </div>
                <div className="absolute top-[40px] right-0 w-[40px] h-[10px] bg-transparent"></div>
                <div className="absolute top-[50px] right-0 border border-[#273172] bg-[#f4f4f4] hidden group-hover:block z-50">
                    <ul className="block">
                        <li className="hover:bg-[#eaeaea] py-[10px] mt-[10px] px-[10px]">
                            <a
                                className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px] cursor-pointer"
                                onClick={handleNavigateToUserProfile}
                            >
                                Thông tin cá nhân
                            </a>
                        </li>
                        <li className="hover:bg-[#eaeaea] py-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Thông tin Pet</a></li>
                        <li className="hover:bg-[#eaeaea] py-[10px] mb-[10px] px-[10px]">
                            <a
                                className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px] cursor-pointer"
                                onClick={handleLogout}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Spin size="small" />
                                        <span className="ml-2">Đang đăng xuất...</span>
                                    </div>
                                ) : (
                                    'Đăng xuất'
                                )}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {/* <li className="relative hover:cursor-pointer group">
                <a className="leading-[100px] text-[#273171] uppercase font-semibold group-hover:text-[#53a0e8]" href="">
                    Blog <DownOutlined />
                </a>

            </li> */}
        </div>
    );
}

export default AvatarHeader