import './commit.css'
import { LineOutlined, RightOutlined, SketchOutlined, ThunderboltOutlined } from "@ant-design/icons"

const Commit = () => {
    return (
        <div className="relative h-[400px] mt-[100px]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#273172] 15% to-[rgba(35,108,255,0.9)] 85% z-10"></div>

            <img className="absolute inset-0 w-[100%] h-[100%] z-0 object-contain" src="https://peturgentcareofstpeters.com/wp-content/uploads/2022/05/dog-and-cat-sec1.jpg" alt="Dog and Cat" />

            <div className='flex justify-center z-20 relative top-[110px]'>
                <div className="relative text-[#ffffff] mr-[105px]">
                    <h2 className="uppercase text-[32px] mb-[15px] font-[700] text-shadow-custom">Dịch vụ tận tình - an tâm chất lượng</h2>
                    <strong className="text-[17px] italic font-[500] tracking-[-1px]">Liên hệ ngay để được tư vấn và báo giá các dịch vụ phù hợp cho bé yêu của bạn!</strong>
                </div>
                <div className='mt-[10px]'>
                    <a className="relative block px-[50px] py-[22px] uppercase text-[#4481fe] hover:text-white hover:bg-[blue] tracking-[2.6px] font-[700] text-[17px] bg-[#ffffff] border border-[#ffffff] rounded-[50px] shadow-[19px_19px_40px_0px_rgba(0,_0,_0,_0.1)]" href="">
                        Tư vấn miễn phí
                    </a>
                </div>
            </div>
            <div className='absolute z-[20] top-[285px] mx-[206px] bg-[rgba(255,255,255,1)] rounded-[5px] shadow-[0px_7px_20px_0px_rgba(0,_0,_0,_0.15)]'>
                <div>
                    <div className='flex px-[65px] py-[80px]'>
                        <div>
                            <h3 className='text-[#110729] text-[14px] font-[600] capitalize mb-[15px]'>
                                <LineOutlined className="" style={{ color: '#49b3f4', marginRight: '15px', marginLeft: '10px', transform: 'scaleX(2)' }} />
                                Thông Tin
                            </h3>
                            <h2 className='text-[48px] text-[#110729] font-[700] leading-[60px] mb-[30px]'>
                                Spa Cho Thú Cưng
                                <br />
                                <i className='text-[#49b3f4] text-shadow-custom-second'>Chuẩn 5 Sao</i>
                            </h2>
                            <div className='flex'>
                                <a className='block px-[20px] py-[10px] text-[12px] text-[#ffffff] hover:bg-none hover:bg-black font-bold uppercase bg-transparent bg-gradient-to-r from-[#3d51ac] to-[#2475fb] rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)]' href="">
                                    Xem thêm <RightOutlined />
                                </a>
                            </div>
                        </div>
                        <div className='w-[515px]'>
                            <img className='object-contain' src="https://peturgentcareofstpeters.com/wp-content/uploads/2022/05/dogAndCatFeatured.jpg" alt="" />
                        </div>
                    </div>
                    <div className='flex items-center bg-[#cdcdcd]'>
                        <div className='items-center'>
                            <a className='flex items-center px-[35px] py-[10px] uppercase text-[15px] font-bold text-[#333333]' href="">
                                <div className='mr-[10px]'>
                                    <SketchOutlined className='mr-[10px]' style={{ fontSize: '30px', alignContent: 'center', justifyContent: 'center', width: '100%', height: '100%' }} />
                                </div>
                                Dịch Vụ Chuyên Nghiệp
                            </a>
                        </div>
                        <div>
                            <a className='flex items-center px-[35px] py-[10px] uppercase text-[15px] font-bold text-[#273172]' href="">
                                <div className='mr-[10px]'>
                                    <ThunderboltOutlined style={{ fontSize: '30px', alignContent: 'center', justifyContent: 'center', width: '100%', height: '100%' }} />
                                </div>
                                Nhanh Chóng
                            </a>
                        </div>
                    </div>
                    <div className='text-[14px] px-[50px] py-[30px]'>
                        <p className='mb-[10px] font-[600]'>
                            KHÁM SỨC KHỎE MIỄN PHÍ
                        </p>
                        <p>
                            Mọi hành động ở PET SERVICE đều bắt đầu từ sứ mệnh Trao gửi yêu thương. Do vậy, Spa đạt chuẩn với quy trình khắt khe sẽ mang lại sự thom tho và sạch sẽ cho thú cưng của bạn.
                        </p>
                    </div>
                </div>

            </div>
        </div>

    );
}

export default Commit