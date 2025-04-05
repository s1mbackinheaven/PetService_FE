import { DownOutlined, LineOutlined } from "@ant-design/icons"


const Intro = () => {
    return (
        <div className="flex items-center justify-center mt-[110px]">
            <div className="p-[10px]">
                <div className="p-[10px] pb-[15px]">
                    <h1 className="text-[14px] font-semibold uppercase mb-[15px] leading-[5px] tracking-[0.6px]">
                        <LineOutlined className="" style={{ color: '#49b3f4', marginRight: '15px', marginLeft: '10px', transform: 'scaleX(2)' }} />
                        Pet Service
                    </h1>
                    <h2 className="leading-14 mb-[10px]">
                        <i className="text-[#110729] text-[60px] font-semibold uppercase">Dịch vụ thú cưng</i>
                        <br />
                        <b className="text-[#110729] text-[60px] uppercase">tại nhà</b>
                    </h2>
                    <p className="m-[10px] text-[22px] uppercase font-expanded">
                        <strong>
                            Uy tín hàng đầu
                        </strong>
                        &nbsp;
                        Tại Việt Nam
                    </p>
                </div>
                <div className="flex items-center">
                    <div className="p-[5px] ml-[5px] mr-[5px]">
                        <a className="block py-[5px] px-[20px] text-[12px] text-[#ffffff] hover:bg-none hover:bg-black font-bold uppercase bg-transparent bg-gradient-to-r from-[#3d51ac] to-[#2475fb] rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)]" href="">
                            Xem thêm <DownOutlined />
                        </a>
                    </div>
                    <div className="ml-[5px] p-[5px]">
                        <a className="block text-[#2475fb] py-[5px] px-[20px] text-[12px] hover:bg-[#2575fc] hover:border-[#49B3F4] hover:text-[#ffffff] uppercase font-bold bg-[rgba(0, 0, 0, 0)] border border-[#4481fe] rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.1)]" href="">Đặt lịch online</a>
                    </div>
                </div>
            </div>
            <div className="p-[10px]">
                <img className="w-[500px] " src="https://petservicehcm.com/wp-content/uploads/2024/08/pet-care-slide3-img-1.webp" alt="" />
            </div>
        </div>
    );
}

export default Intro