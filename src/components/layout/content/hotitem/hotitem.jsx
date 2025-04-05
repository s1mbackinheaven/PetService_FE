import { EllipsisOutlined, LineOutlined, DownOutlined, CloseOutlined, RightOutlined } from "@ant-design/icons"

const HotItem = () => {
    return (
        <div className="mt-[100px] content-center items-center bg-transparent bg-gradient-to-b from-[#F0F0F0] to-white">
            <div className="grid grid-cols-4 mx-[205px] content-center items-center my-[100px] gap-[16px]">
                <div className="">
                    <h3 className="text-[14px] font-[600] mb-[15px]">Hot Items</h3>
                    <h2 className="text-[48px] font-[700] leading-[55px] mb-[20px]">
                        Sản Phẩm
                        <br />
                        <i className="text-[rgb(73,179,244)] drop-shadow-lg transform -rotate-2 text-shadow-custom-second">Nổi Bật</i>
                        <div className="mt-[-10px]">
                            <EllipsisOutlined style={{ fontSize: '35px', marginRight: '20px' }} />
                            <LineOutlined style={{ fontSize: '35px', transform: 'scaleX(2)' }} />
                        </div>
                    </h2>
                    <div className='flex'>
                        <a className='block px-[20px] py-[10px] text-[12px] text-[#ffffff] hover:bg-none hover:bg-black font-bold uppercase bg-transparent bg-gradient-to-r from-[#3d51ac] to-[#2475fb] rounded-r-full rounded-l-full shadow-[10px_15px_30px_0px_rgba(0,0,0,0.15)]' href="">
                            Xem Cửa Hàng <RightOutlined />
                        </a>
                    </div>
                </div>
                <div className="bg-white rounded-[15px] hover:cursor-pointer hover:shadow-[0px_0px_15px_-8px_rgba(0,0,0,0.5)] shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)] p-[15px] h-full">
                    <div className="mb-[20px]">
                        <img src="https://petservicehcm.com/wp-content/uploads/2022/06/bat-an-inox-16-800x800.png" alt="" />
                    </div>
                    <span className="flex justify-center text-[12px] opacity-60 mb-[6px]">Cho Chó</span>
                    <h2 className="flex justify-center items-center text-center text-[13px] font-[600] text-[#333333] mb-[6px]">Alkin Mitecyn 50ml – Xịt trị viêm da, nấm, ghẻ cho chó mèo</h2>
                    <div className="flex justify-center items-center text-[18px] font-[700] mb-[20px]">
                        <span className="line-through text-[gray]">140.000
                            <span className="underline">đ</span>
                        </span>
                        &nbsp;
                        <span className="text-[#273172]">
                            125.000
                            <span className="underline">đ</span>
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-[15px] hover:cursor-pointer hover:shadow-[0px_0px_15px_-8px_rgba(0,0,0,0.5)] shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)] p-[15px]">
                    <div className="mb-[20px]">
                        <img src="https://petservicehcm.com/wp-content/uploads/2024/08/gan-3.png" alt="" />
                    </div>
                    <span className="flex justify-center text-[12px] opacity-60 mb-[6px]">Cho Chó</span>
                    <h2 className="flex justify-center items-center text-center text-[13px] font-[600] text-[#333333] mb-[6px]">Cá ngừ xay rau củ HG Food 400g cho thú cưng thơm ngon dinh dưỡng Pet Service</h2>
                    <div className="flex justify-center items-center text-[18px] font-[700] mb-[20px]">
                        <span className="line-through text-[gray]">40.000
                            <span className="underline">đ</span>
                        </span>
                        &nbsp;
                        <span className="text-[#273172]">
                            36.000
                            <span className="underline">đ</span>
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-[15px] hover:cursor-pointer hover:shadow-[0px_0px_15px_-8px_rgba(0,0,0,0.5)] shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)] p-[15px]">
                    <div className="mb-[20px]">
                        <img src="https://petservicehcm.com/wp-content/uploads/2024/08/gan.png" alt="" />
                    </div>
                    <span className="flex justify-center text-[12px] opacity-60 mb-[6px]">Cho Chó</span>
                    <h2 className="flex justify-center items-center text-center text-[13px] font-[600] text-[#333333] mb-[6px]">Raw hỗn hợp HG Food 400g cho thú cưng thơm ngon dinh dưỡng Pet Service.</h2>
                    <div className="flex justify-center items-center text-[18px] font-[700] mb-[20px]">
                        <span className="line-through text-[gray]">30.000
                            <span className="underline">đ</span>
                        </span>
                        &nbsp;
                        <span className="text-[#273172]">
                            25.000
                            <span className="underline">đ</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotItem