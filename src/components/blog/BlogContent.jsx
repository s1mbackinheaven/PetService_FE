import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateFormatter';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

// Component hiển thị nội dung của trang blog - danh sách bài viết
const BlogContent = ({ articles }) => {
    const navigate = useNavigate(); // Hook để điều hướng

    // State lưu trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // Số bài viết trên mỗi trang
    const postsPerPage = 6;

    // Tính tổng số trang
    const totalPages = Math.ceil(articles.length / postsPerPage);

    // Lấy các bài viết cho trang hiện tại
    const getCurrentPagePosts = () => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        return articles.slice(indexOfFirstPost, indexOfLastPost);
    };

    // Hàm chuyển đến trang trước
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Hàm chuyển đến trang tiếp theo
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Hàm chuyển đến trang cụ thể
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Hàm xử lý chuyển đến trang chi tiết bài viết
    const handleViewArticleDetail = (articleId) => {
        window.scrollTo(0, 0); // Reset vị trí scroll về đầu trang
        navigate(`/blog/detail/${articleId}`); // Chuyển hướng đến trang chi tiết bài viết
    };

    // Reset về trang 1 khi danh sách bài viết thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [articles.length]);

    // Hàm cắt ngắn nội dung bài viết
    const truncateContent = (content, maxLength = 150) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + '...';
    };

    // Chia các bài viết thành từng cặp (mỗi dòng 2 bài viết)
    const getArticlePairs = () => {
        const currentPosts = getCurrentPagePosts();
        const pairs = [];
        for (let i = 0; i < currentPosts.length; i += 2) {
            if (i + 1 < currentPosts.length) {
                pairs.push([currentPosts[i], currentPosts[i + 1]]);
            } else {
                pairs.push([currentPosts[i]]);
            }
        }
        return pairs;
    };

    // Hiển thị các nút trang
    const renderPaginationButtons = () => {
        const pageButtons = [];

        // Logic để hiển thị một số lượng nút trang hợp lý
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        // Nút về trang trước
        pageButtons.push(
            <motion.button
                key="prev"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 hover:cursor-pointer rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-100'}`}
                aria-label="Trang trước"
                whileHover={currentPage !== 1 ? { scale: 1.1, backgroundColor: '#e6f7ff' } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
            >
                <LeftOutlined />
            </motion.button>
        );

        // Nút trang đầu tiên
        if (startPage > 1) {
            pageButtons.push(
                <motion.button
                    key={1}
                    onClick={() => goToPage(1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:bg-blue-100 hover:cursor-pointer"
                    whileHover={{ scale: 1.1, backgroundColor: '#e6f7ff' }}
                    whileTap={{ scale: 0.95 }}
                >
                    1
                </motion.button>
            );

            // Hiển thị dấu ba chấm nếu trang đầu tiên không liền kề
            if (startPage > 2) {
                pageButtons.push(
                    <span key="ellipsis1" className="flex items-center justify-center w-10 h-10">
                        ...
                    </span>
                );
            }
        }

        // Các nút trang số
        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <motion.button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full hover:cursor-pointer ${currentPage === i ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'}`}
                    whileHover={currentPage !== i ? { scale: 1.1, backgroundColor: '#e6f7ff' } : {}}
                    whileTap={{ scale: 0.95 }}
                >
                    {i}
                </motion.button>
            );
        }

        // Hiển thị dấu ba chấm và trang cuối nếu cần
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageButtons.push(
                    <span key="ellipsis2" className="flex items-center justify-center w-10 h-10">
                        ...
                    </span>
                );
            }

            pageButtons.push(
                <motion.button
                    key={totalPages}
                    onClick={() => goToPage(totalPages)}
                    className="flex items-center justify-center w-10 h-10 hover:cursor-pointer rounded-full text-gray-700 hover:bg-blue-100"
                    whileHover={{ scale: 1.1, backgroundColor: '#e6f7ff' }}
                    whileTap={{ scale: 0.95 }}
                >
                    {totalPages}
                </motion.button>
            );
        }

        // Nút chuyển đến trang tiếp theo
        pageButtons.push(
            <motion.button
                key="next"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-full hover:cursor-pointer ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-100'}`}
                aria-label="Trang tiếp theo"
                whileHover={currentPage !== totalPages ? { scale: 1.1, backgroundColor: '#e6f7ff' } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
            >
                <RightOutlined />
            </motion.button>
        );

        return pageButtons;
    };

    // Animation variants cho từng bài viết
    const articleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    // Nếu không có bài viết nào
    if (articles.length === 0) {
        return (
            <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold text-gray-600">Chưa có bài viết nào</h2>
                <p className="mt-4 text-gray-500">Hãy quay lại sau để xem các bài viết mới nhất từ chúng tôi.</p>
            </motion.div>
        );
    }

    return (
        <div>
            <motion.div
                key={currentPage + "-" + articles.length}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
            >
                {getArticlePairs().map((pair, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {pair.map(article => (
                            <motion.div
                                key={article.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                variants={articleVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                {/* Đây sẽ là ảnh bìa của bài viết (hiện tại dùng ảnh mẫu) */}
                                <div
                                    className="h-48 bg-gray-200 relative overflow-hidden cursor-pointer"
                                    onClick={() => handleViewArticleDetail(article.id)}
                                >
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{
                                            backgroundImage: "url('/7827736.jpg')"
                                        }}
                                    />
                                </div>

                                <div className="p-6">
                                    {/* Hiển thị chủ đề */}
                                    <div className="mb-2">
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {article.subject || "Chủ đề"}
                                        </span>
                                    </div>

                                    {/* Tiêu đề bài viết */}
                                    <h2
                                        className="text-xl font-bold text-gray-800 mb-2 hover:cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => handleViewArticleDetail(article.id)}
                                    >
                                        {article.title}
                                    </h2>

                                    {/* Thông tin tác giả và ngày tạo */}
                                    <div className="flex items-center mb-3 text-sm text-gray-600">
                                        <span>{article.user?.fullname || "Tác giả không xác định"}</span>
                                        <span className="mx-2">•</span>
                                        <span>{formatDate(article.creationDate)}</span>
                                    </div>

                                    {/* Nội dung rút gọn của bài viết */}
                                    <p className="text-gray-600 mb-4">
                                        {truncateContent(article.content)}
                                    </p>

                                    {/* Nút đọc thêm */}
                                    <motion.button
                                        className="block py-[5px] px-[20px] text-[12px] text-[#ffffff] hover:cursor-pointer hover:bg-none hover:bg-black font-bold uppercase bg-transparent bg-gradient-to-r from-[#3d51ac] to-[#2475fb] rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)]"
                                        whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleViewArticleDetail(article.id)}
                                    >
                                        Đọc tiếp
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ))}
            </motion.div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <motion.div
                    className="flex justify-center mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="flex items-center space-x-2">
                        {renderPaginationButtons()}
                    </div>
                </motion.div>
            )}

            {/* Hiển thị thông tin trang */}
            <motion.div
                className="text-center mt-4 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                Trang {currentPage} / {totalPages}
            </motion.div>
        </div>
    );
};

export default BlogContent; 