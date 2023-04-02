<script>
  import Carousel from "$lib/components/Carousel.svelte";
  import Discord from "$lib/components/Discord.svelte";
  import Login from "$lib/components/Login.svelte";
  import Logo from "$lib/components/Logo.svelte";
  import Socials from "$lib/components/Socials.svelte";
  import StreamerFrontPage from "$lib/components/StreamerFrontPage.svelte";
  import YoutubeVideo from "$lib/components/YoutubeVideo.svelte";
  import { api } from "$lib/js/api";
  // let events = [
  // 	{
  // 		image: 'ukraine.jpg.webp',
  // 		link: 'https://bank.gov.ua/en/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi'
  // 	},
  // 	{
  // 		image: 'FMYn0keWUAABtRY.png',
  // 		link: 'https://donate.redcrossredcrescent.org/ua/donate/~my-donation'
  // 	}
  // ];
  let events = [
    {
      image: "wikiparty.png",
      link: "https://wikiparty.org",
    },
  ];
  let disabled = false;
</script>

<div class="min-h-screen">
  <div class="flex justify-center items-center p-2">
    <img class=" rounded-md  back shadow-2xl w-1/4" src="cover.png" alt="" />
  </div>

  <div class="p-2">
    <Socials />
  </div>

  <div class="flex justify-center items-center p-2">
    <div id="geobingo-io_970x250" class="hidden lg:block">
      <script type="text/javascript">
        if (!localStorage.getItem("donator")) {
          aiptag.cmd.display.push(function () {
            aipDisplayTag.display("geobingo-io_970x250");
          });
        }
      </script>
    </div>
  </div>
  <div class="w-full flex flex-col md:flex-row p-2 justify-center items-center">
    <div class="p-2 flex items-center justify-center">
      {#if $api?.player}
        <Login />
        <!-- {:else}
		loading -->
      {/if}
    </div>
    <div class="p-2">
      {#if $api.streamerFrontPage}
        <StreamerFrontPage streamerFrontPage={$api.streamerFrontPage} />
      {:else if events.length}
        <Carousel {events} bind:disabled />
      {:else}
        <Discord />
      {/if}
    </div>
  </div>
</div>
