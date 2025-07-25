import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient({ req, res });

    // Get the session data
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    // If there's an error with session retrieval or no session exists
    if (sessionError || !session) {
      return res.status(401).json({
        error: 'not_authenticated',
        description:
          'The user does not have an active session or is not authenticated',
      });
    }

    // Query the 'users' table (make sure it exists in your Supabase schema)
    const { data, error: queryError } = await supabase.from('users').select('*');

    // If there's an error with the query
    if (queryError) {
      return res.status(500).json({
        error: 'query_failed',
        description: queryError.message,
      });
    }

    // Return the fetched data
    return res.status(200).json(data);
  } catch (error) {
    // Catch any unexpected errors
    return res.status(500).json({
      error: 'internal_server_error',
      description: 'An unexpected error occurred.',
    });
  }
}
