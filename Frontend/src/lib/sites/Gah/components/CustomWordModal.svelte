<script lang="ts">
  export let open: boolean;
  export let title: string;
  export let callback: () => void;
  export let closeText: string;
</script>

<div class={`modal ${open ? "modal-open" : ""}`}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">{title}</h3>
    <div class="py-2" />
    <slot />
    <div class="flex justify-end space-x-2">
      <div on:click={() => (open = false)} class="modal-action">
        <label for="my-modal" class="btn">cancel</label>
      </div>
      <div on:click={() => callback()} class="modal-action">
        <label for="my-modal" class="btn btn-primary">{closeText}</label>
      </div>
    </div>
  </div>
</div>
