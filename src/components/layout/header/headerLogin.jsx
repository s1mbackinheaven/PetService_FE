import React, { useState, useEffect } from "react";
// import { Layout, Menu, Button } from "antd";
import Icon from "./icon";
import MenuHeader from "./menuheader";
import AvatarHeader from "./avatarHeader";
const AppHeader = () => {

    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    // ${isScrolled ? 'bg-[gray] opacity-50' : 'bg-[gray] opacity-80'}
    return (
        // border border-gray-300 rounded-lg shadow-sm
        // <div className={`flex justify-center items-center h-[110px] fixed top-0 right-0 left-0 z-100`}>
        //     <Icon />
        //     <MenuHeader />
        //     <LoginHeader />
        // </div>
        <div className="flex justify-center items-center h-[110px] mb-[-100px]">
            {/* // <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#ffffffd8] md:bg-[#03001417] md:backdrop-blur-md z-50 px-10"> */}
            <Icon />
            <MenuHeader />
            <AvatarHeader />
        </div>
    );
};

export default AppHeader;
