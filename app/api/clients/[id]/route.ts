import { neon } from '@neondatabase/serverless';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const sql = neon(process.env.DATABASE_URL!);
    const allowed = ['name','address','price','last_contact','status','current_stage','next_action','agent','source','entered_stage','phone','email'];
    const fields = Object.keys(body).filter(k => allowed.includes(k));
    if (!fields.length) return Response.json({ ok: true });

    // Build update using tagged template per field
    for (const f of fields) {
      const val = body[f];
      if (f === 'name') await sql`UPDATE clients SET name=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'address') await sql`UPDATE clients SET address=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'price') await sql`UPDATE clients SET price=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'status') await sql`UPDATE clients SET status=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'current_stage') await sql`UPDATE clients SET current_stage=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'entered_stage') await sql`UPDATE clients SET entered_stage=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'last_contact') await sql`UPDATE clients SET last_contact=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'next_action') await sql`UPDATE clients SET next_action=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'agent') await sql`UPDATE clients SET agent=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'source') await sql`UPDATE clients SET source=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'phone') await sql`UPDATE clients SET phone=${val}, updated_at=NOW() WHERE id=${id}`;
      else if (f === 'email') await sql`UPDATE clients SET email=${val}, updated_at=NOW() WHERE id=${id}`;
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
