import Hero from '../../components/home/Hero';
import Portfolio from '../../components/home/Portfolio';
import About from '../../components/home/About';
import Services from '../../components/home/Services';

export default function Home() {
  return (
    <div>
      <Hero />
      <Portfolio />
      <About />
      <Services />
    </div>
  );
}