// Language switch and optional app name.
//   ?lang=fr       opens the page in French
//   ?app=TaxMate   shows which app the visitor came from
(function () {
  var params = new URLSearchParams(location.search);
  var root = document.documentElement;

  var lang = params.get("lang");
  if (lang !== "en" && lang !== "fr") {
    lang = (navigator.language || "en").toLowerCase().indexOf("fr") === 0 ? "fr" : "en";
  }
  function apply(next) {
    lang = next;
    root.classList.toggle("fr", lang === "fr");
    root.lang = lang;
    var title = document.querySelector('meta[name="title-' + lang + '"]');
    if (title) { document.title = title.content; }
    // Keep the choice, and the app name, when moving between pages.
    document.querySelectorAll("a[data-keep]").forEach(function (link) {
      var url = new URL(link.getAttribute("href"), location.href);
      url.searchParams.set("lang", lang);
      if (app) { url.searchParams.set("app", app); }
      if (embed) { url.searchParams.set("embed", "1"); }
      link.href = url.pathname.split("/").pop() + url.search + url.hash;
    });
  }

  // ?embed=1: opened inside an app, which shows its own title bar.
  var embed = params.get("embed") === "1";
  if (embed) { root.classList.add("embed"); }

  var app = (params.get("app") || "").replace(/[^\w .&+'-]/g, "").slice(0, 40).trim();
  if (app) {
    document.querySelectorAll(".app-name").forEach(function (node) { node.textContent = app; });
    document.querySelectorAll(".app-only").forEach(function (node) { node.hidden = false; });
    document.querySelectorAll("a[data-mail]").forEach(function (link) {
      link.href = link.href.split("?")[0] + "?subject=" + encodeURIComponent(app);
    });
  }

  apply(lang);
  document.querySelectorAll("[data-set-lang]").forEach(function (button) {
    button.addEventListener("click", function () { apply(button.getAttribute("data-set-lang")); });
  });
})();
