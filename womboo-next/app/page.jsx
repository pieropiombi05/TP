import Header from './components/Header';
import Hero from './components/Hero';
import Coleccion from './components/Coleccion';
import Contacto from './components/Contacto';
import Footer from './components/Footer';
import Reveal from './components/Reveal';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Coleccion ahora obtiene los productos directamente desde la API */}
        {/* No se necesita pasar props de productos */}
        <Reveal>
          <Coleccion />
        </Reveal>
        <Reveal>
          <Contacto />
        </Reveal>
      </main>
      <Reveal>
        <Footer />
      </Reveal>
    </>
  );
}
