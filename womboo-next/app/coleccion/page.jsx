import Header from '../components/Header';
import Coleccion from '../components/Coleccion';
import Footer from '../components/Footer';

const products = [
  { name: 'Oversized Hoodie', price: '$89.99' },
  { name: 'Technical Tee', price: '$49.99' },
  { name: 'Cargo Pants', price: '$129.99' },
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
