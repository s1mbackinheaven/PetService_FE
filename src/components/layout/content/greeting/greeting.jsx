import { PhoneOutlined } from "@ant-design/icons"
import Combo from "../combo/combo";

const Greeting = () => {
    return (
        <div className="mt-[140px] pt-[40px] pb-[100px] bg-transparent bg-gradient-to-b from-white to-[#efefef]">
            <div className="justify-center items-center">
                <h3 className="flex justify-center items-center mb-[15px] text-[16px] font-bold text-[#565656] uppercase">
                    Pet Service
                </h3>
                <h2 className="flex justify-center items-center mb-[25px] text-[48px] font-[700] text-[#3a3a3a]">
                    Chúng tôi luôn&nbsp;<span className="text-[#2575fc]">sẵn sàng</span>&nbsp;phục vụ bạn
                </h2>
            </div>
            <div className="flex justify-center items-center">
                <a className="flex px-[55px] py-[16px] text-[#2475fb] hover:text-[#ffffff] hover:bg-[#545b99] uppercase font-[700] text-[15px] border border-[#4481fe] rounded-full shadow-[19px_19px_40px_0px_rgba(0,0,0,0.1)]" href="">
                    <div className="mr-[0px]">
                        <PhoneOutlined className="rotate-100" style={{ fontSize: "25px", width: "100%", height: "100%" }} />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <span>dịch vụ thú cưng tại nhà</span>
                        <span>Hàng đầu Việt Nam</span>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default Greeting