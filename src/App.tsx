import Navbar from './components/Navbar'; // <--- Import Navbar
import HeroSection from './components/HeroSection';
import FrictionFlow from './components/FrictionFlow';
import Workflow from './components/Workflow';
import PerformanceClub from './components/PerformanceClub';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="bg-background-dark min-h-screen">
      <Navbar /> {/* <--- Sticky Header at the top */}
      
      <main>
        <HeroSection />
        <FrictionFlow />
        <Workflow />
        <PerformanceClub />
      </main>

      <Footer />
    </div>
  );
}