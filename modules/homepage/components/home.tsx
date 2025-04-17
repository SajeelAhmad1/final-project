import FAQs from "./FAQs"
import Features from "./Features"
import Footer from "./Footer"
import Functionality from "./Functionality"
import Functionality2 from "./Functionality2"
import Functionality3 from "./Functionality3"
import Functionality4 from "./Functionality4"
import Hero from "./hero"
import Navbar from "./Navbar"

export const HomePage = () => {
    return (
        <>
            <div className="p-8 px-4 md:px-16 space-y-6">
                <Navbar />
                <Hero />
                <Features />
                <Functionality />
                <Functionality2 />
                <Functionality3 />
                <Functionality4 />
                <FAQs />
            </div>
            <Footer />
        </>
    )
}