<script>
  import { browser } from "$app/environment";
  let kofi;
  if (browser) {
    try {
      kofiwidget2.init("donate", "#29abe0", "F1F068LGZ");
      kofi = kofiwidget2.getHTML() ?? "";
    } catch (e) {
      console.log(e);
    }
  }
</script>

{@html kofi ?? ""}
