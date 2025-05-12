import { EllipsisOutlined, LineOutlined, SmileOutlined, FrownOutlined, MehOutlined, CheckCircleOutlined, MinusCircleOutlined, ExclamationCircleOutlined, SendOutlined } from "@ant-design/icons"
import './combo.css'
const Combo = () => {
    return (
        <div className="grid grid-cols-4 mx-[185px] content-center items-center mt-[100px]">
            <div className="p-[12px] pb-[103px]">
                <h3 className="text-[14px] font-semibold uppercase leading-[5px] mb-[15px]">
                    Bảng giá
                </h3>
                <h2 className="text-[#110729] text-[32px] font-bold uppercase text-shadow-custom">
                    pet service
                </h2>
                <div className="mt-[-10px] mb-[15px]">
                    <EllipsisOutlined style={{ color: '#49b3f4', fontSize: '35px', marginRight: '20px' }} />
                    <LineOutlined style={{ color: '#49b3f4', fontSize: '35px', transform: 'scaleX(2)' }} />
                </div>
                <p className="text-[52px] text-[#110729] m-[10px] leading-[5px] tracking-[0.6px] font-[600] capitalize italic text-shadow-custom">
                    Combo
                </p>
            </div>
            <div className="p-[15px]">
                <div className="border border-[#0a1821] shadow-[0px_5px_15px_0px_rgba(0,_0,_0,_0.25)]">
                    <div className="flex flex-col justify-center items-center mb-[25px] mt-[36px]">
                        <div>
                            <FrownOutlined style={{ fontSize: '40px', width: '100%', height: '100%' }} />
                        </div>
                        <div>
                            <h2 className="uppercase text-[#49B3F4] text-[28px] font-[800]">Combo #1</h2>
                        </div>
                    </div>
                    <div className="flex flex-col items-center ml-[25px] mb-[36px] text-[#EFEFEF] bg-[#4C4C4C] object-contain rounded-l-[48px] rounded-r-[0] border border-[#273172] shadow-[0px_3px_10px_0px_rgba(0,0,0,0.15)]">
                        <div className="flex items-center mt-[10px] mb-[25px] mr-[10px]">
                            <span className="text-[14px] font-[400]">
                                Chỉ từ
                            </span>
                            &nbsp;
                            <span className="text-[38px] font-[500]">
                                200.000
                            </span>
                        </div>
                        <span className="uppercase text-[18px] font-[700] mb-[10px] mr-[10px]">
                            vnđ
                        </span>
                    </div>
                    <div className="ml-[45px] mb-[25px]">
                        <ul className="leading-[36px] text-[#4C4C4C]">
                            <li className="">
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <CheckCircleOutlined style={{ color: 'green' }} />
                                    </div>
                                    Tắm Sấy
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <CheckCircleOutlined style={{ color: 'green' }} />
                                    </div>
                                    Vệ Sinh
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <MinusCircleOutlined style={{ color: 'red' }} />
                                    </div>
                                    Cắt tỉa lông
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[14px] italic font-[500]" href="">
                                    <div className="mr-[10px] text-[18px]">
                                        <ExclamationCircleOutlined style={{ color: '#1e73be' }} />
                                    </div>
                                    Giá sẽ thay đổi theo giống và trọng lượng
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="mb-[25px]">
                        <a className="flex justify-center text-[15px] font-bold italic" href="">
                            Đặt lịch ngay
                            <div className="ml-[5px]">
                                <SendOutlined />
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <div className="p-[15px]">
                <div className="border border-[#0a1821] shadow-[0px_5px_15px_0px_rgba(0,_0,_0,_0.25)]">
                    <div className="flex flex-col justify-center items-center mb-[25px] mt-[36px]">
                        <div>
                            <MehOutlined style={{ fontSize: '40px', width: '100%', height: '100%' }} />
                        </div>
                        <div>
                            <h2 className="uppercase text-[#49B3F4] text-[28px] font-[800]">Combo #2</h2>
                        </div>
                    </div>
                    <div className="flex flex-col items-center ml-[25px] mb-[36px] text-[#EFEFEF] bg-[#4C4C4C] object-contain rounded-l-[48px] rounded-r-[0] border border-[#273172] shadow-[0px_3px_10px_0px_rgba(0,0,0,0.15)]">
                        <div className="flex items-center mt-[10px] mb-[25px] mr-[10px]">
                            <span className="text-[14px] font-[400]">
                                Chỉ từ
                            </span>
                            &nbsp;
                            <span className="text-[38px] font-[500]">
                                300.000
                            </span>
                        </div>
                        <span className="uppercase text-[18px] font-[700] mb-[10px] mr-[10px]">
                            vnđ
                        </span>
                    </div>
                    <div className="ml-[45px] mb-[25px]">
                        <ul className="leading-[36px] text-[#4C4C4C]">
                            <li className="">
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <MinusCircleOutlined style={{ color: 'red' }} />
                                    </div>
                                    Tắm Sấy
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <CheckCircleOutlined style={{ color: 'green' }} />
                                    </div>
                                    Vệ Sinh
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <CheckCircleOutlined style={{ color: 'green' }} />
                                    </div>
                                    Cắt tỉa lông
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[14px] italic font-[500]" href="">
                                    <div className="mr-[10px] text-[18px]">
                                        <ExclamationCircleOutlined style={{ color: '#1e73be' }} />
                                    </div>
                                    Giá sẽ thay đổi theo giống và trọng lượng
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="mb-[25px]">
                        <a className="flex justify-center text-[15px] font-bold italic" href="">
                            Đặt lịch ngay
                            <div className="ml-[5px]">
                                <SendOutlined />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="p-[15px]">
                <div className="border border-[#0a1821] shadow-[0px_5px_15px_0px_rgba(0,_0,_0,_0.25)]">
                    <div className="flex flex-col justify-center items-center mb-[25px] mt-[36px]">
                        <div>
                            <SmileOutlined style={{ fontSize: '40px', width: '100%', height: '100%' }} />
                        </div>
                        <div>
                            <h2 className="uppercase text-[#49B3F4] text-[28px] font-[800]">Combo #3</h2>
                        </div>
                    </div>
                    <div className="flex flex-col items-center ml-[25px] mb-[36px] text-[#EFEFEF] bg-[#4C4C4C] object-contain rounded-l-[48px] rounded-r-[0] border border-[#273172] shadow-[0px_3px_10px_0px_rgba(0,0,0,0.15)]">
                        <div className="flex items-center mt-[10px] mb-[25px] mr-[10px]">
                            <span className="text-[14px] font-[400]">
                                Chỉ từ
                            </span>
                            &nbsp;
                            <span className="text-[38px] font-[500]">
                                450.000
                            </span>
                        </div>
                        <span className="uppercase text-[18px] font-[700] mb-[10px] mr-[10px]">
                            vnđ
                        </span>
                    </div>
                    <div className="ml-[45px] mb-[25px]">
                        <ul className="leading-[36px] text-[#4C4C4C]">
                            <li className="">
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <CheckCircleOutlined style={{ color: 'green' }} />
                                    </div>
                                    Tắm Sấy
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <CheckCircleOutlined style={{ color: 'green' }} />
                                    </div>
                                    Vệ Sinh
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[18px] italic font-[600]" href="">
                                    <div className="mr-[10px]">
                                        <CheckCircleOutlined style={{ color: 'green' }} />
                                    </div>
                                    Cắt tỉa lông
                                </a>
                            </li>
                            <li>
                                <a className="flex text-[14px] italic font-[500]" href="">
                                    <div className="mr-[10px] text-[18px]">
                                        <ExclamationCircleOutlined style={{ color: '#1e73be' }} />
                                    </div>
                                    Giá sẽ thay đổi theo giống và trọng lượng
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="mb-[25px]">
                        <a className="flex justify-center text-[15px] font-bold italic" href="">
                            Đặt lịch ngay
                            <div className="ml-[5px]">
                                <SendOutlined />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Combo