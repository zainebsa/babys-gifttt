// --- Dark Mode ---
const toggle = document.getElementById("darkModeToggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

// --- Task Checklist ---
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    li.className = task.done ? "done" : "";
    li.onclick = () => toggleTask(i);
    const del = document.createElement("button");
    del.textContent = "🗑️";
    del.onclick = (e) => {
      e.stopPropagation();
      deleteTask(i);
    };
    li.appendChild(del);
    taskList.appendChild(li);
  });
}
function addTask() {
  if (taskInput.value.trim()) {
    tasks.push({ text: taskInput.value, done: false });
    taskInput.value = "";
    saveTasks();
  }
}
function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  saveTasks();
}
function deleteTask(i) {
  tasks.splice(i, 1);
  saveTasks();
}
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}
renderTasks();

// --- Notes ---
const noteInput = document.getElementById("noteInput");
const notesList = document.getElementById("notesList");
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach((note, i) => {
    const li = document.createElement("li");
    li.textContent = note;
    const del = document.createElement("button");
    del.textContent = "🗑️";
    del.onclick = () => {
      notes.splice(i, 1);
      saveNotes();
    };
    li.appendChild(del);
    notesList.appendChild(li);
  });
}
function addNote() {
  if (noteInput.value.trim()) {
    notes.push(noteInput.value);
    noteInput.value = "";
    saveNotes();
  }
}
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}
renderNotes();

// --- File Upload ---
const fileUpload = document.getElementById("fileUpload");
const fileList = document.getElementById("fileList");

fileUpload.addEventListener("change", () => {
  fileList.innerHTML = "";
  Array.from(fileUpload.files).forEach(file => {
    const li = document.createElement("li");
    li.textContent = file.name;
    fileList.appendChild(li);
  });
});

// --- Alarm ---
const alarmTime = document.getElementById("alarmTime");
const alarmStatus = document.getElementById("alarmStatus");
const alarmAudio = document.getElementById("alarmAudio");

function setAlarm() {
  const time = alarmTime.value;
  if (!time) return;
  const now = new Date();
  const [h, m] = time.split(":");
  const alarmDate = new Date();
  alarmDate.setHours(h, m, 0, 0);
  if (alarmDate < now) alarmDate.setDate(alarmDate.getDate() + 1);
  const timeToAlarm = alarmDate - now;

  alarmStatus.textContent = "⏰ Alarm set!";
  setTimeout(() => {
    alarmAudio.play();
    alarmStatus.textContent = "🔔 Wake up!";
  }, timeToAlarm);
}

// --- Quote Generator ---
const quotes = [
  "You are capable of amazing things.",
  "Believe in yourself and all that you are.",
  "You make the world a better place 💖",
  "You’ve got this, Melek 🌟",
  "Even on hard days, you shine!"
];

function generateQuote() {
  const quoteText = document.getElementById("quoteText");
  quoteText.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// --- Daily Love Note ---
const dailyLoveText = document.getElementById("dailyLoveText");
const today = new Date().toISOString().slice(0, 10);
const savedNote = localStorage.getItem("loveNoteDate") === today
  ? localStorage.getItem("loveNoteText")
  : null;

if (savedNote) {
  dailyLoveText.textContent = savedNote;
} else {
  const note = "Good morning, my Melek! Just a little reminder that I love you deeply, endlessly, and truly. 💌";
  localStorage.setItem("loveNoteText", note);
  localStorage.setItem("loveNoteDate", today);
  dailyLoveText.textContent = note;
}

// --- Surprise Love Note ---
function showLoveNote() {
  const note = document.getElementById("loveNote");
  const kiss = document.getElementById("kiss");
  note.classList.remove("hidden");
  kiss.classList.remove("hidden");
  popHearts();
  typeText(note, "To my Melek 💗 You inspire me every day. This app is a piece of my heart, just for you.");
}

function typeText(element, text) {
  element.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 40);
}

// --- Heart Animation ---
function popHearts() {
  const container = document.body;
  for (let i = 0; i < 10; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = 2 + Math.random() * 2 + "s";
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }
}

// --- Voice Recorder ---
let mediaRecorder;
let chunks = [];

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const recordingsList = document.getElementById("recordingsList");

recordBtn.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();
  recordBtn.disabled = true;
  stopBtn.disabled = false;

  mediaRecorder.ondataavailable = e => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const li = document.createElement("li");
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = url;
    const del = document.createElement("button");
    del.textContent = "🗑️";
    del.onclick = () => li.remove();
    li.appendChild(audio);
    li.appendChild(del);
    recordingsList.appendChild(li);
    chunks = [];
  };
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  recordBtn.disabled = false;
  stopBtn.disabled = true;
});

// --- Music Player ---
const songs = [
  { name: "Lofi Chill", src: "music/lofi1.mp3" },
  { name: "Calm Waves", src: "music/calm2.mp3" },
  { name: "Night Rain", src: "music/rain3.mp3" }
];

let currentSongIndex = 0;
const audioPlayer = new Audio(songs[currentSongIndex].src);

const playBtn = document.getElementById("playMusic");
const nextBtn = document.getElementById("nextMusic");
const musicTitle = document.getElementById("musicTitle");

function playMusic() {
  audioPlayer.play();
  musicTitle.textContent = `🎵 Now Playing: ${songs[currentSongIndex].name}`;
}
function nextMusic() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  audioPlayer.src = songs[currentSongIndex].src;
  playMusic();
}

if (playBtn && nextBtn) {
  playBtn.addEventListener("click", playMusic);
  nextBtn.addEventListener("click", nextMusic);
}
