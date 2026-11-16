const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Konstanta Dunia Kampus (Lebih luas dari viewport untuk eksplorasi denah)
const WORLD = {
  width: 2100,
  height: 1550
};

// Data 5 Konsentrasi Keahlian dengan total tepat 757 siswa
// (152 + 152 + 151 + 151 + 151 = 757)
const MAJORS = {
  APHPI: {
    code: "APHPi",
    name: "Agribisnis Pengolahan Hasil Perikanan",
    target: 152,
    collected: 0,
    color: "#38bdf8",
    badgeUnlocked: false
  },
  NKPI: {
    code: "NKPI",
    name: "Nautika Kapal Penangkap Ikan",
    target: 152,
    collected: 0,
    color: "#fbbf24",
    badgeUnlocked: false
  },
  TSM: {
    code: "TSM",
    name: "Teknik Sepeda Motor",
    target: 151,
    collected: 0,
    color: "#f87171",
    badgeUnlocked: false
  },
  TKPI: {
    code: "TKPI",
    name: "Teknika Kapal Penangkap Ikan",
    target: 151,
    collected: 0,
    color: "#a78bfa",
    badgeUnlocked: false
  },
  APAT: {
    code: "APAT",
    name: "Agribisnis Perikanan Air Tawar",
    target: 151,
    collected: 0,
    color: "#34d399",
    badgeUnlocked: false
  }
};

// Tata Letak Bangunan Sesuai Denah Ruang SMKN 1 Watulimo (Halaman 1 & Halaman 2 Gedung IKN)
const BUILDINGS = [
  // Deret Kiri Atas (Kelas XI)
  { x: 90, y: 70, w: 150, h: 85, label: "Kelas XI TKPI", color: "#334155", border: "#94a3b8" },
  { x: 90, y: 165, w: 150, h: 85, label: "Kelas XI NKPI B", color: "#334155", border: "#94a3b8" },
  { x: 90, y: 270, w: 150, h: 85, label: "Kelas XI NKPI A", color: "#334155", border: "#94a3b8" },
  { x: 90, y: 365, w: 150, h: 85, label: "Kelas XI APHPi B", color: "#334155", border: "#94a3b8" },
  { x: 90, y: 460, w: 150, h: 85, label: "Kelas XI APHPi A", color: "#334155", border: "#94a3b8" },

  // Deret Tengah Atas
  { x: 320, y: 80, w: 145, h: 85, label: "Kelas XI TSM A", color: "#334155", border: "#94a3b8" },
  { x: 475, y: 80, w: 145, h: 85, label: "Kelas XI TSM B", color: "#334155", border: "#94a3b8" },
  { x: 475, y: 185, w: 145, h: 90, label: "R. Simulator / NKPI", color: "#1e3a5f", border: "#fbbf24" },
  { x: 475, y: 285, w: 145, h: 85, label: "LAB Komp 2", color: "#1e293b", border: "#38bdf8" },
  { x: 475, y: 380, w: 145, h: 85, label: "LAB Komp 1", color: "#1e293b", border: "#38bdf8" },

  // Deret Kiri Tengah - Bawah (Lab NKPI, Navigasi, Lab TKPI, R. IT, Ruang Guru, Kantor)
  { x: 90, y: 610, w: 150, h: 140, label: "Lab. NKPI", color: "#1e3a5f", border: "#fbbf24" },
  { x: 90, y: 830, w: 150, h: 85, label: "Navigasi Lt. 2", color: "#1e3a5f", border: "#38bdf8" },
  { x: 90, y: 925, w: 150, h: 90, label: "LAB TKPI", color: "#312e81", border: "#a78bfa" },
  { x: 90, y: 1025, w: 150, h: 75, label: "R. IT", color: "#1e293b", border: "#38bdf8" },
  { x: 90, y: 1110, w: 150, h: 95, label: "RUANG GURU", color: "#3f3f46", border: "#e4e4e7" },
  { x: 90, y: 1220, w: 300, h: 95, label: "KANTOR UTAMA", color: "#475569", border: "#f59e0b" },

  // Area Tengah-Bawah (Lab TSM)
  { x: 640, y: 1270, w: 165, h: 110, label: "Lab. TSM", color: "#451a1a", border: "#f87171" },

  // Area Tengah-Kanan (Lab TKPI, Perpus, Lab APHPi, R. TSM)
  { x: 960, y: 640, w: 175, h: 95, label: "Lab. TKPI /", color: "#312e81", border: "#a78bfa" },
  { x: 960, y: 755, w: 150, h: 95, label: "Kelas X TKPI", color: "#334155", border: "#94a3b8" },
  { x: 960, y: 900, w: 150, h: 105, label: "Lab APHPi", color: "#0c4a6e", border: "#38bdf8" },
  { x: 950, y: 1015, w: 170, h: 65, label: "R. TSM", color: "#451a1a", border: "#f87171" },
  { x: 960, y: 1090, w: 150, h: 105, label: "LAB APHPi", color: "#0c4a6e", border: "#38bdf8" },
  { x: 910, y: 1265, w: 145, h: 95, label: "Kelas X APHPi A", color: "#334155", border: "#94a3b8" },
  { x: 1065, y: 1265, w: 145, h: 95, label: "Kelas X APHPi B", color: "#334155", border: "#94a3b8" },

  // Perpustakaan & Kelas X APAT
  { x: 1210, y: 620, w: 145, h: 110, label: "Perpus 2", color: "#3f2e21", border: "#fbbf24" },
  { x: 1210, y: 765, w: 145, h: 105, label: "Perpustakaan", color: "#3f2e21", border: "#fbbf24" },
  { x: 1210, y: 920, w: 145, h: 95, label: "Kelas X APAT A", color: "#064e3b", border: "#34d399" },
  { x: 1210, y: 1025, w: 145, h: 95, label: "Kelas X APAT B", color: "#064e3b", border: "#34d399" },

  // Deret Kanan (Kelas X NKPI & Kelas X TSM)
  { x: 1410, y: 580, w: 145, h: 95, label: "Kelas X NKPI B", color: "#334155", border: "#94a3b8" },
  { x: 1410, y: 685, w: 145, h: 95, label: "Kelas X NKPI A", color: "#334155", border: "#94a3b8" },
  { x: 1410, y: 940, w: 145, h: 95, label: "Kelas X TSM A", color: "#334155", border: "#94a3b8" },
  { x: 1410, y: 1045, w: 145, h: 95, label: "Kelas X TSM B", color: "#334155", border: "#94a3b8" },

  // Gedung IKN (Denah Halaman 2 - Seberang Jalan Gajah Oyo)
  { x: 1690, y: 310, w: 160, h: 140, label: "Lab. APAT (Gedung IKN)", color: "#064e3b", border: "#34d399" },
  { x: 1875, y: 310, w: 120, h: 140, label: "Toilet IKN", color: "#334155", border: "#94a3b8" },
  { x: 1690, y: 520, w: 150, h: 100, label: "Kelas XI APAT A", color: "#064e3b", border: "#34d399" },
  { x: 1855, y: 520, w: 150, h: 100, label: "Kelas XI APAT B", color: "#064e3b", border: "#34d399" },
  { x: 1690, y: 640, w: 150, h: 95, label: "R. BK", color: "#3f3f46", border: "#cbd5e1" },
  { x: 1855, y: 640, w: 150, h: 95, label: "R. UKS", color: "#7f1d1d", border: "#fca5a5" }
];

// Zona Terbuka / Landmark Denah
const ZONES = [
  { x: 350, y: 560, w: 460, h: 520, name: "Lapangan Upacara" },
  { x: 960, y: 120, w: 480, h: 380, name: "GoPark SMKN 1 Watulimo" },
  { x: 1590, y: 0, w: 80, h: 1550, name: "Jalan Gajah Oyo" },
  { x: 1670, y: 260, w: 360, h: 520, name: "Area Gedung IKN (APAT)" }
];

// Titik Perekrutan Siswa & Lencana Keahlian di Lapangan & Sekitar Lab
let checkpoints = [];

function initCheckpoints() {
  checkpoints = [
    // NKPI (Total 152)
    { id: 1, major: "NKPI", count: 76, x: 280, y: 680, title: "Pos Lab. NKPI", desc: "Taruna Nautika Kapal Penangkap Ikan (NKPI) sedang bersiap di depan Lab. NKPI dan Ruang Simulator!", collected: false },
    { id: 2, major: "NKPI", count: 76, x: 1360, y: 650, title: "Koridor Kelas X NKPI", desc: "Siswa Kelas X NKPI A & B bergabung membawa kompas navigasi!", collected: false },

    // TKPI (Total 151)
    { id: 3, major: "TKPI", count: 76, x: 280, y: 970, title: "Pos LAB TKPI & Navigasi", desc: "Taruna Teknika Kapal Penangkap Ikan (TKPI) dari ruang mesin kapal siap memperkuat armada!", collected: false },
    { id: 4, major: "TKPI", count: 75, x: 910, y: 710, title: "Pos Lab. TKPI Timur", desc: "Siswa Kelas X TKPI dan bengkel mesin bergabung dalam barisan!", collected: false },

    // APHPi (Total 152)
    { id: 5, major: "APHPI", count: 76, x: 890, y: 960, title: "Pos Lab APHPi", desc: "Siswa Agribisnis Pengolahan Hasil Perikanan (APHPi) membawa inovasi produk bahari Watulimo!", collected: false },
    { id: 6, major: "APHPI", count: 76, x: 1050, y: 1215, title: "Pos Kelas X APHPi A & B", desc: "Rombongan kelas X & XI APHPi siap berbaris menuju Lapangan Upacara!", collected: false },

    // TSM (Total 151)
    { id: 7, major: "TSM", count: 76, x: 720, y: 1220, title: "Pos Lab. TSM", desc: "Mekanik handal Teknik Sepeda Motor (TSM) dari Lab. TSM dan R. TSM siap meluncur!", collected: false },
    { id: 8, major: "TSM", count: 75, x: 1360, y: 1010, title: "Pos Kelas X TSM A & B", desc: "Siswa Kelas X & XI TSM lengkap bergabung ke dalam formasi sekolah!", collected: false },

    // APAT (Total 151) - Termasuk Gedung IKN di seberang Jalan Gajah Oyo
    { id: 9, major: "APAT", count: 75, x: 1165, y: 980, title: "Pos Kelas X APAT A & B", desc: "Siswa Agribisnis Perikanan Air Tawar (APAT) dari area dekat Perpustakaan bergabung!", collected: false },
    { id: 10, major: "APAT", count: 76, x: 1770, y: 485, title: "Gedung IKN - Lab. APAT", desc: "Menyeberangi Jalan Gajah Oyo menuju Gedung IKN! Siswa Lab. APAT & Kelas XI APAT resmi bergabung!", collected: false },

    // Monumen Jangkar Utama di Tengah Lapangan Upacara
    { id: 99, major: "ANCHOR", count: 0, x: 580, y: 820, title: "Monumen Jangkar SMKN 1 Watulimo", desc: "Pusat kebanggaan taruna-taruni SMKN 1 Watulimo. Kumpulkan 757 siswa dari 5 konsentrasi keahlian untuk mengangkat Jangkar Utama!", collected: false }
  ];
}

// State Pemain & Game
const player = {
  x: 580,
  y: 900,
  w: 28,
  h: 34,
  speed: 4.2,
  dir: "down",
  animFrame: 0
};

const keys = {};
let gameActive = false;
let dialogOpen = false;
let showMinimap = true;
let particles = [];

// Audio Efek Sederhana (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type = "sine", duration = 0.15) {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// Efek Partikel
function spawnParticles(x, y, color) {
  for (let i = 0; i < 22; i++) {
    const angle = (Math.PI * 2 * i) / 22;
    const speed = 1.5 + Math.random() * 3.5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color
    });
  }
}

// Update HUD
function updateHUD() {
  let totalStudents = 0;
  let totalBadges = 0;

  Object.keys(MAJORS).forEach((key) => {
    const m = MAJORS[key];
    totalStudents += m.collected;
    if (m.collected >= m.target) {
      m.badgeUnlocked = true;
      totalBadges++;
    }
    const pill = document.getElementById(`pill-${key}`);
    if (pill) {
      pill.querySelector(".major-progress").textContent = `(${m.collected}/${m.target})`;
      if (m.badgeUnlocked) pill.classList.add("completed");
      else pill.classList.remove("completed");
    }
  });

  document.getElementById("student-count").textContent = totalStudents;
  document.getElementById("badge-count").textContent = totalBadges;

  // Cek Zona Saat Ini
  let zoneName = "Koridor Kampus Watulimo";
  for (const z of ZONES) {
    if (player.x >= z.x && player.x <= z.x + z.w && player.y >= z.y && player.y <= z.y + z.h) {
      zoneName = z.name;
      break;
    }
  }
  document.getElementById("current-zone").textContent = zoneName;
}

// Dialog Helper
function openDialog(title, text) {
  dialogOpen = true;
  document.getElementById("dialog-title").textContent = title;
  document.getElementById("dialog-text").textContent = text;
  document.getElementById("dialog-box").classList.remove("hidden");
}

function closeDialog() {
  dialogOpen = false;
  document.getElementById("dialog-box").classList.add("hidden");
}

// Interaksi Pemain dengan Pos / Monumen Jangkar
function interact() {
  if (dialogOpen) {
    closeDialog();
    checkVictoryCondition();
    return;
  }

  for (const cp of checkpoints) {
    const dist = Math.hypot(player.x - cp.x, player.y - cp.y);
    if (dist < 68) {
      if (cp.major === "ANCHOR") {
        const total = Object.values(MAJORS).reduce((acc, m) => acc + m.collected, 0);
        if (total >= 757) {
          playTone(523.25, "triangle", 0.35);
          checkVictoryCondition(true);
        } else {
          playTone(320, "sine", 0.2);
          openDialog(
            "⚓ Jangkar Utama SMKN 1 Watulimo",
            `Saat ini baru terkumpul ${total} dari 757 siswa. Jelajahi seluruh pos keahlian (APHPi, NKPI, TSM, TKPI, dan APAT hingga Gedung IKN) lalu kembali ke sini!`
          );
        }
        return;
      }

      if (!cp.collected) {
        cp.collected = true;
        const m = MAJORS[cp.major];
        m.collected += cp.count;
        playTone(587.33, "triangle", 0.18);
        setTimeout(() => playTone(880, "triangle", 0.25), 110);
        spawnParticles(cp.x, cp.y, m.color);
        updateHUD();

        const statusLencana =
          m.collected >= m.target
            ? `🎉 Lencana Keahlian ${m.code} (${m.name}) LENGKAP (${m.collected}/${m.target} siswa)!`
            : `Progres ${m.code}: ${m.collected}/${m.target} siswa.`;

        openDialog(
          `${cp.title} (+${cp.count} Siswa ${m.code})`,
          `${cp.desc} ${statusLencana}`
        );
      } else {
        openDialog(cp.title, `Semua siswa di pos ${cp.title} sudah bergabung dalam barisan!`);
      }
      return;
    }
  }
}

function checkVictoryCondition(forceFromAnchor = false) {
  const total = Object.values(MAJORS).reduce((acc, m) => acc + m.collected, 0);
  if (total >= 757 && forceFromAnchor) {
    gameActive = false;
    document.getElementById("win-summary").innerHTML = `
      <strong>Rekapitulasi 757 Siswa SMKN 1 Watulimo:</strong><br/>
      APHPi: 152 | NKPI: 152 | TSM: 151 | TKPI: 151 | APAT: 151
    `;
    document.getElementById("win-overlay").classList.remove("hidden");
  }
}

// Deteksi Tabrakan Dinding Bangunan
function collidesWithBuildings(nx, ny) {
  const pad = 4;
  for (const b of BUILDINGS) {
    if (
      nx - player.w / 2 + pad < b.x + b.w &&
      nx + player.w / 2 - pad > b.x &&
      ny - player.h / 2 + pad < b.y + b.h &&
      ny + player.h / 2 - pad > b.y
    ) {
      return true;
    }
  }
  return false;
}

// Update Logika Game
function update() {
  if (!gameActive || dialogOpen) return;

  let dx = 0;
  let dy = 0;
  if (keys["ArrowUp"] || keys["KeyW"]) {
    dy -= 1;
    player.dir = "up";
  }
  if (keys["ArrowDown"] || keys["KeyS"]) {
    dy += 1;
    player.dir = "down";
  }
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    dx -= 1;
    player.dir = "left";
  }
  if (keys["ArrowRight"] || keys["KeyD"]) {
    dx += 1;
    player.dir = "right";
  }

  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy);
    dx = (dx / len) * player.speed;
    dy = (dy / len) * player.speed;

    const nextX = Math.max(25, Math.min(WORLD.width - 25, player.x + dx));
    const nextY = Math.max(25, Math.min(WORLD.height - 25, player.y + dy));

    if (!collidesWithBuildings(nextX, player.y)) player.x = nextX;
    if (!collidesWithBuildings(player.x, nextY)) player.y = nextY;

    player.animFrame += 0.18;
    updateHUD();
  }

  // Update Partikel
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.025;
  });
  particles = particles.filter((p) => p.life > 0);
}

// Render Dunia Kampus Sesuai Denah
function drawWorld() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Kamera mengikuti pemain
  const camX = Math.max(0, Math.min(WORLD.width - canvas.width, player.x - canvas.width / 2));
  const camY = Math.max(0, Math.min(WORLD.height - canvas.height, player.y - canvas.height / 2));

  ctx.save();
  ctx.translate(-camX, -camY);

  // Latar Belakang Halaman Kampus
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  // Grid paving halaman sekolah
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let gx = 0; gx < WORLD.width; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, WORLD.height);
    ctx.stroke();
  }
  for (let gy = 0; gy < WORLD.height; gy += 40) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(WORLD.width, gy);
    ctx.stroke();
  }

  // 1. Lapangan Upacara
  ctx.fillStyle = "#263547";
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 3;
  ctx.fillRect(350, 560, 460, 520);
  ctx.strokeRect(350, 560, 460, 520);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.font = "bold 22px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("LAPANGAN UPACARA", 580, 740);

  // 2. GoPark (Belah Ketupat Sesuai Denah)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(1200, 110);
  ctx.lineTo(1450, 310);
  ctx.lineTo(1200, 510);
  ctx.lineTo(950, 310);
  ctx.closePath();
  ctx.fillStyle = "#14532d";
  ctx.fill();
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = "#4ade80";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#bbf7d0";
  ctx.font = "italic bold 28px Georgia";
  ctx.fillText("GoPark", 1200, 318);
  ctx.restore();

  // 3. Jalan Gajah Oyo (Penghubung Kampus Utama & Gedung IKN)
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(1590, 0, 80, WORLD.height);
  ctx.setLineDash([18, 14]);
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(1630, 0);
  ctx.lineTo(1630, WORLD.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.save();
  ctx.translate(1630, 780);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 16px Segoe UI";
  ctx.fillText("JALAN GAJAH OYO", 0, 5);
  ctx.restore();

  // 4. Area Gedung IKN (Denah Hal. 2)
  ctx.strokeStyle = "rgba(52, 211, 153, 0.35)";
  ctx.strokeRect(1675, 275, 355, 485);
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 15px Segoe UI";
  ctx.fillText("GEDUNG IKN (AREA APAT)", 1852, 296);

  // 5. Kompas Arah Mata Angin (Pojok Kanan Atas Denah)
  ctx.save();
  ctx.translate(1510, 120);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -35);
  ctx.lineTo(0, 35);
  ctx.moveTo(-35, 0);
  ctx.lineTo(35, 0);
  ctx.stroke();
  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 13px Segoe UI";
  ctx.fillText("U", 0, -40);
  ctx.fillText("S", 0, 48);
  ctx.fillText("B", 44, 4);
  ctx.fillText("T", -44, 4);
  ctx.restore();

  // 6. Gambar Semua Bangunan Kelas & Lab
  for (const b of BUILDINGS) {
    // Bayangan bangunan
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(b.x + 5, b.y + 6, b.w, b.h);

    // Badan bangunan
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, b.h);

    ctx.strokeStyle = b.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);

    // Label Ruangan
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 12px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + 4);
  }

  // 7. Gambar Titik Rekrutmen Siswa & Monumen Jangkar
  const pulse = Math.sin(Date.now() / 220) * 4;
  for (const cp of checkpoints) {
    const isAnchor = cp.major === "ANCHOR";
    const color = isAnchor ? "#f59e0b" : MAJORS[cp.major].color;

    // Lingkaran radius interaksi
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, (isAnchor ? 34 : 24) + pulse, 0, Math.PI * 2);
    ctx.fillStyle = cp.collected ? "rgba(16, 185, 129, 0.18)" : "rgba(255, 255, 255, 0.12)";
    ctx.fill();
    ctx.strokeStyle = cp.collected ? "#10b981" : color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Ikon Pos
    ctx.font = isAnchor ? "28px Segoe UI" : "20px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(isAnchor ? "⚓" : cp.collected ? "✅" : "🎓", cp.x, cp.y + 7);

    // Label Pos
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px Segoe UI";
    const tag = isAnchor ? "JANGKAR UTAMA" : `${cp.major} (${cp.count} Siswa)`;
    ctx.fillText(tag, cp.x, cp.y - 26);

    // Prompt Interaksi Jika Dekat
    if (Math.hypot(player.x - cp.x, player.y - cp.y) < 68) {
      ctx.fillStyle = "#fde68a";
      ctx.font = "bold 12px Segoe UI";
      ctx.fillText("[SPASI] Interaksi", cp.x, cp.y + 42);
    }
  }

  // 8. Gambar Karakter Pemain (Taruna SMKN 1 Watulimo)
  const bob = Math.sin(player.animFrame) * 2;
  // Bayangan
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(player.x, player.y + 15, 13, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Seragam Taruna Biru Dongker
  ctx.fillStyle = "#1d4ed8";
  ctx.fillRect(player.x - 10, player.y - 4 + bob, 20, 18);
  // Selempang Emas
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(player.x - 9, player.y - 3 + bob);
  ctx.lineTo(player.x + 9, player.y + 12 + bob);
  ctx.stroke();

  // Kepala & Topi Taruna
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(player.x, player.y - 11 + bob, 8.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(player.x - 10, player.y - 20 + bob, 20, 5);
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(player.x - 3, player.y - 19 + bob, 6, 3);

  // 9. Gambar Partikel
  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.restore();

  // 10. Mini-Map Denah Kampus di Pojok Kanan Bawah
  if (showMinimap) {
    drawMinimap();
  }
}

function drawMinimap() {
  const mw = 190;
  const mh = 140;
  const mx = canvas.width - mw - 14;
  const my = canvas.height - mh - 14;
  const scaleX = mw / WORLD.width;
  const scaleY = mh / WORLD.height;

  ctx.save();
  ctx.fillStyle = "rgba(7, 22, 43, 0.88)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.fillRect(mx, my, mw, mh);
  ctx.strokeRect(mx, my, mw, mh);

  // Bangunan mini
  ctx.fillStyle = "#475569";
  for (const b of BUILDINGS) {
    ctx.fillRect(mx + b.x * scaleX, my + b.y * scaleY, b.w * scaleX, b.h * scaleY);
  }

  // Titik Pos belum selesai
  for (const cp of checkpoints) {
    if (!cp.collected) {
      ctx.fillStyle = cp.major === "ANCHOR" ? "#f59e0b" : "#38bdf8";
      ctx.beginPath();
      ctx.arc(mx + cp.x * scaleX, my + cp.y * scaleY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Posisi Pemain
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(mx + player.x * scaleX, my + player.y * scaleY, 3.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 9px Segoe UI";
  ctx.textAlign = "left";
  ctx.fillText("DENAH MINI [M]", mx + 6, my + 11);
  ctx.restore();
}

// Game Loop Utama
function gameLoop() {
  update();
  drawWorld();
  requestAnimationFrame(gameLoop);
}

// Event Listeners Keyboard
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "Space" || e.code === "KeyE" || e.code === "Enter") {
    if (gameActive) {
      e.preventDefault();
      interact();
    }
  }
  if (e.code === "KeyM") {
    showMinimap = !showMinimap;
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// Kontrol Mobile / Sentuh
document.querySelectorAll(".dpad button").forEach((btn) => {
  const dir = btn.dataset.dir;
  const mapCode = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight"
  }[dir];

  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys[mapCode] = true;
  });
  btn.addEventListener("touchend", () => {
    keys[mapCode] = false;
  });
  btn.addEventListener("mousedown", () => (keys[mapCode] = true));
  btn.addEventListener("mouseup", () => (keys[mapCode] = false));
});

document.getElementById("btn-action-mobile").addEventListener("click", () => {
  if (gameActive) interact();
});

document.getElementById("dialog-close").addEventListener("click", () => {
  closeDialog();
  checkVictoryCondition();
});

// Mulai & Ulangi Game
function startGame() {
  Object.values(MAJORS).forEach((m) => {
    m.collected = 0;
    m.badgeUnlocked = false;
  });
  player.x = 580;
  player.y = 900;
  initCheckpoints();
  updateHUD();
  closeDialog();
  document.getElementById("start-overlay").classList.add("hidden");
  document.getElementById("win-overlay").classList.add("hidden");
  gameActive = true;
}

document.getElementById("btn-start").addEventListener("click", startGame);
document.getElementById("btn-restart").addEventListener("click", startGame);

// Inisialisasi awal
initCheckpoints();
updateHUD();
gameLoop();
