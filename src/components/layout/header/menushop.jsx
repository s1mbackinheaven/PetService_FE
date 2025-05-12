import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const MenuShop = () => {
    return (
        <li className="relative hover:cursor-pointer group">
            <Link to="/shop" className="leading-[100px] text-[#273171] uppercase font-semibold group-hover:text-[#53a0e8]">
                Cửa Hàng <DownOutlined />
            </Link>
            <div className="absolute top-[75px] border border-[#273172] bg-[#f4f4f4] hidden group-hover:block">
                <ul className="block">
                    <li className="relative hover:bg-[#eaeaea] py-[10px] mt-[10px] px-[10px] group/submenu">
                        <a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">
                            Dành cho chó <DownOutlined />
                        </a>
                        <div className="absolute left-[220px] top-[0px] border border-[#273172] bg-[#f4f4f4] hidden group-hover/submenu:block">
                            <ul className="block">
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mt-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Thức ăn cho chó <DownOutlined /></a></li>
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mb-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Sản phẩm vệ sinh</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="relative hover:bg-[#eaeaea] py-[10px] px-[10px] group/submenu">
                        <a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">
                            Dành cho mèo <DownOutlined />
                        </a>
                        <div className="absolute left-[220px] top-[0px] border border-[#273172] bg-[#f4f4f4] hidden group-hover/submenu:block">
                            <ul className="block">
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mt-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Thức ăn cho mèo <DownOutlined /></a></li>
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mb-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Sản phẩm vệ sinh</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="relative hover:bg-[#eaeaea] py-[10px] px-[10px] group/submenu">
                        <a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">
                            Phụ kiện thú cưng <DownOutlined />
                        </a>
                        <div className="absolute left-[220px] top-[0px] border border-[#273172] bg-[#f4f4f4] hidden group-hover/submenu:block">
                            <ul className="block">
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mt-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Vòng cổ & dây dắt</a></li>
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Dụng cụ ăn uống</a></li>
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Nệm ngủ</a></li>
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Balo & chuồng</a></li>
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mb-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Đồ chơi</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="relative hover:bg-[#eaeaea] py-[10px] mb-[10px] px-[10px] group/submenu">
                        <a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">
                            Chăm sóc sức khỏe <DownOutlined />
                        </a>
                        <div className="absolute left-[220px] top-[0px] border border-[#273172] bg-[#f4f4f4] hidden group-hover/submenu:block">
                            <ul className="block">
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mt-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Sản phẩm điều trị</a></li>
                                <li className="hover:bg-[#eaeaea] py-[10px] px-[10px] mb-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Thực phẩm chức năng</a></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </li>
    );
}

export default MenuShop