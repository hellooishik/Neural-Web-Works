import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Services from './components/Services.jsx';
import Process from './components/Process.jsx';
import StackExplorer from './components/StackExplorer.jsx';
import Work from './components/Work.jsx';
import Pricing from './components/Pricing.jsx';
import BriefForm from './components/BriefForm.jsx';
import Faq from './components/Faq.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <StackExplorer />
        <Work />
        <Pricing />
        <BriefForm />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
