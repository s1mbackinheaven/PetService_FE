import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderLogin from "../components/layout/header/headerLogin";
import Footer from "../components/layout/footer/footer";
import { formatDate, formatRelativeTime } from '../utils/dateFormatter';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HeartOutlined,
    HeartFilled,
    CommentOutlined,
    ArrowLeftOutlined,
    UserOutlined,
    CalendarOutlined,
    SendOutlined
} from '@ant-design/icons';
import Header from '../components/layout/header/header';

// Component trang chi tiết bài viết
const BlogDetailPage = () => {
    const { id } = useParams(); // Lấy id bài viết từ URL
    const navigate = useNavigate();

    // State lưu thông tin bài viết
    const [article, setArticle] = useState(null);
    // State lưu trạng thái loading
    const [loading, setLoading] = useState(true);
    // State lưu thông báo lỗi
    const [error, setError] = useState(null);
    // State lưu trạng thái like
    const [liked, setLiked] = useState(false);
    // State lưu số lượng like
    const [likeCount, setLikeCount] = useState(0);
    // State lưu danh sách comment
    const [comments, setComments] = useState([]);
    // State lưu nội dung comment mới
    const [newComment, setNewComment] = useState('');
    // State lưu trạng thái đang gửi comment
    const [submittingComment, setSubmittingComment] = useState(false);
    // State lưu trạng thái hiển thị form comment
    const [showCommentForm, setShowCommentForm] = useState(false);
    // State lưu các bài viết khác
    const [otherArticles, setOtherArticles] = useState([]);
    // State lưu thông tin người dùng hiện tại
    const [currentUser, setCurrentUser] = useState({
        id: 4, // Giá trị mặc định, thực tế lấy từ token
        fullname: 'Xuân Bách', // Giá trị mặc định, thực tế lấy từ token
        avatar: null
    });

    // Lấy thông tin bài viết khi component được render
    useEffect(() => {
        const fetchArticleDetail = async () => {
            try {
                setLoading(true);
                // Gọi API lấy chi tiết bài viết
                const response = await fetch(`http://localhost:8080/api/articles/${id}`);

                if (!response.ok) {
                    throw new Error('Không thể tải chi tiết bài viết');
                }

                const data = await response.json();
                setArticle(data);

                // Reset vị trí scroll về đầu trang
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Không thể tải chi tiết bài viết. Vui lòng thử lại sau.');
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };

        // Lấy danh sách comments
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/articles/${id}/comments`);

                if (!response.ok) {
                    throw new Error('Không thể tải bình luận');
                }

                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        // Lấy các bài viết khác
        const fetchOtherArticles = async () => {
            try {
                // Gọi API lấy danh sách bài viết
                const response = await fetch('http://localhost:8080/api/articles/approved');

                if (!response.ok) {
                    throw new Error('Không thể tải danh sách bài viết');
                }

                const data = await response.json();
                // Lọc ra các bài viết khác (không bao gồm bài viết hiện tại)
                const filtered = data.filter(a => a.id !== parseInt(id)).slice(0, 3);
                setOtherArticles(filtered);
            } catch (error) {
                console.error('Error fetching other articles:', error);
            }
        };

        // Lấy số lượng like
        const fetchLikeCount = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/articles/${id}/likes/count`);

                if (!response.ok) {
                    throw new Error('Không thể lấy số lượng like');
                }

                const count = await response.json();
                setLikeCount(count);
            } catch (error) {
                console.error('Error fetching like count:', error);
            }
        };

        // Kiểm tra trạng thái like của người dùng
        const checkUserLikeStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/articles/${id}/likes/users/${currentUser.id}`);

                if (response.ok) {
                    const result = await response.json();
                    setLiked(result === true);
                }
            } catch (error) {
                console.error('Error checking user like status:', error);
            }
        };

        if (id) {
            fetchArticleDetail();
            fetchComments();
            fetchOtherArticles();
            fetchLikeCount();
            checkUserLikeStatus();
        }
    }, [id, currentUser.id]);

    // Hàm xử lý khi người dùng like/unlike bài viết
    const handleLikeClick = async () => {
        try {
            // Nếu đã like thì không cho like nữa
            if (liked) {
                return;
            }

            const response = await fetch(`http://localhost:8080/api/articles/${id}/users/${currentUser.id}/likes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setLiked(true);
                // Cập nhật lại số lượng like
                const countResponse = await fetch(`http://localhost:8080/api/articles/${id}/likes/count`);
                if (countResponse.ok) {
                    const newCount = await countResponse.json();
                    setLikeCount(newCount);
                }
            } else {
                console.error('Failed to update like status');
            }
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };

    // Hàm xử lý khi người dùng gửi comment
    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        try {
            setSubmittingComment(true);

            // Gọi API để lưu comment
            const response = await fetch(`http://localhost:8080/api/articles/${id}/users/${currentUser.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newComment })
            });

            if (response.ok) {
                // Nếu thành công, làm mới danh sách comments
                const commentsResponse = await fetch(`http://localhost:8080/api/articles/${id}/comments`);
                if (commentsResponse.ok) {
                    const data = await commentsResponse.json();
                    setComments(data);
                }

                // Reset form
                setNewComment('');
            } else {
                console.error('Failed to submit comment');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    // Hàm quay lại trang blog
    const handleGoBack = () => {
        navigate('/blog');
    };

    // Hàm xem tất cả bài viết của tác giả
    const handleViewAuthorArticles = () => {
        if (article && article.user && article.user.id) {
            navigate(`/blog?author=${article.user.id}`);
        }
    };

    // Nếu đang loading
    if (loading) {
        return (
            <div>
                <HeaderLogin />
                <div className="container mx-auto py-20 px-4 flex justify-center items-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#273172]" />
                </div>
                <Footer />
            </div>
        );
    }

    // Nếu có lỗi
    if (error || !article) {
        return (
            <div>
                <HeaderLogin />
                <div className="container mx-auto py-20 px-4 flex flex-col justify-center items-center min-h-[50vh]">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl">
                        <p>{error || 'Không tìm thấy bài viết'}</p>
                    </div>
                    <button
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={handleGoBack}
                    >
                        Quay lại trang Blog
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            {/* Hình ảnh bài viết */}
            <div className="w-full h-[400px] bg-gray-200 relative mt-[136px] z-[-100]">
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/7827736.jpg')"
                    }}
                />
            </div>
            <div className="container mx-auto py-12 px-4 md:px-0 ">
                <div className="mx-[100px]">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-8">
                            {/* Thông tin chủ đề và nút like */}
                            <div className="flex justify-between items-center mb-4">
                                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                    {article.subject || "Chủ đề"}
                                </span>
                                <div className="flex items-center space-x-4">
                                    {/* Nút like */}
                                    <motion.button
                                        className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                                        onClick={handleLikeClick}
                                        whileHover={!liked ? { scale: 1.1 } : {}}
                                        whileTap={!liked ? { scale: 0.9 } : {}}
                                        disabled={liked}
                                    >
                                        {liked ? (
                                            <HeartFilled className="text-xl" />
                                        ) : (
                                            <HeartOutlined className="text-xl" />
                                        )}
                                        <span className="ml-2">{likeCount}</span>
                                    </motion.button>

                                    {/* Nút bình luận */}
                                    <motion.button
                                        className="flex items-center text-gray-600 hover:text-blue-500"
                                        onClick={() => setShowCommentForm(!showCommentForm)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <CommentOutlined className="text-xl" />
                                        <span className="ml-2">{comments.length}</span>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Tiêu đề bài viết */}
                            <motion.h1
                                className="text-3xl font-bold text-gray-800 mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {article.title}
                            </motion.h1>

                            {/* Thông tin tác giả và ngày tạo */}
                            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6">
                                <div className="flex items-center mr-4">
                                    <UserOutlined className="mr-1" />
                                    <span>{article.user?.fullname || "Tác giả không xác định"}</span>
                                </div>
                                <div className="flex items-center mr-4">
                                    <CalendarOutlined className="mr-1" />
                                    <span>{formatDate(article.creationDate)}</span>
                                </div>
                            </div>

                            {/* Nội dung bài viết */}
                            <motion.div
                                className="prose prose-lg max-w-none text-gray-700 mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                <p>{article.content}</p>
                            </motion.div>

                            {/* Phần bình luận */}
                            <div className="mt-10">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                    <CommentOutlined className="mr-2" />
                                    Bình Luận ({comments.length})
                                </h3>

                                {/* Form bình luận - luôn hiển thị không cần ẩn hiện */}
                                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                                    <form onSubmit={handleSubmitComment} className="flex items-start">
                                        <div className="flex-shrink-0 mr-4">
                                            {currentUser.avatar ? (
                                                <img
                                                    src={currentUser.avatar}
                                                    alt={currentUser.fullname}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <UserOutlined />
                                                </div>
                                            )}
                                            <div className="mt-1 text-center text-xs font-medium">
                                                {currentUser.fullname}
                                            </div>
                                        </div>
                                        <div className="flex-grow relative">
                                            <textarea
                                                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows="3"
                                                placeholder="Hãy bình luận có văn hóa để tránh bị khóa tài khoản"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                disabled={submittingComment}
                                                required
                                            />
                                            <motion.button
                                                type="submit"
                                                className="absolute right-3 bottom-3 text-blue-600 hover:text-blue-800"
                                                disabled={submittingComment || !newComment.trim()}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <SendOutlined className="text-xl" />
                                            </motion.button>
                                        </div>
                                    </form>
                                </div>

                                {/* Danh sách bình luận */}
                                {comments.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {comments.map((comment, index) => (
                                            <motion.div
                                                key={comment.id}
                                                className="bg-gray-50 p-4 rounded-lg"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                            >
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mr-3">
                                                        {comment.user.avatar ? (
                                                            <img
                                                                src={comment.user.avatar}
                                                                alt={comment.user.fullname}
                                                                className="w-10 h-10 rounded-full"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                                <UserOutlined />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <h4 className="font-semibold text-gray-800">
                                                                {comment.user.fullname}
                                                            </h4>
                                                            <span className="text-xs text-gray-500">
                                                                {formatRelativeTime(comment.creationDate)}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700">{comment.content}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Thông tin tác giả */}
                            {article.user && (
                                <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                                                <UserOutlined style={{ fontSize: '24px' }} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{article.user.fullname}</h3>
                                                <p className="text-sm text-gray-600">{article.user.email}</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            onClick={handleViewAuthorArticles}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Xem tất cả bài viết
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bài viết khác */}
                    {otherArticles.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Bài viết khác</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {otherArticles.map((article, index) => (
                                    <motion.div
                                        key={article.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                        onClick={() => navigate(`/blog/detail/${article.id}`)}
                                    >
                                        <div className="h-40 bg-gray-200">
                                            <div
                                                className="w-full h-full bg-cover bg-center"
                                                style={{
                                                    backgroundImage: "url('/7827736.jpg')"
                                                }}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-2">
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    {article.subject}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span>{article.user?.fullname}</span>
                                                <span className="mx-1">•</span>
                                                <span>{formatDate(article.creationDate)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                    <motion.button
                        className="flex items-center mt-[36px] hover:cursor-pointer text-gray-600 hover:text-blue-600 mb-6"
                        onClick={handleGoBack}
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeftOutlined className="mr-2" />
                        Quay lại trang Blog
                    </motion.button>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default BlogDetailPage; 