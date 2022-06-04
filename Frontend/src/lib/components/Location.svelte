<script>


    export let long
    export let lat
    function init (node){
    const map = L.map(node, { zoomControl: false }).setView([lat, long], 13)
    let googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}?hl=en',{
    maxZoom: 20,
    attribution: "Google",
    subdomains:['mt0','mt1','mt2','mt3'] });
    googleStreets.addTo(map)

    var marker = L.marker([lat, long]).addTo(map)
    }
</script>

<div class="" style="height:100%" use:init />
