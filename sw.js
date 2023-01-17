//derived from this: https://web.dev/offline-cookbook/#on-install-as-dependency

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("jf-portfolio-site").then(function (cache) {
      return cache.addAll([
        "assets/img/about-me.png",
        "assets/img/about-me.svg",
        "assets/img/bloodletting.png",
        "assets/img/bloodletting.webp",
        "assets/img/contact-me-vector.svg",
        "assets/img/contact-me.png",
        "assets/img/contact-me.svg",
        "assets/img/currency-converter.png",
        "assets/img/currency-converter.webp",
        "assets/img/dhelve.png",
        "assets/img/dhelve.webp",
        "assets/img/highway-hero.png",
        "assets/img/highway-hero.webp",
        "assets/img/home.png",
        "assets/img/home.svg",
        "assets/img/logo.png",
        "assets/img/logo.webp",
        "assets/img/necromancer.png",
        "assets/img/necromancer.webp",
        "assets/img/runecom.png",
        "assets/img/runecom.webp",
        "assets/img/projects.svg",
        "assets/img/projects.webp",
        "assets/img/samantha-sully-photo-2x.png",
        "assets/img/samantha-sully-photo-2x.webp",
        "assets/img/samantha-sully-photo.jpg",
        "assets/img/samantha-sully-photo.webp",
        "assets/img/testimonials.svg",
        "assets/img/testimonials.webp",
        "assets/img/runecom.webp",
        "index.html",
        "forecaster.html",
        "currency_converter.html",
        "/css/whatever-v3.css",
        "/css/imgs/sprites-v6.png",
        "/assets/fonts/icomoon.woff",
        "assets/fonts/notosans/woff2/NotoSans-Black.woff2",
        "assets/fonts/notosans/woff/NotoSans-Black.woff",
        "/js/main.js",
        "/sw.js",
      ]);
    })
  );
});
