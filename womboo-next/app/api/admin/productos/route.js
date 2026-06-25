import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabase.js';

// Fuerza la consulta a Supabase en cada petición para que los cambios aparezcan inmediatamente.
export const dynamic = 'force-dynamic';

// Función auxiliar para centralizar la lectura de productos desde Supabase.
async function obtenerProductos() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function GET() {
  try {
    // Trae todos los productos para mostrarlos en la vista administrativa.
    const productos = await obtenerProductos();

    return NextResponse.json({
      success: true,
      data: productos,
      total: productos.length
    });
  } catch (error) {
    console.error('Error al listar productos:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudieron cargar los productos.'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabaseClient();

    // Lee el cuerpo de la petición enviada desde la página de administración.
    const body = await request.json();
    const { nombre, precio, imagen, categoria } = body;

    // Valida que los campos mínimos estén presentes antes de insertar.
    if (!nombre || !categoria) {
      return NextResponse.json(
        {
          success: false,
          error: 'El nombre y la categoría son obligatorios.'
        },
        { status: 400 }
      );
    }

    // Prepara el objeto que se insertará en Supabase.
    const productoParaCrear = {
      nombre,
      precio: Number(precio) || 0,
      imagen: imagen || '',
      categoria
    };

    // Inserta el nuevo producto y devuelve el registro creado.
    const { data, error } = await supabase
      .from('productos')
      .insert([productoParaCrear])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Producto creado correctamente.'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear producto:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo crear el producto.'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const supabase = getSupabaseClient();

    // Lee el cuerpo de la petición para obtener el id y los campos a actualizar.
    const body = await request.json();
    const { id, nombre, precio, imagen, categoria } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'El id del producto es obligatorio.'
        },
        { status: 400 }
      );
    }

    // Construye un objeto con solo los campos que se quieren actualizar.
    const productoParaActualizar = {
      nombre,
      precio: Number(precio) || 0,
      imagen: imagen || '',
      categoria
    };

    // Actualiza el producto que coincida con el id y devuelve el registro modificado.
    const { data, error } = await supabase
      .from('productos')
      .update(productoParaActualizar)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Producto actualizado correctamente.'
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo actualizar el producto.'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const supabase = getSupabaseClient();

    // Lee el id del producto que se desea eliminar desde el cuerpo de la petición.
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'El id del producto es obligatorio.'
        },
        { status: 400 }
      );
    }

    // Elimina el producto por id y devuelve el registro eliminado.
    const { data, error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Producto eliminado correctamente.'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo eliminar el producto.'
      },
      { status: 500 }
    );
  }
}
