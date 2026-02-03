import { writable } from "svelte/store";

export interface VisibleTreeInfo {
  order: string[];
  visible_children: Map<string, string[]>;
}

const visibility = writable(new Map<string, VisibleTreeInfo>());

export const tree_table_visibility = {
  subscribe: visibility.subscribe,
};

export function set_tree_visibility(root: string, info: VisibleTreeInfo): void {
  visibility.update((current) => {
    const next = new Map(current);
    next.set(root, info);
    return next;
  });
}

export function clear_tree_visibility(root: string): void {
  visibility.update((current) => {
    if (!current.has(root)) {
      return current;
    }
    const next = new Map(current);
    next.delete(root);
    return next;
  });
}
