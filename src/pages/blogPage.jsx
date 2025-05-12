import { useState, useEffect } from 'react';
import Header from "../components/layout/header/header";
import Footer from "../components/layout/footer/footer";
import BlogHeader from "../components/blog/BlogHeader";
import BlogContent from "../components/blog/BlogContent";
import BlogSidebar from "../components/blog/BlogSidebar";
import { motion } from 'framer-motion';

const BlogPage = () => {
    // State để lưu trữ bài viết từ API
    const [articles, setArticles] = useState([]);
    // State để lưu trữ bài viết đang hiển thị (có thể là tất cả hoặc kết quả tìm kiếm)
    const [displayedArticles, setDisplayedArticles] = useState([]);
    // State để lưu trữ trạng thái loading
    const [loading, setLoading] = useState(true);
    // State để lưu trữ thông báo lỗi nếu có
    const [error, setError] = useState(null);
    // State để quản lý trạng thái tìm kiếm
    const [searchQuery, setSearchQuery] = useState('');
    // State để quản lý danh mục đã chọn
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Hàm gọi API để lấy danh sách bài viết
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/articles/approved');

                if (!response.ok) {
                    throw new Error('Không thể tải dữ liệu bài viết');
                }

                const data = await response.json();
                setArticles(data);
                setDisplayedArticles(data); // Ban đầu hiển thị tất cả bài viết
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // Hàm xử lý tìm kiếm
    const handleSearch = async (keyword) => {
        if (!keyword.trim()) {
            // Nếu không có từ khóa, hiển thị lại tất cả bài viết
            setDisplayedArticles(articles);
            setSearchQuery('');
            return;
        }

        try {
            setLoading(true);
            setSearchQuery(keyword);

            // Gọi API tìm kiếm
            const response = await fetch(`http://localhost:8080/api/articles/approved/search?keyword=${encodeURIComponent(keyword)}`);

            if (!response.ok) {
                throw new Error('Không thể tìm kiếm bài viết');
            }

            const data = await response.json();
            setDisplayedArticles(data); // Cập nhật danh sách bài viết hiển thị
        } catch (error) {
            setError(error.message);
            setDisplayedArticles([]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý lọc theo danh mục
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);

        // Nếu không chọn danh mục nào
        if (!categoryId) {
            setDisplayedArticles(articles);
            return;
        }

        // Lọc bài viết theo danh mục (giả định rằng subject trong article tương ứng với id của category)
        // Cần điều chỉnh logic này khi có API thực tế
        const filtered = articles.filter(article =>
            article.subject && article.subject.toLowerCase().includes(
                categories.find(cat => cat.id === categoryId)?.name.toLowerCase() || ''
            )
        );

        setDisplayedArticles(filtered);
    };

    // Danh sách các danh mục (tạm thời)
    const categories = [
        { id: 1, name: 'Chia Sẻ Kinh Nghiệm' },
        { id: 2, name: 'Góc Giải Trí' },
        { id: 3, name: 'Dịch Vụ Tại Nhà' },
    ];

    return (
        <div>
            <Header />
            <BlogHeader />
            <div className="container mx-auto py-12 px-4 md:px-0">
                <div className="flex flex-col md:flex-row mx-[100px]">
                    <div className="w-full md:w-2/3 md:pr-8">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273172]" />
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                <p>{error}</p>
                            </div>
                        ) : (
                            <div>
                                {searchQuery && (
                                    <motion.div
                                        className="mb-6"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <h2 className="text-2xl font-semibold text-gray-800">
                                            Kết quả tìm kiếm: "{searchQuery}"
                                        </h2>
                                        <p className="text-gray-600 mt-2">
                                            Tìm thấy {displayedArticles.length} bài viết liên quan
                                        </p>
                                    </motion.div>
                                )}
                                <BlogContent articles={displayedArticles} />
                            </div>
                        )}
                    </div>
                    <div className="w-full md:w-1/3 mt-8 md:mt-0">
                        <BlogSidebar
                            onSearch={handleSearch}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategorySelect={handleCategorySelect}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BlogPage; 