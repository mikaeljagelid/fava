<script lang="ts">
  import { day } from "../format.ts";
  import { urlForAccount } from "../helpers.ts";
  import { ancestors, leaf } from "../lib/account.ts";
  import { account_details } from "../stores/index.ts";
  import AccountIndicator from "./AccountIndicator.svelte";

  interface Props {
    account: string;
  }

  let { account }: Props = $props();

  let parts = $derived(ancestors(account));
  let details = $derived($account_details[account]);
  let last = $derived(details?.last_entry);
  let description = $derived(details?.description);
</script>

<span class="droptarget" data-account-name={account}>
  {#each parts as name, index (index)}
    <a href={$urlForAccount(name)} title={name}>{leaf(name)}</a
    >{#if index < parts.length - 1}:{/if}
  {/each}
  <AccountIndicator {account} />
  {#if description != null || last != null}
    <span class="last-activity">
      {#if description != null}<em>{description}</em
        >{/if}{#if description != null && last != null}&nbsp;&nbsp;&nbsp;{/if}{#if last != null}(Last
        entry: <a href="#context-{last.entry_hash}">{day(last.date)}</a>){/if}
    </span>
  {/if}
</span>

<style>
  a {
    color: unset;
  }

  .droptarget {
    padding: 0.6em;
    margin-left: -0.6em;
  }

  .last-activity {
    display: inline-block;
    margin-left: 10px;
    font-size: 12px;
    font-weight: normal;
    opacity: 0.8;
  }
</style>
