import { useNavigate } from 'react-router-dom';

const LoginHeader = () => {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="flex ml-[35px] w-[200px] justify-center items-center rounded-r-full rounded-l-full bg-black h-[40px] group hover:bg-[#454ed0] shadow-md"
            onClick={handleLoginClick}>
            <a className="group-hover:text-[#ccc] uppercase text-white" href="">Đăng Nhập/Đăng Kí</a>
        </div>
    );
}

export default LoginHeader