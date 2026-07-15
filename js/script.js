/* ========================================
   CONTENT DATA
   ======================================== */

const pages = [
  {
    title: "My Dear Friend",
    text: "There are some people in life who arrive quietly, but change everything. You are one of them.\n\nEvery conversation we've had, every laugh shared, every moment you stayed—these are the things that made me feel less alone in this world."
  },
  {
    title: "",
    text: "You have this gift of listening that's rare. You don't just hear words; you hear what's underneath them. You remember the small things, the details that most people forget."
  },
  {
    title: "",
    text: "You've been there in the quiet moments, in the hard moments, in the moments when I needed someone to just... understand.\n\nThank you for that."
  },
  {
    title: "",
    text: "Birthdays are meant to celebrate the person you are. And today, I want to celebrate you—not just the kind things you do, but the way you simply exist, the way you make people feel seen."
  },
  {
    title: "",
    text: "This experience is small, like everything I do. But inside it, I've tried to place something meaningful for you—not something you need, but something that might make you smile."
  }
];

const gifts = [
  {
    hint: "Something peaceful.",
    description: "A moment of stillness, a reminder to breathe.",
    image: "assets/images/gift1.jpg"
  },
  {
    hint: "Something you can keep.",
    description: "A memory we share, preserved in time.",
    image: "assets/images/gift2.jpg"
  },
  {
    hint: "For difficult days.",
    description: "Comfort for when the world feels too heavy.",
    image: "assets/images/gift3.jpg"
  },
  {
    hint: "Tiny, but meaningful.",
    description: "Small moments that add up to something big.",
    image: "assets/images/gift4.jpg"
  },
  {
    hint: "My favourite guess.",
    description: "Something I hope you've been needing.",
    image: "assets/images/gift5.jpg"
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
let currentGiftIndex = 0;
let typingTimeout = null;
let musicStarted = false;
let exploredGifts = new Set();

const explorationMessages = [
    "That was your first instinct.",
    "Ooo... now I'm curious.",
    "You're making this difficult.",
    "Just one more surprise to discover...",
    "You've seen every little surprise."
];

let finalSelection = null;

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
   SCENE: GIFTS
======================================== */

function showGiftScene(){

    document.body.classList.remove("reading");
    fadeInMusic(0.08,1800);

    exploredGifts=new Set();

    renderGiftExplorer();

}

function renderGiftExplorer(){

    const scene=document.createElement("section");
    scene.className="scene scene-gift hidden";

    const container=document.createElement("div");
    container.className="gift-selection";

    const title=document.createElement("h2");
    title.className="gift-selection-title";
    title.textContent="Choose Your Little Surprise";

    const subtitle=document.createElement("p");
    subtitle.className="gift-selection-subtitle";
    subtitle.innerHTML=`
    Each little box hides something different.<br><br>
    Explore every surprise before making your final decision.
    `;

    const grid=document.createElement("div");
    grid.className="gift-grid";

    gifts.forEach((gift,index)=>{

        const card=document.createElement("div");
        card.className="gift-card";

        const img=document.createElement("img");
        img.src="assets/images/gift-closed.png";

        const hint=document.createElement("div");
        hint.className="gift-card-hint";
        hint.textContent=gift.hint;

        card.appendChild(img);
        card.appendChild(hint);

        card.addEventListener("click",()=>{

            showGiftPopup(index);

        });

        grid.appendChild(card);

    });

    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(grid);

    scene.appendChild(container);

    transitionToScene(scene);

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
