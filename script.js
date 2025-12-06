(function () {
  const q = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));


  const LS = {
    getRooms() {
      const raw = JSON.parse(localStorage.getItem("rooms") || "[]");

      return raw.map((r) => {
        if (!r.images) r.images = [];
        return r;
      });
    },

    setRooms(r) {
      localStorage.setItem("rooms", JSON.stringify(r));
    },

    getSaved() {
      return JSON.parse(localStorage.getItem("savedRooms") || "[]");
    },
    setSaved(arr) {
      localStorage.setItem("savedRooms", JSON.stringify(arr));
    },

    getUsers() {
      return JSON.parse(localStorage.getItem("users") || "[]");
    },
    setUsers(u) {
      localStorage.setItem("users", JSON.stringify(u));
    },

    getCurrentUser() {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    },
    setCurrentUser(u) {
      if (u) localStorage.setItem("currentUser", JSON.stringify(u));
      else localStorage.removeItem("currentUser");
    },

    getSelectedRoom() {
      return localStorage.getItem("selectedRoom");
    },
    setSelectedRoom(id) {
      localStorage.setItem("selectedRoom", id);
    },

    getNextRoomId() {
      const n = Number(localStorage.getItem("nextRoomId") || "1");
      localStorage.setItem("nextRoomId", String(n + 1));
      return "RM-" + String(n).padStart(4, "0");
    },
  };


  function seedRooms() {
    if (LS.getRooms().length) return;

    const rooms = [
      {
        id: LS.getNextRoomId(),
        title: "Bright room near campus",
        description: "Large window, fast internet, shared kitchen.",
        city: "Ramallah",
        street: "Al-Bireh St",
        price: 400,
        images: ["images/room1.jpg", "images/room5.jpg"],
        renterPhone: "+970500000001",
        renterId: "demo-renter-1",
        available: true,
        allowedGender: "female",
        createdAt: Date.now(),
      },
      {
        id: LS.getNextRoomId(),
        title: "Cozy studio apartment",
        description: "Private studio, fully furnished.",
        city: "Nablus",
        street: "University St",
        price: 900,
        images: ["images/room2.jpg"],
        renterPhone: "+970500000002",
        renterId: "demo-renter-2",
        available: true,
        allowedGender: "male",
        createdAt: Date.now(),
      },
      {
        id: LS.getNextRoomId(),
        title: "Quiet room with balcony",
        description: "Calm neighborhood with a nice balcony.",
        city: "Ramallah",
        street: "Main Road",
        price: 700,
        images: ["images/room3.jpg"],
        renterPhone: "+970500000003",
        renterId: "demo-renter-1",
        available: false,
        allowedGender: "male",
        createdAt: Date.now(),
      },
    ];

    LS.setRooms(rooms);
  }


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

  if (hamb) {
    hamb.onclick = () => mm.classList.toggle("open");
  }

  document.addEventListener("click", (e) => {
    if (!mm.contains(e.target) && !hamb.contains(e.target)) {
      mm.classList.remove("open");
    }
  });
}

function initRenterPosts() {
  const page = q("#renter-posts-page");
  if (!page) return;

  const user = LS.getCurrentUser();
  if (!user || user.type !== "renter") {
    alert("أنت لست مؤجر.");
    window.location.href = "login.html";
    return;
  }

  const grid = q("#posts-grid");
  const addBtn = q("#add-post-btn");

  addBtn.onclick = () => window.location.href = "myposts.html";

  function renderMyPosts() {
    const posts = LS.getRooms().filter((r) => r.renterId === user.id);
    grid.innerHTML = "";

    if (!posts.length) {
      grid.innerHTML = `<p class="muted">لا يوجد منشورات بعد.</p>`;
      return;
    }

    posts.forEach((post) => {
      const card = document.createElement("article");
      card.className = "card";

      card.innerHTML = `
        <img src="${post.images[0] || "images/default.jpg"}">

        <div class="meta">
          <div>
            <div style="font-weight:700">${post.title}</div>
            <div class="muted">${post.city} • ${post.street}</div>
          </div>
          <div class="price">${post.price}₪</div>
        </div>

        <div class="actions" style="margin-top:10px">
          <button class="icon-btn delete-btn" data-id="${post.id}">حذف</button>
        </div>
      `;

      grid.appendChild(card);
    });

    qa(".delete-btn").forEach((btn) => {
      btn.onclick = () => {
        if (!confirm("هل أنت متأكد من حذف المنشور؟")) return;

        let posts = LS.getRooms();
        posts = posts.filter((p) => p.id !== btn.dataset.id);
        LS.setRooms(posts);

        renderMyPosts();
      };
    });
  }

  renderMyPosts();
}


  function animateOnScroll() {
    const els = qa("[data-animate]");
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


  function populateFilters() {
    const citySel = q("#filter-city");
    const streetSel = q("#filter-street");
    if (!citySel || !streetSel) return;

    const rooms = LS.getRooms();
    const cities = [...new Set(rooms.map((r) => r.city))];
    const streets = [...new Set(rooms.map((r) => r.street))];

    citySel.innerHTML =
      '<option value="">الكل</option>' +
      cities.map((c) => `<option>${c}</option>`).join("");

    streetSel.innerHTML =
      '<option value="">الكل</option>' +
      streets.map((s) => `<option>${s}</option>`).join("");
  }


  function makeCard(room) {
    const saved = LS.getSaved();
    const isSaved = saved.includes(room.id);

    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <img src="${room.images[0] || "images/default.jpg"}">

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
          room.available ? "badge-available" : "badge-unavailable"
        }">${room.available ? "متاح" : "غير متاح"}</div>

        <div class="badge ${room.allowedGender}">
          ${
            room.allowedGender === "male"
              ? "ذكور"
              : room.allowedGender === "female"
              ? "إناث"
              : "الجميع"
          }
        </div>

        <span class="muted">ID: ${room.id}</span>
      </div>

      <div class="actions">
        <button class="icon-btn save-btn" data-id="${room.id}">
          ${isSaved ? "تم الحفظ ❤️" : "حفظ ♡"}
        </button>
        <button class="icon-btn det-btn" data-id="${room.id}">تفاصيل</button>
        <a class="icon-btn" href="tel:${room.renterPhone}">اتصال</a>
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
        const id = btn.dataset.id;

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
        LS.setSelectedRoom(btn.dataset.id);
        window.location.href = "details.html";
      };
    });
  }


  function initHome() {
    if (!q("#hero")) return;
    populateFilters();
    renderList(LS.getRooms());
  }

  function initRooms() {
    if (!q("#rooms-page")) return;
    populateFilters();
    renderList(LS.getRooms());
  }

  function initSaved() {
    if (!q("#saved-page")) return;
    const saved = LS.getSaved();
    const rooms = LS.getRooms().filter((r) => saved.includes(r.id));
    renderList(rooms);
  }

  function initDetails() {
    if (!q("#details-page")) return;

    const id = LS.getSelectedRoom();
    const room = LS.getRooms().find((r) => r.id === id);

    if (!room) {
      q("#details-page .container").innerHTML =
        `<p class="muted">الغرفة غير موجودة.</p>`;
      return;
    }

    q("#det-title").textContent = room.title;
    q("#det-location").textContent = room.city + " • " + room.street;
    q("#det-desc").textContent = room.description;
    q("#det-price").textContent = room.price;
    q("#det-id").textContent = room.id;
    q("#det-avail").textContent = room.available ? "متاح" : "غير متاح";
    q("#det-phone").textContent = room.renterPhone;

    const slide = q(".slides");
    slide.innerHTML = "";
    room.images.forEach((img, i) => {
      const el = document.createElement("img");
      el.src = img;
      if (i === 0) el.classList.add("active");
      slide.appendChild(el);
    });
  }


  function initAddPost() {
    const page = q("#addpost-page");
    if (!page) return;

    const user = LS.getCurrentUser();
    if (!user || user.type !== "renter") {
      alert("أنت لست مؤجر");
      window.location.href = "signup.html";
      return;
    }

    const form = q("#addpost-form");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = q("#ap-title").value.trim();
      const city = q("#ap-city").value.trim();
      const street = q("#ap-street").value.trim();
      const price = Number(q("#ap-price").value);
      const desc = q("#ap-desc").value.trim();
      const gender = q("#ap-gender").value;
      const images = q("#ap-images")
        .value.split(",")
        .map((x) => x.trim())
        .filter((x) => x);

      if (!title || !city || !street || !price || !desc || !gender || !images.length) {
        alert("يرجى تعبئة جميع الحقول.");
        return;
      }

      const rooms = LS.getRooms();
      rooms.push({
        id: LS.getNextRoomId(),
        title,
        description: desc,
        city,
        street,
        price,
        images,
        renterPhone: user.phone,
        renterId: user.id,
        allowedGender: gender,
        available: true,
        createdAt: Date.now(),
      });

      LS.setRooms(rooms);

      alert("تم إضافة البوست!");
      window.location.href = "myposts.html";
    });
  }

  function initSignup() {
    const page = q("#signup-page");
    if (!page) return;
  }


  function initLogin() {
    const page = q("#login-page");
    if (!page) return;
  }


  function showRenterLinks() {
    const user = LS.getCurrentUser();
    const links = document.querySelectorAll(".renter-only");

    if (user && user.type === "renter") {
      links.forEach((l) => (l.style.display = "block"));
    } else {
      links.forEach((l) => (l.style.display = "none"));
    }
  }


  document.addEventListener("DOMContentLoaded", () => {
    showRenterLinks();
    seedRooms();
    headerBehavior();
    animateOnScroll();

    initHome();
    initRooms();
    initSaved();
    initDetails();
    initAddPost();
   initRenterPosts(); 
    initSignup();
    initLogin();
  });
})();
