import { PhoneOutlined, HomeOutlined, MailOutlined, FacebookOutlined, InstagramOutlined } from "@ant-design/icons"

const Footer = () => {
    return (
        <div className="bg-[#000000] text-[rgba(255,255,255,0.79)]">
            <div className="grid grid-cols-4 mx-[200px] py-[72px]">
                <div className="text-[14px] mr-[30px] col-span-2">
                    <a className="text-[#1e73be] text-[30px] font-[800] tracking-[-1px] block mb-[20px]" href="">PET SERVICE</a>
                    <p className="leading-[1.7em] mb-[18px]">
                        <strong>Pet Service </strong>
                        ra đời với mong muốn mang lại cho khách hàng sự chuyên nghiệp, uy tín mang nét đẹp hoa mỹ mà chúng tôi đem lại sự trải nghiệm tốt nhất cho thú cưng của chúng ta. Với nhiều năm kinh nghiệm trong ngành dịch vụ thú cưng bao gồm: Spa thú cưng, Khách sạn thú cưng, Dịch vụ thú cưng tại nhà,…
                    </p>
                    <div className="leading-[1.7em] mb-[10px]">
                        <span className="flex">
                            <div className="text-[#ffffff] mr-[6px]">
                                <HomeOutlined style={{}} />
                            </div>
                            Khu 5, Thị Trấn Quán Lào, Yên Định, Thanh Hóa
                        </span>
                        <span className="flex">
                            <div className="text-[#ffffff] mr-[6px]">
                                <PhoneOutlined className="rotate-90" style={{}} />
                            </div>
                            Hotline 0397550xxx
                        </span>
                        <span className="flex">
                            <div className="text-[#ffffff] mr-[6px]">
                                <MailOutlined style={{}} />
                            </div>
                            bachtieuquai@gmail.com
                        </span>
                    </div>
                    <div className="flex mb-[50px]">
                        <div className="mr-[10px]">
                            <FacebookOutlined style={{ fontSize: "25px" }} />
                        </div>
                        <div className="mr-[10px]">
                            <InstagramOutlined style={{ fontSize: "25px" }} />
                        </div>
                        <div className="mr-[10px]">
                            <MailOutlined style={{ fontSize: "25px" }} />
                        </div>
                        <div className="mr-[10px]">
                            <PhoneOutlined style={{ fontSize: "25px" }} className="rotate-90" />
                        </div>
                    </div>
                    <div>
                        <img src="https://petservicehcm.com/wp-content/uploads/2020/01/logo-da-thong-bao-voi-bo-cong-thuong-padvnpwxkd4ns4kthip3kg525b8ulnril0e7c2qa3s.webp" alt="" />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="text-[12.5px] mb-[50px]">
                        <h4 className="text-[#ffffff] text-[18px] font-[600] mb-[15px]">DỊCH VỤ</h4>
                        <div className="flex flex-col leading-[23px]">
                            <span>Spa Thú Cưng Chuẩn 5 Sao</span>
                            <span>Dịch vụ tắm thú cưng tại nhà</span>
                            <span>Dịch vụ cắt tỉa lông và tạo kiểu tại nhà</span>
                            <span>Khách Sạn Thú Cưng Chuẩn 5 Sao</span>
                            <span>Cung Cấp Sản Phẩm, Phụ Kiện</span>
                        </div>
                    </div>
                    <div className="text-[12.5px]">
                        <h4 className="text-[#ffffff] text-[18px] font-[600] mb-[15px]">TRUY CẬP</h4>
                        <div className="flex flex-col leading-[23px] mb-[5px]">
                            <span>Trang chủ</span>
                            <span>Giới thiệu về Pet service</span>
                            <span>Chia sẻ kiến thức và kinh nghiệm</span>
                            <span>Khách Sạn Thú Cưng Chuẩn 5 Sao</span>
                            <span>Cung Cấp Sản Phẩm, Phụ Kiện</span>
                        </div>
                        <div className="font-[800]">
                            <span>HOTLINE 24/7</span>
                        </div>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="text-[12.5px] mb-[50px]">
                        <h4 className="text-[#ffffff] text-[18px] font-[600] mb-[15px]">DỊCH VỤ THÚ CƯNG TẠI NHÀ</h4>
                        <div className="flex flex-col leading-[23px]">
                            <span>Dịch Vụ Thú Cưng Tại Nhà Khu A</span>
                            <span>Dịch Vụ Thú Cưng Tại Nhà Khu B</span>
                            <span>Dịch Vụ Thú Cưng Tại Nhà Khu C</span>
                            <span>Dịch Vụ Thú Cưng Tại Nhà Khu D</span>
                            <span>Dịch Vụ Thú Cưng Tại Nhà Khu E</span>
                            <span>Dịch Vụ Thú Cưng Tại Nhà Khu F</span>
                            <span>Dịch Vụ Thú Cưng Tại Nhà Khu G</span>
                            <span>Dịch Vụ Thú Cưng Tại Nhà Khu H</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end w-full">
                <strong className="mr-[10px]">Made by Trinh Le Xuan Bach - S1mBack</strong>
            </div>
        </div>
    );
}

export default Footer