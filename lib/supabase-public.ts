import { createClient } from '@supabase/supabase-js'

  export function createPublicClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  ---
  2. Em app/page.tsx — linha 1:
  import { createPublicClient } from '@/lib/supabase-public'
  linha 15:
    const supabase = createPublicClient()

  ---
  3. Em app/_components/Parceiros.tsx — linha 1:
  import { createPublicClient } from '@/lib/supabase-public'
  linha 11:
    const supabase = createPublicClient()

  ---
