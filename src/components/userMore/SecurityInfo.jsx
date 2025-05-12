import React from 'react';

// Component hiển thị thông tin bảo mật
const SecurityInfo = ({
    passwordInfo,
    handlePasswordChange,
    handleChangePassword
}) => {
    return (
        <div className="absolute w-[900px] h-[550px] top-[-130px] left-[300px] bg-white rounded-md p-4 z-10">
            <div>
                <div className='ml-[60px]'>
                    <h3 className="text-[20px] font-semibold mb-6">Thay Đổi Mật Khẩu</h3>
                    <div className="flex items-center mb-4">
                        <span className="w-[150px] font-semibold">Mật Khẩu Cũ:</span>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordInfo.oldPassword}
                            onChange={handlePasswordChange}
                            className="border border-gray-300 rounded px-2 py-1 w-[300px]"
                            placeholder="Nhập mật khẩu cũ"
                        />
                    </div>
                    <div className="flex items-center mb-4">
                        <span className="w-[150px] font-semibold">Mật Khẩu Mới:</span>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordInfo.newPassword}
                            onChange={handlePasswordChange}
                            className="border border-gray-300 rounded px-2 py-1 w-[300px]"
                            placeholder="Nhập mật khẩu mới"
                        />
                    </div>
                    <div className="flex items-center mb-4">
                        <span className="w-[150px] font-semibold">Xác Nhận Mật Khẩu:</span>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordInfo.confirmPassword}
                            onChange={handlePasswordChange}
                            className="border border-gray-300 rounded px-2 py-1 w-[300px]"
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>
                    <div className='flex items-center gap-4 mt-6'>
                        <button
                            className='bg-[#273172] text-white px-[30px] rounded-[5px] uppercase font-[500] text-[15px] hover:bg-[#53a0e8] hover:cursor-pointer transition-colors duration-300'
                            onClick={handleChangePassword}
                        >
                            Đổi Mật Khẩu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityInfo; 