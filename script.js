window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-0CNDXRJ252');

const API_URL =
"https://script.google.com/macros/s/AKfycbyFuh-_5l0A5XNOKQyepSYQkr8l6d9Ap7fXtEgwnZoghj8KT4GxSWZRv0gZSUDvKLM/exec";

const CARD_IMAGE_FOLDER = "14f7DQ0_NgqwWsWodjsYPQPM2Frsz89YG";
const imageMap = {};

let sheetData={};

const DRIVE_API_KEY = 'AIzaSyChKGiFIRlWRrarAZlbBaLQQJKCWIthN54';

async function loadFolderPhotos(folderId, label) {
  document.getElementById('sheet-label').textContent = label;
  document.getElementById('sheet-page').classList.add('open');
  document.body.style.overflow = 'hidden';

  const frame = document.getElementById('sheet-frame');
  const viewer = document.getElementById('photo-viewer');

  frame.style.display = 'none';

  // ✅ GRID LAYOUT (MAIN CHANGE)
  if (window.innerWidth <= 600) {
  // 📱 MOBILE → FULL WIDTH (NO GRID)
  viewer.style.display = 'flex';
  viewer.style.flexDirection = 'column';
  viewer.style.gap = '16px';
  viewer.style.padding = '12px 10px';
} else {
  // 💻 DESKTOP → GRID
  viewer.style.display = 'grid';
  viewer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(500px, 1fr))';
  viewer.style.gap = '12px';
  viewer.style.padding = '12px 16px';
}
  viewer.style.width = '100%';  
  viewer.style.maxWidth = 'none';

  viewer.innerHTML = '<div style="color:#555;text-align:center;padding:60px;">⏳ Loading photos...</div>';

  try {
    const query = encodeURIComponent(
      `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`
    );

    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${DRIVE_API_KEY}&fields=files(id,name)&orderBy=createdTime desc&pageSize=50`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      viewer.innerHTML = `<div style="color:#e63946;text-align:center;padding:60px;">
        Error: ${data.error.message}
      </div>`;
      return;
    }

    const files = data.files;

    if (!files || files.length === 0) {
      viewer.innerHTML = '<div style="color:#555;text-align:center;padding:60px;">No photos found.</div>';
      return;
    }

    viewer.innerHTML = '';

    files.forEach((file, i) => {
      const wrapper = document.createElement('div');

      // ✅ CARD STYLE
      wrapper.style.cssText = `
        width:100%;
        background:#0a0a0a;
        border-radius:10px;
        overflow:hidden;
        position:relative;
      `;

      const img = document.createElement('img');
      img.src = `https://lh3.googleusercontent.com/d/${file.id}`;

      // ✅ IMAGE STYLE (GRID FRIENDLY)
      img.style.cssText = `
        width:100%;
        object-fit:cover;
        display:block;
        transition:0.3s;
        cursor:pointer;
      `;

      img.loading = 'lazy';
      img.alt = file.name;

      // 🔥 hover effect (makes it feel premium)
      img.onmouseover = () => img.style.transform = 'scale(1.05)';
      img.onmouseout = () => img.style.transform = 'scale(1)';

      // 🔍 click to zoom
      img.onclick = () => openImageZoom(img.src);

      // ❌ hide broken images
      img.onerror = () => wrapper.style.display = 'none';

      // 📊 counter badge
      const num = document.createElement('div');
      num.style.cssText = `
        position:absolute;
        top:10px;
        right:10px;
        background:rgba(0,0,0,0.6);
        color:#fff;
        font-size:11px;
        padding:4px 10px;
        border-radius:20px;
      `;
      num.textContent = `${i + 1} / ${files.length}`;

      wrapper.appendChild(img);
      wrapper.appendChild(num);
      viewer.appendChild(wrapper);
    });

  } catch (err) {
    viewer.innerHTML = `<div style="color:#e63946;text-align:center;padding:60px;">
      Failed to load photos<br>${err.message}
    </div>`;
  }
}
function openSheet(key) {
  gtag('event', 'event_open', {
  event_category: 'concert',
  event_label: key
});
  const data = sheetData[key];
  if (!data) return;

  document.getElementById('sheet-label').textContent = data.label;
  document.getElementById('sheet-page').classList.add('open');
  document.body.style.overflow = 'hidden';

  const frame = document.getElementById('sheet-frame');
  const viewer = document.getElementById('photo-viewer');

  if (data.folder) {
    // FOLDER MODE — auto loads all photos from Drive folder
    frame.style.display = 'none';
    loadFolderPhotos(data.folder, data.label);

  } else if (data.photos) {
    // MANUAL PHOTOS array
    frame.style.display = 'none';
    viewer.style.display = 'grid';
    viewer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
    viewer.style.gap = '16px';
    viewer.style.padding = '20px';
    viewer.innerHTML = '';
    data.photos.forEach((url, i) => {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
      width:100%;
      background:#0a0a0a;
      border-radius:10px;
      overflow:hidden;
      `;
      const img = document.createElement('img');
      img.src = url;
      img.style.cssText = `
      width:100%;
      height:220px;
      object-fit:cover;
      display:block;
      `;
      img.loading = 'lazy';
      const num = document.createElement('div');
      num.style.cssText = 'position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.65);color:#fff;font-size:11px;padding:4px 10px;border-radius:20px;';
      num.textContent = `${i + 1} / ${data.photos.length}`;
      wrapper.appendChild(img);
      wrapper.appendChild(num);
      viewer.appendChild(wrapper);
    });

  } else if (data.url) {
    // GOOGLE SHEET
    viewer.style.display = 'none';
    viewer.innerHTML = '';
    frame.style.display = 'flex';
    frame.src = data.url;
  }
}

function openImageZoom(src) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.95);
    display:flex;justify-content:center;align-items:center;
    z-index:9999;overflow:hidden;touch-action:none;
  `;

  const closeBtn = document.createElement("div");
  closeBtn.innerHTML = "✕";
  closeBtn.style.cssText = `
    position:absolute;top:12px;right:12px;
    font-size:20px;color:#fff;cursor:pointer;
    z-index:10000;
    background:rgba(255,255,255,0.2);
    width:52px;height:52px;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    -webkit-tap-highlight-color:transparent;
    touch-action:manipulation;
    border:2px solid rgba(255,255,255,0.3);
  `;

  // Make touch area even bigger with padding trick
  closeBtn.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    e.preventDefault();
    closeOverlay();
  }, { passive: false });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeOverlay();
  });

  const hint = document.createElement("div");
  hint.innerHTML = "Scroll to zoom · Drag to pan · Double-click to reset";
  hint.style.cssText = `
    position:absolute;bottom:20px;left:50%;transform:translateX(-50%);
    font-size:11px;color:#777;white-space:nowrap;pointer-events:none;
    transition:opacity 1s;z-index:10000;
  `;
  setTimeout(() => hint.style.opacity = '0', 2500);

  const img = document.createElement("img");
  img.alt = "Enlarged event image";
  img.src = src;
  img.style.cssText = `
    max-width:90vw;max-height:90vh;
    cursor:grab;user-select:none;-webkit-user-drag:none;
    transform-origin:center center;
    display:block;will-change:transform;
  `;

  let scale = 1, posX = 0, posY = 0;
  let isDragging = false, lastX, lastY, lastDist = null;
  let closed = false;

  function clampPos() {
    if (scale <= 1) { posX = 0; posY = 0; return; }
    const rect = img.getBoundingClientRect();
    const maxX = Math.max(0, (rect.width - window.innerWidth) / 2 + 40);
    const maxY = Math.max(0, (rect.height - window.innerHeight) / 2 + 40);
    posX = Math.max(-maxX, Math.min(maxX, posX));
    posY = Math.max(-maxY, Math.min(maxY, posY));
  }

  function applyTransform(smooth = false) {
    img.style.transition = smooth ? 'transform 0.25s ease' : 'none';
    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  }

  function closeOverlay() {
    if (closed) return;
    closed = true;
    overlay.remove();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  // WHEEL ZOOM
  overlay.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    scale = Math.min(Math.max(1, scale * factor), 6);
    clampPos();
    applyTransform();
  }, { passive: false });

  // MOUSE DRAG
  img.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if (scale <= 1) return;
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    img.style.cursor = 'grabbing';
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    posX += e.clientX - lastX;
    posY += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    clampPos();
    applyTransform();
  }

  function onMouseUp() {
    isDragging = false;
    img.style.cursor = scale > 1 ? 'grab' : 'default';
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  // DOUBLE CLICK RESET
  img.addEventListener('dblclick', () => {
    scale = 1; posX = 0; posY = 0;
    applyTransform(true);
    img.style.cursor = 'default';
  });

  // TOUCH PINCH + PAN
  overlay.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      lastDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1) {
      isDragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    }
  }, { passive: false });

  overlay.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && lastDist !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      scale = Math.min(Math.max(1, scale * (dist / lastDist)), 6);
      lastDist = dist;
      clampPos();
      applyTransform();
    } else if (e.touches.length === 1 && isDragging) {
      posX += e.touches[0].clientX - lastX;
      posY += e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      clampPos();
      applyTransform();
    }
  }, { passive: false });

  overlay.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) lastDist = null;
    if (e.touches.length === 0) isDragging = false;
  });

  // CLOSE — stopPropagation prevents bubbling to overlay click
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeOverlay();
  });

  // Click dark area to close (but NOT the image)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  // ESC key to close
  const onKeyDown = (e) => {
    if (e.key === 'Escape') { closeOverlay(); document.removeEventListener('keydown', onKeyDown); }
  };
  document.addEventListener('keydown', onKeyDown);

  overlay.appendChild(closeBtn);
  overlay.appendChild(hint);
  overlay.appendChild(img);
  document.body.appendChild(overlay);
}
function closeSheet() {
  document.getElementById('sheet-page').classList.remove('open');
  document.getElementById('sheet-frame').src = '';
  document.getElementById('sheet-frame').style.display = 'none';
  document.getElementById('photo-viewer').style.display = 'none';
  document.getElementById('photo-viewer').innerHTML = '';
  document.body.style.overflow = '';
}

function openAbout(){
  document.getElementById('about-page').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeAbout(){
  document.getElementById('about-page').classList.remove('open');
  document.body.style.overflow='';
}

let currentCountry="all";
let currentService=null;

function openService(service) {
  currentService = service;
  document.getElementById("service-page").classList.add("hidden");
  document.getElementById("catalog-shell").classList.add("open");
  document.getElementById("catalog-label").textContent = service === "htb" ? "Help to Buy" : "Ready Stock";
  updateFilterButtons();
  applyFilters();
  window.scrollTo(0, 0);
}

function showServicePicker() {
  currentService = null;
  currentCountry = "all";
  document.getElementById("searchInput").value = "";
  document.querySelectorAll(".cat").forEach(button => button.classList.remove("active"));
  document.querySelector(".cat")?.classList.add("active");
  document.getElementById("catalog-shell").classList.remove("open");
  document.getElementById("service-page").classList.remove("hidden");
  updateFilterButtons();
  window.scrollTo(0, 0);
}

function setCountry(country,el){
  currentCountry=country;
  document.querySelectorAll('.cat').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  applyFilters();
}
function applyFilters(){
  const raw = document.getElementById('searchInput').value.toLowerCase().trim();
  const terms = raw.split(/\s+/).filter(Boolean); // split by spaces

  document.querySelectorAll('.card').forEach(card => {
    const dataTitle = (card.dataset.title || "").toLowerCase();
    const cardText = (card.innerText || card.textContent || "").toLowerCase();
    const combined = dataTitle + " " + cardText;
    const country = card.dataset.country || "";
    const service = card.dataset.service || "";

    // Every word must match somewhere in the combined text
    const matchSearch = !raw || terms.every(term => combined.includes(term));
    const matchCountry = (currentCountry === "all" || country === currentCountry);
    const matchService = !currentService || service === currentService;
    card.style.display = (matchSearch && matchCountry && matchService) ? "block" : "none";
  });
}

setInterval(()=>{
  const sp=document.getElementById("sheet-page");
  const iframe=document.getElementById("sheet-frame");
  if(sp.classList.contains("open")&&iframe.src){iframe.src=iframe.src;}
},180000);

function normalizeCountry(country) {
  const value = String(country || "").trim();
  const upper = value.toUpperCase();
  const countryMap = {
    MALAYSIA: "MY",
    SINGAPORE: "SG",
    THAILAND: "TH",
    KOREA: "KR",
    "SOUTH KOREA": "KR",
    INDONESIA: "ID",
    France: "FR",
    PHILIPPINES: "PH",
    "Hong Kong": "HK",
    "Rent Phone": "Rent",
    "Currency Exchange": "Currency",
    "Genting Concert Tickets": "Genting",
    AUSTRALIA: "AU",
    "United States of America": "US",
    MACAU: "MO",
    VIETNAM: "VN",
    TAIWAN: "TW",
  };

  return countryMap[upper] || upper;
}

function getEventService(event) {
  const type = String(event.type || "").trim().toLowerCase();
  return type === "htb" || type === "ready" ? type : "";
}

function openEventSheet(sheet, label) {
  if (!sheet) return;

  if (sheetData[sheet]) {
    openSheet(sheet);
    return;
  }

  document.getElementById('sheet-label').textContent = label || 'Event Details';
  document.getElementById('sheet-page').classList.add('open');
  document.body.style.overflow = 'hidden';

  const frame = document.getElementById('sheet-frame');
  const viewer = document.getElementById('photo-viewer');
  viewer.style.display = 'none';
  viewer.innerHTML = '';
  frame.style.display = 'flex';
  frame.src = sheet;
}

function renderEvent(event) {
  const country = normalizeCountry(event.country);
  const service = getEventService(event);
  const title = event.title || "";
  const description = event.description || "";
  const date = event.date || "";
  const venue = event.venue || "";
  const image = event.image || "";
  const label = event.label || title;
  const sheet = event.sheet || "";

  const card = document.createElement("div");
  card.className = "card";
  card.dataset.country = country;
  card.dataset.service = service;
  card.dataset.title = [
    event.id,
    title,
    description,
    country,
    date,
    venue,
    label
  ].filter(Boolean).join(" ").toLowerCase();
  card.onclick = () => openEventSheet(sheet, label);

 const img = document.createElement("img");
  img.alt = title;
  img.loading = "lazy";
  img.decoding = "async";

  const key = (image || "").trim().toLowerCase();
  img.dataset.imageKey = key;
  if (imageMap[key]) img.src = imageMap[key];

  const content = document.createElement("div");
  content.className = "card-content";

  const badge = document.createElement("span");
  badge.className = `badge badge-${country}`;
  badge.textContent = country;

  const titleEl = document.createElement("div");
  titleEl.className = "title2";
  titleEl.textContent = title;

  const descEl = document.createElement("div");
  descEl.className = "title3";
  descEl.textContent = description;

  content.appendChild(badge);
  content.appendChild(titleEl);
  content.appendChild(descEl);

  if (date) {
    const dateEl = document.createElement("div");
    dateEl.className = "info";
    dateEl.textContent = `📅 ${date}`;
    content.appendChild(dateEl);
  }

  if (venue) {
    const venueEl = document.createElement("div");
    venueEl.className = "info";
    venueEl.textContent = `📍 ${venue}`;
    content.appendChild(venueEl);
  }

  card.appendChild(img);
  card.appendChild(content);

  return card;
}

function getEventsFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.events)) return data.events;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.rows)) return data.rows;
  return [];
}

const EVENTS_CACHE_KEY = "ticketing-events-v2";
const EVENTS_CACHE_TTL = 10 * 60 * 1000;
const EVENTS_REQUEST_TIMEOUT = 12 * 1000;

function showEventsMessage(message, onRetry) {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;

  grid.innerHTML = "";
  const state = document.createElement("div");
  state.style.cssText = "grid-column:1/-1;color:#777;text-align:center;padding:50px 16px;font-size:13px;line-height:1.6;";
  state.textContent = message;
  grid.appendChild(state);

  if (onRetry) {
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "back-btn";
    retry.textContent = "Retry";
    retry.addEventListener("click", onRetry);
    state.appendChild(document.createElement("br"));
    state.appendChild(retry);
  }
}

function getCachedEvents() {
  try {
    const cached = JSON.parse(localStorage.getItem(EVENTS_CACHE_KEY));
    if (cached && Date.now() - cached.savedAt < EVENTS_CACHE_TTL && Array.isArray(cached.events)) {
      return cached.events;
    }
  } catch (error) {
    console.warn("Event cache could not be read.", error);
  }
  return null;
}

function cacheEvents(events) {
  try {
    localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), events }));
  } catch (error) {
    console.warn("Event cache could not be saved.", error);
  }
}

function updateServiceCounts(events) {
  const counts = { htb: 0, ready: 0 };
  events.forEach(event => {
    const service = getEventService(event);
    if (service) counts[service] += 1;
  });

  Object.entries(counts).forEach(([service, count]) => {
    const element = document.getElementById(`${service}-count`);
    if (element) element.textContent = `${count} ${count === 1 ? "listing" : "listings"}`;
  });
}

function renderEvents(events) {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;

  grid.innerHTML = "";
  sheetData = {};
  updateServiceCounts(events);

  if (!events.length) {
    showEventsMessage("No events are available right now.");
    return;
  }

  const cards = document.createDocumentFragment();
  events.forEach(event => {
    sheetData[event.id] = {
      label: event.label,
      url: event.sheet
    };
    cards.appendChild(renderEvent(event));
  });

  grid.appendChild(cards);
  updateFilterButtons();
  applyFilters();
}

async function loadEvents(){
  const cardImagesPromise = loadCardImages().catch(error => {
    console.warn("Card image map could not be loaded.", error);
  });

  const cachedEvents = getCachedEvents();
  if (cachedEvents) {
    renderEvents(cachedEvents);
  } else {
    showEventsMessage("Loading events...");
  }

  cardImagesPromise.then(updateCardImages);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EVENTS_REQUEST_TIMEOUT);

  try {

const response = await fetch(API_URL, {
  method: "GET",
  mode: "cors",
  redirect: "follow",
  signal: controller.signal
});

if (!response.ok) throw new Error(`Event API returned ${response.status}.`);

const data = await response.json();
const events = getEventsFromResponse(data);
cacheEvents(events);

renderEvents(events);
updateCardImages();

  } catch (error) {
    console.error("Event API failed.", error);
    if (!cachedEvents) {
      const message = error.name === "AbortError"
        ? "Events are taking too long to respond."
        : "Events could not be loaded. Check your connection and try again.";
      showEventsMessage(message, loadEvents);
    }
  } finally {
    clearTimeout(timeout);
  }

}

loadEvents();

function updateFilterButtons() {
  const available = new Set();
  let allButton;

  document.querySelectorAll(".card").forEach(card => {
    if (!currentService || card.dataset.service === currentService) {
      available.add(card.dataset.country);
    }
  });

  document.querySelectorAll(".cat").forEach(button => {
    const value = button.getAttribute("onclick")
      ?.match(/'([^']+)'/)?.[1];

    if (value === "all") {
      allButton = button;
      return;
    }

    if (value) button.style.display = available.has(value) ? "" : "none";
  });

  if (currentCountry !== "all" && !available.has(currentCountry)) {
    currentCountry = "all";
    document.querySelectorAll(".cat").forEach(button => button.classList.remove("active"));
    allButton?.classList.add("active");
  }
}
function getCardImageUrl(id) {
  return `https://lh3.googleusercontent.com/d/${id}=w900`;
}

function updateCardImages() {
  document.querySelectorAll("img[data-image-key]").forEach(img => {
    const src = imageMap[img.dataset.imageKey];
    if (src && !img.getAttribute("src")) img.src = src;
  });
}

async function loadCardImages() {

    const query = encodeURIComponent(
        `'${CARD_IMAGE_FOLDER}' in parents and mimeType contains 'image/' and trashed=false`
    );

    const url =
        `https://www.googleapis.com/drive/v3/files?q=${query}` +
        `&key=${DRIVE_API_KEY}` +
        `&fields=files(id,name)` +
        `&pageSize=1000`;

    const res = await fetch(url);
    const data = await res.json();
    const files = Array.isArray(data.files) ? data.files : [];

    files.forEach(file => {
        imageMap[file.name.toLowerCase()] =
            getCardImageUrl(file.id);
    });
}
