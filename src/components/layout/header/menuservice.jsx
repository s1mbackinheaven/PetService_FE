import { DownOutlined } from "@ant-design/icons";

const MenuService = () => {
    return (
        <li className="relative hover:cursor-pointer group">
            <a className="leading-[100px] text-[#273171] uppercase font-semibold group-hover:text-[#53a0e8]" href="">
                Dịch Vụ <DownOutlined />
            </a>
            <div className="absolute top-[75px] border border-[#273172] bg-[#f4f4f4] hidden group-hover:block">
                <ul className="block">
                    <li className="relative hover:bg-[#eaeaea] py-[10px] mt-[10px] px-[10px] group/submenu">
                        <a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">
                            Dịch vụ Spa Thú Cưng HCM – Chăm sóc toàn diện cho Boss yêu <DownOutlined />
                        </a>
                        <div className="absolute left-[220px] top-[0px] border border-[#273172] bg-[#f4f4f4] hidden group-hover/submenu:block">
                            <ul className="block">
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mt-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Combo 1</a></li>
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Combo 2</a></li>
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mb-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Combo 3</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="relative hover:bg-[#eaeaea] py-[10px] px-[10px] group/submenu">
                        <a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">
                            Dịch vụ thú cưng tại nhà: Giải pháp tiện lợi 24/7 cho bạn <DownOutlined />
                        </a>
                        <div className="absolute left-[220px] top-[0px] border border-[#273172] bg-[#f4f4f4] hidden group-hover/submenu:block">
                            <ul className="block">
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mt-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Tắm thú cưng</a></li>
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mb-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Cắt lông thú cưng tại nhà</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="hover:bg-[#eaeaea] py-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Ưu Đãi Pet Service</a></li>
                    <li className="hover:bg-[#eaeaea] py-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Khách Sạn Thú Cưng</a></li>
                    <li className="hover:bg-[#eaeaea] py-[10px] mb-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Dắt Chó Đi Dạo</a></li>
                </ul>
            </div>
        </li>
    );
}

export default MenuService