<script>
  import "../app.css";
  import { onMount } from "svelte";
  import { themeChange } from "theme-change";

  // NOTE: the element that is using one of the theme attributes must be in the DOM on mount
  onMount(() => {
    themeChange(false);
    // 👆 false parameter is required for svelte
  });
</script>

<!-- <svelte:head> -->
<!--   <script> -->
<!--     window.aiptag = window.aiptag || { cmd: [] }; -->
<!--     aiptag.cmd.display = aiptag.cmd.display || []; -->
<!--     aiptag.cmd.player = aiptag.cmd.player || []; -->
<!--     //CMP tool settings -->
<!--     aiptag.cmp = { -->
<!--       show: true, -->
<!--       position: "fullscreen", //centered, bottom -->
<!--       button: true, -->
<!--       buttonText: "Privacy settings", -->
<!--       buttonPosition: "bottom-left", //bottom-left, bottom-right, top-left, top-right -->
<!--     }; -->
<!--     aiptag.cmd.player.push(function () { -->
<!--       aiptag.adplayer = new aipPlayer({ -->
<!--         AD_WIDTH: 960, -->
<!--         AD_HEIGHT: 540, -->
<!--         AD_DISPLAY: "fullscreen", //default, fullscreen, center, fill -->
<!--         LOADING_TEXT: "loading advertisement", -->
<!--         PREROLL_ELEM: function () { -->
<!--           return document.getElementById("preroll"); -->
<!--         }, -->
<!--         AIP_COMPLETE: function (state) { -->
<!--           /******************* -->
<!-- 				 ***** WARNING ***** -->
<!-- 				 ******************* -->
<!-- 				 Please do not remove the PREROLL_ELEM -->
<!-- 				 from the page, it will be hidden automaticly. -->
<!-- 				*/ -->
<!---->
<!--           console.log("Preroll Ad Completed: " + state); -->
<!--         }, -->
<!--       }); -->
<!--     }); -->
<!---->
<!--     function show_preroll() { -->
<!--       //check if the adslib is loaded correctly or blocked by adblockers etc. -->
<!--       if ( -->
<!--         !localStorage.getItem("donator") && -->
<!--         typeof aiptag.adplayer !== "undefined" -->
<!--       ) { -->
<!--         aiptag.cmd.player.push(function () { -->
<!--           aiptag.adplayer.startPreRoll(); -->
<!--         }); -->
<!--       } else { -->
<!--         //Adlib didnt load this could be due to an adblocker, timeout etc. -->
<!--         //Please add your script here that starts the content, this usually is the same script as added in AIP_COMPLETE. -->
<!--         console.log("Ad Could not be loaded"); -->
<!--       } -->
<!--     } -->
<!--   </script> -->
<!--   <script -->
<!--     async -->
<!--     src="//api.adinplay.com/libs/aiptag/pub/GBN/geobingo.io/tag.min.js"></script> -->
<!-- </svelte:head> -->

<div class=" min-h-screen w-full flex flex-col justify-stretch">
  <div id="preroll" />
  <slot />
</div>
