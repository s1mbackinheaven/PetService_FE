import AppHeader from "../components/layout/header/header";
import Intro from "../components/layout/content/intro/intro";
import Detail from "../components/layout/content/detail/detail";
import Information from "../components/layout/content/information/information";
import Commit from "../components/layout/content/commit/commit";
import Bonus from "../components/layout/content/bonus/bonus";
import Greeting from "../components/layout/content/greeting/greeting";
import Combo from "../components/layout/content/combo/combo";
import HotItem from "../components/layout/content/hotitem/hotitem";
import Hotline from "../components/layout/content/hotline/hotline";
import Footer from "../components/layout/footer/footer";
import IconToTop from "../components/others/icontotop";
import TMP from "../components/layout/content/information/tmp";
import '@/styles/index.css'
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Component tái sử dụng cho animation
const AnimatedSection = ({ children, animation }) => {
    // Khởi tạo ref và inView state (true khi phần tử đi vào viewport)
    const [ref, inView] = useInView({
        triggerOnce: true, // Chỉ trigger một lần
        threshold: 0.1, // Trigger khi 10% phần tử hiển thị
        rootMargin: "-50px 0px" // Kích hoạt sớm hơn 50px trước khi phần tử vào viewport
    });

    return (
        <motion.div
            ref={ref} // Gán ref từ useInView
            initial="hidden" // Trạng thái khởi tạo
            animate={inView ? "visible" : "hidden"} // Khi inView = true, chuyển thành visible
            variants={animation} // Dùng variants từ prop
        >
            {children}
        </motion.div>
    );
};

const HomePage = () => {
    // Định nghĩa các kiểu animation
    const fromTopAnimation = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 }
        }
    };

    const fromBottomAnimation = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 }
        }
    };

    const fadeInAnimation = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 1 }
        }
    };

    const fromLeftAnimation = {
        hidden: { opacity: 0, x: -100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8 }
        }
    };

    const fromRightAnimation = {
        hidden: { opacity: 0, x: 100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8 }
        }
    };

    const scaleAnimation = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8 }
        }
    };

    const rotateAnimation = {
        hidden: { opacity: 0, rotate: -5 },
        visible: {
            opacity: 1,
            rotate: 0,
            transition: { duration: 0.8 }
        }
    };

    const bounceAnimation = {
        hidden: { opacity: 0, y: 100 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                type: "spring",
                bounce: 0.4
            }
        }
    };

    return (
        <div>
            <AppHeader />

            {/* Intro - Từ trên xuống */}
            <AnimatedSection animation={fromTopAnimation}>
                <Intro />
            </AnimatedSection>

            {/* Detail - Từ dưới lên */}
            <AnimatedSection animation={fromBottomAnimation}>
                <Detail />
            </AnimatedSection>

            {/* Information - Hiện dần */}
            <AnimatedSection animation={fadeInAnimation}>
                <Information />
            </AnimatedSection>

            {/* Commit - Từ trái sang */}
            <AnimatedSection animation={fromLeftAnimation}>
                <Commit />
            </AnimatedSection>

            {/* Bonus - Từ phải sang */}
            <AnimatedSection animation={fromRightAnimation}>
                <Bonus />
            </AnimatedSection>

            {/* Greeting - Phóng to */}
            <AnimatedSection animation={scaleAnimation}>
                <Greeting />
            </AnimatedSection>

            {/* Combo - Xoay nhẹ */}
            <AnimatedSection animation={rotateAnimation}>
                <Combo />
            </AnimatedSection>

            {/* HotItem - Nảy lên */}
            <AnimatedSection animation={bounceAnimation}>
                <HotItem />
            </AnimatedSection>

            {/* Hotline - Hiện dần */}
            <AnimatedSection animation={fadeInAnimation}>
                <Hotline />
            </AnimatedSection>

            <Footer />
            <IconToTop />
        </div>
    );
}

export default HomePage;