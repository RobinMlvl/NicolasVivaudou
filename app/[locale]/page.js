import Hero from '../../components/home/Hero';
import Portfolio from '../../components/home/Portfolio';
import About from '../../components/home/About';
import Services from '../../components/home/Services';
import Contact from '../../components/home/Contact';
import Footer from '../../components/home/Footer';

export default function Home() {
  return (
    <div>
      <Hero />
      <Portfolio />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}