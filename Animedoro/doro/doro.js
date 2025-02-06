var interval, animeTime, workTime, timeMins;
let endTime = Date.now() + 40 * 60 * 1000;
let watchingAnime = false;
let paused = false;

const workInp = document.querySelector("#work-input");
const aniInp = document.querySelector("#anime-input");
const beforeStart = document.querySelector(".before-start");
const aftStart = document.querySelector(".aft-start");
const minsCounter = document.querySelector(".minutes");
const secsCounter = document.querySelector(".seconds");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector('#reset-button');
const finishButton = document.querySelector("#finish-button");
const plus5 = document.querySelector("#plus5");
const pause = document.querySelector("#pause");
const play = document.querySelector("#play");
const nextEventInfo = document.querySelector(".next-event-info");
const animeSessionCounter = document.querySelector(".anime-session-counter");
const studySessionCounter = document.querySelector(".study-session-counter");
const animeHoursCounter = document.querySelector(".total-count-anime");
const studyHoursCounter = document.querySelector(".total-count-study");

const beep = document.querySelector("#notificationSound");

startButton.textContent = "СТАРТ";
resetButton.style.display = "none";
finishButton.style.display = "none";
finishButton.textContent = "ЗАВЕРШИТЬ";
plus5.textContent = "+5";
plus5.style.display = "none";
pause.style.display = "none";
play.style.display = "none";
startButton.addEventListener("click", function () {
  this.blur();
});
// get values and initialize if non existent
aniInp.value = localStorage.getItem("animeTime")
  ? localStorage.getItem("animeTime")
  : 23;
workInp.value = localStorage.getItem("workTime")
  ? localStorage.getItem("workTime")
  : 40;

let animeSessions = localStorage.getItem("animeSessions")
  ? localStorage.getItem("animeSessions")
  : 0;
let studySessions = localStorage.getItem("studySessions")
  ? localStorage.getItem("studySessions")
  : 0;

let animeHours = localStorage.getItem("animeSessionCounter")
  ? localStorage.getItem("animeSessionCounter")
  : 0;
let studyHours = localStorage.getItem("studySessionCounter")
  ? localStorage.getItem("studySessionCounter")
  : 0;

localStorage.setItem("animeSessions", animeSessions);
localStorage.setItem("studySessions", studySessions);
localStorage.setItem("animeSessionCounter", animeHours);
localStorage.setItem("studySessionCounter", studyHours);

function updateSessionCounters() {
  animeSessions = parseInt(localStorage.getItem("animeSessions"), 10);
  animeSessionCounter.textContent = animeSessions + " Аниме-Сессий";
  studySessions = parseInt(localStorage.getItem("studySessions"), 10);
  studySessionCounter.textContent = studySessions + " Сессий Работы";
  animeHours = parseInt(localStorage.getItem("animeSessionCounter"), 10);
  animeHoursCounter.textContent = `${Math.floor(animeHours / 60)}:${
    animeHours % 60
  } Время Аниме`;
  studyHours = parseInt(localStorage.getItem("studySessionCounter"), 10);
  studyHoursCounter.textContent = `${Math.floor(studyHours / 60)}:${
    studyHours % 60
  } Время Работы`;
}
updateSessionCounters();

function addAnimeSession() {
  localStorage.setItem("animeSessions", parseInt(animeSessions, 10) + 1);
  localStorage.setItem(
    "animeSessionCounter",
    parseInt(animeHours, 10) + animeTime
  );
  updateSessionCounters();
}
function addStudySession() {
  localStorage.setItem("studySessions", parseInt(studySessions, 10) + 1);
  localStorage.setItem(
    "studySessionCounter",
    parseInt(studyHours, 10) + workTime
  );
  updateSessionCounters();
}

function updateTime(){
  animeTime = Number(aniInp.value);
  workTime = Number(workInp.value);
  localStorage.setItem("animeTime", animeTime);
  localStorage.setItem("workTime", workTime);
  timeMins = workTime;

}
updateTime();

const startCountdown = function (mins, secs) {
  const now = Date.now();
  endTime = now + mins * 60 * 1000 + secs * 1000;
  displayTime(Math.round((endTime - Date.now()) / 1000));
  plus5.style.display = "inline";
  pause.style.display = "inline";
  finishButton.style.display = "inline";
  play.style.display = "none";
  interval = setInterval(() => {
    if (paused) {
      endTime += 100; // keeps adding 100ms because interval is called every 100ms
      return;
    }
    const timeLeft = Math.round((endTime - Date.now()) / 1000);
    if (timeLeft < 0) {
      beep.play();
      if (watchingAnime) {
        // working time starts
        clearInterval(interval);
        nextEventInfo.textContent = "Не смей кликать на следующий эпизод!";
        startButton.textContent = "СТАРТ";
        plus5.style.display = "none";
        finishButton.style.display = "none";
        timeMins = workTime;
        watchingAnime = false;
        paused = true;
        notify(
          "Время Аниме истекло",
          "Возвращайся к работе\nИ ДАЖЕ НЕ СМЕЙ КЛИКАТЬ НА СЛЕДУЮЩИЙ ЭПИЗОД!"
        );
        addAnimeSession();
        return;
      } else {
        // anime time starts
        clearInterval(interval);
        timeMins = animeTime;
        nextEventInfo.textContent = "Теперь ты можешь смотреть Аниме";
        plus5.style.display = "none";
        finishButton.style.display = "none";
        startButton.textContent = "СТАРТ";
        watchingAnime = true;
        paused = true;
        notify("Можешь сделать перерыв", "Посмотри аниме, ты это заслужил!\n");
        addStudySession();
        return;
      }
    }
    displayTime(timeLeft);
  }, 100); // 100ms interval
};

const displayTime = function (seconds) {
  let minutesRemaining = Math.floor(seconds / 60);
  let secondsRemaining = seconds % 60;
  minsCounter.textContent =
    (minutesRemaining < 10 ? "0" : "") + minutesRemaining;
  secsCounter.textContent =
    (secondsRemaining < 10 ? "0" : "") + secondsRemaining;
  //console.log(minutesRemaining, secondsRemaining);
};

const add5mins = function () {
  endTime += 5 * 60 * 1000;
  //displayTime(Date.now() - endTime);
  updateEventDetails(endTime);
};

const finishCountdown = function () {
  endTime = 1000;
  //displayTime(Date.now() - endTime);
  updateEventDetails(endTime);
};

const updateEventDetails = function (timestamp) {
  let dateObj = new Date(timestamp);
  let hours = dateObj.getHours();
  hours = (hours < 10 ? "0" : "") + hours;
  let mins = dateObj.getMinutes();
  mins = (mins < 10 ? "0" : "") + mins;
  if (watchingAnime) {
    nextEventInfo.textContent = "Аниме закончится в " + hours + ":" + mins;
  } else {
    nextEventInfo.textContent = "Следующий эпизод через " + hours + ":" + mins;
  }
};

function startClicked() {
  window.onbeforeunload = function (e) {
    return "Уверен, что хочешь уйти?";
  };

  if(startButton.textContent==='РЕСТАРТ'){
    paused = true;
    startButton.textContent='СТАРТ'
    resetButton.style.display = 'inline';
    startButton.style.display = "none";
  }else{
    paused = false;
    startButton.style.display = "inline";
    startButton.textContent='СБРОС';
  }

  checkPerms();
  startCountdown(timeMins, 0);
  updateEventDetails(endTime);
  aftStart.style.display = "inline";
  beforeStart.style.display = "none";
}

function pauseCountdown() {
  paused = true;
  pause.style.display = "none";
  play.style.display = "inline";
}

function resumeCountdown() {
  paused = false;
  pause.style.display = "inline";
  play.style.display = "none";
}


//startCountdown(1, 5);
//add5mins();
//updateEventDetails(endTime)

/*NOTIFICATIONS*/

const checkPerms = function () {
  if (Notification.permission === "granted") {
    //alert("we have permission");
    console.log("notifications allowed");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      console.log(permission);
    });
  }
};

const notify = function (heading, desc) {
  checkPerms();

  const notification = new Notification(heading, {
    body: desc,
    icon: "../Images/icon.png",
  });
  beep.play();
};

function inpvalid(inp){
  val = inp.value;
  if(val.length > 3){
    inp.value = val.slice(-3);
  }
}

function inpchk(inp){
  if(Number(val) > 180){
    inp.value = 180;
  }

  if(Number(val) < 0){
    inp.value = 0;
  }

  updateTime();
}

checkPerms();


function reset(){
  aftStart.style.display = 'none';
  beforeStart.style.display = 'inline';
  startButton.textContent = 'СТАРТ';
  resetButton.style.display = 'none';
}
