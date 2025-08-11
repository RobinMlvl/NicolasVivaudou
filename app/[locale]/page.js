import Hero from '../../components/home/Hero';
import Portfolio from '../../components/home/Portfolio';
import About from '../../components/home/About';
import Services from '../../components/home/Services';
import Contact from '../../components/home/Contact';
import Footer from '../../components/home/Footer';
import Navbar from '../../components/home/Navbar';
import { getPersonStructuredData, getWebsiteStructuredData, getPhotographyServiceStructuredData } from '../../lib/structured-data';

export default async function Home({ params }) {
  const { locale } = await params;
  const currentLocale = locale || 'fr';
  
  // Structured Data pour le SEO
  const personData = getPersonStructuredData(currentLocale);
  const websiteData = getWebsiteStructuredData(currentLocale);
  const serviceData = getPhotographyServiceStructuredData(currentLocale);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
      
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
    </>
  );
}