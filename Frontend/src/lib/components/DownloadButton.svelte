<script>
  import { api } from "$lib/js/api";
  import { NormalGame } from "$lib/js/NormalGame";

  let locationsShowing = false;
  let captures = $api.game.currentPhase.captures;

  let rows = [["word", "player name", "removed", "url"]];
  for (let capture of captures) {
    let pano = capture.pano.pano;
    let link = `https://www.google.com/maps/@?api=1&map_action=pano&pano=${
      pano.pano
    }&heading=${pano.pov.heading <= 360 ? pano.pov.heading : 360}&pitch=${
      pano.pov.pitch <= 90 ? pano.pov.pitch : 90
    }&fov=${
      180 / Math.pow(2, pano.pov.zoom) <= 100
        ? 180 / Math.pow(2, pano.pov.zoom)
        : 100
    }`;
    rows.push([
      $api.game.currentPhase.words[capture.word].word,
      capture.player.name,
      capture.removed,
      link,
    ]);
  }
  let csvContent =
    "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `GeoBingo.io;Host=${
      api.game instanceof NormalGame ? $api?.game?.currentPhase.host.name : ""
    };Date=${new Date().toLocaleString()}.csv`
  );
  document.body.appendChild(link); // Required for FF
</script>

<div class="flex w-full my-5 justify-between">
  <button
    class="btn btn-sm m-1 "
    on:click={() => {
      locationsShowing = !locationsShowing;
    }}
  >
    show all locations
  </button>
  <button
    class="btn  btn-sm   m-1"
    on:click={() => {
      link.click();
    }}
  >
    save Locations as csv
  </button>
</div>

{#if locationsShowing}
  <div class="overflow-x-auto">
    <table class="bg-base-100 table w-full">
      <thead>
        <tr>
          <td />
          <td>{rows[0][0]}</td>
          <td>{rows[0][1]}</td>
          <td>{rows[0][2]}</td>
          <td>{rows[0][3]}</td>
        </tr>
      </thead>
      <tbody>
        {#each rows.slice(1) as row, i}
          <tr>
            <td>{i + 1}</td>
            <td>{row[0]}</td>
            <td>{row[1]}</td>
            <td>{row[2]}</td>
            <td
              ><a href={row[3]} target="_blank"
                ><button class="btn btn-sm ">open</button><a /></a
              ></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
