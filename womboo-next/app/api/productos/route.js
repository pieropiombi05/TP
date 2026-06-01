export async function GET() {
  const productos = [
    {
      id: 1,
      nombre: 'Oversized Hoodie',
      precio: 89.99,
      imagen: '/images/hoodie.png',
      categoria: 'Hoodies'
    },
    {
      id: 2,
      nombre: 'Technical Tee',
      precio: 49.99,
      imagen: '/images/shirt.png',
      categoria: 'Remeras'
    },
    {
      id: 3,
      nombre: 'Cargo Pants',
      precio: 129.99,
      imagen: '/images/pants.png',
      categoria: 'Pantalones'
    },
    {
      id: 4,
      nombre: 'Rain Jacket',
      precio: 149.99,
      imagen: '/images/jacket.png',
      categoria: 'Outerwear'
    }
  ];

  return Response.json({
    success: true,
    data: productos,
    total: productos.length
  });
}