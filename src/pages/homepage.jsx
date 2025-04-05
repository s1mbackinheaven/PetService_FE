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

const HomePage = () => {
    return (
        <div>
            <AppHeader />
            <Intro />
            <Detail />
            <Information />
            <Commit />
            <Bonus />
            <Greeting />
            <Combo />
            <HotItem />
            <Hotline />
            <Footer />
            <IconToTop />
        </div>
    );
}

export default HomePage;