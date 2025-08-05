let timeLeft = parseInt(localStorage.getItem("timeLeft") || "1500");
let timer = null;
let walkFrames = ["walk1.png", "walk2.png", "walk3.png"];
let currentFrame = 0;
let isWalking = false;
let moveInterval = null;
let frameInterval = null;
let autoTalkInterval = null;
let activeSeconds = 0;
let isAutoPaused = false;
let typingInterval = null; 
let hakuFrames = ["haku_walk1.PNG", "haku_walk2.PNG"];
let mataFrames = ["mata_walk1.PNG", "mata_walk2.PNG"];
let moyaFrames = ["moya_walk1.PNG", "moya_walk2.PNG"];

let hakuFrame = 0;
let mataFrame = 0;
let moyaFrame = 0;



const idol = document.getElementById("idol");
const timeDisplay = document.getElementById("time");
const bubble = document.getElementById("idolText");
const title = document.getElementById("idolTitle");

const idolWidth = 64;
const totalDuration = 1500; // 25分鐘
const screenWidth = window.innerWidth;
const targetLeft = screenWidth - idolWidth;
const speedPerSecond = targetLeft / totalDuration;

function updateDisplay() {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  let timeStr = "";

  if (hours > 0) {
    timeStr = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  timeDisplay.textContent = timeStr;
  localStorage.setItem("timeLeft", timeLeft);
  updateProgressBar();
}



function speak(text, sticky = false) {

  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }

  bubble.textContent = "";
  bubble.style.opacity = "1";

  const name = localStorage.getItem("idolName") || "Shu";
  const fullText = `${name}：${text}`;
  let index = 0;

  typingInterval = setInterval(() => {
    bubble.textContent += fullText[index];
    index++;

    if (index >= fullText.length) {
      clearInterval(typingInterval);
      typingInterval = null;

      if (!sticky) {
        setTimeout(() => {
          bubble.textContent = "";
          bubble.style.opacity = "0";
        }, 5000);
      }
    }
  }, 50);
}


function startTimer() {
  clearInterval(frameInterval);

  if (!autoTalkInterval) {
    autoTalkInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        activeSeconds++;
        if (activeSeconds >= 10) {
          activeSeconds = 0;
          const idleLines = [
            "我的狗會說三國語言喔～",
            "記得喝水喔～",
            "有拔過門牙嗎？",
            "總有一天我們會見面的 ",
            "我會陪你一起唷 💗",
            "你還在嗎...？嘿嘿",
            "肚子有點餓了 🍙",
            "你應該有專心吧？",
            "給每件事都賦予意義就會很累，懂嗎？",
            "認真讀shu～",
            "唸完再去看我的綜藝吧，我可是主持人喔",
            "油囉奔！～油囉奔！～",
            "哎一古...",
            "我是葉波舒舒～",
            "專心點，少來煩姐哈～",
            "安妞～",
            "我是葉波舒舒～",
            "如果不過好現在，怎麼會有好的未來",
            "我知道我很漂亮，但不用一直盯著我吧...",
            "莎朗嘿呦～",
          ];
          const line = idleLines[Math.floor(Math.random() * idleLines.length)];
          speak(line);
        }
      }
    }, 1000);
  }

  if (timer) return;

  speak("我們開始囉！");
  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      localStorage.removeItem("timeLeft");

      // 🎁 給盤子邏輯
      const totalDuration = parseInt(localStorage.getItem("totalDuration") || "1500");
      const minutes = Math.floor(totalDuration / 60);
      let plates = Math.floor(minutes / 25) * 3;
      const remaining = minutes % 25;
      if (remaining >= 10) {
        plates += Math.floor(remaining / 10);
      }

      const oldCount = parseInt(localStorage.getItem("plates") || "0");
      const newCount = oldCount + plates;
      localStorage.setItem("plates", newCount.toString());
      document.getElementById("plateCount").textContent = newCount;

      // 🎉 說話
      speak(`恭喜完成 ${minutes} 分鐘，獲得 ${plates} 個盤子！`, true);
      speak("完成了誒，想不到吧！盤子拿去啦～休息一下！", true);

      // 💫 重設畫面
      const skin = localStorage.getItem("current_skin");
      idol.src = skin === "v2" ? "sit_v2.png" : "sit.png";

      if (document.getElementById("dogHaku").style.display === "block") {
        document.getElementById("dogHaku").src = "haku_sit.PNG";
      }
      if (document.getElementById("dogMata").style.display === "block") {
        document.getElementById("dogMata").src = "mata_sit.PNG";
      }
      if (document.getElementById("dogMoya").style.display === "block") {
        document.getElementById("dogMoya").src = "moya_sit.png";
      }

      isWalking = false;
      clearInterval(frameInterval);
      clearInterval(autoTalkInterval);
      autoTalkInterval = null;
      activeSeconds = 0;
    }
  }, 1000);

  if (!isWalking) {
    startWalking();
  }
}


function pauseTimer() {

  clearInterval(timer);
  timer = null;
  clearInterval(moveInterval);
  clearInterval(frameInterval);
  clearInterval(autoTalkInterval);
  autoTalkInterval = null;
  activeSeconds = 0;

  idol.src = "sit_angry.png"; 
if (document.getElementById("dogHaku").style.display === "block") {
  document.getElementById("dogHaku").src = "haku_sit.PNG";
}
if (document.getElementById("dogMata").style.display === "block") {
  document.getElementById("dogMata").src = "mata_sit.PNG";
}
if (document.getElementById("dogMoya").style.display === "block") {
  document.getElementById("dogMoya").src = "moya_sit.png";
}

  if (!isAutoPaused) {
  speak("幹嘛暫停，又要休息嗎？", true);
}
isAutoPaused = false;

  isWalking = false;
  clearInterval(frameInterval);

}

function resetTimer() {
  clearInterval(autoTalkInterval);
  autoTalkInterval = null;
  activeSeconds = 0;

  clearInterval(timer);
  timer = null;

  // ✅ 正確設定 timeLeft 與 totalDuration
  timeLeft = 1500;
  localStorage.setItem("timeLeft", "1500");
  localStorage.setItem("totalDuration", "1500");

  updateDisplay();         // 會顯示 25:00
  updateProgressBar();     // 會讓進度條回到最左邊
  speak("重新來一次也沒關係！");
  isWalking = false;
  clearInterval(frameInterval);
}


function startWalking() {
  isWalking = true;
  frameInterval = setInterval(() => {

    // 偶像走路動畫
    currentFrame = (currentFrame + 1) % walkFrames.length;
    idol.src = walkFrames[currentFrame];

    // Haku 動畫
    if (document.getElementById("dogHaku").style.display === "block") {
      hakuFrame = (hakuFrame + 1) % hakuFrames.length;
      document.getElementById("dogHaku").src = hakuFrames[hakuFrame];
    }

    // Mata 動畫
    if (document.getElementById("dogMata").style.display === "block") {
      mataFrame = (mataFrame + 1) % mataFrames.length;
      document.getElementById("dogMata").src = mataFrames[mataFrame];
    }

    // Moya 
    if (document.getElementById("dogMoya").style.display === "block") {
      moyaFrame = (moyaFrame + 1) % moyaFrames.length;
      document.getElementById("dogMoya").src = moyaFrames[moyaFrame];
    }

  }, 500);
}



function initPlateDisplay() {
  const count = parseInt(localStorage.getItem("plates") || "0");
  document.getElementById("plateCount").textContent = count;
}

function addPlate() {
  const newTotal = parseInt(localStorage.getItem("plates") || "0") + 3;
  localStorage.setItem("plates", newTotal);
  document.getElementById("plateCount").textContent = newTotal;
}

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("open");
}

function updateProgressBar() {
  const idolWidth = 64;
  const idolHeight = 64;
  const dogHeight = 48;
  const characterBottomMargin = 1;

  const totalDuration = parseInt(localStorage.getItem("totalDuration") || "1500");
  const progress = ((totalDuration - timeLeft) / totalDuration);

  const wrapper = document.getElementById("progressWrapper");
  if (!wrapper) return;

  const wrapperRect = wrapper.getBoundingClientRect();
  const wrapperStart = wrapperRect.left;
  const wrapperWidth = wrapperRect.width;
  const wrapperTop = wrapperRect.top;

  const idolTop = wrapperTop - idolHeight - characterBottomMargin;
  const dogTop = wrapperTop - dogHeight - characterBottomMargin;

  // 更新進度條寬度
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = `${progress * 100}%`;
  }

  // 偶像位置
  let idolX = (progress === 0)
    ? wrapperStart
    : wrapperStart + wrapperWidth * progress;

  idolX = Math.max(wrapperStart, Math.min(wrapperStart + wrapperWidth - idolWidth, idolX));
  idol.style.left = `${idolX}px`;
  idol.style.top = `${idolTop}px`;

  // 狗狗從 idol 左邊開始排
  const spacing = 4; // 每隻狗之間的間距
  const startDogX = idolX - spacing; // 從 idol 左邊開始排

  const dogList = [
    { id: "dogHaku", width: 50 },
    { id: "dogMata", width: 50 },
    { id: "dogMoya", width: 55 }
  ];

  let currentX = startDogX;

  for (const dog of dogList) {
    const el = document.getElementById(dog.id);
    if (el && el.style.display === "block") {
      currentX -= dog.width; // 空出狗狗寬度
      el.style.left = `${currentX}px`;
      el.style.top = `${dogTop}px`;
      currentX -= spacing; // 加上間距再繼續往左排
    }
  }
}




function customizeTimer() {
  pauseTimer();

  const input = prompt("請輸入新的倒數時間（分鐘，至少 25）");
  if (!input) return;

  const minutes = parseInt(input);
  if (isNaN(minutes) || minutes < 25) {
    alert("請輸入大於或等於 25 的數字（單位：分鐘）");
    return;
  }

  const newTime = minutes * 60;
  timeLeft = newTime;
  localStorage.setItem("totalDuration", newTime.toString());
  localStorage.setItem("timeLeft", newTime.toString());

  updateDisplay();
  updateProgressBar();

  speak(`設定成 ${minutes} 分鐘啦～完成後會給你盤子唷 💗`, true);
}



function toggleFullscreen() {
  const elem = document.documentElement;

  const isFull = document.fullscreenElement ||
                 document.webkitFullscreenElement ||
                 document.mozFullScreenElement ||
                 document.msFullscreenElement;

  if (!isFull) {
    // 進入全螢幕
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    // 離開全螢幕
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

// 自動切換圖示
function updateFullscreenButton() {
  const btn = document.getElementById("fullscreenBtn");
  const isFull = document.fullscreenElement ||
                 document.webkitFullscreenElement ||
                 document.mozFullScreenElement ||
                 document.msFullscreenElement;

  btn.textContent = isFull ? "❎" : "full screen";
}

// 監聽全螢幕狀態變化
document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
document.addEventListener("mozfullscreenchange", updateFullscreenButton);
document.addEventListener("MSFullscreenChange", updateFullscreenButton);


function showDogsIfOwned() {
  const showHaku = localStorage.getItem("dog_display_haku") === "true";
  const showMata = localStorage.getItem("dog_display_mata") === "true";
  const showMoya = localStorage.getItem("dog_display_moya") === "true";

  document.getElementById("dogHaku").style.display = showHaku ? "block" : "none";
  document.getElementById("dogMata").style.display = showMata ? "block" : "none";
  document.getElementById("dogMoya").style.display = showMoya ? "block" : "none";
}




function goPage(url) {
  const menu = document.getElementById("sideMenu");
  if (menu) menu.classList.remove("open");

  if (url === "bag.html") {
    pauseTimer();
    localStorage.setItem("fromBag", "true");
  }
  if (url === "store.html") {
    localStorage.setItem("fromStore", "true");
  }

  window.location.href = url;
}

window.onload = () => {
  updateFullscreenButton();
  const skin = localStorage.getItem("current_skin");
  if (skin === "v2") {
    idol.src = "sit_v2.png";
  }

  showDogsIfOwned();

  if (!localStorage.getItem("totalDuration")) {
  localStorage.setItem("totalDuration", "1500");
}

  const savedName = localStorage.getItem("idolName") || "Shu";
  title.textContent = `${savedName}陪你讀SHU`;

  updateDisplay();
  initPlateDisplay();

  if (localStorage.getItem("fromStore") === "true") {
    speak("去買禮物給我了嗎？～按下開始，我們繼續吧！", true);
    localStorage.removeItem("fromStore");
  } else if (localStorage.getItem("fromBag") === "true") {
    speak("你去哪裡了啊？回來就好～按下開始吧！", true);
    localStorage.removeItem("fromBag");
  } else {
    speak("我會陪你一起唷！", true);
  }
  idol.style.opacity = "1"; 
  updateProgressBar();

};

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    if (timer) {
      isAutoPaused = true;
      pauseTimer();
    }
    clearInterval(autoTalkInterval);
    autoTalkInterval = null;
    activeSeconds = 0;
  } else if (document.visibilityState === "visible") {
    setTimeout(() => {
      if (document.visibilityState === "visible") {
        speak("喂喂～你剛剛去哪了？我都有在等你唷 💢", true);
      }
    }, 1000);
  }
});

document.addEventListener("fullscreenchange", () => {
  setTimeout(updateProgressBar, 100);
});
document.addEventListener("webkitfullscreenchange", () => {
  setTimeout(updateProgressBar, 100);
});
window.addEventListener("resize", () => {
  setTimeout(updateProgressBar, 100);
});



