import { assert } from '$lib/assert';
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies }) => {
  let { session } = await safeGetSession()
  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously();
    assert(!error && !!data.user, 'error signing in anonymously');
    session = data.session
  }
  return {
    session,
    cookies: cookies.getAll(),
  }
}
