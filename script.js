(function () {
  const q = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));

  // Only for saved rooms list
  const LS = {
    getSaved() {
      return JSON.parse(localStorage.getItem("savedRooms") || "[]");
    },
    setSaved(arr) {
      localStorage.setItem("savedRooms", JSON.stringify(arr));
    }
  };

  // ---------- API HELPERS ----------
  async function fetchJSON(url) {
    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } catch (err) {
      console.error("Fetch error:", err);
      return null;
    }
  }

  async function fetchRooms() {
    const data = await fetchJSON("get_rooms.php");
    if (!data) return [];
    return data.map((r) => ({
      ...r,
      id: r.room_id,
      title: r.title || "",
      city: r.city || "",
      street: r.street || "",
      price: Number(r.price) || 0,
      description: r.description || "",
      availability: r.availability || "available",
      gender: r.gender || "any",
      images: Array.isArray(r.images) ? r.images : []
    }));
  }

  async function fetchMyRooms() {
    const data = await fetchJSON("get_my_rooms.php");
    if (!data || data.error) return [];
    return data.map((r) => ({
      ...r,
      id: r.room_id,
      title: r.title || "",
      city: r.city || "",
      street: r.street || "",
      price: Number(r.price) || 0,
      description: r.description || "",
      availability: r.availability || "available",
      gender: r.gender || "any",
      images: Array.isArray(r.images) ? r.images : []
    }));
  }

  async function fetchRoomById(id) {
    const data = await fetchJSON("get_room.php?id=" + encodeURIComponent(id));
    if (!data || data.error) return null;
    return {
      ...data,
      id: data.room_id,
      title: data.title || "",
      city: data.city || "",
      street: data.street || "",
      price: Number(data.price) || 0,
      description: data.description || "",
      availability: data.availability || "available",
      gender: data.gender || "any",
      images: Array.isArray(data.images) ? data.images : []
    };
  }

  // ---------- HEADER / MENU ----------
  function headerBehavior() {
    const header = q("#site-header");
    const heroBg = q(".hero-bg");

    if (header) {
      window.addEventListener(
        "scroll",
        () => {
          const y = window.scrollY;
          if (y > 40) header.classList.add("scrolled");
          else header.classList.remove("scrolled");

          if (heroBg) {
            heroBg.style.transform = `translateY(${y * 0.12}px) scale(${
              1 + Math.min(y / 3000, 0.03)
            })`;
          }
        },
        { passive: true }
      );
    }

    const hamb = q("#hamburger");
    const mm = q("#mobile-menu");

    if (hamb && mm) {
      hamb.onclick = () => mm.classList.toggle("open");

      document.addEventListener("click", (e) => {
        if (!mm.contains(e.target) && !hamb.contains(e.target)) {
          mm.classList.remove("open");
        }
      });
    }
  }

  function animateOnScroll() {
    const els = qa("[data-animate]");
    if (!els.length) return;

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          obs.unobserve(e.target);
        }
      });
    });

    els.forEach((el) => io.observe(el));
  }

  function showRenterLinks() {
    // JS can't see PHP session, so safest is to hide renter links by default.
    // If you want, you can later make a small API that says whether current user is renter.
    const links = document.querySelectorAll(".renter-only");
    links.forEach((l) => (l.style.display = "none"));
  }

  // ---------- FILTER HELPERS ----------
  function populateFiltersFromRooms(rooms, citySel, streetSel) {
    if (!citySel || !streetSel) return;

    const cities = [...new Set(rooms.map((r) => r.city).filter(Boolean))];
    const streets = [...new Set(rooms.map((r) => r.street).filter(Boolean))];

    citySel.innerHTML =
      '<option value="">All Cities</option>' +
      cities.map((c) => `<option value="${c}">${c}</option>`).join("");

    streetSel.innerHTML =
      '<option value="">All Streets</option>' +
      streets.map((s) => `<option value="${s}">${s}</option>`).join("");
  }

  function applyFilters(rooms, { keyword, city, street, min, max }) {
    keyword = (keyword || "").toLowerCase();
    min = min ? Number(min) : null;
    max = max ? Number(max) : null;

    return rooms.filter((r) => {
      const price = Number(r.price) || 0;
      const matchesKey =
        !keyword ||
        r.title.toLowerCase().includes(keyword) ||
        r.description.toLowerCase().includes(keyword) ||
        r.city.toLowerCase().includes(keyword) ||
        r.street.toLowerCase().includes(keyword);

      const matchesCity = !city || r.city === city;
      const matchesStreet = !street || r.street === street;
      const matchesMin = min === null || price >= min;
      const matchesMax = max === null || price <= max;

      return matchesKey && matchesCity && matchesStreet && matchesMin && matchesMax;
    });
  }

  // ---------- CARDS ----------
  function makeCard(room) {
    const saved = LS.getSaved();
    const idStr = String(room.id);
    const isSaved = saved.includes(idStr);
    const imgSrc =
      room.images && room.images.length ? room.images[0] : "images/default.jpg";

    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <img src="${imgSrc}">

      <div class="meta">
        <div>
          <div style="font-weight:700">${room.title}</div>
          <div class="muted">${room.city} • ${room.street}</div>
        </div>
        <div class="price">${room.price}₪</div>
      </div>

      <div class="muted" style="margin-top:8px">
        ${room.description.substring(0, 90)}...
      </div>

      <div class="meta" style="margin-top:12px">
        <div class="badge ${
          room.availability === "available"
            ? "badge-available"
            : "badge-unavailable"
        }">
          ${room.availability === "available" ? "متاح" : "غير متاح"}
        </div>

        <div class="badge ${room.gender}">
          ${
            room.gender === "male"
              ? "ذكور"
              : room.gender === "female"
              ? "إناث"
              : "الجميع"
          }
        </div>

        <span class="muted">ID: ${room.serial_id || room.id}</span>
      </div>

      <div class="actions">
        <button class="icon-btn save-btn" data-id="${room.id}">
          ${isSaved ? "تم الحفظ ❤️" : "حفظ ♡"}
        </button>
        <button class="icon-btn det-btn" data-id="${room.id}">تفاصيل</button>
      </div>
    `;

    return card;
  }

  function renderList(rooms, id = "cards-grid") {
    const grid = q("#" + id);
    if (!grid) return;

    grid.innerHTML = "";
    if (!rooms.length) {
      grid.innerHTML = `<p class="muted">لا يوجد نتائج.</p>`;
      return;
    }

    rooms.forEach((r) => grid.appendChild(makeCard(r)));
    attachCardEvents();
  }

  function attachCardEvents() {
    qa(".save-btn").forEach((btn) => {
      btn.onclick = () => {
        let saved = LS.getSaved();
        const id = String(btn.dataset.id);

        if (saved.includes(id)) {
          saved = saved.filter((x) => x !== id);
          btn.textContent = "حفظ ♡";
        } else {
          saved.push(id);
          btn.textContent = "تم الحفظ ❤️";
        }

        LS.setSaved(saved);
      };
    });

    qa(".det-btn").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        window.location.href = "details.html?id=" + encodeURIComponent(id);
      };
    });
  }

  // ---------- PAGE-SPECIFIC INITIALIZERS ----------

  function initHome() {
    if (!q("#hero")) return;

    const form = q("#hero-search");
    const citySel = q("#filter-city");
    const streetSel = q("#filter-street");
    const minInput = q("#filter-min");
    const maxInput = q("#filter-max");
    const keyInput = q("#search-key");

    fetchRooms().then((rooms) => {
      populateFiltersFromRooms(rooms, citySel, streetSel);
      renderList(rooms);

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const filtered = applyFilters(rooms, {
            keyword: keyInput.value,
            city: citySel.value,
            street: streetSel.value,
            min: minInput.value,
            max: maxInput.value
          });
          renderList(filtered);
        });
      }
    });
  }

  function initRooms() {
    if (!q("#rooms-page")) return;

    const form = q("#rooms-search");
    const citySel = q("#filter-city");
    const streetSel = q("#filter-street");
    const minInput = q("#filter-min");
    const maxInput = q("#filter-max");
    const keyInput = q("#search-key");

    fetchRooms().then((rooms) => {
      populateFiltersFromRooms(rooms, citySel, streetSel);
      renderList(rooms);

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const filtered = applyFilters(rooms, {
            keyword: keyInput.value,
            city: citySel.value,
            street: streetSel.value,
            min: minInput.value,
            max: maxInput.value
          });
          renderList(filtered);
        });
      }
    });
  }

  function initSaved() {
    if (!q("#saved-page")) return;

    fetchRooms().then((rooms) => {
      const savedIds = LS.getSaved();
      const filtered = rooms.filter((r) =>
        savedIds.includes(String(r.id))
      );
      renderList(filtered);
    });
  }

  function initDetails() {
    if (!q("#details-page")) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const container = q("#details-page .container");

    if (!id) {
      if (container)
        container.innerHTML = `<p class="muted">لا توجد غرفة محددة.</p>`;
      return;
    }

    fetchRoomById(id).then((room) => {
      if (!room) {
        if (container)
          container.innerHTML = `<p class="muted">الغرفة غير موجودة.</p>`;
        return;
      }

      q("#det-title").textContent = room.title;
      q("#det-location").textContent = room.city + " • " + room.street;
      q("#det-desc").textContent = room.description;
      q("#det-price").textContent = room.price;
      q("#det-id").textContent = room.serial_id || room.id;
      q("#det-avail").textContent =
        room.availability === "available" ? "متاح" : "غير متاح";
      q("#det-phone").textContent = ""; // fill later from renter table if needed

      const slide = q(".slides");
      if (slide) {
        slide.innerHTML = "";
        (room.images || []).forEach((img, i) => {
          const el = document.createElement("img");
          el.src = img;
          if (i === 0) el.classList.add("active");
          slide.appendChild(el);
        });
      }

      const detSave = q("#det-save");
      if (detSave) {
        detSave.onclick = () => {
          let saved = LS.getSaved();
          const idStr = String(room.id);
          if (!saved.includes(idStr)) {
            saved.push(idStr);
            LS.setSaved(saved);
            alert("تم الحفظ");
          }
        };
      }

      const detCall = q("#det-call");
      if (detCall) {
        detCall.disabled = true; // until renter phone is wired in
      }
    });
  }

  function initDashboard() {
    if (!q("#dashboard-page")) return;

    const grid = q("#dashboard-rooms");
    if (!grid) return;

    fetchMyRooms().then((rooms) => {
      if (!rooms.length) {
        grid.innerHTML = `<p class="muted">لا يوجد منشورات بعد.</p>`;
        return;
      }

      grid.innerHTML = "";
      rooms.forEach((room) => {
        const card = makeCard(room);
        grid.appendChild(card);
      });
      attachCardEvents();
    });
    // Posting form is normal HTML form -> handled entirely by add_room.php
  }

  // ---------- BOOTSTRAP ----------
  document.addEventListener("DOMContentLoaded", () => {
    showRenterLinks();
    headerBehavior();
    animateOnScroll();

    initHome();
    initRooms();
    initSaved();
    initDetails();
    initDashboard();
  });
})();
