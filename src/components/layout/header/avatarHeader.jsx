import { BellOutlined, AppstoreOutlined, ShoppingCartOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AvatarHeader = () => {
    const navigate = useNavigate(); // Hook để điều hướng

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        // Xóa token và thông tin user từ localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Hiển thị thông báo đăng xuất thành công (có thể thêm sau)

        // Chuyển hướng về trang chủ
        window.scrollTo(0, 0); // Reset vị trí scroll về đầu trang
        navigate('/homepage');
    };

    return (
        <div className='flex items-center'>
            <div className='flex ml-[35px] justify-center items-center rounded-full w-[40px] h-[40px] border border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)]'>
                <ShoppingCartOutlined style={{ backgroundColor: '' }} />
            </div>
            <div className='flex ml-[10px] justify-center items-center rounded-full w-[40px] h-[40px] border border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)]'>
                <AppstoreOutlined style={{ backgroundColor: '' }} />
            </div>
            <div className='flex ml-[10px] justify-center items-center rounded-full w-[40px] h-[40px] border border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)]'>
                <BellOutlined style={{ backgroundColor: '' }} />
            </div>
            <div className="relative group ml-[10px]">
                <div className="flex justify-center items-center rounded-full w-[40px] h-[40px] border border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)]">
                    <img className='w-full h-full object-cover rounded-full' src="https://scontent.fhan5-7.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_ohc=1BwdynYvBPkQ7kNvwE9sV-K&_nc_oc=AdlFGpkkcb-oOyq44KV43eO0-0Q4HajPF5YGZg321gKxd1mwJQBWGZYwCn84dDSsucU&_nc_zt=24&_nc_ht=scontent.fhan5-7.fna&oh=00_AYFknllcpge585Nw3iBjUq1UuH_Iv23tg8t4bknZe-QPOA&oe=6816F2FA" alt="" />
                </div>
                <div className="absolute top-[40px] right-0 w-[40px] h-[10px] bg-transparent"></div>
                <div className="absolute top-[50px] right-0 border border-[#273172] bg-[#f4f4f4] hidden group-hover:block z-50">
                    <ul className="block">
                        <li className="hover:bg-[#eaeaea] py-[10px] mt-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Thông tin cá nhân</a></li>
                        <li className="hover:bg-[#eaeaea] py-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Thông tin Pet</a></li>
                        <li className="hover:bg-[#eaeaea] py-[10px] mb-[10px] px-[10px]">
                            <a
                                className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px] cursor-pointer"
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {/* <li className="relative hover:cursor-pointer group">
                <a className="leading-[100px] text-[#273171] uppercase font-semibold group-hover:text-[#53a0e8]" href="">
                    Blog <DownOutlined />
                </a>

            </li> */}
        </div>
    );
}

export default AvatarHeader