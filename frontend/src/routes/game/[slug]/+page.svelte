<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { RealtimePostgresInsertPayload, SupabaseClient } from '@supabase/supabase-js';
	import { assert } from '$lib/assert';

	let { data }: { data: PageData } = $props();
	const game = $state(data.game);
	let supabase: SupabaseClient<any, 'public', any> = $derived(data.supabase);
	let session: any = $derived(data.session);
	async function startLobby() {
		const now = new Date().toISOString();
		const res = await supabase.from('games').update({ started_at: now }).eq('id', game.id).select();
		console.log(res);
	}

	async function addPlayer(
		payload: RealtimePostgresInsertPayload<{
			[key: string]: any;
		}>
	) {
		if (!payload.new) return;
		const res = await supabase.from('players').select('*').eq('id', payload.new.player_id).single();
		assert(!res.error, "couldn't get new player");
		game.players.push({ player: res.data });
	}

	onMount(async () => {
		supabase
			.channel('participations')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'participations',
					filter: `game_id=eq.${game.id}`
				},
				addPlayer
			)
			.subscribe();
	});
</script>

<h1 class="mt-4 text-center text-3xl">
	<span>
		{game.admin.name}'s Lobby
	</span>
	{#if game.started_at}
		<span>(in progress) </span>
	{:else}
		<button onclick={startLobby} class="btn btn-primary text-2xl">Start</button>
	{/if}
</h1>
<div>
	<h2 class="text-xl">Players:</h2>
	{#each game.players as item, i}
		<div>
			<span class="mr-2">{i + 1}.</span>
			<span>
				{item.player.name}
			</span>
			{#if game.admin.id == item.player.id}
				(Admin)
			{/if}
		</div>
	{/each}
</div>
