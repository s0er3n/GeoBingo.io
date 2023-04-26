<script>
  import Head from "$lib/components/Head.svelte";

  import Pano from "$lib/components/Pano.svelte";

  show_preroll();
</script>

<div class="card h-full" style="height: 100vh;">
  <div class="p-2 card-body h-full">
    <Head />
    <div class="flex w-full h-full">
    <div class="hidden xl:flex justify-center items-center">
        <div id="geobingo-io_300x600" class="max-w-screen">
          <script type="text/javascript">
            if (!localStorage.getItem("donator")) {
              aiptag.cmd.display.push(function () {
                aipDisplayTag.display("geobingo-io_970x250");
              });
            }
          </script>
        </div>
    </div>
      <div class="w-full h-full">
    <Pano />
      </div>
    <div class="hidden lg:flex justify-center items-center">
        <div id="geobingo-io_300x600" class="max-w-screen">
          <script type="text/javascript">
            if (!localStorage.getItem("donator")) {
              aiptag.cmd.display.push(function () {
                aipDisplayTag.display("geobingo-io_970x250");
              });
            }
          </script>
        </div>
        </div>
    </div>
  </div>
</div>
