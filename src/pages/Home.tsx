import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FrictionFlow from '../components/FrictionFlow';
import Workflow from '../components/Workflow';
import PerformanceClub from '../components/PerformanceClub';
import Footer from '../components/Footer';
import MembershipApplication from '../components/MembershipApplication';

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <FrictionFlow />
                <Workflow />
                <PerformanceClub />
                <MembershipApplication />
            </main>
            <Footer />
        </>
    );
}
