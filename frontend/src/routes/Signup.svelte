<script lang="ts">
  import type { LayoutData } from "./$types";
  import { assert } from "$lib/assert";
  import * as m from "$lib/paraglide/messages.js";

  let { data }: { data: LayoutData } = $props();
  let { session, supabase } = $derived(data);
  let name = $state("");
  let profile = $state(data.profile);

  async function setName(e: SubmitEvent) {
    e.preventDefault();
    assert(!!name, "name cannot be empty");
    let user_id = session?.user?.id;
    if (!session) {
      const { data, error } = await supabase.auth.signInAnonymously();
      assert(!error && !!data.user, "error signing in anonymously");
      user_id = data.user!.id;
    }
    console.log(`updating name of player with id {${user_id}} to ${name}`);
    const { data, error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user_id)
      .select();
    console.log("updated user: ", data);
    assert(!error, "error updating player name");
    profile.name = name;
  }
</script>

<h1>{m.what_to_call_you()}</h1>
<form onsubmit={setName}>
  <label class="form-control block w-full max-w-xs">
    <div class="label">
      <span class="label-text">Username</span>
    </div>
    <input
      bind:value={name}
      type="text"
      placeholder="John Doe"
      class="input input-bordered w-full max-w-xs"
    />
  </label>
</form>
