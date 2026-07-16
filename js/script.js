/* ========================================
   CONTENT DATA
   ======================================== */

const pages = letterPages;

const gifts = [
{
    id:1,
    image:"assets/images/gift1.jpg",
    hint:"A moment of stillness, a reminder to breathe.",
    title:"Something peaceful."
},
{
    id:2,
    image:"assets/images/gift2.jpg",
    hint:"A quiet reminder of faith, strength and protection.",
    title:"Something to keep close."
},
{
    id:3,
    image:"assets/images/gift3.jpg",
    hint:"Small moments that add up to something big.",
    title:"Tiny, but meaningful."
},
{
    id:4,
    image:"assets/images/gift4.jpg",
    hint:"For every journey that still waits ahead.",
    title:"Something you'll carry with you."
},
{
    id:5,
    image:"assets/images/gift5.jpg",
    hint:"Something I hope you'll wear with a smile.",
    title:"My favourite guess."
}
];

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
let typingTimeout = null;
let musicStarted = false;

/* ========================================
   MUSIC MANAGEMENT
   ======================================== */

const music = new Audio("assets/audio/Friends.mp3");
music.loop = false;
music.volume = 0.06;

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
  text.textContent = "A Little Something";

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
      hint.style.opacity = "0";
      hint.style.pointerEvents = "none";
    }, 800);
    setTimeout(() => {
      showLetter();
    }, 1700);
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

  const content = document.createElement("div");
  content.className = "letter-content";

  const title = document.createElement("h2");
  title.className = "letter-title";

  const text = document.createElement("div");
  text.className = "letter-text";

  const pageIndicator = document.createElement("p");
  pageIndicator.className = "page-indicator";

  content.appendChild(title);
  content.appendChild(text);
  paper.appendChild(content);
  paper.appendChild(pageIndicator);

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
  paper.appendChild(controls);

  container.appendChild(paper);
  scene.appendChild(container);

  fadeInMusic(0.025, 1800);

  currentPageIndex = 0;
  renderLetterPage(title, text, pageIndicator, prevBtn, nextBtn);

  prevBtn.addEventListener("click", () => {
    if (currentPageIndex > 0) {
      currentPageIndex--;
      renderLetterPage(title, text, pageIndicator, prevBtn, nextBtn);
      paper.scrollTop = 0;
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPageIndex < pages.length - 1) {
      currentPageIndex++;
      renderLetterPage(title, text, pageIndicator, prevBtn, nextBtn);
      paper.scrollTop = 0;
    } else {
      showClosingMessage();
    }
  });

  transitionToScene(scene);
}

function renderLetterPage(titleEl, textEl, indicatorEl, prevBtn, nextBtn) {
  if (typingTimeout) clearTimeout(typingTimeout);

  const page = pages[currentPageIndex];
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === pages.length - 1;

  titleEl.textContent = page.title;
  titleEl.style.display = page.title ? "block" : "none";
  textEl.textContent = "";

  indicatorEl.textContent = `${currentPageIndex + 1} of ${pages.length}`;

  prevBtn.disabled = currentPageIndex === 0;
  nextBtn.disabled = true;

  typeText(textEl, page.text, () => {
    nextBtn.disabled = false;
  });
}

function typeText(element, text, onComplete) {
  if (typingTimeout) clearTimeout(typingTimeout);

  let charIndex = 0;
  const chars = text.split("");

  function typeNextChar() {
    if (charIndex < chars.length) {
      element.textContent += chars[charIndex];
      charIndex++;
      const delay = 10 + Math.random() * 5;
      typingTimeout = setTimeout(typeNextChar, delay);
    } else {
      if (onComplete) onComplete();
    }
  }

  typeNextChar();
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

  let selectedGiftIndex = null;
  let scrollAreaEl = null;
  let sealButtonEl = null;

  /* ---------- gift list ---------- */

  function buildGiftCard(gift, index) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gift-card";
    card.setAttribute("aria-label", `Open gift: ${gift.hint}`);

    const img = document.createElement("img");
    img.src = "assets/images/gift-closed.png";
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

  /* ---------- gift modal ---------- */

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
    badge.src = "assets/images/gift-open.png";
    badge.alt = "";
    badge.className = "gift-modal-badge";

    const image = document.createElement("img");
    image.src = gift.image;
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
  }

  /* ---------- final selection ---------- */

  function buildFinalSection() {
    const section = document.createElement("div");
    section.className = "gift-final";

    const title = document.createElement("h3");
    title.className = "gift-final-title";
    title.textContent = "You've explored every surprise.";

    const subtitle = document.createElement("p");
    subtitle.className = "gift-final-subtitle";
    subtitle.textContent = "Now choose the one you'd genuinely love.";

    const options = document.createElement("div");
    options.className = "gift-options";

    gifts.forEach((gift, index) => {
      const option = document.createElement("label");
      option.className = "gift-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "giftChoice";
      input.value = String(index);

      const text = document.createElement("span");
      text.textContent = gift.hint;

      input.addEventListener("change", () => {
        selectedGiftIndex = index;
        sealButtonEl.disabled = false;
      });

      option.appendChild(input);
      option.appendChild(text);
      options.appendChild(option);
    });

    sealButtonEl = document.createElement("button");
    sealButtonEl.type = "button";
    sealButtonEl.className = "seal-button";
    sealButtonEl.textContent = "Seal My Choice \u2728";
    sealButtonEl.disabled = true;
    sealButtonEl.addEventListener("click", () => {
      if (selectedGiftIndex !== null) openConfirmDialog();
    });

    section.appendChild(title);
    section.appendChild(subtitle);
    section.appendChild(options);
    section.appendChild(sealButtonEl);

    return section;
  }

  /* ---------- confirmation dialog ---------- */

  function openConfirmDialog() {
    const overlay = document.createElement("div");
    overlay.className = "gift-modal-overlay";

    const box = document.createElement("div");
    box.className = "gift-confirm-box";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");

    const text = document.createElement("p");
    text.className = "gift-confirm-text";
    text.textContent = "Are you sure this is your final choice?";

    const actions = document.createElement("div");
    actions.className = "gift-confirm-actions";

    const yesButton = document.createElement("button");
    yesButton.type = "button";
    yesButton.className = "gift-confirm-yes";
    yesButton.textContent = "Yes, I'm sure";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "gift-confirm-back";
    backButton.textContent = "Go Back";

    yesButton.addEventListener("click", () => {
      overlay.remove();
      submitGiftSelection(gifts[selectedGiftIndex]);
      showEnding();
    });

    backButton.addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });

    actions.appendChild(yesButton);
    actions.appendChild(backButton);
    box.appendChild(text);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add("visible"));
  }

  /* ---------- future integration ---------- */

  function submitGiftSelection(selectedGift) {
    // TODO: Send selected gift to Telegram
  }

  /* ---------- scene assembly ---------- */

  function render() {
    selectedGiftIndex = null;

    const scene = document.createElement("section");
    scene.className = "scene scene-gift hidden";

    scrollAreaEl = document.createElement("div");
    scrollAreaEl.className = "gift-scroll-area";

    const title = document.createElement("h2");
    title.className = "gift-title";
    title.textContent = "Choose Your Little Surprise";

    const subtitle = document.createElement("p");
    subtitle.className = "gift-subtitle";
    subtitle.textContent = "Explore every surprise before making your final decision.";

    scrollAreaEl.appendChild(title);
    scrollAreaEl.appendChild(subtitle);
    scrollAreaEl.appendChild(buildGiftList());
    scrollAreaEl.appendChild(buildFinalSection());

    scene.appendChild(scrollAreaEl);

    return scene;
  }

  return { render };

})();

showArtwork();
return;

function showGiftScene() {
  transitionToScene(giftExperience.render());
}

/* ========================================
   SCENE: ENDING
   ======================================== */

function showEnding() {
  const scene = document.createElement("section");
  scene.className = "scene scene-ending hidden";

  const title = document.createElement("h1");
  title.className = "ending-title";
  title.textContent = "Thank you...";

  const text = document.createElement("div");
  text.className = "ending-text";
  text.innerHTML = `
    <p>For every conversation.</p>
    <p>Every laugh.</p>
    <p>Every time you stayed.</p>
    <p style="margin-top: 16px;">And...</p>
    <p style="margin-top: 16px; font-size: 1.2em;">Happy Birthday.</p>
  `;

  scene.appendChild(title);
  scene.appendChild(text);

  transitionToScene(scene);
}

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  showOpening();
});

function showArtwork(){

document.getElementById("app").innerHTML=`
<div class="scene artwork-scene">

<img src="assets/images/final-artwork.jpg"
class="final-artwork">

<button class="primary-btn"
onclick="showGiftScene()">
Continue
</button>

</div>
`;

}