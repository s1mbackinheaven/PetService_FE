import { useState, useEffect } from 'react';
import { Slider, Select, Pagination, Input } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/layout/header/header';
import Footer from '../components/layout/footer/footer';
import Toast from '../components/Toast';

const ShopPage = () => {
    const navigate = useNavigate();
    // State cho khoảng giá
    const [priceRange, setPriceRange] = useState([0, 10000000]); // Khoảng giá từ 0 đến 10 triệu đồng
    const [selectedCategory, setSelectedCategory] = useState('all'); // Danh mục được chọn
    const [products, setProducts] = useState([]); // Danh sách sản phẩm
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [sortOption, setSortOption] = useState('default'); // Tùy chọn sắp xếp
    const [cart, setCart] = useState([]); // Giỏ hàng
    const [showCart, setShowCart] = useState(false); // Hiển thị giỏ hàng
    const pageSize = 12; // Số lượng sản phẩm mỗi trang
    const [searchKeyword, setSearchKeyword] = useState(''); // Từ khóa tìm kiếm
    const [searchTimeout, setSearchTimeout] = useState(null); // Timeout for debounce

    // State cho toast thông báo
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success'
    });

    // Các danh mục tạm thời
    const categories = [
        { value: 'all', label: 'Tất cả' },
        { value: 'health', label: 'Sức khỏe' },
        { value: 'entertainment', label: 'Giải trí' },
        { value: 'hygiene', label: 'Vệ sinh' },
    ];

    // Các tùy chọn sắp xếp
    const sortOptions = [
        { value: 'default', label: 'Mặc định' },
        { value: 'price-high-to-low', label: 'Giá: Cao đến thấp' },
        { value: 'price-low-to-high', label: 'Giá: Thấp đến cao' },
        { value: 'name-a-z', label: 'Tên: A-Z' },
        { value: 'name-z-a', label: 'Tên: Z-A' },
        { value: 'discount', label: 'Đang giảm giá' },
    ];

    // Lấy dữ liệu sản phẩm từ API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/items');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Lỗi khi tải dữ liệu sản phẩm');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        } finally {
            setLoading(false);
        }
    };

    // Lấy dữ liệu sản phẩm khi component được render lần đầu
    useEffect(() => {
        fetchProducts();

        // Kiểm tra giỏ hàng đã lưu có hết hạn chưa
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

    // Sử dụng useEffect để lưu giỏ hàng vào localStorage mỗi khi giỏ hàng thay đổi
    useEffect(() => {
        if (cart.length > 0) {
            // Lưu giỏ hàng và thời gian hết hạn (2 giờ từ hiện tại)
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + 2);

            const cartData = {
                items: cart,
                expiration: expiration.getTime()
            };

            localStorage.setItem('cart', JSON.stringify(cartData));

            // Tạo sự kiện custom để thông báo giỏ hàng đã thay đổi
            window.dispatchEvent(new Event('storage'));
        }
    }, [cart]);

    // Xử lý thay đổi khoảng giá
    const handlePriceRangeChange = (value) => {
        setPriceRange(value);
    };

    // Xử lý thay đổi tùy chọn sắp xếp
    const handleSortChange = (value) => {
        setSortOption(value);
    };

    // Xử lý thay đổi danh mục
    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    // Xử lý chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Cuộn lên đầu danh sách sản phẩm
        window.scrollTo({
            top: document.getElementById('products-section').offsetTop - 120,
            behavior: 'smooth'
        });
    };

    // Xử lý tìm kiếm sản phẩm
    const handleSearch = (value) => {
        // Hủy timeout hiện tại nếu có
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Đặt từ khóa tìm kiếm
        setSearchKeyword(value);

        // Debounce tìm kiếm để tránh gọi API quá nhiều
        const timeout = setTimeout(() => {
            if (value.trim()) {
                searchProducts(value);
            } else {
                // Nếu từ khóa trống, lấy lại tất cả sản phẩm
                fetchProducts();
            }
        }, 500);

        setSearchTimeout(timeout);
    };

    // Gọi API tìm kiếm sản phẩm
    const searchProducts = async (keyword) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/items/search?keyword=${keyword}`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Lỗi khi tìm kiếm sản phẩm');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API tìm kiếm:', error);
        } finally {
            setLoading(false);
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = (product) => {
        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        let newCart;
        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên 1
            newCart = [...cart];
            newCart[existingItemIndex].quantity += 1;
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm với số lượng là 1
            newCart = [...cart, { ...product, quantity: 1 }];
        }

        setCart(newCart);

        // Lưu giỏ hàng và thời gian hết hạn
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 2);

        const cartData = {
            items: newCart,
            expiration: expiration.getTime()
        };

        localStorage.setItem('cart', JSON.stringify(cartData));

        // Tạo sự kiện custom để thông báo giỏ hàng đã thay đổi
        window.dispatchEvent(new Event('storage'));

        // Hiển thị toast thông báo
        setToast({
            visible: true,
            message: 'Đã thêm sản phẩm vào giỏ hàng!',
            type: 'success'
        });
    };

    // Thay đổi số lượng sản phẩm trong giỏ hàng
    const updateCartItemQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
            setCart(cart.filter(item => item.id !== productId));
        } else {
            // Cập nhật số lượng mới
            setCart(cart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    // Tính tổng tiền của giỏ hàng
    const calculateCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.discountedPrice || item.price;
            return total + price * item.quantity;
        }, 0);
    };

    // Lọc và sắp xếp sản phẩm
    const getFilteredAndSortedProducts = () => {
        let filteredProducts = [...products];

        // Lọc theo khoảng giá
        filteredProducts = filteredProducts.filter(product => {
            const price = product.price;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Lọc theo danh mục
        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product =>
                product.category?.toLowerCase() === selectedCategory
            );
        }

        // Sắp xếp sản phẩm
        switch (sortOption) {
            case 'price-high-to-low':
                filteredProducts.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
                break;
            case 'price-low-to-high':
                filteredProducts.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
                break;
            case 'name-a-z':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-z-a':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'discount':
                filteredProducts = filteredProducts.filter(product => product.discount > 0);
                break;
            default:
            // Mặc định không sắp xếp
        }

        return filteredProducts;
    };

    // Lấy sản phẩm cho trang hiện tại
    const getCurrentPageProducts = () => {
        const filteredAndSortedProducts = getFilteredAndSortedProducts();
        const startIndex = (currentPage - 1) * pageSize;
        return filteredAndSortedProducts.slice(startIndex, startIndex + pageSize);
    };

    // Định dạng số tiền thành chuỗi có dấu phân cách
    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN') + ' đ';
    };

    // Chuyển hướng đến trang chi tiết sản phẩm
    const navigateToProductDetail = (productId) => {
        navigate(`/product/${productId}`);
        window.scrollTo(0, 0);
    };

    // Xóa sản phẩm khỏi giỏ hàng
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

        // Hiển thị toast thông báo
        setToast({
            visible: true,
            message: 'Đã xóa sản phẩm khỏi giỏ hàng!',
            type: 'success'
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header with z-index to ensure it stays on top */}
            <div className="relative z-50">
                <AppHeader />
            </div>

            {/* Toast Component */}
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, visible: false })}
                />
            )}

            {/* Banner - đã bỏ pt-[110px] và thêm mt-0 */}
            <div className="relative">
                <div className="h-[250px] bg-[#fff] flex items-center mt-[136px]">
                    <div className="container mx-[236px] px-4 flex justify-between items-center text-[36px] font-[700] leading-[36px]">
                        <div>
                            <i className="text-[rgb(73,179,244)] text-[55px] drop-shadow-lg transform -rotate-2 text-shadow-custom-second">Pet Service</i>
                            <h2 className="text-[28px] font-[700] text-[#424242] mt-[6px] ml-[180px]">Cửa Hàng</h2>
                        </div>
                        <div className="w-[636px]">
                            <img
                                src="https://petservicehcm.com/wp-content/uploads/2021/04/pet-cover-1440x548.jpeg"
                                alt="Pet Shop Banner"
                                className="rounded-lg object-cover h-[180px] w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 py-8 flex-1">
                <div className="flex flex-col md:flex-row gap-8 mx-[160px]">
                    {/* Sidebar - Filters */}
                    <div className="md:w-1/4">
                        <div className="bg-white p-4 rounded-lg shadow mb-6">
                            <h2 className="text-xl font-bold mb-4 text-[#273171]">Khoảng giá</h2>
                            <Slider
                                range
                                min={0}
                                max={10000000}
                                step={100000}
                                value={priceRange}
                                onChange={handlePriceRangeChange}
                                tipFormatter={value => `${formatPrice(value)}`}
                                className="mb-4"
                            />
                            <div className="flex justify-between text-sm">
                                <span>{formatPrice(priceRange[0])}</span>
                                <span>{formatPrice(priceRange[1])}</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow mb-6">
                            <h2 className="text-xl font-bold mb-4 text-[#273171]">Danh mục</h2>
                            <Select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="w-full"
                                options={categories}
                            />
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4 text-[#273171]">Tìm kiếm</h2>
                            <Input
                                placeholder="Nhập từ khóa tìm kiếm..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={searchKeyword}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full"
                                allowClear
                            />
                        </div>
                    </div>

                    {/* Products */}
                    <div className="md:w-3/4" id="products-section">
                        {/* Products header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="font-medium">
                                    Hiển thị {getFilteredAndSortedProducts().length} sản phẩm
                                </span>
                            </div>
                            <div className="w-[200px]">
                                <Select
                                    value={sortOption}
                                    onChange={handleSortChange}
                                    className="w-full"
                                    options={sortOptions}
                                />
                            </div>
                        </div>

                        {/* Products grid */}
                        {loading ? (
                            <div className="text-center py-8">Đang tải...</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {getCurrentPageProducts().map((product) => (
                                        <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                                            <div
                                                className="relative h-[250px] overflow-hidden cursor-pointer"
                                                onClick={() => navigateToProductDetail(product.id)}
                                            >
                                                <img
                                                    src={product.imageUrl || 'https://via.placeholder.com/300x200'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {product.quantity === 0 && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                        <span className="text-white font-bold text-xl">Hết hàng</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 bg-[#273171] text-white px-2 py-1 rounded text-xs">
                                                    {product.type}
                                                </div>
                                                {product.discount > 0 && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                                                        -{product.discount}%
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className="p-4 cursor-pointer"
                                                onClick={() => navigateToProductDetail(product.id)}
                                            >
                                                <h3 className="font-semibold text-lg mb-2 h-[56px] overflow-hidden line-clamp-2">{product.name}</h3>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        {product.discount > 0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500 line-through text-sm">{formatPrice(product.price)}</span>
                                                                <span className="text-red-600 font-bold">{formatPrice(product.discountedPrice)}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-700 font-bold">{formatPrice(product.price)}</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        className={`p-2 rounded-full ${product.quantity === 0
                                                            ? 'bg-gray-300 cursor-not-allowed'
                                                            : 'bg-[#53a0e8] hover:bg-[#273171] text-white'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Ngăn chặn sự kiện nổi bọt để không chuyển trang
                                                            product.quantity > 0 && addToCart(product);
                                                        }}
                                                        disabled={product.quantity === 0}
                                                        aria-label="Thêm vào giỏ hàng"
                                                    >
                                                        <ShoppingCartOutlined />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {getFilteredAndSortedProducts().length > pageSize && (
                                    <div className="flex justify-center mt-8">
                                        <Pagination
                                            current={currentPage}
                                            pageSize={pageSize}
                                            total={getFilteredAndSortedProducts().length}
                                            onChange={handlePageChange}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Shopping cart popup */}
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
                                                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2">{item.quantity}</span>
                                                    <button
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm">
                                                        {formatPrice((item.discountedPrice || item.price) * item.quantity)}
                                                    </span>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                        onClick={() => handleRemoveItem(item.id)}
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

            {/* Shopping cart button */}
            <div
                className="fixed top-[636px] right-5 z-50 bg-[#273171] text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-[#53a0e8]"
                onClick={() => setShowCart(!showCart)}
                aria-label="Giỏ hàng"
            >
                <ShoppingCartOutlined style={{ fontSize: '20px' }} />
                {cart.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ShopPage; 