import { DownOutlined } from "@ant-design/icons";

const MenuBlog = () => {
    return (
        <li className="relative hover:cursor-pointer group">
            <a className="leading-[100px] text-[#273171] uppercase font-semibold group-hover:text-[#53a0e8]" href="">
                Blog <DownOutlined />
            </a>
            <div className="absolute top-[75px] border border-[#273172] bg-[#f4f4f4] hidden group-hover:block">
                <ul className="block">
                    <li className="hover:bg-[#eaeaea] py-[10px] mt-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Chia sẻ kinh nghiệm</a></li>
                    <li className="hover:bg-[#eaeaea] py-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Dịch Vụ Tại Nhà</a></li>
                    <li className="hover:bg-[#eaeaea] py-[10px] mb-[10px] px-[10px]"><a className="hover:text-[#53a0e8] block w-[200px] uppercase text-[#273171] font-semibold text-[14px]" href="">Góc Giải Trí</a></li>
                </ul>
            </div>
        </li>
    );
}

export default MenuBlog