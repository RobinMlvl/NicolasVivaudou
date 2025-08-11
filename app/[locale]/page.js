import Hero from '../../components/home/Hero';
import Portfolio from '../../components/home/Portfolio';
import About from '../../components/home/About';
import Services from '../../components/home/Services';
import Contact from '../../components/home/Contact';
import Footer from '../../components/home/Footer';
import Navbar from '../../components/home/Navbar';

export default function Home() {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <Hero />
      <Portfolio />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}