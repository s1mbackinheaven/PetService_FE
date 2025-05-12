import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

// Component hiển thị sidebar của trang blog
const BlogSidebar = ({ onSearch, categories, selectedCategory, onCategorySelect }) => {
    // State lưu từ khóa tìm kiếm
    const [searchKeyword, setSearchKeyword] = useState('');
    // State lưu trạng thái loading khi tìm kiếm
    const [searching, setSearching] = useState(false);

    // Danh sách các bài viết mới (tạm thời)
    const recentPosts = [
        { id: 1, title: 'Bí Quyết Chăm Sóc Mèo Con Mới Nhận Nuôi Tại TPHCM', date: '12 Th4 2025' },
        { id: 2, title: 'Dịch Vụ Trông Giữ Thú Cưng Quận 7 – Linh Hoạt Từ Pet Service', date: '11 Th3 2025' },
        { id: 3, title: 'Spa Uy Tín Quận 7 – Top Mẹo Chọn spa thú cưng Từ Pet Service', date: '05 Th3 2025' },
        { id: 4, title: 'Hướng Dẫn Cách Tắm Cho Chó Con Lần Đầu Không Sợ Nước', date: '20 Th2 2025' },
        { id: 5, title: 'TOP 5 Loại Thức Ăn Cho Mèo Con Dưới 1 Tháng Tuổi Tốt Nhất', date: '15 Th2 2025' },
    ];

    // Hàm xử lý tìm kiếm
    const handleSearch = () => {
        if (!searchKeyword.trim()) return;

        try {
            setSearching(true);
            // Gọi hàm tìm kiếm từ component cha
            onSearch(searchKeyword);
        } catch (error) {
            console.error('Lỗi tìm kiếm:', error);
        } finally {
            setSearching(false);
        }
    };

    // Hàm xử lý khi nhấn Enter trong input tìm kiếm
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Hàm xử lý khi xóa từ khóa tìm kiếm
    const handleClearSearch = () => {
        setSearchKeyword('');
        onSearch(''); // Gọi hàm tìm kiếm từ component cha với từ khóa rỗng
    };

    // Hàm xử lý khi thay đổi giá trị input tìm kiếm
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearchKeyword(newValue);

        // Nếu xóa hết từ khóa trong input, tự động hiển thị lại tất cả bài viết
        if (newValue === '') {
            onSearch('');
        }
    };

    return (
        <div className="space-y-8">
            {/* Thanh tìm kiếm */}
            <motion.div
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tìm kiếm</h3>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập từ khóa..."
                        value={searchKeyword}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    {searchKeyword && (
                        <button
                            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={handleClearSearch}
                        >
                            ✕
                        </button>
                    )}
                    <motion.button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                        onClick={handleSearch}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <SearchOutlined style={{ fontSize: '18px' }} />
                    </motion.button>
                </div>

                {/* Hiển thị trạng thái tìm kiếm */}
                {searching && (
                    <div className="mt-4 flex justify-center py-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                    </div>
                )}
            </motion.div>

            {/* Danh mục */}
            <motion.div
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">DANH MỤC</h3>
                <ul className="space-y-3">
                    {categories.map(category => (
                        <motion.li
                            key={category.id}
                            className="flex items-center"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ x: 5 }}
                        >
                            <button
                                className={`flex items-center space-x-2 text-gray-700 hover:text-blue-600 ${selectedCategory === category.id ? 'text-blue-600 font-medium' : ''}`}
                                onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full border ${selectedCategory === category.id ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}
                                >
                                    {selectedCategory === category.id && (
                                        <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5" />
                                    )}
                                </div>
                                <span>{category.name}</span>
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Bài viết mới */}
            <motion.div
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">BÀI VIẾT MỚI</h3>
                <ul className="space-y-4">
                    {recentPosts.map((post, index) => (
                        <motion.li
                            key={post.id}
                            className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                            whileHover={{ x: 5, backgroundColor: "#f9fafb", borderRadius: "4px" }}
                        >
                            <a href="#" className="block hover:text-blue-600 transition-colors">
                                <h4 className="text-gray-800 font-medium">{post.title}</h4>
                                <div className="text-xs text-gray-500 mt-1 flex items-center">
                                    <span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-2" />
                                    {post.date}
                                </div>
                            </a>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
};

export default BlogSidebar; 