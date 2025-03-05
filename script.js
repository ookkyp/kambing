// --- Izin Audio ---
const audioPermissionOverlay = document.getElementById('audio-permission');
const songAudio = document.getElementById('song');
audioPermissionOverlay.addEventListener('click', () => {
  songAudio.play().then(() => {
    songAudio.pause();
    audioPermissionOverlay.style.display = 'none';
    console.log("Audio telah di-unlock");
  }).catch(e => {
    console.error("Error unlocking audio:", e);
    audioPermissionOverlay.style.display = 'none';
  });
});

// --- Deteksi Tiupan untuk Memadamkan Api ---
const flameEl = document.querySelector('.flame');
const smokeEl = document.querySelector('.smoke');
const playButton = document.getElementById('play-song');
let blowCount = 0;
let blowInProgress = false;
let extinguished = false;
const blowThreshold = 25; // Sesuaikan threshold jika perlu

async function initMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    function detectBlow() {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        let sample = dataArray[i] - 128;
        sum += sample * sample;
      }
      const rms = Math.sqrt(sum / dataArray.length);

      if (rms > blowThreshold) {
        if (!blowInProgress && !extinguished) {
          blowInProgress = true;
          blowCount++;
          console.log("Tiupan ke-" + blowCount);

          if (blowCount < 3) {
            flameEl.classList.add("gust");
            setTimeout(() => {
              flameEl.classList.remove("gust");
            }, 500);
          }

          if (blowCount === 3) {
            flameEl.classList.add("final-blow");
            setTimeout(() => {
              extinguished = true;
              smokeEl.classList.add("active");
              playButton.style.display = 'block';
              console.log("Tombol play ditampilkan.");
            }, 800);
          }
        }
      } else {
        blowInProgress = false;
      }
      if (!extinguished) {
        requestAnimationFrame(detectBlow);
      }
    }
    detectBlow();
  } catch (error) {
    console.error('Error mengakses microphone:', error);
  }
}
initMic();

// --- Animasi Hujan Celebratory ---
const rainContainer = document.getElementById('rain-container');
// Array URL gambar untuk hujan celebratory
const photoSrcs = [
  "assets/IMG_5460.jpeg",
  "assets/IMG_5432.jpeg"
];

// Fungsi untuk membuat falling item (foto)
function spawnFallingItem() {
  const item = document.createElement('div');
  item.classList.add('falling-item');
  
  // Ukuran acak
  const size = Math.floor(Math.random() * 150) + 50;
  item.style.width = size + "px";
  item.style.height = size + "px";
  
  // Posisi horizontal acak
  const posX = Math.floor(Math.random() * (window.innerWidth - size));
  item.style.left = posX + "px";
  
  // Durasi animasi acak antara 5 dan 10 detik
  const duration = (Math.random() * 4 + 3).toFixed(2);
  item.style.animation = `fall ${duration}s linear forwards`;
  
  // Pilih foto secara acak
  const randomIndex = Math.floor(Math.random() * photoSrcs.length);
  const selectedPhoto = photoSrcs[randomIndex];
  item.style.backgroundImage = `url(${selectedPhoto})`;
  item.style.backgroundSize = "cover";
  
  // Hapus setelah animasi selesai
  item.addEventListener('animationend', () => {
    item.remove();
  });
  
  rainContainer.appendChild(item);
}

let rainInterval;
playButton.addEventListener('click', () => {
  console.log("Tombol play diklik.");
  songAudio.play().then(() => {
    console.log("Lagu diputar.");
    playButton.style.display = 'none';
    // Mulai spawning falling items setiap 80ms
    rainInterval = setInterval(spawnFallingItem, 80);
  }).catch(e => {
    console.error("Gagal memainkan audio:", e);
  });
  
  // Ketika lagu selesai, hentikan spawning falling items
  songAudio.addEventListener('ended', () => {
    clearInterval(rainInterval);
    console.log("Lagu selesai, animasi hujan dihentikan.");
  });
});

// --- Animasi Hujan Kedua (Love & Bunga) ---
const rainContainer2 = document.getElementById('rain-container-2');
const loveSrcs2 = [
  "love1.png",
  "love2.png"
];
const flowerSrcs2 = [
  "flower1.png",
  "flower2.png"
];

function spawnFallingItem2() {
  const item = document.createElement('div');
  item.classList.add('falling-item-2');
  
  // Tentukan apakah yang muncul adalah love atau bunga
  const isLove = Math.random() < 0.5;
  if (isLove) {
    item.classList.add('love');
    const randomIndex = Math.floor(Math.random() * loveSrcs2.length);
    item.style.backgroundImage = `url(${loveSrcs2[randomIndex]})`;
  } else {
    item.classList.add('flower');
    const randomIndex = Math.floor(Math.random() * flowerSrcs2.length);
    item.style.backgroundImage = `url(${flowerSrcs2[randomIndex]})`;
  }
  
  // Ukuran acak antara 40px dan 80px
  const size = Math.floor(Math.random() * 40) + 40;
  item.style.width = size + "px";
  item.style.height = size + "px";
  
  // Posisi horizontal acak
  const posX = Math.floor(Math.random() * (window.innerWidth - size));
  item.style.left = posX + "px";
  
  rainContainer2.appendChild(item);
  
  // Hapus setelah animasi selesai
  item.addEventListener('animationend', () => {
    item.remove();
  });
}

setInterval(() => {
  // Munculkan 2 elemen sekaligus setiap 400ms
  for (let i = 0; i < 2; i++) {
    spawnFallingItem2();
  }
}, 80);
// Tunggu hingga DOM selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    const audioPermissionOverlay = document.getElementById('audio-permission');
    const songAudio = document.getElementById('song');
    const playButton = document.getElementById('play-song');
  
    // Buka kunci audio ketika overlay diklik
    audioPermissionOverlay.addEventListener('click', () => {
      songAudio.play()
        .then(() => {
          songAudio.pause();
          audioPermissionOverlay.style.display = 'none';
          console.log("Audio telah di-unlock");
        })
        .catch(e => {
          console.error("Error unlocking audio:", e);
          audioPermissionOverlay.style.display = 'none';
        });
    });
  
    // Event listener untuk tombol play lagu
    playButton.addEventListener('click', () => {
      console.log("Tombol play diklik.");
      songAudio.play()
        .then(() => {
          console.log("Lagu diputar.");
          playButton.style.display = 'none';
          // Mulai animasi hujan jika diperlukan
          // Contoh: rainInterval = setInterval(spawnFallingItem, 80);
        })
        .catch(e => {
          console.error("Gagal memainkan audio:", e);
        });
      
      // Opsional: tambahkan event listener 'ended' untuk menghentikan animasi
      songAudio.addEventListener('ended', () => {
        // clearInterval(rainInterval);
        console.log("Lagu selesai, animasi hujan dihentikan.");
      });
    });
    
    // (Pastikan kode pendeteksian tiupan untuk memadamkan lilin berjalan dan mengubah playButton.style.display ke 'block')
  });