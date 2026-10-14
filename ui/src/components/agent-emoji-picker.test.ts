import { createComponent, flush } from "solid-js";
import { expect, it, vi } from "vitest";
import { mountSolid } from "../test-helpers/mount-solid.ts";
import { AgentEmojiPicker } from "./agent-emoji-picker.tsx";

it("filters emoji choices, selects their value, and remounts after removal", () => {
  const onSelect = vi.fn();
  const mount = () =>
    mountSolid(() => createComponent(AgentEmojiPicker, { value: "", disabled: false, onSelect }));
  let view = mount();
  try {
    flush();
    const search = view.container.querySelector<HTMLInputElement>(".agent-emoji-picker__search")!;
    search.value = "rocket";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    flush();
    const choice = view.container.querySelector<HTMLButtonElement>(".agent-emoji-picker__choice")!;
    expect(choice.textContent).toBe("🚀");
    choice.click();
    expect(onSelect).toHaveBeenCalledExactlyOnceWith("🚀");
    view.unmount();
    view = mount();
    flush();
    expect(view.container.querySelectorAll(".agent-emoji-picker__choice")).toHaveLength(24);
  } finally {
    view.unmount();
  }
});
