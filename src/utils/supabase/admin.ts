import { createServerClient } from '@supabase/ssr'
import { Database } from '../database.types'

export const supabaseAdmin = createServerClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    cookies: {
      get: () => '',
      set: (_, __, ____) => undefined,
      remove: (_, __) => undefined,
    },
  }
)
