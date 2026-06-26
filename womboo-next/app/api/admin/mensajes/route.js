import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabase.js';

// Fuerza la consulta a Supabase en cada petición para que los mensajes aparezcan de inmediato.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Trae todos los mensajes de la tabla mensajes ordenados por fecha descendente.
    const { data, error } = await supabase
      .from('mensajes')
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
    console.error('Error al obtener mensajes:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudieron cargar los mensajes.'
      },
      { status: 500 }
    );
  }
}
