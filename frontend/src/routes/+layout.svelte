<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Signup from './Signup.svelte'
    import Navbar from './Navbar.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let { session, supabase } = $derived(data);
	let name = $state('');
	let profile = $state(data.profile);

</script>

<div class="h-full min-h-screen w-full bg-ctp-base text-ctp-text">	
<ParaglideJS {i18n}>
		<Navbar/>
		{#if !profile?.name}
			<Signup {data}/>
		{:else}
	{@render children()}
		{/if}
</ParaglideJS>
</div>
