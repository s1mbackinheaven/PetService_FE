import React from 'react';

// Component hiển thị thông tin tài khoản
const AccountInfo = ({
    userInfo,
    isEditing,
    editUserInfo,
    handleInputChange,
    handleEditClick,
    handleSaveClick,
    handleCancelClick
}) => {
    return (
        <div className="absolute w-[900px] h-[550px] top-[-90px] left-[300px] bg-white rounded-md p-4 z-10">
            <div>
                <div className='ml-[60px]'>
                    <div className="flex items-center mb-4">
                        <span className="w-[150px] font-semibold">Tên:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="fullname"
                                value={editUserInfo.fullname}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1 w-[300px]"
                            />
                        ) : (
                            <span className="text-gray-700">{userInfo.fullName}</span>
                        )}
                    </div>
                    <div className="flex items-center mb-4">
                        <span className="w-[150px] font-semibold">Giới Tính:</span>
                        {isEditing ? (
                            <select
                                name="gender"
                                value={editUserInfo.gender}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1 w-[300px]"
                            >
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                            </select>
                        ) : (
                            <span className="text-gray-700">{userInfo.gender}</span>
                        )}
                    </div>
                    <div className="flex items-center mb-4">
                        <span className="w-[150px] font-semibold">Email:</span>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={editUserInfo.email}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1 w-[300px]"
                            />
                        ) : (
                            <span className="text-gray-700">{userInfo.email}</span>
                        )}
                    </div>
                    <div className="flex items-center mb-4">
                        <span className="w-[150px] font-semibold">Số Điện Thoại:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="phone"
                                value={editUserInfo.phone}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1 w-[300px]"
                            />
                        ) : (
                            <span className="text-gray-700">{userInfo.phone}</span>
                        )}
                    </div>
                    <div className="flex items-center mb-4">
                        <span className="w-[150px] font-semibold">Địa Chỉ:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="address"
                                value={editUserInfo.address}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1 w-[300px]"
                            />
                        ) : (
                            <span className="text-gray-700">{userInfo.address}</span>
                        )}
                    </div>
                    <div className="flex items-center mb-4">
                        <span className="w-[150px] font-semibold">Ngày Đăng Ký:</span>
                        <span className="text-gray-700">{userInfo.created}</span>
                    </div>
                    <div className='flex items-center gap-4'>
                        {isEditing ? (
                            <>
                                <button
                                    className='bg-[#273172] text-white px-[30px] rounded-[5px] uppercase font-[500] text-[15px] hover:bg-[#53a0e8] hover:cursor-pointer transition-colors duration-300'
                                    onClick={handleSaveClick}
                                >
                                    Lưu
                                </button>
                                <button
                                    className='bg-gray-500 text-white px-[30px] rounded-[5px] uppercase font-[500] text-[15px] hover:bg-gray-600 hover:cursor-pointer transition-colors duration-300'
                                    onClick={handleCancelClick}
                                >
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <button
                                className='bg-[#273172] text-white px-[30px] rounded-[5px] uppercase font-[500] text-[15px] hover:bg-[#53a0e8] hover:cursor-pointer transition-colors duration-300'
                                onClick={handleEditClick}
                            >
                                Cập Nhật
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInfo; 