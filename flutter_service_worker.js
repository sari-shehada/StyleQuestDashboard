'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "96215e35f121a5698a0547e6b6e14639",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "e7fb4439b45ab04b2a50bf3381bf6878",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "114d065db66136dd18651d2bc0050af1",
"assets/AssetManifest.bin": "4fe1f3b5e8b3ced8235584f8ffabab1f",
"assets/fonts/Inter-Thin.ttf": "4558ff85abeab91af24c86aab81509a7",
"assets/fonts/Inter-Medium.ttf": "cad1054327a25f42f2447d1829596bfe",
"assets/fonts/Inter-Regular.ttf": "ea5879884a95551632e9eb1bba5b2128",
"assets/fonts/MaterialIcons-Regular.otf": "711e1a940c09c0e30458bbc71459860f",
"assets/fonts/Inter-Light.ttf": "a3fe4e0f9fdf3119c62a34b1937640dd",
"assets/fonts/Inter-ExtraLight.ttf": "7a177fa21fece72dfaa5639d8f1c114a",
"assets/fonts/Inter-Bold.ttf": "ba74cc325d5f67d0efbeda51616352db",
"assets/fonts/Inter-ExtraBold.ttf": "72ac147c98056996b2a31e95a56d6e66",
"assets/fonts/Inter-Black.ttf": "118c5868c7cc1370fcf5a1fc2f569883",
"assets/fonts/Inter-SemiBold.ttf": "465266b2b986e33ef7e395f4df87b300",
"assets/AssetManifest.json": "5401844fa1d7964c6dcee5428591ff9e",
"assets/FontManifest.json": "1eb4ebb43616aff7f3e725995fccd32d",
"assets/assets/map_styles/dark_mode.json": "0bc926b57222d37e93dbd2d63372f404",
"assets/assets/texts/terms_and_conditions_ar.md": "b504cc994b9183c9d4b5169794662681",
"assets/assets/texts/terms_and_conditions_en.md": "5aee81ecba4beb72db3dc58dccdc4381",
"assets/assets/light/placeholders/customer.jpg": "cb7f4806429c1e59dcaa8a431bcf73c0",
"assets/assets/light/placeholders/salon.png": "9fa15ac833f089da417cc090c8e65679",
"assets/assets/light/placeholders/specialist.jpg": "abbde188c89ad52499785aa4ee1f267b",
"assets/assets/shared/icons/app_icon.png": "2b3aac3122c7d71d731bb7b9ee882b6c",
"assets/assets/shared/icons/app_icon_white.png": "2933b788727812fd9d270dd72de504f1",
"assets/assets/dark/placeholders/customer.jpg": "52f9996418255fb03de7db5d9ab50b90",
"assets/assets/dark/placeholders/specialist.jpg": "6e384eab066ac59678be09afd8f0bfcf",
"assets/NOTICES": "37c6bf0473c111919545419c47843b53",
"assets/AssetManifest.bin.json": "9bedb868789619b6934a34d23f9ea612",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"manifest.json": "d37c4da88379fe0a558eae1a785147b2",
"index.html": "f20f5fcf59d553475412d05940828c3d",
"/": "f20f5fcf59d553475412d05940828c3d",
"version.json": "191595f72c94967ff44fc676a3aedb8c",
"flutter_bootstrap.js": "e9e35d2623540941f8d8587c48505962",
"main.dart.js": "f85b761d8fc371d72b67e10beef59b2b",
"favicon.png": "5dcef449791fa27946b3d35ad8803796"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
