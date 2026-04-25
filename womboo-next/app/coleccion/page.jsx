import Header from '../components/Header';
import Coleccion from '../components/Coleccion';
import Footer from '../components/Footer';

const products = [
  { name: 'Oversized Hoodie', price: '$89.99', image: '/images/hoodie.png' },
  { name: 'Technical Tee', price: '$49.99', image: '/images/shirt.png' },
  { name: 'Cargo Pants', price: '$129.99', image: '/images/pants.png' },
  { name: 'Classic Sneakers', price: '$99.99', image: '/images/jacket.png' },
];

export default function ColeccionPage() {
  return (
    <>
      <Header />
      <main>
        <Coleccion products={products} />
      </main>
      <Footer />
    </>
  );
}
