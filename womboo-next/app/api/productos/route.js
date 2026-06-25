import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabase.js';

// Fuerza la consulta a la base de datos en cada solicitud para que los cambios de Supabase se reflejen de inmediato.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Trae todos los productos desde la tabla productos, ordenados por id.
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: true });

    // Si Supabase devuelve un error, lo propagamos para mostrarlo en la respuesta.
    if (error) {
      throw error;
    }

    // Devolvemos el array de productos en el formato esperado por la colección.
    return NextResponse.json({
      success: true,
      data: data ?? [],
      total: data?.length ?? 0
    });
  } catch (error) {
    console.error('Error al obtener productos desde Supabase:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudieron cargar los productos.'
      },
      { status: 500 }
    );
  }
}