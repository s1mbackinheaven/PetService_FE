import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import MenuService from "./menuservice";
import MenuShop from "./menushop";
import MenuBlog from "./menublog";

const MenuHeader = () => {
    const navigate = useNavigate(); // Hook để điều hướng

    // Hàm xử lý chuyển hướng đến trang chủ
    const handleHomeClick = () => {
        window.scrollTo(0, 0); // Reset vị trí scroll về đầu trang
        navigate('/homepage');

    };

    // Hàm xử lý chuyển hướng đến trang đặt lịch
    const handleAppointmentClick = () => {
        window.scrollTo(0, 0); // Reset vị trí scroll về đầu trang
        navigate('/appointment'); // Chuyển hướng đến trang đặt lịch
    };

    return (
        <div className="pl-[10px] pr-[75px] h-[100px]">
            <ul className="flex space-x-[24px]">
                <li><a className="leading-[100px] text-[#273171] uppercase font-semibold hover:text-[#53a0e8] cursor-pointer" onClick={handleHomeClick}>Trang Chủ</a></li>
                <li><a className="leading-[100px] text-[#273171] uppercase font-semibold hover:text-[#53a0e8]" href="">Giới Thiệu</a></li>
                <MenuService />
                <MenuShop />
                <MenuBlog />
                <li><a className="leading-[100px] text-[#273171] uppercase font-semibold hover:text-[#53a0e8]" href="">Liên Hệ</a></li>
                <li><a className="leading-[100px] text-[#273171] uppercase font-semibold hover:text-[#53a0e8] cursor-pointer" onClick={handleAppointmentClick}>Đặt lịch</a></li>
            </ul>
        </div>
    );
}

export default MenuHeader