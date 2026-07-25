/* ========================================
   CONTENT DATA
   ======================================== */

const pages = letterPages;

const gifts = [
{
    id:1,
    image:"assets/images/gift1.jpg",
    hint:"A moment of stillness, a reminder to breathe.",
    title:"Something peaceful.",
    description:"A moment of stillness, a reminder to breathe."
},
{
    id:2,
    image:"assets/images/gift2.jpg",
    hint:"A quiet reminder of faith, strength and protection.",
    title:"Something to keep close.",
    description:"A quiet reminder of faith, strength and protection."
},
{
    id:3,
    image:"assets/images/gift3.jpg",
    hint:"Small moments that add up to something big.",
    title:"Tiny, but meaningful.",
    description:"Small moments that add up to something big."
},
{
    id:4,
    image:"assets/images/gift4.jpg",
    hint:"For every journey that still waits ahead.",
    title:"Something you'll carry with you.",
    description:"For every journey that still waits ahead."
},
{
    id:5,
    image:"assets/images/gift5.jpg",
    hint:"Something I hope you'll wear with a smile.",
    title:"My favourite guess.",
    description:"Something I hope you'll wear with a smile."
},
{
    id:6,
    image:"assets/images/gift6.jpeg",
    hint:"Because you deserve better relief than a tablet and gritted teeth.",
    title:"Something for the headaches.",
    description:"For the days your head won't quiet down — something softer than a painkiller."
},
{
    id:7,
    image:"assets/images/gift7.jpeg",
    hint:"For the old songs, the podcasts, and pretending you didn't hear me the first time.",
    title:"Something for your ears.",
    description:"So the next old song you send yourself sounds exactly as good as you remember."
},
{
    id:8,
    image:"assets/images/gift8.jpeg",
    hint:"One for the desk, one for the commute — no excuses left.",
    title:"Something musical, times two.",
    description:"Over-ear for the long days, and a tiny pair that fits in your bag for the days in between."
},
{
    id:9,
    image:"assets/images/gift9.jpeg",
    hint:"A little stillness for your desk, straight from Kailash.",
    title:"Something for your shelf.",
    description:"For the quiet corner of your room, and the quieter corner of your mind."
},
{
    id:10,
    image:"assets/images/gift11.jpg",
    hint:"Something that can make every journey, every drive and every quiet evening a little more musical.",
    title:"For someone who listens so well... here's something that deserves to be listened to.",
    description:"A portable Bluetooth speaker."
}
];

/* ========================================
   EMAIL NOTIFICATION (via EmailJS)
   ======================================== */

// EmailJS lets a static site send email without needing a server of
// your own. Its "public key" is safe to use client-side (unlike a
// Gmail password or an API secret) — it's scoped to your account and
// rate-limited, which is exactly what it's designed for.
//
// SETUP (~5 minutes):
// 1. Create a free account at https://www.emailjs.com (200 emails/month free)
// 2. Email Services -> Add New Service -> connect Gmail (adarsh.niftem@gmail.com)
//      -> copy the Service ID it gives you
// 3. Email Templates -> Create New Template. Use variables in the body like:
//      Her final choice: {{gift_title}}
//      {{gift_hint}}
//      Chosen at: {{timestamp}}
//    Set the "To email" field to {{to_email}} -> copy the Template ID
// 4. Account -> General -> copy your Public Key
// 5. Paste all three values into the constants below.
//
// index.html already includes the EmailJS SDK script tag needed for this to work.

const EMAILJS_PUBLIC_KEY = "Vbcda4KEfexQfkafa";
const EMAILJS_SERVICE_ID = "service_vii9k6w";
const EMAILJS_TEMPLATE_ID = "template_gozef3x";
const NOTIFY_EMAIL = "adarsh.niftem@gmail.com";

if (typeof emailjs !== "undefined") {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
  });
}

const closingMessages = [
  "One last thing...",
  "I wasn't quite sure...",
  "...which one you'd like the most.",
  "So...",
  "I thought you should decide."
];

/* ========================================
   GLOBAL STATE
   ======================================== */

let currentSceneEl = null;
let currentPageIndex = 0;
let musicStarted = false;

/* ========================================
   MUSIC MANAGEMENT
   ======================================== */

const music = new Audio("assets/audio/Friends.mp3");
music.loop = false;
music.volume = 0.30;

music.addEventListener("ended", () => {
  setTimeout(() => {
    music.currentTime = 0;
    music.play().catch(err => console.log("Playback error:", err));
  }, 1000);
});

function startMusic() {
  if (!musicStarted) {
    musicStarted = true;
    music.play().catch(err => console.log("Playback error:", err));
  }
}

function fadeInMusic(targetVolume, duration) {
  const startVolume = music.volume;
  const startTime = Date.now();
  const volumeInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    music.volume = startVolume + (targetVolume - startVolume) * progress;
    if (progress >= 1) clearInterval(volumeInterval);
  }, 50);
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

const app = document.getElementById("app");

/**
 * Sets an <img>'s src with automatic fallback across common
 * extension mismatches (e.g. the file is actually .jpeg but the
 * code asked for .jpg, or vice versa). Tries the given path first,
 * then swaps the extension until one actually loads.
 */
function setImageSrc(imgEl, path) {
  const dotIndex = path.lastIndexOf(".");
  const base = dotIndex === -1 ? path : path.substring(0, dotIndex);
  const ext = dotIndex === -1 ? "" : path.substring(dotIndex + 1).toLowerCase();

  const fallbacksByExt = {
    jpg: ["jpeg", "JPG", "JPEG", "png"],
    jpeg: ["jpg", "JPEG", "JPG", "png"],
    png: ["PNG", "jpg", "jpeg"],
  };

  const candidates = [path];
  (fallbacksByExt[ext] || []).forEach((altExt) => {
    candidates.push(`${base}.${altExt}`);
  });

  let attempt = 0;

  imgEl.onerror = () => {
    attempt++;
    if (attempt < candidates.length) {
      imgEl.src = candidates[attempt];
    } else {
      imgEl.onerror = null;
    }
  };

  imgEl.src = candidates[0];
}

function hideCurrentScene() {
  if (!currentSceneEl) return;

  const oldScene = currentSceneEl;

  oldScene.classList.add("hidden");

  setTimeout(() => {
    if (oldScene.parentElement) {
      oldScene.remove();
    }
  }, 600);
}

function transitionToScene(sceneElement) {
  sceneElement.classList.add("scene");
  app.appendChild(sceneElement);
  requestAnimationFrame(() => {
    sceneElement.classList.remove("hidden");
  });
  hideCurrentScene();
  currentSceneEl = sceneElement;
}

/* ========================================
   TOAST / FLASH MESSAGES
   ======================================== */

let activeToastTimeout = null;

function showToast(message, duration = 3200) {
  const existing = document.querySelector(".flash-toast");
  if (existing) existing.remove();
  if (activeToastTimeout) clearTimeout(activeToastTimeout);

  const toast = document.createElement("div");
  toast.className = "flash-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("visible"));

  activeToastTimeout = setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 400);
  }, duration);

  return toast;
}

/* ========================================
   SCENE: OPENING
   ======================================== */

function showOpening() {
  const scene = document.createElement("section");
  scene.className = "scene scene-opening hidden";

  const content = document.createElement("div");
  content.className = "opening-content";

  const title = document.createElement("h1");
  title.className = "opening-title";
  title.textContent = "To the Best Listener I Know...";

  const subtitle = document.createElement("p");
  subtitle.className = "opening-subtitle";
  subtitle.textContent =
    "...and the keeper of more conversations than she'll probably ever remember.";

  const hint = document.createElement("p");
  hint.className = "tap-hint pulse";
  hint.textContent = "Tap to begin";

  content.appendChild(title);
  content.appendChild(subtitle);
  content.appendChild(hint);
  scene.appendChild(content);

  scene.addEventListener("click", handleFirstTap, { once: true });

  transitionToScene(scene);
}

function handleFirstTap() {
  startMusic();
  showIntro();
}

/* ========================================
   SCENE: INTRODUCTION
   ======================================== */

function showIntro() {

  const scene = document.createElement("section");
  scene.className = "scene scene-intro hidden";

  const box = document.createElement("div");
  box.className = "intro-content";

  const line = document.createElement("p");
  line.className = "intro-line";

  scene.appendChild(box);
  box.appendChild(line);

  transitionToScene(scene);

  const messages = [
    "Some people quietly become important...",
    "without ever asking for recognition.",
    "This little letter is for one of them."
  ];

  let index = 0;

  function showNext() {

    if (index >= messages.length) {
      setTimeout(showEnvelope, 1200);
      return;
    }

    line.style.opacity = "0";

    setTimeout(() => {

      line.textContent = messages[index];

      line.style.opacity = "1";

      index++;

      setTimeout(showNext, 2200);

    }, 500);

  }

  showNext();

}

/* ========================================
   SCENE: ENVELOPE
   ======================================== */

function showEnvelope() {
  const scene = document.createElement("section");
  scene.className = "scene scene-envelope hidden";

  const wrapper = document.createElement("div");
  wrapper.className = "envelope-wrapper";

  const envelope = document.createElement("div");
  envelope.className = "envelope";

  const body = document.createElement("div");
  body.className = "envelope-body";

  const text = document.createElement("p");
  text.className = "envelope-text";
  text.textContent = "My First Attempt at a Digital Letter✨\n(After about 1000 trials though😜)";
  text.style.opacity = "0";

  const flap = document.createElement("div");
  flap.className = "envelope-flap";

  body.appendChild(text);
  envelope.appendChild(body);
  envelope.appendChild(flap);

  const hint = document.createElement("p");
  hint.className = "envelope-hint";
  hint.textContent = "Click the envelope";

  wrapper.appendChild(envelope);
  scene.appendChild(wrapper);
  scene.appendChild(hint);

  envelope.addEventListener("click", () => {
    if (envelope.classList.contains("opened")) return;
    setTimeout(() => {
    envelope.classList.add("opened");
},250);

setTimeout(() => {
    text.style.opacity = "1";
}, 700);

    setTimeout(() => {
      hint.style.opacity = "0";
      hint.style.pointerEvents = "none";
    }, 800);
    setTimeout(() => {
      showLetter();
    }, 5700);
  });

  transitionToScene(scene);
}

/* ========================================
   SCENE: LETTER
   ======================================== */

function showLetter() {
  document.body.classList.add("reading");
  const scene = document.createElement("section");
  scene.className = "scene scene-letter hidden";

  const container = document.createElement("div");
  container.className = "letter-container";

  const paper = document.createElement("div");
  paper.className = "letter-paper";

  const scrollArea = document.createElement("div");
  scrollArea.className = "letter-scroll-area";

  const content = document.createElement("div");
  content.className = "letter-content";

  const title = document.createElement("h2");
  title.className = "letter-title";

  const text = document.createElement("div");
  text.className = "letter-text";

  content.appendChild(title);
  content.appendChild(text);
  scrollArea.appendChild(content);
  paper.appendChild(scrollArea);

  const footer = document.createElement("div");
  footer.className = "letter-footer";

  const pageIndicator = document.createElement("p");
  pageIndicator.className = "page-indicator";

  const controls = document.createElement("div");
  controls.className = "letter-controls";

  const prevBtn = document.createElement("button");
  prevBtn.className = "letter-button";
  prevBtn.textContent = "Previous";

  const nextBtn = document.createElement("button");
  nextBtn.className = "letter-button";
  nextBtn.textContent = "Next";

  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  footer.appendChild(pageIndicator);
  footer.appendChild(controls);
  paper.appendChild(footer);

  container.appendChild(paper);
  scene.appendChild(container);

  fadeInMusic(0.050, 1800);

  currentPageIndex = 0;
  renderLetterPage(title, text, pageIndicator, prevBtn, nextBtn);

  prevBtn.addEventListener("click", () => {
    if (currentPageIndex > 0) {
      currentPageIndex--;
      renderLetterPage(title, text, pageIndicator, prevBtn, nextBtn);
      scrollArea.scrollTop = 0;
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPageIndex < pages.length - 1) {
      currentPageIndex++;
      renderLetterPage(title, text, pageIndicator, prevBtn, nextBtn);
      scrollArea.scrollTop = 0;
    } else {
      showClosingMessage();
    }
  });

  transitionToScene(scene);
}

function renderLetterPage(titleEl, textEl, indicatorEl, prevBtn, nextBtn) {
  const page = pages[currentPageIndex];

  titleEl.textContent = page.title;
  titleEl.style.display = page.title ? "block" : "none";
  textEl.textContent = page.text;

  // Smaller font only for the last two Hindi poem pages
  if (currentPageIndex >= pages.length - 2) {
    textEl.style.fontSize = "0.92rem";
    textEl.style.lineHeight = "1.8";
  } else {
    textEl.style.fontSize = "";
    textEl.style.lineHeight = "";
  }

  indicatorEl.textContent = `${currentPageIndex + 1} of ${pages.length}`;

  prevBtn.disabled = currentPageIndex === 0;
  nextBtn.disabled = false;
}

/* ========================================
   SCENE: CLOSING MESSAGE
   ======================================== */

function showClosingMessage() {
  let messageIndex = 0;

  function showNextMessage() {
    if (messageIndex >= closingMessages.length) {
      showGiftScene();
      return;
    }

    const scene = document.createElement("section");
    scene.className = "scene scene-closing-message hidden";

    const text = document.createElement("p");
    text.className = "closing-text";
    text.textContent = closingMessages[messageIndex];

    scene.appendChild(text);
    transitionToScene(scene);

    setTimeout(() => {
      messageIndex++;
      showNextMessage();
    }, 1200);
  }

  showNextMessage();
}

/* ========================================
   SCENE: GIFT SELECTION EXPERIENCE
   ======================================== */

const giftExperience = (() => {

  let exploredGifts = new Set();
  let selectedGiftIndex = null;
  let continueBtnEl = null;
  let continueNoteEl = null;
  let confirmBarEl = null;
  let selectionCardsEl = [];

  /* ========================================
     STAGE 1 — EXPLORE
     ======================================== */

  function buildGiftCard(gift, index) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gift-card";
    card.setAttribute("aria-label", `Open gift: ${gift.hint}`);

    const img = document.createElement("img");
    setImageSrc(img, "assets/images/gift-closed.png");
    img.alt = "";
    img.className = "gift-card-image";

    const hint = document.createElement("p");
    hint.className = "gift-card-hint";
    hint.textContent = gift.hint;

    card.appendChild(img);
    card.appendChild(hint);

    card.addEventListener("click", () => openGiftModal(index));

    return card;
  }

  function buildGiftList() {
    const list = document.createElement("div");
    list.className = "gift-list";

    gifts.forEach((gift, index) => {
      list.appendChild(buildGiftCard(gift, index));
    });

    return list;
  }

  function openGiftModal(index) {
    const gift = gifts[index];

    const overlay = document.createElement("div");
    overlay.className = "gift-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "gift-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const closeIcon = document.createElement("button");
    closeIcon.type = "button";
    closeIcon.className = "gift-modal-close-icon";
    closeIcon.innerHTML = "&#10005;";
    closeIcon.setAttribute("aria-label", "Close");

    const badge = document.createElement("img");
    setImageSrc(badge, "assets/images/gift-open.png");
    badge.alt = "";
    badge.className = "gift-modal-badge";

    const image = document.createElement("img");
    setImageSrc(image, gift.image);
    image.alt = gift.title;
    image.className = "gift-modal-image";

    const title = document.createElement("h3");
    title.className = "gift-modal-title";
    title.textContent = gift.title;

    const description = document.createElement("p");
    description.className = "gift-modal-description";
    description.textContent = gift.description;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "gift-modal-close-button";
    closeButton.textContent = "Close";

    modal.appendChild(closeIcon);
    modal.appendChild(badge);
    modal.appendChild(image);
    modal.appendChild(title);
    modal.appendChild(description);
    modal.appendChild(closeButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add("visible"));

    function close() {
      overlay.classList.remove("visible");
      document.removeEventListener("keydown", onKeydown);
      setTimeout(() => overlay.remove(), 250);
    }

    function onKeydown(e) {
      if (e.key === "Escape") close();
    }

    closeIcon.addEventListener("click", close);
    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", onKeydown);

    markExplored(index);
  }

  function markExplored(index) {
    if (exploredGifts.has(index)) return;
    exploredGifts.add(index);
    updateContinueSection();
  }

  function updateContinueSection() {
    if (!continueBtnEl || !continueNoteEl) return;

    const remaining = gifts.length - exploredGifts.size;

    if (remaining <= 0) {
      continueBtnEl.disabled = false;
      continueNoteEl.textContent = "You've read every hint. Ready when you are.";
    } else {
      continueBtnEl.disabled = true;
      continueNoteEl.textContent =
        remaining === 1
          ? "Open 1 more gift to continue."
          : `Open ${remaining} more gifts to continue.`;
    }
  }

  function buildContinueSection() {
    const section = document.createElement("div");
    section.className = "gift-continue";

    continueNoteEl = document.createElement("p");
    continueNoteEl.className = "gift-continue-note";

    continueBtnEl = document.createElement("button");
    continueBtnEl.type = "button";
    continueBtnEl.className = "seal-button";
    continueBtnEl.textContent = "Continue \u2192";
    continueBtnEl.disabled = true;

    continueBtnEl.addEventListener("click", () => {
      if (continueBtnEl.disabled) return;
      showToast(
        "Lovely \uD83D\uDE04 Don't worry, I'm not that mean of a friend — you can still revisit every hint. Your final pick happens on the next page.",
        4200
      );
      setTimeout(() => {
        transitionToScene(renderSelectionStage());
      }, 900);
    });

    section.appendChild(continueNoteEl);
    section.appendChild(continueBtnEl);

    return section;
  }

  function renderExploreStage() {
    exploredGifts = new Set();
    selectedGiftIndex = null;

    const scene = document.createElement("section");
    scene.className = "scene scene-gift hidden";

    const scrollArea = document.createElement("div");
    scrollArea.className = "gift-scroll-area";

    const title = document.createElement("h2");
    title.className = "gift-title";
    title.textContent = "Choose Your Little Surprise";

    const subtitle = document.createElement("p");
    subtitle.className = "gift-subtitle";
    subtitle.textContent = "Explore every surprise before making your final decision.";

    scrollArea.appendChild(title);
    scrollArea.appendChild(subtitle);
    scrollArea.appendChild(buildGiftList());
    scrollArea.appendChild(buildContinueSection());

    scene.appendChild(scrollArea);

    setTimeout(() => {
      showToast("Choose wisely \u2014 you can only pick one, based on the hints below. \uD83D\uDC40", 3800);
    }, 500);

    updateContinueSection();

    return scene;
  }

  /* ========================================
     STAGE 2 — FINAL SELECTION
     ======================================== */

  function buildSelectionCard(gift, index) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "selection-card";
    card.setAttribute("aria-label", `Select gift: ${gift.title}`);

    const img = document.createElement("img");
    setImageSrc(img, gift.image);
    img.alt = gift.title;
    img.className = "selection-card-image";

    const title = document.createElement("p");
    title.className = "selection-card-title";
    title.textContent = gift.title;

    const hint = document.createElement("p");
    hint.className = "selection-card-hint";
    hint.textContent = gift.hint;

    const check = document.createElement("div");
    check.className = "selection-card-check";
    check.innerHTML = "&#10003;";

    card.appendChild(check);
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(hint);

    card.addEventListener("click", () => selectGift(index));

    return card;
  }

  function buildSelectionGrid() {
    const grid = document.createElement("div");
    grid.className = "selection-grid";

    selectionCardsEl = gifts.map((gift, index) => {
      const card = buildSelectionCard(gift, index);
      grid.appendChild(card);
      return card;
    });

    return grid;
  }

  function selectGift(index) {
    selectedGiftIndex = index;

    selectionCardsEl.forEach((card, i) => {
      card.classList.toggle("selected", i === index);
    });

    if (confirmBarEl) {
      confirmBarEl.classList.add("visible");
    }
  }

  function buildConfirmBar() {
    const bar = document.createElement("div");
    bar.className = "gift-confirm-bar";

    const text = document.createElement("p");
    text.className = "gift-confirm-bar-text";
    text.textContent = "Are you sure about this, or would you like to change your mind?";

    const actions = document.createElement("div");
    actions.className = "gift-confirm-bar-actions";

    const changeButton = document.createElement("button");
    changeButton.type = "button";
    changeButton.className = "gift-confirm-back";
    changeButton.textContent = "Change";

    const finalButton = document.createElement("button");
    finalButton.type = "button";
    finalButton.className = "seal-button";
    finalButton.textContent = "Final \u2728";

    changeButton.addEventListener("click", () => {
      selectedGiftIndex = null;
      selectionCardsEl.forEach((card) => card.classList.remove("selected"));
      bar.classList.remove("visible");
    });

    finalButton.addEventListener("click", () => {
      if (selectedGiftIndex === null) return;
      finalButton.disabled = true;
      changeButton.disabled = true;
      submitGiftSelection(gifts[selectedGiftIndex]);
      showArtwork();
    });

    actions.appendChild(changeButton);
    actions.appendChild(finalButton);
    bar.appendChild(text);
    bar.appendChild(actions);

    return bar;
  }

  function renderSelectionStage() {
    selectedGiftIndex = null;

    const scene = document.createElement("section");
    scene.className = "scene scene-gift-selection hidden";

    const scrollArea = document.createElement("div");
    scrollArea.className = "gift-scroll-area";

    const title = document.createElement("h2");
    title.className = "gift-title";
    title.textContent = "Alright, Which One Is It Going To Be?";

    const subtitle = document.createElement("p");
    subtitle.className = "gift-subtitle";
    subtitle.textContent = "Tap the one you'd genuinely love. You can still change it before it's final.";

    const warning = document.createElement("p");
    warning.className = "gift-teasing-note";
    warning.textContent =
      "Fair warning: not choosing isn't actually an option. Leave this blank and I'm auto-ordering literally every single one for you. Not all at once though, I'm not made of money. \uD83D\uDE08";

    scrollArea.appendChild(title);
    scrollArea.appendChild(subtitle);
    scrollArea.appendChild(warning);
    scrollArea.appendChild(buildSelectionGrid());

    confirmBarEl = buildConfirmBar();
    scrollArea.appendChild(confirmBarEl);

    scene.appendChild(scrollArea);

    return scene;
  }

  /* ---------- future integration ---------- */

  function submitGiftSelection(selectedGift) {
    if (typeof emailjs === "undefined") {
      console.log("EmailJS SDK not loaded; skipping email notification.");
      return;
    }

    if (
      EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY" ||
      EMAILJS_SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "YOUR_EMAILJS_TEMPLATE_ID"
    ) {
      console.warn(
        "EMAIL NOT SENT: the EMAILJS_PUBLIC_KEY / EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID " +
          "constants near the top of script.js are still placeholder values. " +
          "See the setup steps in the comment above them."
      );
      return;
    }

    emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
        to_email: NOTIFY_EMAIL,
        gift_title: selectedGift.title,
        gift_hint: selectedGift.hint,
        gift_description: selectedGift.description,
        gift_image: selectedGift.image.split("/").pop(),
        timestamp: new Date().toLocaleString(),
    },
    EMAILJS_PUBLIC_KEY
)
      .then(() => {
        console.log("Email notification sent successfully.");
      })
      .catch((err) => {
        console.warn("Could not send email notification:", err);
      });
  }

  return { renderExploreStage };

})();


function showGiftScene() {
  transitionToScene(giftExperience.renderExploreStage());
}

/* ========================================
   SCENE: ENDING
   ======================================== */

function showEnding() {
  const scene = document.createElement("section");
  scene.className = "scene scene-ending hidden";
scene.style.overflowY = "auto";
scene.style.padding = "40px 24px";
scene.style.justifyContent = "flex-start";

  const title = document.createElement("h1");
  title.className = "ending-title";
  title.textContent = "One Last Surprise...";

  const text = document.createElement("div");
  text.className = "ending-text";
text.style.maxWidth = "720px";
text.style.lineHeight = "1.75";
text.style.fontSize = "1rem";
  text.innerHTML = `
    <p>Do you remember one day you told me</p>
    <p>that you'd love to be on the cover of a magazine someday?</p>

    <p style="margin-top:24px;">
      I don't know whether that day comes tomorrow,
      a few years from now,
      or somewhere much later.
    </p>

    <p style="margin-top:18px;">
      But I wasn't going to let your birthday pass
      without making at least one cover
      that belongs only to you.
    </p>

    <p style="margin-top:22px;">
      So...
    </p>

    <p style="margin-top:8px;font-size:1.35em;font-weight:600;">
      Here's your first one.
    </p>

    <button id="showMagazineBtn" class="letter-button" style="margin-top:34px;">
      Show Me ❤️
    </button>
  `;

  scene.appendChild(title);
  scene.appendChild(text);

  text.querySelector("#showMagazineBtn").addEventListener("click", showMagazineCover);

  transitionToScene(scene);
}

function showMagazineCover() {
  const scene = document.createElement("section");
  scene.className = "scene scene-ending hidden";

  scene.style.overflowY = "auto";
  scene.style.padding = "40px 24px";
  scene.style.justifyContent = "flex-start";

  const img = document.createElement("img");
  setImageSrc(img, "assets/images/magazine-cover-v2.jpeg");
  img.alt = "Magazine Cover";

  img.style.width = "90%";
  img.style.maxWidth = "650px";
  img.style.height = "auto";
  img.style.objectFit = "contain";
  img.style.borderRadius = "18px";
  img.style.boxShadow = "0 25px 60px rgba(0,0,0,0.25)";

  const text = document.createElement("div");
  text.className = "ending-text";
  text.style.maxWidth = "720px";
  text.style.fontSize = "1rem";
  text.style.lineHeight = "1.7";
  text.style.marginTop = "24px";

  text.innerHTML = `
      <p>Keep spreading the kindness, smiles and care</p>
      <p>that make people feel heard.</p>

      <p style="margin-top:20px;">
        The world could always use
        one more Listener.
      </p>

      <p style="margin-top:28px;font-size:1.25em;">
        Happy Birthday.
      </p>

      <p style="margin-top:10px;">
        — Your Elderly Person (whom you don't trust anymore🥹😭)
      </p>
  `;

  scene.appendChild(img);
  scene.appendChild(text);

  transitionToScene(scene);
}

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  showOpening();
});

function showArtwork() {
  const scene = document.createElement("section");
  scene.className = "scene scene-ending hidden";

  scene.style.overflowY = "auto";
  scene.style.padding = "40px 24px";
  scene.style.justifyContent = "flex-start";

  const img = document.createElement("img");
  setImageSrc(img, "assets/images/final-artwork.jpg");
  img.alt = "A final little surprise";

  img.style.width = "90%";
  img.style.maxWidth = "650px";
  img.style.height = "auto";
  img.style.objectFit = "contain";
  img.style.borderRadius = "20px";
  img.style.boxShadow = "0 20px 50px rgba(0,0,0,.25)";

  const text = document.createElement("div");
  text.className = "ending-text";
  text.style.maxWidth = "720px";
  text.style.fontSize = "1rem";
  text.style.lineHeight = "1.7";
  text.style.marginTop = "20px";

  text.innerHTML = `
      <p style="font-size:1.35em;">
          Wishing you a birthday
      </p>

      <p style="font-size:1.35em;">
          like none before.
      </p>
  `;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "letter-button primary-btn";
  button.textContent = "Continue";
  button.style.marginTop = "25px";
  button.addEventListener("click", showEnding);

  scene.appendChild(img);
  scene.appendChild(text);
  scene.appendChild(button);

  transitionToScene(scene);
}