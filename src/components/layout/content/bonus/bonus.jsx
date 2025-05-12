import { LineOutlined, CheckOutlined, EllipsisOutlined } from "@ant-design/icons"

const Bonus = () => {
    return (
        <div className="relative flex mt-[568px] mx-[205px] justify-center items-center">
            <img className="absolute z-[-2] w-[180px] top-[480px] opacity-5" src="https://petservicehcm.com/wp-content/uploads/2019/11/002-dog.png" alt="" />
            <div className="w-[540px] h-[540px] mr-[60px]">
                <img className="object-contain border-4 border-[#FFFFFF] rounded-[10px] shadow-[0px_5px_20px_0px_rgba(0,_0,_0,_0.25)]" src="https://petservicehcm.com/wp-content/uploads/2020/02/a77237d3bf511c0f4540-1080x1080-1-720x720.jpg" alt="" />
            </div>
            <div className="ml-[50px]">
                <h3 className='text-[#110729] text-[14px] font-[600] capitalize mb-[15px]'>
                    <LineOutlined className="" style={{ color: '#49b3f4', marginRight: '15px', marginLeft: '10px', transform: 'scaleX(2)' }} />
                    Thông tin & Bảng giá
                </h3>
                <h2 className='text-[48px] text-[#110729] font-[700] leading-[60px] mb-[30px]'>
                    Dịch Vụ Thú Cưng
                    <br />
                    <i className='text-[#49b3f4] text-shadow-custom-second'>Tại Nhà</i>
                </h2>
                <div className="flex justify-center items-center">
                    <div>
                        <ul className="leading-[36px]">
                            <li className="">
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <CheckOutlined style={{ color: '#1e73be' }} />
                                    </div>
                                    Tắm Vệ Sinh
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <CheckOutlined style={{ color: '#1e73be' }} />
                                    </div>
                                    Tỉa lông tạo kiểu
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <CheckOutlined style={{ color: '#1e73be' }} />
                                    </div>
                                    Cạo lông Vệ Sinh
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="ml-[10px] px-[35px] py-[10px] leading-8">
                        <span className='flex mx-[10px] items-center uppercase text-[24px] font-bold text-[#273172]'>
                            Chỉ Từ
                            <div className='ml-[10px]'>
                                <LineOutlined style={{ fontSize: '35px', transform: 'scaleX(1)' }} />
                                <EllipsisOutlined style={{ fontSize: '35px', marginLeft: '1px' }} />
                            </div>
                        </span>
                        <i className='text-[#49b3f4] text-[38px] font-bold text-shadow-custom-second'>250.000đ</i>
                    </div>
                </div>
                <div className="flex items-center mt-[40px]">
                    <div className="p-[5px] mr-[5px]">
                        <a className="block py-[5px] px-[20px] text-[12px] text-[#ffffff] hover:bg-none hover:bg-black font-bold uppercase bg-transparent bg-gradient-to-r from-[#3d51ac] to-[#2475fb] rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)]" href="">
                            Xem thêm
                        </a>
                    </div>
                    <div className="ml-[5px] p-[5px]">
                        <a className="block text-[#2475fb] py-[5px] px-[20px] text-[12px] hover:bg-[#2575fc] hover:border-[#49B3F4] hover:text-[#ffffff] uppercase font-bold bg-[rgba(0, 0, 0, 0)] border border-[#4481fe] rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.1)]" href="">
                            Đặt lịch online
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bonus