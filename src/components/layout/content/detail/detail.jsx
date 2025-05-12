import { EllipsisOutlined, LineOutlined, ClearOutlined, HeartOutlined, HomeOutlined } from "@ant-design/icons"
import './detail.css'

const Detail = () => {
    return (
        <div className="grid grid-cols-4 mx-[185px] content-center items-center mt-[100px]">
            <div className="p-[12px] pb-[103px]">
                <h3 className="text-[14px] font-semibold uppercase leading-[5px] mb-[15px]">
                    Pet Service
                </h3>
                <h2 className="text-[#110729] text-[52px] font-bold uppercase text-shadow-custom">
                    Dịch Vụ
                </h2>
                <div className="mt-[-10px] mb-[15px]">
                    <EllipsisOutlined style={{ color: '#49b3f4', fontSize: '35px', marginRight: '20px' }} />
                    <LineOutlined style={{ color: '#49b3f4', fontSize: '35px', transform: 'scaleX(2)' }} />
                </div>
                <p className="text-[28px] m-[10px] leading-[5px] tracking-[0.6px] font-bold capitalize italic">
                    Hàng Đầu
                </p>
            </div>
            <div className="p-[15px]">
                <div className="px-[30px] py-[60px] border border-[#0a1821] shadow-[0px_5px_15px_0px_rgba(0,_0,_0,_0.25)]">
                    <div>
                        <ClearOutlined style={{ fontSize: '60px' }} />
                    </div>
                    <h3 className="text-[23px] font-semibold uppercase">
                        Grooming
                    </h3>
                    <p className="text-[#656565] text-[12.5px] leading-[17px] mb-[10px] font-[500]">
                        Chúng tôi biết cách làm thế nào để thú cưng của bạn trở nên đẳng cấp và cá tính hơn. Với dịch vụ cắt tỉa lông thú cưng chúng tôi sẽ giúp các bé trở thành phiên bản hoàn hảo nhất...
                    </p>
                    <div className="flex mt-[20px]">
                        <a className="block py-[10px] px-[25px] text-[14px] bg-[#efefef] text-[#000000] hover:text-[#efefef] hover:bg-[#273172]  font-semibold rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)]" href="">
                            Xem Thêm
                        </a>
                    </div>
                </div>
            </div>
            <div className="p-[15px]">
                <div className="px-[30px] py-[60px] border border-[#0a1821] shadow-[0px_5px_15px_0px_rgba(0,_0,_0,_0.25)]">
                    <div>
                        <HeartOutlined style={{ fontSize: '60px' }} />
                    </div>
                    <h3 className="text-[23px] font-semibold uppercase">
                        Shop
                    </h3>
                    <p className="text-[#656565] text-[12.5px] leading-[17px] mb-[10px] font-[500]">
                        Chúng tôi biết cách làm thế nào để thú cưng của bạn trở nên đẳng cấp và cá tính hơn. Với dịch vụ cắt tỉa lông thú cưng chúng tôi sẽ giúp các bé trở thành phiên bản hoàn hảo nhất...
                    </p>
                    <div className="flex mt-[20px]">
                        <a className="block py-[10px] px-[25px] text-[14px] bg-[#efefef] text-[#000000] hover:text-[#efefef] hover:bg-[#273172]  font-semibold rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)]" href="">
                            Xem Thêm
                        </a>
                    </div>
                </div>
            </div>
            <div className="p-[15px]">
                <div className="px-[30px] py-[60px] border border-[#0a1821] shadow-[0px_5px_15px_0px_rgba(0,_0,_0,_0.25)]">
                    <div>
                        <HomeOutlined style={{ fontSize: '60px' }} />
                    </div>
                    <h3 className="text-[23px] font-semibold uppercase">
                        HOTEL
                    </h3>
                    <p className="text-[#656565] text-[12.5px] leading-[17px] mb-[10px] font-[500]">
                        Chúng tôi biết cách làm thế nào để thú cưng của bạn trở nên đẳng cấp và cá tính hơn. Với dịch vụ cắt tỉa lông thú cưng chúng tôi sẽ giúp các bé trở thành phiên bản hoàn hảo nhất...
                    </p>
                    <div className="flex mt-[20px]">
                        <a className="block py-[10px] px-[25px] text-[14px] bg-[#efefef] text-[#000000] hover:text-[#efefef] hover:bg-[#273172]  font-semibold rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)]" href="">
                            Xem Thêm
                        </a>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Detail