import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabase.js';

// Fuerza la consulta a Supabase en cada petición para que las ventas aparezcan al instante.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Trae todas las órdenes registradas en la tabla ordenes, ordenadas por fecha descendente.
    const { data, error } = await supabase
      .from('ordenes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
      total: data?.length ?? 0
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudieron cargar las ventas.'
      },
      { status: 500 }
    );
  }
}
