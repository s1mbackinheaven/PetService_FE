import { useState, useEffect } from 'react';
import { UpCircleOutlined } from "@ant-design/icons"

const IconToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0.01) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return (
        isVisible && (
            <button
                onClick={scrollToTop}
                className="fixed bottom-10 right-10 p-3 z-1000 bg-[#F0F0F0] rounded-full hover:shadow-[0px_0px_15px_-8px_rgba(0,0,0,0.8)] shadow-[0px_0px_10px_-8px_rgba(0,0,0,0.5)] focus:outline-none"
            >
                <UpCircleOutlined style={{ fontSize: '20px', color: '#273172' }} />
            </button>
        )
    );
}

export default IconToTop