import { assert } from '$lib/assert';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies }) => {
  let { session } = await safeGetSession()
  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously();
    assert(!error && !!data.user, 'error signing in anonymously');
    session = data.session
  }
  if (!session) return {}
  const res = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session?.user?.id)
    .single()

  const { data } = res
  if (res.error) {
    console.log(res.error)
    return error(500, res.error)
  }
  return {
    profile: data,
    session,
    cookies: cookies.getAll(),
  }
}
