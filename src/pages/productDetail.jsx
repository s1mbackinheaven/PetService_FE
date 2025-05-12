import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import AppHeader from '../components/layout/header/header';
import Footer from '../components/layout/footer/footer';
import Toast from '../components/Toast';

const ProductDetail = () => {
    const { id } = useParams(); // Lấy ID sản phẩm từ URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null); // Thông tin sản phẩm
    const [similarProducts, setSimilarProducts] = useState([]); // Các sản phẩm tương tự
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm muốn mua
    const [cart, setCart] = useState([]); // Giỏ hàng

    // State cho toast
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success'
    });

    // Lấy thông tin chi tiết sản phẩm từ API
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/items/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);

                    // Sau khi có thông tin sản phẩm, lấy các sản phẩm tương tự
                    if (data.category) {
                        fetchSimilarProducts(data.category);
                    }
                } else {
                    console.error('Lỗi khi tải dữ liệu sản phẩm');
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    // Lấy các sản phẩm tương tự từ API
    const fetchSimilarProducts = async (category) => {
        try {
            const response = await fetch(`http://localhost:8080/api/items/category/${category}`);
            if (response.ok) {
                const data = await response.json();
                // Lọc bỏ sản phẩm hiện tại khỏi danh sách các sản phẩm tương tự
                const filteredData = data.filter(item => item.id !== parseInt(id));
                // Giới hạn số lượng sản phẩm tương tự hiển thị
                setSimilarProducts(filteredData.slice(0, 4));
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu sản phẩm tương tự:', error);
        }
    };

    // Lấy giỏ hàng từ localStorage khi lần đầu load trang
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

    // Tăng số lượng sản phẩm
    const increaseQuantity = () => {
        if (product && quantity < product.quantity) {
            setQuantity(quantity + 1);
        }
    };

    // Giảm số lượng sản phẩm
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Xử lý khi người dùng nhập số lượng trực tiếp
    const handleQuantityChange = (e) => {
        const value = e.target.value;

        // Cho phép trường rỗng
        if (value === '') {
            setQuantity('');
            return;
        }

        // Kiểm tra nếu chỉ chứa ký tự số
        if (/^\d+$/.test(value)) {
            const numValue = parseInt(value, 10);

            // Nếu là số, cập nhật giá trị
            setQuantity(numValue);
        }
    };

    // Xử lý khi người dùng rời khỏi input
    const handleQuantityBlur = () => {
        // Nếu trường rỗng hoặc giá trị nhỏ hơn 1, đặt lại thành 1
        if (quantity === '' || parseInt(quantity, 10) < 1) {
            setQuantity(1);
        }
        // Nếu vượt quá số lượng tối đa
        else if (product && parseInt(quantity, 10) > product.quantity) {
            setToast({
                visible: true,
                message: `Số lượng tối đa có thể mua là ${product.quantity}`,
                type: 'error'
            });
            setQuantity(product.quantity);
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = () => {
        if (!product || product.quantity === 0) return;

        const productToAdd = {
            ...product,
            quantity: quantity
        };

        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        let newCart;
        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
            newCart = [...cart];
            newCart[existingItemIndex].quantity += parseInt(quantity, 10);
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            newCart = [...cart, productToAdd];
        }

        setCart(newCart);

        // Lưu giỏ hàng và thời gian hết hạn (2 giờ từ hiện tại)
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

    // Định dạng số tiền thành chuỗi có dấu phân cách
    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN') + ' đ';
    };

    // Chuyển hướng đến trang chi tiết sản phẩm khác
    const navigateToProduct = (productId) => {
        navigate(`/product/${productId}`);
        window.scrollTo(0, 0);
    };

    // Format mô tả sản phẩm từ text có \n thành các đoạn HTML
    const formatDescription = (description) => {
        if (!description) return '';
        return description.split('\n').map((line, index) => (
            <p key={index} className={`${line.startsWith('+') || line.startsWith('-') ? 'font-medium' : ''} ${line.startsWith('–') ? 'font-bold' : ''} mb-2`}>
                {line}
            </p>
        ));
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
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

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 pt-[136px] pb-4">
                <div className="mx-[160px] text-sm text-gray-500">
                    <a href="/" className="hover:text-[#53a0e8]">Trang chủ</a> /
                    <a href="/shop" className="hover:text-[#53a0e8]"> Sản phẩm diều trị</a> /
                    <span className="text-gray-700"> {product?.name}</span>
                </div>
            </div>

            {loading ? (
                <div className="container mx-auto px-4 py-8 flex-1 text-center">
                    <div className="mx-[160px]">Đang tải...</div>
                </div>
            ) : product ? (
                <>
                    {/* Product Detail */}
                    <div className="container mx-auto px-4 py-8 flex-1">
                        <div className="mx-[160px] bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Product Image */}
                                <div className="md:w-1/2">
                                    <img
                                        src={product.imageUrl || 'https://via.placeholder.com/500'}
                                        alt={product.name}
                                        className="w-full h-auto object-contain rounded-lg"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="md:w-1/2">
                                    <h1 className="text-3xl font-bold text-[#273171] mb-4">{product.name}</h1>

                                    <div className="mb-6">
                                        {product.discount > 0 ? (
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-500 line-through text-xl">{formatPrice(product.price)}</span>
                                                <span className="text-red-600 font-bold text-2xl">{formatPrice(product.discountedPrice)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-700 font-bold text-2xl">{formatPrice(product.price)}</span>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <span className="text-gray-600">Loại: <span className="font-medium">{product.type}</span></span>
                                    </div>

                                    <div className="mb-4">
                                        <span className="text-gray-600">Danh mục: <span className="font-medium">{product.category}</span></span>
                                    </div>

                                    <div className="mb-4">
                                        <span className="text-gray-600">
                                            Trạng thái:
                                            <span className={`ml-2 font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                            </span>
                                            {product.quantity > 0 && <span className="ml-2 text-sm">({product.quantity} sản phẩm)</span>}
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <div className="text-gray-600 mb-2">Số lượng:</div>
                                        <div className="flex items-center">
                                            <button
                                                className="border border-gray-300 py-1 px-3 rounded-l hover:bg-gray-100 cursor-pointer"
                                                onClick={decreaseQuantity}
                                                disabled={!quantity || quantity <= 1}
                                            >
                                                <MinusOutlined />
                                            </button>
                                            <input
                                                type="text"
                                                className="border-t border-b border-gray-300 py-1 px-3 w-16 text-center"
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                onBlur={handleQuantityBlur}
                                                style={{ appearance: 'textfield' }}
                                            />
                                            <button
                                                className="border border-gray-300 py-1 px-3 rounded-r hover:bg-gray-100 cursor-pointer"
                                                onClick={increaseQuantity}
                                                disabled={!product || !quantity || parseInt(quantity, 10) >= product.quantity}
                                            >
                                                <PlusOutlined />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            className={`flex items-center justify-center cursor-pointer gap-2 py-3 px-6 rounded-lg ${product.quantity > 0
                                                ? 'bg-[#273171] text-white hover:bg-[#53a0e8]'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                } transition-colors`}
                                            onClick={addToCart}
                                            disabled={product.quantity === 0}
                                        >
                                            <ShoppingCartOutlined /> Thêm vào giỏ hàng
                                        </button>
                                        <button
                                            className={`py-3 px-6 cursor-pointer rounded-lg ${product.quantity > 0
                                                ? 'bg-[#53a0e8] text-white hover:bg-[#273171]'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                } transition-colors`}
                                            disabled={product.quantity === 0}
                                        >
                                            Mua ngay
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Product Description */}
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold text-[#273171] mb-6">Mô tả sản phẩm</h2>
                                <div className="bg-gray-50 p-6 rounded-lg leading-relaxed">
                                    {formatDescription(product.description)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Products */}
                    {similarProducts.length > 0 && (
                        <div className="container mx-auto px-4 py-8">
                            <div className="mx-[160px]">
                                <h2 className="text-2xl font-bold text-[#4e57a4] mb-6 text-center">Sản phẩm tương tự</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {similarProducts.map((similarProduct) => (
                                        <div
                                            key={similarProduct.id}
                                            className="bg-white rounded-lg shadow overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                                            onClick={() => navigateToProduct(similarProduct.id)}
                                        >
                                            <div className="relative h-[250px] overflow-hidden">
                                                {/* Logo ở góc trên trái */}
                                                <div className="absolute top-2 left-2 z-10 w-14 h-14">
                                                    <img
                                                        src="https://petservicehcm.com/wp-content/uploads/2018/10/cropped-logo-PET-SERVICE-01-e1539050271677.png"
                                                        alt="PetService Logo"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>

                                                <img
                                                    src={similarProduct.imageUrl || 'https://via.placeholder.com/300x200'}
                                                    alt={similarProduct.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {similarProduct.quantity === 0 && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-[#4e57a4] font-bold text-xl bg-white/80 px-6 py-2 rounded">HẾT HÀNG</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <div className="text-sm text-[#53a0e8] mb-1">
                                                    {similarProduct.type === 'Thuốc' && similarProduct.category === 'Sức khỏe'
                                                        ? (similarProduct.name.toLowerCase().includes('mèo') ? 'Cho Mèo' : 'Cho Chó')
                                                        : similarProduct.category
                                                    }
                                                </div>
                                                <h3 className="font-semibold text-lg mb-2 h-[56px] overflow-hidden line-clamp-2 text-[#333]">{similarProduct.name}</h3>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        {similarProduct.discount > 0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500 line-through text-sm">{formatPrice(similarProduct.price)}</span>
                                                                <span className="text-red-600 font-bold">{formatPrice(similarProduct.discountedPrice)}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-700 font-bold">{formatPrice(similarProduct.price)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="container mx-auto px-4 py-8 flex-1 text-center">
                    <div className="mx-[160px]">Không tìm thấy sản phẩm!</div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ProductDetail; 