import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Component hiển thị thông tin bài viết của người dùng
const ArticleInfo = ({ userId }) => {
    // Khởi tạo navigate để điều hướng
    const navigate = useNavigate();

    // State để lưu danh sách bài viết
    const [articles, setArticles] = useState([]); // State lưu trữ danh sách bài viết
    const [loading, setLoading] = useState(true); // State kiểm tra trạng thái tải dữ liệu
    const [error, setError] = useState(null); // State lưu trữ lỗi nếu có

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [itemsPerPage] = useState(5); // Số bài viết mỗi trang

    // State cho modal thêm bài viết mới
    const [showAddModal, setShowAddModal] = useState(false); // State hiển thị/ẩn modal thêm bài viết
    const [newArticle, setNewArticle] = useState({ // State lưu thông tin bài viết mới
        subject: '',
        title: '',
        content: '',
    });

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    // Hàm lấy danh sách bài viết của người dùng
    const fetchUserArticles = async () => {
        try {
            setLoading(true); // Bắt đầu tải dữ liệu
            const response = await fetch(`http://localhost:8080/api/articles/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json(); // Đọc dữ liệu trả về từ response
                setArticles(data); // Lưu danh sách bài viết vào state
                setLoading(false); // Hoàn thành tải dữ liệu
            } else {
                throw new Error('Lỗi khi tải danh sách bài viết');
            }
        } catch (err) {
            setError('Không thể tải danh sách bài viết'); // Gán thông báo lỗi
            setLoading(false); // Đánh dấu đã tải xong (dù có lỗi)
            console.error('Lỗi khi tải danh sách bài viết:', err);
        }
    };

    // Gọi API lấy danh sách bài viết khi component được render
    useEffect(() => {
        fetchUserArticles();
    }, [userId]);

    // Hàm xử lý thay đổi input trong form thêm bài viết
    const handleInputChange = (e) => {
        const { name, value } = e.target; // Lấy tên và giá trị của trường input
        setNewArticle(prev => ({
            ...prev,
            [name]: value // Cập nhật giá trị mới cho trường tương ứng
        }));
    };

    // Hàm xử lý thêm bài viết mới
    const handleAddArticle = async () => {
        try {
            // Kiểm tra dữ liệu nhập vào
            if (!newArticle.subject || !newArticle.title || !newArticle.content) {
                alert('Vui lòng điền đầy đủ thông tin bài viết'); // Hiển thị thông báo lỗi
                return;
            }

            // Chuẩn bị dữ liệu gửi đi
            const articleData = {
                ...newArticle,
                userId: userId // Thêm userId vào dữ liệu gửi đi
            };

            // Gọi API để thêm bài viết mới
            const response = await fetch('http://localhost:8080/api/articles', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleData)
            });

            if (response.ok) {
                const newArticleData = await response.json(); // Đọc dữ liệu bài viết mới từ response

                // Cập nhật danh sách bài viết
                setArticles(prev => [...prev, newArticleData]);

                // Đóng modal và xóa dữ liệu form
                setShowAddModal(false);
                setNewArticle({
                    subject: '',
                    title: '',
                    content: ''
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi thêm bài viết');
            }
        } catch (err) {
            alert('Có lỗi xảy ra khi thêm bài viết: ' + (err.message || 'Vui lòng thử lại sau'));
            console.error('Lỗi khi thêm bài viết:', err);
        }
    };

    // Hàm xử lý chuyển đến trang chi tiết bài viết
    const handleArticleClick = (articleId) => {
        navigate(`/blog/detail/${articleId}`);
    };

    // Tính toán bài viết hiển thị trên trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentArticles = articles.slice(indexOfFirstItem, indexOfLastItem);

    // Tính toán tổng số trang
    const totalPages = Math.ceil(articles.length / itemsPerPage);

    // Hàm xử lý khi thay đổi trang
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    return (
        <div className="absolute w-[900px] h-[550px] top-[-333px] left-[300px] bg-white rounded-md p-4 z-10">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#273172]">Danh Sách Bài Viết</h2>
                <button
                    className="bg-[#273172] text-white px-4 py-2 rounded-[5px] text-sm font-medium hover:bg-[#53a0e8] transition-colors duration-300 cursor-pointer"
                    onClick={() => setShowAddModal(true)} // Hiển thị modal khi nhấn nút
                >
                    Thêm Bài Viết
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-600">Bạn chưa có bài viết nào</p>
                </div>
            ) : (
                <div>
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="min-w-full bg-white">
                            <thead className="bg-[#273172] text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left w-[8%]">ID</th>
                                    <th className="py-3 px-4 text-left w-[42%]">Tiêu Đề</th>
                                    <th className="py-3 px-4 text-left w-[30%]">Chủ Đề</th>
                                    <th className="py-3 px-4 text-left w-[20%]">Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentArticles.map((article) => (
                                    <tr key={article.id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-4 truncate">{article.id}</td>
                                        <td
                                            className="py-3 px-4 truncate text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                                            title={article.title}
                                            onClick={() => handleArticleClick(article.id)}
                                        >
                                            {article.title}
                                        </td>
                                        <td className="py-3 px-4 truncate" title={article.subject}>{article.subject}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 inline-block min-w-[100px] text-center rounded-full text-xs font-medium whitespace-nowrap ${article.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {article.active ? 'Đã duyệt' : 'Chưa duyệt'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-0 rounded-full cursor-pointer ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#273172] text-white hover:bg-[#53a0e8]'}`}
                            >
                                &laquo;
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`px-3 py-0 rounded-full cursor-pointer ${currentPage === number ? 'bg-[#53a0e8] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-0 rounded-full cursor-pointer ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#273172] text-white hover:bg-[#53a0e8]'}`}
                            >
                                &raquo;
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal thêm bài viết mới */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-[#273172] mb-4">Thêm Bài Viết Mới</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chủ Đề</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={newArticle.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#273172]"
                                        placeholder="Nhập chủ đề bài viết"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu Đề</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newArticle.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#273172]"
                                        placeholder="Nhập tiêu đề bài viết"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội Dung</label>
                                    <textarea
                                        name="content"
                                        value={newArticle.content}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#273172]"
                                        placeholder="Nhập nội dung bài viết"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300 cursor-pointer"
                                    onClick={() => setShowAddModal(false)} // Đóng modal khi nhấn nút Hủy
                                >
                                    Hủy
                                </button>
                                <button
                                    className="px-4 py-2 bg-[#273172] text-white rounded-md hover:bg-[#53a0e8] transition-colors duration-300 cursor-pointer"
                                    onClick={handleAddArticle} // Gọi hàm thêm bài viết khi nhấn nút Thêm
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticleInfo; 