

(function () {
  const q = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));

  
  const LS = {
    getRooms(){
  const raw = JSON.parse(localStorage.getItem('rooms') || '[]');
  
  return raw.map(r => {
    if (!r.images) {
      if (r.image) {
        r.images = [r.image];
      } else {
        r.images = [];
      }
    }
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
        images: ["images/room1.jpg", "images/room5.jpg" ],
        renterPhone: "+970500000001",
        renterId: "demo-renter-1",
        available: true,
        allowedGender: "female",
        createdAt: Date.now(),
      },
      {
        id: LS.getNextRoomId(),
        title: "Cozy studio apartment",
        description: "Private studio, fully furnished, 5 min walk from university.",
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
        description: "Calm neighborhood, balcony overlooking garden.",
        city: "Ramallah",
        street: "Main Road",
        price: 700,
        images: ["images/room3.jpg"],
        renterPhone: "+970500000003",
        renterId: "demo-renter-1",
        allowedGender: "male",
        available: false,
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

    hamb.onclick = () => {
      mm.classList.toggle("open");
    };

    document.addEventListener("click", (e) => {
      if (!mm.contains(e.target) && !hamb.contains(e.target)) {
        mm.classList.remove("open");
      }
    });
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

  
function populateFilters() {
    const citySel = q("#filter-city");
    const streetSel = q("#filter-street");
    if (!citySel || !streetSel) return;

    const rooms = LS.getRooms();
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
    const savedIds = LS.getSaved();
    const isSaved = savedIds.includes(room.id);

    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("data-animate", "");

   
    card.innerHTML = `
     <img src="${room.images?.[0] || 'images/default.jpg'}" 
     alt="${room.title}" loading="lazy">

      <div class="meta">
        <div>
          <div style="font-weight:700">${room.title}</div>
          <div class="muted">${room.city} • ${room.street}</div>
        </div>
        <div class="price">${room.price}₪</div>
      </div>

      <div style="margin-top:8px;color:#374151">${room.description.substring(0,100)}...</div>

      <div class="meta" style="margin-top:12px">
  <div class="${room.available ? 'badge badge-available' : 'badge badge-unavailable'}">
    ${room.available ? 'متاح' : 'غير متاح'}
  </div>

  <div class="badge ${room.allowedGender}">
    ${
      room.allowedGender === 'male'
        ? 'اولاد'
        : room.allowedGender === 'female'
        ? 'بنات'
        : ''
    }
  </div>

  <span class="muted">ID: ${room.id}</span>
</div>

      </div>

      <div class="actions">
        <button class="icon-btn save-btn" data-id="${room.id}">
          ${isSaved ? "تم الحفظ ❤️" : "حفظ ♡"}
        </button>
        <button class="icon-btn det-btn" data-id="${room.id}">تفاصيل</button>
        <a class="icon-btn" href="tel:${room.renterPhone.replace(/\s/g, "")}">اتصال</a>
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
        const id = btn.dataset.id;
        let saved = LS.getSaved();

        if (saved.includes(id)) {
          saved = saved.filter((x) => x !== id);
          LS.setSaved(saved);
          btn.innerText = "حفظ ♡";
        } else {
          saved.push(id);
          LS.setSaved(saved);
          btn.innerText = "تم الحفظ ❤️";
        }
      };
    });

    qa(".det-btn").forEach((btn) => {
      btn.onclick = () => {
        LS.setSelectedRoom(btn.dataset.id);
        window.location.href = "details.html";
      };
    });
  }

  
  function filterRoomsFromForm() {
    const keyEl = q("#search-key");
    const cityEl = q("#filter-city");
    const streetEl = q("#filter-street");
    const minEl = q("#filter-min");
    const maxEl = q("#filter-max");

    const rooms = LS.getRooms();
    if (!rooms.length) return [];

    const key = keyEl ? keyEl.value.trim().toLowerCase() : "";
    const city = cityEl ? cityEl.value : "";
    const street = streetEl ? streetEl.value : "";
    const min = minEl ? Number(minEl.value || 0) : 0;
    const max = maxEl ? Number(maxEl.value || Infinity) : Infinity;

    return rooms.filter((r) => {
      const text = (
        r.title +
        " " +
        r.description +
        " " +
        r.city +
        " " +
        r.street
      ).toLowerCase();

      return (
        (!key || text.includes(key)) &&
        (!city || r.city === city) &&
        (!street || r.street === street) &&
        r.price >= min &&
        r.price <= max
      );
    });
  }

  
  function initHome() {
    if (!q("#hero")) return;
    populateFilters();
    renderList(LS.getRooms());

    const heroForm = q("#hero-search");
    if (heroForm) {
      heroForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const rooms = filterRoomsFromForm();
        renderList(rooms);
      });
    }
  }

  function initRooms() {
    if (!q("#rooms-page")) return;
    populateFilters();
    renderList(LS.getRooms());

    const form = q("#rooms-search");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const rooms = filterRoomsFromForm();
        renderList(rooms);
      });
    }
  }

  function initSaved() {
    if (!q("#saved-page")) return;
    const savedIds = LS.getSaved();
    const rooms = LS.getRooms().filter((r) => savedIds.includes(r.id));
    renderList(rooms);
  }

  
  function initDetails() {
    if (!q("#details-page")) return;

    const id = LS.getSelectedRoom();
    const rooms = LS.getRooms();
    const room = rooms.find((r) => r.id === id);

    if (!room) {
      q(
        "#details-page .container"
      ).innerHTML = `<p class="muted">Room not found. <a href="rooms.html">Return</a></p>`;
      return;
    }

    q("#det-title").textContent = room.title;
    q("#det-location").textContent = `${room.city} • ${room.street}`;
    q("#det-desc").textContent = room.description;
    q("#det-price").textContent = room.price;
    q("#det-id").textContent = room.id;
    q("#det-avail").textContent = room.available ? "متاح" : "غير متاح";
    q("#det-phone").textContent = room.renterPhone;
    q("#det-call").href = `tel:${room.renterPhone.replace(/\s/g, "")}`;

    
  const slideBox = q(".slides");
    slideBox.innerHTML = "";

    room.images.forEach((img, i) => {
      const el = document.createElement("img");
      el.src = img;
      el.className = i === 0 ? "active" : "";
      slideBox.appendChild(el);
    });

    let current = 0;
    const imgs = qa(".slides img");

    const show = (index) => {
      imgs[current].classList.remove("active");
      current = (index + imgs.length) % imgs.length;
      imgs[current].classList.add("active");
    };

    q(".next").onclick = () => show(current + 1);
    q(".prev").onclick = () => show(current - 1);

    
    const btn = q("#det-save");
    const saved = LS.getSaved();
    const isSaved = saved.includes(room.id);
    btn.textContent = isSaved ? "تم الحفظ ❤️" : "حفظ";

    btn.onclick = () => {
      let s = LS.getSaved();
      if (s.includes(room.id)) {
        s = s.filter((x) => x !== room.id);
        LS.setSaved(s);
        btn.textContent = "حفظ";
      } else {
        s.push(room.id);
        LS.setSaved(s);
        btn.textContent = "تم الحفظ ❤️";
      }
    };
  }

  
  function initDashboard() {
    const page = q("#dashboard-page");
    if (!page) return;

    const user = LS.getCurrentUser();
    if (!user || user.type !== "renter") {
      page.querySelector(
        ".container"
      ).innerHTML = `<p class="muted">You must be logged in as a renter.</p>`;
      return;
    }

    const form = q("#room-form");
    const list = q("#dashboard-rooms");

    function renderRenterRooms() {
      const rooms = LS.getRooms().filter((r) => r.renterId === user.id);
      list.innerHTML = "";

      if (!rooms.length) {
        list.innerHTML =
          '<p class="muted">No rooms yet. Add one from the form above.</p>';
        return;
      }

      rooms.forEach((r) => {
        const firstImage = r.images?.[0] || "images/room1.jpg";

        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <img src="${firstImage}" alt="${r.title}">
          <div class="meta">
            <div>
              <div style="font-weight:700">${r.title}</div>
              <div class="muted">${r.city} • ${r.street}</div>
            </div>
            <div class="price">${r.price}$</div>
          </div>

          <div class="muted" style="margin-top:8px">${r.description.substring(
            0,
            80
          )}...</div>

          <div class="meta" style="margin-top:10px">
            <span class="badge">${r.available ? "متاح" : "غير متاح"}</span>
            <span class="muted">ID: ${r.id}</span>
          </div>

          <div class="actions">
            <button class="icon-btn toggle-btn" data-id="${r.id}">
              ${r.available ? "Set Unavailable" : "Set Available"}
            </button>
            <button class="icon-btn delete-btn" data-id="${r.id}">Delete</button>
          </div>
        `;

        list.appendChild(card);
      });

      qa(".toggle-btn").forEach((b) => {
        b.onclick = () => {
          const id = b.dataset.id;
          const rooms = LS.getRooms();
          const room = rooms.find((r) => r.id === id);

          if (room) {
            room.available = !room.available;
            LS.setRooms(rooms);
            renderRenterRooms();
          }
        };
      });

      qa(".delete-btn").forEach((b) => {
        b.onclick = () => {
          const id = b.dataset.id;
          if (!confirm("Delete this room?")) return;

          let rooms = LS.getRooms();
          rooms = rooms.filter((r) => r.id !== id);
          LS.setRooms(rooms);
          renderRenterRooms();
        };
      });
    }

    
  form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = q("#rf-title").value.trim();
      const city = q("#rf-city").value.trim();
      const street = q("#rf-street").value.trim();
      const price = Number(q("#rf-price").value);
      const desc = q("#rf-desc").value.trim();
      const allowed = q('#rf-allowed').value;


      
      const images = q("#rf-images")
        .value.split(",")
        .map((x) => x.trim())
        .filter((x) => x.length > 0);

      if(!title || !city || !street || !price || !images.length || !desc || !allowed){
alert("Please fill all fields");
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
        allowedGender: allowed,
        available: true,
        createdAt: Date.now(),
      });

      LS.setRooms(rooms);
      form.reset();
      renderRenterRooms();
    });

    renderRenterRooms();
  }
  function initSignup() {
  const page = q("#signup-page");
  if (!page) return;

  const form = q("#signup-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = q("#su-name").value.trim();
    const phone = q("#su-phone").value.trim();
    const email = q("#su-email").value.trim().toLowerCase();
    const pass = q("#su-pass").value;
    const type = (form.querySelector('input[name="su-type"]:checked') || {}).value;
const gender = q('#su-gender').value;



    if(!name || !phone || !email || !pass || !type || !gender){
 
      alert("Please fill all fields.");
      return;
    }

    const users = LS.getUsers();
    if (users.some((u) => u.email === email)) {
      alert("This email is already registered.");
      return;
    }

    const user = {
  id: 'U-' + Date.now(),
  name, phone, email, pass, type, gender
};


    users.push(user);
    LS.setUsers(users);
    LS.setCurrentUser(user);

    alert("Account created successfully!");

    if (type === "renter") window.location.href = "renter-dashboard.html";
    else window.location.href = "rooms.html";
  });
}
function initLogin() {
  const page = q("#login-page");
  if (!page) return;

  q("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = q("#li-email").value.trim().toLowerCase();
    const pass = q("#li-pass").value;

    const users = LS.getUsers();
    const user = users.find((u) => u.email === email && u.pass === pass);

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    LS.setCurrentUser(user);
    alert("Logged in successfully");

    if (user.type === "renter") window.location.href = "renter-dashboard.html";
    else window.location.href = "rooms.html";
  });
}


  
  document.addEventListener("DOMContentLoaded", () => {
    seedRooms();
    headerBehavior();
    animateOnScroll();
    initHome();
    initRooms();
    initSaved();
    initDetails();
    initSignup();
    initLogin();
    initDashboard();
  });
})();
