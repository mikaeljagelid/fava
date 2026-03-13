import { get as store_get } from "svelte/store";

import { get_source_slice, put_source_slice } from "../../api/index.ts";
import { escape_for_regex } from "../../lib/regex.ts";
import { notify_err } from "../../notifications.ts";
import { router } from "../../router.ts";
import { fql_filter } from "../../stores/filters.ts";

/**
 * Add a filter to the existing list of filters. Any parts that are interpreted
 * as a regex must be escaped.
 */
function add_filter(value: string): void {
  const $fql_filter = store_get(fql_filter);
  router.set_search_param(
    "filter",
    $fql_filter ? `${$fql_filter} ${value}` : value,
  );
}

export function handle_journal_click({ target }: Event): void {
  if (!(target instanceof HTMLElement) || target instanceof HTMLAnchorElement) {
    return;
  }

  if (target.matches(".tag, .link")) {
    // Filter for tags and links when clicking on them.
    add_filter(target.innerText);
  } else if (target.matches(".payee")) {
    // Filter for payees when clicking on them.
    // Note: any special characters in the payee string are escaped so the
    // filter matches against the payee literally.
    add_filter(`payee:"^${escape_for_regex(target.innerText)}$"`);
  } else if (target.tagName === "DT") {
    // Filter for metadata key when clicking on the key. The key tag text
    // includes the colon.
    const expr = `${target.innerText}""`;
    add_filter(target.closest(".postings") ? `any(${expr})` : expr);
  } else if (target.tagName === "DD") {
    // Filter for metadata key and value when clicking on the value. The key
    // tag text includes the colon.
    const key = (target.previousElementSibling as HTMLElement).innerText;
    const value = `"^${escape_for_regex(target.innerText)}$"`;
    const expr = `${key}${value}`;
    add_filter(target.closest(".postings") ? `any(${expr})` : expr);
  } else if (target.matches(".flag") && target.closest("li.transaction")) {
    // Toggle transaction flag between * and ! when clicking on it.
    const li = target.closest("li.transaction");
    const context_link = li?.querySelector(
      "a[href^='#context-']",
    ) as HTMLAnchorElement | null;
    if (!context_link) {
      return;
    }
    const href = context_link.getAttribute("href");
    if (href == null) {
      return;
    }
    const entry_hash = href.slice("#context-".length);
    toggle_flag(entry_hash).catch(() => {
      // errors reported inside toggle_flag
    });
  } else if (target.closest(".indicators")) {
    // Toggle postings and metadata by clicking on indicators.
    target.closest(".journal > li")?.classList.toggle("show-full-entry");
  }
}

async function toggle_flag(entry_hash: string): Promise<void> {
  try {
    const { slice, sha256sum } = await get_source_slice({ entry_hash });
    const toggled = slice.replace(
      /^(\d{4}-\d{2}-\d{2} )([*!])/,
      (_, date: string, flag: string) => date + (flag === "*" ? "!" : "*"),
    );
    if (toggled === slice) {
      return;
    }
    await put_source_slice({ entry_hash, source: toggled, sha256sum });
    router.reload();
  } catch (error) {
    notify_err(error, (e) => `Toggling flag failed: ${e.message}`);
  }
}
