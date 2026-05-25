import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const clients = await sql`SELECT * FROM clients ORDER BY type, current_stage DESC`;
    return Response.json(clients);
  } catch {
    return Response.json([], { status: 200 });
  }
}
