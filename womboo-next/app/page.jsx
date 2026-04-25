import Header from './components/Header';
import Hero from './components/Hero';
import Coleccion from './components/Coleccion';
import Contacto from './components/Contacto';
import Footer from './components/Footer';

const products = [
  { name: 'Oversized Hoodie', price: '$89.99', image: '/images/hoodie.png' },
  { name: 'Technical Tee', price: '$49.99', image: '/images/shirt.png' },
  { name: 'Cargo Pants', price: '$129.99', image: '/images/pants.png' },
  { name: 'Classic Sneakers', price: '$99.99', image: '/images/jacket.png' },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Coleccion products={products} />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
