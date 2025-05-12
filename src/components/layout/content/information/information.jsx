import { EllipsisOutlined, LineOutlined, DownOutlined, CloseOutlined } from "@ant-design/icons"
import React, { useState } from 'react';
import './information.css'

const Information = () => {
    const [activeMenu, setActiveMenu] = useState(null); // Trạng thái cho từng dropdown

    const toggleMenu = (menuIndex) => {
        setActiveMenu(activeMenu === menuIndex ? null : menuIndex); // Mở hoặc đóng dropdown
    };

    return (
        <div className="flex mt-[100px] items-center">
            <div className="mx-[185px] p-[20px] mr-[55px]">
                <h3 className="text-[14px] font-[600] mb-[15px]">Thông Tin & Bảng Giá</h3>
                <h2 className="text-[48px] font-[700] leading-[55px] mb-[20px]">
                    Spa Thú Cưng
                    <br />
                    <i className="text-[rgb(73,179,244)] drop-shadow-lg transform -rotate-2 text-shadow-custom-second">Pet Service</i>
                    <div className="mt-[-10px]">
                        <EllipsisOutlined style={{ fontSize: '35px', marginRight: '20px' }} />
                        <LineOutlined style={{ fontSize: '35px', transform: 'scaleX(2)' }} />
                    </div>
                </h2>
                <div>
                    <button
                        className="flex py-[10px] px-[20px] hover:cursor-pointer border border-[rgb(204,204,204)] rounded-[5px] shadow-[-1.216px_6.894px_15px_0_rgba(37,117,252,.2)]"
                        onClick={() => toggleMenu(0)}
                    >
                        <span className="text-left mr-[160px] text-[16px] font-bold text-[rgb(76,76,76);]">DỊCH VỤ BAO GỒM</span>
                        <div className="text-right">{activeMenu === 0 ? <CloseOutlined /> : <DownOutlined />}</div>
                    </button>
                    <div className={`text-[16px] font-[500] italic leading-[1.8em] text-[rgb(39,49,114)] p-[20px] mx-[20px] ${activeMenu === 0 ? 'block' : 'hidden'}`}>
                        <ul className="list-decimal">
                            <li className="">Pet Grooming (Cắt tỉa lông + Tắm vệ sinh)</li>
                            <li className="">Pet Hotel (Dog + Cat)</li>
                            <li className="">Pet Shop (Thức ăn + Phụ kiện)</li>
                        </ul>
                    </div>
                    <button
                        className="flex py-[10px] px-[20px] hover:cursor-pointer border border-[rgb(204,204,204)] rounded-[5px] shadow-[-1.216px_6.894px_15px_0_rgba(37,117,252,.2)]"
                        onClick={() => toggleMenu(1)}
                    >
                        <span className="text-left mr-[235px] text-[16px] font-bold text-[rgb(76,76,76);]">BẢNG GIÁ</span>
                        <div className="text-right">{activeMenu === 1 ? <CloseOutlined /> : <DownOutlined />}</div>
                    </button>
                    <div className={`text-[16px] font-[500] italic leading-[1.8em] text-[rgb(39,49,114)] p-[20px] mx-[20px] ${activeMenu === 1 ? 'block' : 'hidden'}`}>
                        <ul className="list-decimal">
                            <li>Tắm vệ sinh từ <strong>200.000đ</strong></li>
                            <li>Cắt Tỉa Lông từ <strong>250.000đ</strong></li>
                            <li>Pet Hotel từ <strong>150.000đ</strong></li>
                            <li>Pet Shop <strong>giá cạnh tranh</strong></li>
                            <strong>(Bảng giá sẽ phụ thuộc vào chủng loại + cân nặng.)</strong>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center mt-[40px]">
                    <div className="p-[5px] mr-[5px]">
                        <a className="block py-[5px] px-[20px] text-[12px] text-[#ffffff] hover:bg-none hover:bg-black font-bold uppercase bg-transparent bg-gradient-to-r from-[#3d51ac] to-[#2475fb] rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)]" href="">
                            Xem thêm <DownOutlined />
                        </a>
                    </div>
                    <div className="ml-[5px] p-[5px]">
                        <a className="block text-[#2475fb] py-[5px] px-[20px] text-[12px] hover:bg-[#2575fc] hover:border-[#49B3F4] hover:text-[#ffffff] uppercase font-bold bg-[rgba(0, 0, 0, 0)] border border-[#4481fe] rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.1)]" href="">
                            Đặt lịch online
                        </a>
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-1">
                <div className="flex-shrink-0">
                    <img className="h-[450px] w-[330px] object-cover" src="https://petservicehcm.com/wp-content/uploads/2020/02/476642807_1026270376190935_7699761044449832626_n.jpg" alt="Pet Service Image 1" />
                </div>
                <div className="flex-shrink-0">
                    <img className="h-[450px] w-[330px] object-cover" src="https://petservicehcm.com/wp-content/uploads/2025/03/be771229ccf87da624e9-1.jpg" alt="Pet Service Image 2" />
                </div>
            </div>
        </div>
    );
}

export default Information