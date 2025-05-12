import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    // State quản lý tab hiện tại
    const [activeTab, setActiveTab] = useState('users');
    // State cho người dùng
    const [users, setUsers] = useState([]);
    // State cho thú cưng
    const [pets, setPets] = useState([]);
    // State cho bài viết
    const [articles, setArticles] = useState([]);
    // State cho đơn hàng
    const [invoices, setInvoices] = useState([]);
    // State loading
    const [loading, setLoading] = useState(false);
    // State tìm kiếm
    const [searchText, setSearchText] = useState('');
    // State cho admin name
    const [adminName, setAdminName] = useState('');
    // State cho modal xem nội dung bài viết
    const [contentModalOpen, setContentModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    // State cho modal xác nhận
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmData, setConfirmData] = useState(null);

    // State cho modal thông báo
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('success'); // success, error

    // State phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // State filter
    const [statusFilter, setStatusFilter] = useState('');
    const [amountFilter, setAmountFilter] = useState('');
    const [articleStatusFilter, setArticleStatusFilter] = useState('');

    // State cho filter dropdown
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [tempArticleStatusFilter, setTempArticleStatusFilter] = useState('');

    // State cho filter dropdown đơn hàng
    const [invoiceFilterModalOpen, setInvoiceFilterModalOpen] = useState(false);
    const [tempInvoiceStatusFilter, setTempInvoiceStatusFilter] = useState('');

    const navigate = useNavigate();

    // Lấy thông tin từ token khi component mount
    useEffect(() => {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Giải mã token để lấy thông tin người dùng
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);
                setAdminName(decodedToken.fullname || decodedToken.username);

                // Tải dữ liệu ban đầu
                fetchDataForActiveTab(activeTab);
            } catch (error) {
                console.error('Lỗi khi giải mã token:', error);
                showNotification('Không thể xác thực. Vui lòng đăng nhập lại!', 'error');
                navigate('/login');
            }
        } else {
            showNotification('Vui lòng đăng nhập để truy cập trang này!', 'error');
            navigate('/login');
        }
    }, []);

    // Thêm effect để reset currentPage khi searchText thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText]);

    // Hàm tải dữ liệu dựa trên tab hiện tại
    const fetchDataForActiveTab = (tab) => {
        setLoading(true);

        switch (tab) {
            case 'users':
                fetchUsers();
                break;
            case 'pets':
                fetchPets();
                break;
            case 'articles':
                fetchArticles();
                break;
            case 'invoices':
                fetchInvoices();
                break;
            default:
                break;
        }
    };

    // Hàm chuyển tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset về trang đầu tiên khi chuyển tab
        fetchDataForActiveTab(tab);
    };

    // Hàm tải danh sách người dùng
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể lấy danh sách người dùng');
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
            showNotification('Không thể lấy danh sách người dùng!', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Hàm tải danh sách thú cưng
    const fetchPets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/pets', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể lấy danh sách thú cưng');
            }

            const data = await response.json();
            setPets(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thú cưng:', error);
            showNotification('Không thể lấy danh sách thú cưng!', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Hàm tải danh sách bài viết
    const fetchArticles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/articles', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể lấy danh sách bài viết');
            }

            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bài viết:', error);
            showNotification('Không thể lấy danh sách bài viết!', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Hàm tải danh sách đơn hàng
    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/invoices', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể lấy danh sách đơn hàng');
            }

            const data = await response.json();
            setInvoices(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            showNotification('Không thể lấy danh sách đơn hàng!', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Hàm hiển thị thông báo
    const showNotification = (message, type = 'success') => {
        setNotificationMessage(message);
        setNotificationType(type);
        setNotificationModalOpen(true);

        // Tự động đóng thông báo sau 3 giây
        setTimeout(() => {
            setNotificationModalOpen(false);
        }, 3000);
    };

    // Hàm hiển thị xác nhận
    const showConfirmation = (message, actionCallback, data = null) => {
        setConfirmMessage(message);
        setConfirmAction(() => actionCallback);
        setConfirmData(data);
        setConfirmModalOpen(true);
    };

    // Hàm xử lý xác nhận
    const handleConfirm = () => {
        if (confirmAction && typeof confirmAction === 'function') {
            confirmAction(confirmData);
        }
        setConfirmModalOpen(false);
    };

    // Hàm kiểm duyệt bài viết
    const moderateArticle = async (data) => {
        const { id, status } = data;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/articles/${id}/moderation?status=${status}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể kiểm duyệt bài viết');
            }

            showNotification(`Bài viết đã được ${status ? 'phê duyệt' : 'từ chối'}!`);

            // Cập nhật lại danh sách bài viết
            fetchArticles();
        } catch (error) {
            console.error('Lỗi khi kiểm duyệt bài viết:', error);
            showNotification('Không thể kiểm duyệt bài viết!', 'error');
        }
    };

    // Hàm xóa bài viết
    const deleteArticle = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/articles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể xóa bài viết');
            }

            showNotification('Bài viết đã được xóa thành công!');

            // Cập nhật lại danh sách bài viết
            fetchArticles();
        } catch (error) {
            console.error('Lỗi khi xóa bài viết:', error);
            showNotification('Không thể xóa bài viết!', 'error');
        }
    };

    // Hàm xóa người dùng
    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể xóa người dùng');
            }

            showNotification('Người dùng đã được xóa thành công!');

            // Cập nhật lại danh sách người dùng
            fetchUsers();
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            showNotification('Không thể xóa người dùng!', 'error');
        }
    };

    // Xác nhận kiểm duyệt bài viết
    const showModerationConfirm = (id, status) => {
        showConfirmation(
            `Bạn có chắc chắn muốn ${status ? 'phê duyệt' : 'từ chối'} bài viết này không?`,
            moderateArticle,
            { id, status }
        );
    };

    // Xác nhận xóa bài viết
    const showDeleteConfirm = (id) => {
        showConfirmation(
            'Bạn có chắc chắn muốn xóa bài viết này không?',
            deleteArticle,
            id
        );
    };

    // Xác nhận xóa người dùng
    const showUserDeleteConfirm = (id) => {
        showConfirmation(
            'Cảnh báo: Việc xóa người dùng sẽ xóa tất cả dữ liệu liên quan. Bạn có chắc chắn muốn tiếp tục?',
            deleteUser,
            id
        );
    };

    // Hiển thị modal nội dung bài viết
    const showContentModal = (article) => {
        setSelectedArticle(article);
        setContentModalOpen(true);
    };

    // Đóng modal nội dung bài viết
    const closeContentModal = () => {
        setContentModalOpen(false);
        setSelectedArticle(null);
    };

    // Hàm format ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Hàm định dạng số tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount).replace('₫', 'VNĐ');
    };

    // Toggle filter dropdown bài viết
    const toggleFilterDropdown = () => {
        setFilterModalOpen(!filterModalOpen);
        setTempArticleStatusFilter(articleStatusFilter);
    };

    // Reset filter bài viết
    const resetArticleFilter = () => {
        setTempArticleStatusFilter('');
    };

    // Apply filter bài viết
    const applyArticleFilter = () => {
        setArticleStatusFilter(tempArticleStatusFilter);
        setFilterModalOpen(false);
    };

    // Toggle filter dropdown đơn hàng
    const toggleInvoiceFilterDropdown = () => {
        setInvoiceFilterModalOpen(!invoiceFilterModalOpen);
        setTempInvoiceStatusFilter(statusFilter);
    };

    // Reset filter đơn hàng
    const resetInvoiceFilter = () => {
        setTempInvoiceStatusFilter('');
    };

    // Apply filter đơn hàng
    const applyInvoiceFilter = () => {
        setStatusFilter(tempInvoiceStatusFilter);
        setInvoiceFilterModalOpen(false);
    };

    // Hàm lọc dữ liệu
    const getFilteredData = () => {
        let filteredData = [];

        if (activeTab === 'users') {
            filteredData = users;
            if (searchText) {
                filteredData = filteredData.filter(user =>
                    user.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.phone?.toLowerCase().includes(searchText.toLowerCase())
                );
            }
        } else if (activeTab === 'pets') {
            filteredData = pets;
            if (searchText) {
                filteredData = filteredData.filter(pet =>
                    pet.nickName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    pet.type?.toLowerCase().includes(searchText.toLowerCase()) ||
                    pet.breed?.toLowerCase().includes(searchText.toLowerCase())
                );
            }
        } else if (activeTab === 'articles') {
            filteredData = articles;
            if (searchText) {
                filteredData = filteredData.filter(article =>
                    article.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                    article.subject?.toLowerCase().includes(searchText.toLowerCase()) ||
                    article.user?.fullname?.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            // Lọc theo trạng thái bài viết
            if (articleStatusFilter) {
                if (articleStatusFilter === 'active') {
                    filteredData = filteredData.filter(article => article.active === true);
                } else if (articleStatusFilter === 'inactive') {
                    filteredData = filteredData.filter(article => article.active === false);
                }
            }
        } else if (activeTab === 'invoices') {
            filteredData = invoices;

            // Lọc theo text search
            if (searchText) {
                filteredData = filteredData.filter(invoice =>
                    invoice.id.toString().includes(searchText) ||
                    invoice.userName?.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            // Lọc theo trạng thái
            if (statusFilter) {
                filteredData = filteredData.filter(invoice => invoice.status === statusFilter);
            }

            // Lọc theo số tiền
            if (amountFilter) {
                if (amountFilter === 'asc') {
                    filteredData = [...filteredData].sort((a, b) => a.totalAmount - b.totalAmount);
                } else if (amountFilter === 'desc') {
                    filteredData = [...filteredData].sort((a, b) => b.totalAmount - a.totalAmount);
                }
            }
        }

        return filteredData;
    };

    // Hàm phân trang dữ liệu
    const getPaginatedData = () => {
        const filteredData = getFilteredData();
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredData.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Hàm xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Render bảng người dùng
    const renderUsersTable = () => {
        const paginatedData = getPaginatedData();
        const totalItems = getFilteredData().length;

        return (
            <>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Tên đầy đủ</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Số điện thoại</th>
                                <th scope="col" className="px-6 py-3">Vai trò</th>
                                <th scope="col" className="px-6 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">Đang tải...</td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">Không có dữ liệu</td>
                                </tr>
                            ) : (
                                paginatedData.map(user => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{user.id}</td>
                                        <td className="px-6 py-4">{user.fullname}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.phone}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-white ${user.role === 'ADMIN' ? 'bg-yellow-500' :
                                                user.role === 'DOCTOR' ? 'bg-blue-500' :
                                                    user.role === 'RECEPTIONIST' ? 'bg-green-500' : 'bg-gray-500'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {/* Không hiển thị nút xóa nếu là Admin */}
                                                {user.role !== 'ADMIN' && (
                                                    <button
                                                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 cursor-pointer"
                                                        onClick={() => showUserDeleteConfirm(user.id)}
                                                        title="Xóa người dùng"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </>
        );
    };

    // Render bảng thú cưng
    const renderPetsTable = () => {
        const paginatedData = getPaginatedData();
        const totalItems = getFilteredData().length;

        return (
            <>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Tên thú cưng</th>
                                <th scope="col" className="px-6 py-3">Loại</th>
                                <th scope="col" className="px-6 py-3">Giống</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">Đang tải...</td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">Không có dữ liệu</td>
                                </tr>
                            ) : (
                                paginatedData.map(pet => (
                                    <tr key={pet.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{pet.id}</td>
                                        <td className="px-6 py-4">{pet.nickName}</td>
                                        <td className="px-6 py-4">{pet.type}</td>
                                        <td className="px-6 py-4">{pet.breed}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </>
        );
    };

    // Render bảng bài viết
    const renderArticlesTable = () => {
        const paginatedData = getPaginatedData();
        const totalItems = getFilteredData().length;

        return (
            <>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Chủ đề</th>
                                <th scope="col" className="px-6 py-3">Tiêu đề</th>
                                <th scope="col" className="px-6 py-3">Ngày tạo</th>
                                <th scope="col" className="px-6 py-3">Tác giả</th>
                                <th scope="col" className="px-6 py-3 w-[140px]">
                                    <div className="flex items-center">
                                        Trạng thái
                                        <button
                                            onClick={toggleFilterDropdown}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                            title="Lọc theo trạng thái"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
                                            </svg>
                                        </button>

                                        {/* Filter Dropdown */}
                                        {filterModalOpen && (
                                            <div className="absolute mt-1 bg-white shadow-lg rounded-md p-3 z-10">
                                                <div className="mb-2">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={tempArticleStatusFilter === 'active'}
                                                            onChange={() => setTempArticleStatusFilter(tempArticleStatusFilter === 'active' ? '' : 'active')}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span>Đã duyệt</span>
                                                    </label>
                                                </div>
                                                <div className="mb-2">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={tempArticleStatusFilter === 'inactive'}
                                                            onChange={() => setTempArticleStatusFilter(tempArticleStatusFilter === 'inactive' ? '' : 'inactive')}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span>Chưa duyệt</span>
                                                    </label>
                                                </div>
                                                <div className="flex justify-between mt-2">
                                                    <button
                                                        onClick={resetArticleFilter}
                                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                                    >
                                                        Reset
                                                    </button>
                                                    <button
                                                        onClick={applyArticleFilter}
                                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    >
                                                        OK
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">Đang tải...</td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">Không có dữ liệu</td>
                                </tr>
                            ) : (
                                paginatedData.map(article => (
                                    <tr key={article.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{article.id}</td>
                                        <td className="px-6 py-4">{article.subject}</td>
                                        <td className="px-6 py-4">{article.title}</td>
                                        <td className="px-6 py-4">{formatDate(article.creationDate)}</td>
                                        <td className="px-6 py-4">{article.user?.fullname}</td>
                                        <td className="px-6 py-4 min-w-[140px] whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-white ${article.active ? 'bg-green-500' : 'bg-orange-500'}`}>
                                                {article.active ? 'Đã duyệt' : 'Chờ duyệt'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {/* Nút xem nội dung */}
                                                <button
                                                    className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 cursor-pointer"
                                                    onClick={() => showContentModal(article)}
                                                    title="Xem nội dung"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                </button>

                                                {/* Nút thay đổi trạng thái active */}
                                                <button
                                                    className={`p-1 ${article.active ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'} rounded hover:bg-opacity-80 cursor-pointer`}
                                                    onClick={() => showModerationConfirm(article.id, !article.active)}
                                                    title={article.active ? 'Hủy duyệt' : 'Phê duyệt'}
                                                >
                                                    {article.active ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    )}
                                                </button>

                                                {/* Nút xóa bài viết */}
                                                <button
                                                    className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 cursor-pointer"
                                                    onClick={() => showDeleteConfirm(article.id)}
                                                    title="Xóa bài viết"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </>
        );
    };

    // Render bảng đơn hàng
    const renderInvoicesTable = () => {
        const paginatedData = getPaginatedData();
        const totalItems = getFilteredData().length;

        return (
            <>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Khách hàng</th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Tổng tiền
                                        <div className="ml-1">
                                            <button onClick={() => setAmountFilter('asc')} className="block text-gray-500 hover:text-blue-500">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M7 14l5-5 5 5H7z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => setAmountFilter('desc')} className="block text-gray-500 hover:text-blue-500">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M7 10l5 5 5-5H7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Trạng thái
                                        <button
                                            onClick={toggleInvoiceFilterDropdown}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                            title="Lọc theo trạng thái"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
                                            </svg>
                                        </button>

                                        {/* Filter Dropdown */}
                                        {invoiceFilterModalOpen && (
                                            <div className="absolute mt-1 bg-white shadow-lg rounded-md p-3 z-10">
                                                <div className="mb-2">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={tempInvoiceStatusFilter === 'PENDING'}
                                                            onChange={() => setTempInvoiceStatusFilter(tempInvoiceStatusFilter === 'PENDING' ? '' : 'PENDING')}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span>Đang thanh toán</span>
                                                    </label>
                                                </div>
                                                <div className="mb-2">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={tempInvoiceStatusFilter === 'PAID'}
                                                            onChange={() => setTempInvoiceStatusFilter(tempInvoiceStatusFilter === 'PAID' ? '' : 'PAID')}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span>Đã thanh toán</span>
                                                    </label>
                                                </div>
                                                <div className="mb-2">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={tempInvoiceStatusFilter === 'COMPLETED'}
                                                            onChange={() => setTempInvoiceStatusFilter(tempInvoiceStatusFilter === 'COMPLETED' ? '' : 'COMPLETED')}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span>Hoàn thành</span>
                                                    </label>
                                                </div>
                                                <div className="mb-2">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={tempInvoiceStatusFilter === 'CANCELED'}
                                                            onChange={() => setTempInvoiceStatusFilter(tempInvoiceStatusFilter === 'CANCELED' ? '' : 'CANCELED')}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span>Đã hủy</span>
                                                    </label>
                                                </div>
                                                <div className="flex justify-between mt-2">
                                                    <button
                                                        onClick={resetInvoiceFilter}
                                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                                    >
                                                        Reset
                                                    </button>
                                                    <button
                                                        onClick={applyInvoiceFilter}
                                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    >
                                                        OK
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">Đang tải...</td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">Không có dữ liệu</td>
                                </tr>
                            ) : (
                                paginatedData.map(invoice => (
                                    <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{invoice.id}</td>
                                        <td className="px-6 py-4">{invoice.userName}</td>
                                        <td className="px-6 py-4">{formatCurrency(invoice.totalAmount)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-white ${invoice.status === 'COMPLETED' ? 'bg-green-500' :
                                                invoice.status === 'PAID' ? 'bg-blue-500' :
                                                    invoice.status === 'PENDING' ? 'bg-orange-500' :
                                                        'bg-red-500'
                                                }`}>
                                                {invoice.statusDisplayValue}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {/* Chỉ hiển thị nút cập nhật trạng thái nếu đơn hàng đang ở trạng thái PENDING */}
                                                {invoice.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 cursor-pointer"
                                                            onClick={() => showUpdateStatusConfirm(invoice.id, 'PAID')}
                                                            title="Đánh dấu đã thanh toán"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="p-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200 cursor-pointer"
                                                            onClick={() => showUpdateStatusConfirm(invoice.id, 'CANCELED')}
                                                            title="Hủy đơn hàng"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}

                                                {/* Nút xóa đơn hàng */}
                                                <button
                                                    className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 cursor-pointer"
                                                    onClick={() => showInvoiceDeleteConfirm(invoice.id)}
                                                    title="Xóa đơn hàng"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </>
        );
    };

    // Component phân trang
    const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Tạo danh sách các trang
        const getPageNumbers = () => {
            const pages = [];
            const displayedPages = 5; // Số lượng trang hiển thị

            // Các trường hợp đặc biệt
            if (totalPages <= displayedPages) {
                // Hiển thị tất cả các trang nếu tổng số trang ít hơn hoặc bằng displayedPages
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Xác định trang bắt đầu và kết thúc để hiển thị
                let startPage = Math.max(1, currentPage - Math.floor(displayedPages / 2));
                let endPage = startPage + displayedPages - 1;

                // Điều chỉnh nếu endPage vượt quá totalPages
                if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = Math.max(1, endPage - displayedPages + 1);
                }

                // Thêm nút trang đầu tiên
                if (startPage > 1) {
                    pages.push(1);
                    if (startPage > 2) {
                        pages.push('...');
                    }
                }

                // Thêm các trang ở giữa
                for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                }

                // Thêm nút trang cuối cùng
                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                        pages.push('...');
                    }
                    pages.push(totalPages);
                }
            }

            return pages;
        };

        const pageNumbers = getPageNumbers();

        if (totalPages <= 1) return null;

        return (
            <div className="mt-4 flex justify-center">
                <nav>
                    <ul className="flex space-x-1">
                        {/* Nút Previous */}
                        <li>
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded ${currentPage === 1
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                        </li>

                        {/* Các trang */}
                        {pageNumbers.map((page, index) => (
                            <li key={index}>
                                {page === '...' ? (
                                    <span className="px-3 py-1">...</span>
                                ) : (
                                    <button
                                        onClick={() => onPageChange(page)}
                                        className={`px-3 py-1 rounded ${currentPage === page
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </li>
                        ))}

                        {/* Nút Next */}
                        <li>
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded ${currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    };

    // Hàm cập nhật trạng thái đơn hàng
    const updateInvoiceStatus = async (data) => {
        const { id, newStatus } = data;
        try {
            const token = localStorage.getItem('token');
            console.log(`Calling API: PUT http://localhost:8080/api/invoices/${id}/status with status=${newStatus}`);

            const requestBody = { status: newStatus };
            console.log('Request body:', requestBody);

            const response = await fetch(`http://localhost:8080/api/invoices/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`Không thể cập nhật trạng thái đơn hàng thành ${newStatus}`);
            }

            showNotification(`Đơn hàng đã được cập nhật thành ${newStatus === 'PAID' ? 'Đã thanh toán' : 'Đã hủy'}!`);

            // Cập nhật lại danh sách đơn hàng
            fetchInvoices();
        } catch (error) {
            console.error(`Lỗi khi cập nhật trạng thái đơn hàng thành ${newStatus}:`, error);
            showNotification(`Không thể cập nhật trạng thái đơn hàng!`, 'error');
        }
    };

    // Hàm xóa đơn hàng
    const deleteInvoice = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/invoices/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể xóa đơn hàng');
            }

            showNotification('Đơn hàng đã được xóa thành công!');

            // Cập nhật lại danh sách đơn hàng
            fetchInvoices();
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
            showNotification('Không thể xóa đơn hàng!', 'error');
        }
    };

    // Xác nhận cập nhật trạng thái đơn hàng
    const showUpdateStatusConfirm = (id, newStatus) => {
        const statusText = newStatus === 'PAID' ? 'đã thanh toán' : 'đã hủy';
        showConfirmation(
            `Bạn có chắc chắn muốn cập nhật đơn hàng này thành "${statusText}"?`,
            updateInvoiceStatus,
            { id, newStatus }
        );
    };

    // Xác nhận xóa đơn hàng
    const showInvoiceDeleteConfirm = (id) => {
        showConfirmation(
            'Bạn có chắc chắn muốn xóa đơn hàng này không?',
            deleteInvoice,
            id
        );
    };

    return (
        <div className="container mx-auto mt-[100px] mb-12">
            <div className="mx-[100px] flex">
                {/* Sidebar */}
                <div className="w-1/5 bg-white shadow-md rounded-lg overflow-hidden mr-8">
                    <div className="p-4 bg-gray-50 border-b">
                        <h2 className="text-lg font-semibold">Admin Panel</h2>
                        <p className="text-gray-600">{adminName}</p>
                    </div>
                    <div className="py-2">
                        <button
                            onClick={() => handleTabChange('users')}
                            className={`flex items-center px-4 py-2 w-full text-left ${activeTab === 'users' ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'} cursor-pointer`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                            </svg>
                            Người dùng
                        </button>
                        <button
                            onClick={() => handleTabChange('pets')}
                            className={`flex items-center px-4 py-2 w-full text-left ${activeTab === 'pets' ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'} cursor-pointer`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0010-6c0 1.837-.92 3.464-2.324 4.445z" clipRule="evenodd"></path>
                            </svg>
                            Thú cưng
                        </button>
                        <button
                            onClick={() => handleTabChange('articles')}
                            className={`flex items-center px-4 py-2 w-full text-left ${activeTab === 'articles' ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'} cursor-pointer`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                            </svg>
                            Bài viết
                        </button>
                        <button
                            onClick={() => handleTabChange('invoices')}
                            className={`flex items-center px-4 py-2 w-full text-left ${activeTab === 'invoices' ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'} cursor-pointer`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2 3a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1zm7 0a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            Đơn hàng
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="w-4/5 bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">
                            {activeTab === 'users' ? 'Quản lý người dùng' :
                                activeTab === 'pets' ? 'Quản lý thú cưng' :
                                    activeTab === 'articles' ? 'Quản lý bài viết' :
                                        'Quản lý đơn hàng'}
                        </h1>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Render bảng tương ứng với tab đang chọn */}
                    {activeTab === 'users' && renderUsersTable()}
                    {activeTab === 'pets' && renderPetsTable()}
                    {activeTab === 'articles' && renderArticlesTable()}
                    {activeTab === 'invoices' && renderInvoicesTable()}
                </div>
            </div>

            {/* Modal xem nội dung bài viết */}
            {contentModalOpen && selectedArticle && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="pointer-events-auto bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold">{selectedArticle.title}</h2>
                            <button
                                onClick={closeContentModal}
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">
                                {formatDate(selectedArticle.creationDate)} bởi {selectedArticle.user?.fullname}
                            </p>
                            <p className="text-sm font-semibold mt-2">Chủ đề: {selectedArticle.subject}</p>
                        </div>
                        <div className="border-t pt-4">
                            <div className="prose max-w-none">
                                {selectedArticle.content.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-2">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeContentModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xác nhận */}
            {confirmModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="pointer-events-auto bg-white p-6 rounded-lg w-full max-w-md text-center shadow-2xl">
                        <div className="mb-6 flex justify-center">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Xác nhận</h3>
                        <p className="mb-6 text-gray-600">{confirmMessage}</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setConfirmModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal thông báo */}
            {notificationModalOpen && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
                    <div className={`p-4 rounded-lg shadow-xl ${notificationType === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                        <div className="flex items-center">
                            {notificationType === 'success' ? (
                                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            )}
                            <p className={`font-medium ${notificationType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {notificationMessage}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin; 