<script lang="ts">
  import type { AvailableLanguageTag } from "$lib/paraglide/runtime";
  import { i18n } from "$lib/i18n";
  import * as m from "$lib/paraglide/messages.js";
  import { goto } from "$app/navigation";

  function switchToLanguage(newLanguage: AvailableLanguageTag) {
    const canonicalPath = i18n.route(location.href);
    const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
    goto(localisedPath);
  }
</script>

<h1>{m.hello_world({ name: "SvelteKit User" })}</h1>
<div>
  <button onclick={() => switchToLanguage("en")}>en</button>
  <button onclick={() => switchToLanguage("de")}>de</button>
  <button onclick={() => switchToLanguage("ar")}>ar</button>
  <button onclick={() => switchToLanguage("sy")}>sy</button>
</div>
