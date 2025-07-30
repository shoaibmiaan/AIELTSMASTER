import { supabaseAdmin } from '../../lib/supabaseAdminClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { user_id, email, full_name } = req.body;

    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user_id,
        email,
        full_name,
        role: 'student'
      }, {
        onConflict: 'id'
      });

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}