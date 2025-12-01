

(function () {
  const q = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));

 
  let ALL_ROOMS = []; 

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
      hamb.onclick = () => {
        mm.classList.toggle("open");
      };

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

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => io.observe(el));
  }


  function fetchRooms(callback) {
  
    if (ALL_ROOMS.length) {
      callback(ALL_ROOMS);
      return;
    }

    fetch("get_rooms.php")
      .then((res) => res.json())
      .then((data) => {
        ALL_ROOMS = Array.isArray(data) ? data : [];
        callback(ALL_ROOMS);
      })
      .catch((err) => {
        console.error("Error loading rooms:", err);
        callback([]);
      });
  }

 
  function populateFilters(rooms) {
    const citySel = q("#filter-city");
    const streetSel = q("#filter-street");
    if (!citySel || !streetSel) return;

    const cities = [...new Set(rooms.map((r) => r.city))].sort();
    const streets = [...new Set(rooms.map((r) => r.street))].sort();

    citySel.innerHTML =
      '<option value="">All Cities</option>' +
      cities.map((c) => `<option value="${c}">${c}</option>`).join("");

    streetSel.innerHTML =
      '<option value="">All Streets</option>' +
      streets.map((s) => `<option value="${s}">${s}</option>`).join("");
  }

  function makeCard(room) {
    const savedIds = JSON.parse(localStorage.getItem("savedRooms") || "[]");
    const isSaved = savedIds.includes(String(room.id));

    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("data-animate", "");

    const firstImage =
      (room.images && room.images.split && room.images.split(",")[0].trim()) ||
      "images/default.jpg";

    card.innerHTML = `
      <img src="${firstImage}" alt="${room.title || ""}" loading="lazy">

      <div class="meta">
        <div>
          <div style="font-weight:700">${room.title || ""}</div>
          <div class="muted">${room.city || ""} • ${room.street || ""}</div>
        </div>
        <div class="price">${room.price || ""}₪</div>
      </div>

      <div style="margin-top:8px;color:#374151">
        ${(room.description || "").substring(0, 100)}...
      </div>

      <div class="meta" style="margin-top:12px">
        <span class="muted">ID: ${room.id}</span>
      </div>

      <div class="actions">
        <button class="icon-btn save-btn" data-id="${room.id}">
          ${isSaved ? "تم الحفظ ❤️" : "حفظ ♡"}
        </button>
        <a class="icon-btn" href="details.html?id=${room.id}">تفاصيل</a>
        ${
          room.renter_phone
            ? `<a class="icon-btn" href="tel:${String(
                room.renter_phone
              ).replace(/\s/g, "")}">اتصال</a>`
            : ""
        }
      </div>
    `;

    return card;
  }

  function renderList(rooms, gridId = "cards-grid") {
    const grid = q(`#${gridId}`);
    if (!grid) return;

    grid.innerHTML = "";

    if (!rooms.length) {
      grid.innerHTML = '<p class="muted">No rooms found.</p>';
      return;
    }

    rooms.forEach((r) => grid.appendChild(makeCard(r)));
    attachCardEvents();
    animateOnScroll();
  }

  function attachCardEvents() {
    qa(".save-btn").forEach((btn) => {
      btn.onclick = () => {
        const id = String(btn.dataset.id);
        let saved = JSON.parse(localStorage.getItem("savedRooms") || "[]");

        if (saved.includes(id)) {
          saved = saved.filter((x) => x !== id);
          btn.innerText = "حفظ ♡";
        } else {
          saved.push(id);
          btn.innerText = "تم الحفظ ❤️";
        }

        localStorage.setItem("savedRooms", JSON.stringify(saved));
      };
    });
  }

  function filterRoomsFromForm(rooms) {
    const keyEl = q("#search-key");
    const cityEl = q("#filter-city");
    const streetEl = q("#filter-street");
    const minEl = q("#filter-min");
    const maxEl = q("#filter-max");

    const key = keyEl ? keyEl.value.trim().toLowerCase() : "";
    const city = cityEl ? cityEl.value : "";
    const street = streetEl ? streetEl.value : "";
    const min = minEl ? Number(minEl.value || 0) : 0;
    const max = maxEl ? Number(minEl.value || Infinity) : Infinity;

    return rooms.filter((r) => {
      const text = (
        (r.title || "") +
        " " +
        (r.description || "") +
        " " +
        (r.city || "") +
        " " +
        (r.street || "")
      ).toLowerCase();

      return (
        (!key || text.includes(key)) &&
        (!city || r.city === city) &&
        (!street || r.street === street) &&
        Number(r.price) >= min &&
        Number(r.price) <= max
      );
    });
  }

 
  function initHome() {
    if (!q("#hero")) return;

    fetchRooms((rooms) => {
      populateFilters(rooms);
      renderList(rooms);

      const heroForm = q("#hero-search");
      if (heroForm) {
        heroForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const filtered = filterRoomsFromForm(rooms);
          renderList(filtered);
        });
      }
    });
  }

  function initRooms() {
    if (!q("#rooms-page")) return;

    fetchRooms((rooms) => {
      populateFilters(rooms);
      renderList(rooms);

      const form = q("#rooms-search");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const filtered = filterRoomsFromForm(rooms);
          renderList(filtered);
        });
      }
    });
  }

  function initSaved() {
    if (!q("#saved-page")) return;

    fetchRooms((rooms) => {
      const savedIds = JSON.parse(localStorage.getItem("savedRooms") || "[]");
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
    if (!id) {
      q(
        "#details-page .container"
      ).innerHTML = `<p class="muted">Room not found. <a href="rooms.html">Return</a></p>`;
      return;
    }

    fetch("get_room.php?id=" + encodeURIComponent(id))
      .then((res) => res.json())
      .then((room) => {
        if (!room || room.error) {
          q(
            "#details-page .container"
          ).innerHTML = `<p class="muted">Room not found. <a href="rooms.html">Return</a></p>`;
          return;
        }

        q("#det-title").textContent = room.title || "";
        q("#det-location").textContent = `${room.city || ""} • ${
          room.street || ""
        }`;
        q("#det-desc").textContent = room.description || "";
        q("#det-price").textContent = room.price || "";
        q("#det-id").textContent = room.id || "";
        q("#det-avail").textContent =
          room.availability === "unavailable" ? "غير متاح" : "متاح";
        q("#det-phone").textContent = room.renter_phone || "";

        const callBtn = q("#det-call");
        if (callBtn && room.renter_phone) {
          callBtn.onclick = () => {
            window.location.href =
              "tel:" + String(room.renter_phone).replace(/\s/g, "");
          };
        }

     
        const slideBox = q(".slides");
        if (slideBox) {
          slideBox.innerHTML = "";
          const imgs =
            typeof room.images === "string"
              ? room.images
                  .split(",")
                  .map((x) => x.trim())
                  .filter((x) => x.length)
              : [];

          if (!imgs.length) imgs.push("images/default.jpg");

          imgs.forEach((img, i) => {
            const el = document.createElement("img");
            el.src = img;
            el.className = i === 0 ? "active" : "";
            slideBox.appendChild(el);
          });

          let current = 0;
          const imgEls = qa(".slides img");

          const show = (index) => {
            imgEls[current].classList.remove("active");
            current = (index + imgEls.length) % imgEls.length;
            imgEls[current].classList.add("active");
          };

          const nextBtn = q(".next");
          const prevBtn = q(".prev");
          if (nextBtn) nextBtn.onclick = () => show(current + 1);
          if (prevBtn) prevBtn.onclick = () => show(current - 1);
        }

        const btn = q("#det-save");
        if (btn) {
          let saved = JSON.parse(
            localStorage.getItem("savedRooms") || "[]"
          );
          const isSaved = saved.includes(String(room.id));
          btn.textContent = isSaved ? "تم الحفظ ❤️" : "حفظ";

          btn.onclick = () => {
            let s = JSON.parse(
              localStorage.getItem("savedRooms") || "[]"
            );
            const sid = String(room.id);
            if (s.includes(sid)) {
              s = s.filter((x) => x !== sid);
              btn.textContent = "حفظ";
            } else {
              s.push(sid);
              btn.textContent = "تم الحفظ ❤️";
            }
            localStorage.setItem("savedRooms", JSON.stringify(s));
          };
        }
      })
      .catch((err) => {
        console.error(err);
        q(
          "#details-page .container"
        ).innerHTML = `<p class="muted">Room not found. <a href="rooms.html">Return</a></p>`;
      });
  }

 
  document.addEventListener("DOMContentLoaded", () => {
    headerBehavior();
    animateOnScroll();
    initHome();
    initRooms();
    initSaved();
    initDetails();
  });
})();
