import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Component hiển thị header của trang blog
const BlogHeader = () => {
    // State để theo dõi vị trí scroll
    const [scrollY, setScrollY] = useState(0);

    // Hàm xử lý sự kiện scroll
    const handleScroll = () => {
        // Cập nhật giá trị scrollY khi cuộn trang
        setScrollY(window.scrollY);
    };

    // Thêm event listener cho scroll
    useEffect(() => {
        // Cập nhật giá trị scrollY ban đầu
        setScrollY(window.scrollY);

        // Thêm event listener để theo dõi sự kiện scroll
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup function khi component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Tính toán giá trị transform dựa trên scrollY
    const parallaxY = scrollY * 0.5; // Tăng hệ số lên 0.5 để thấy rõ hiệu ứng hơn

    return (
        <div className="relative w-full h-[360px] overflow-hidden mt-[136px] z-[-100]">
            {/* Ảnh nền cho header với hiệu ứng parallax */}
            <div
                className="absolute inset-0 will-change-transform"
                style={{
                    backgroundImage: "url('/pet.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center', // Bắt đầu hiển thị từ trên cùng
                    backgroundRepeat: 'no-repeat',
                    height: '150%', // Tăng chiều cao để có không gian cho ảnh di chuyển
                    top: `-${parallaxY}px`, // Di chuyển ảnh lên khi cuộn xuống
                    filter: "brightness(0.7)",
                    willChange: 'transform, top'
                }}
            />

            {/* Lớp gradient để làm đẹp và tăng độ tương phản */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.5)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Nội dung header */}
            <div className="relative h-full flex items-center justify-center">
                <motion.h1
                    className="text-5xl font-bold text-white text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.3,
                        type: "spring",
                        stiffness: 50
                    }}
                >
                    Blog
                </motion.h1>
            </div>

            {/* Hiệu ứng sóng nước - đơn giản hóa để tránh lỗi */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-8 bg-white"
                style={{
                    borderTopLeftRadius: "50% 100%",
                    borderTopRightRadius: "50% 100%"
                }}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.5
                }}
            />
        </div>
    );
};

export default BlogHeader; 