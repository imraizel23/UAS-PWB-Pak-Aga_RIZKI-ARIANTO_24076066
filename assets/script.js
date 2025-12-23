
// Interaksi: validasi, generate kartu, manipulasi DOM, audio EQ, dan cetak

document.addEventListener('DOMContentLoaded', () => {
  const btnCetak = document.getElementById('btnCetak');
  const audio = document.getElementById('marsAudio');
  const eq = document.getElementById('eqBars');

  // ====== Tombol Cetak -> generate kartu & print ======
  if (btnCetak) {
    btnCetak.addEventListener('click', () => {
      generateKTM();
      // Scroll halus ke area preview biar jelas
      const preview = document.getElementById('preview');
      if (preview && preview.scrollIntoView) {
        preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ====== Equalizer mini untuk Mars Kampus ======
  if (audio && eq) {
    const setEqState = () => {
      if (audio.paused) {
        eq.classList.add('paused');   // hentikan animasi bar
      } else {
        eq.classList.remove('paused'); // nyalakan animasi bar
      }
    };
    audio.addEventListener('play', setEqState);
    audio.addEventListener('pause', setEqState);
    audio.addEventListener('ended', setEqState);
    audio.addEventListener('timeupdate', setEqState);
    // Inisialisasi state
    setEqState();
  }
});

// ====== Generate Kartu KTM ======
function generateKTM() {
  const nama = document.getElementById('nama')?.value.trim() || '';
  const tgl  = document.getElementById('tgl')?.value || '';
  const prodiSel = document.getElementById('prodi');
  const prodi = prodiSel ? prodiSel.value : '';
  const jkRadio = document.querySelector('input[name="jk"]:checked');
  const jk  = jkRadio ? jkRadio.value : '-';
  const hobiNodes = document.querySelectorAll('input[name="hobi"]:checked');
  const hobi = Array.from(hobiNodes).map(x => x.value).join(', ') || '-';

  // Validasi sederhana
  if (!nama || !prodi) {
    alert('Harap lengkapi data!');
    return;
  }

  // ====== Logika aksen berdasarkan prodi (tidak mengganggu tema ungu) ======
  applyAccentByProdi(prodi);

  // ====== Inject biodata ke tabel (innerHTML) ======
  const ktmData = document.getElementById('ktmData');
  if (ktmData) {
    ktmData.innerHTML = `
      <tr><td>Nama</td><td><strong>${escapeHTML(nama)}</strong></td></tr>
      <tr><td>NIM</td><td><strong>${escapeHTML('24076066')}</strong></td></tr>
      <tr><td>Program Studi</td><td>${escapeHTML(getProdiLabel(prodi))}</td></tr>
      <tr><td>Tanggal Lahir</td><td>${tgl ? formatDateID(tgl) : '-'}</td></tr>
      <tr><td>Jenis Kelamin</td><td>${escapeHTML(jk)}</td></tr>
      <tr><td>Hobi/Minat</td><td>${escapeHTML(hobi)}</td></tr>
    `;
  }

  // Tampilkan kartu, sembunyikan placeholder
  const ktm = document.getElementById('ktm');
  const placeholder = document.getElementById('ktmPlaceholder');
  if (ktm) ktm.classList.remove('is-hidden');
  if (placeholder) placeholder.classList.add('is-hidden');

  // Buka dialog cetak (beri jeda agar layout & gaya cetak siap)
  setTimeout(() => window.print(), 800);
}

// ====== Utility: label Prodi ======
function getProdiLabel(v) {
  switch (v) {
    case 'PTI': return 'Pendidikan Teknik Informatika (PTI)';
    case 'INF': return 'Teknik Informatika (INF)';
    case 'DKV': return 'Desain Komunikasi Visual (DKV)';
    default:    return v || '-';
  }
}

// ====== Utility: escape HTML ======
function escapeHTML(str) {
  return String(str).replace(/[&<>\"']/g, s => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[s]));
}

// ====== Utility: format tanggal id-ID ======
function formatDateID(iso) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric'
    }).format(d);
  } catch {
    return iso;
  }
}

// ====== Utility: terapkan aksen berdasarkan Prodi ======
function applyAccentByProdi(prodi) {
  const root = document.documentElement;
  // Default tetap ungu tua yang elegan
  let accent = '#6D28D9';   // purple-700
  let accent2 = '#8B5CF6';  // purple-500
  let cardBg = getComputedStyle(root).getPropertyValue('--card-bg').trim() || '#111827';

  switch (prodi) {
    case 'INF': // Teknik Informatika -> biru
      accent  = '#3B82F6';  // blue-500
      accent2 = '#60A5FA';  // blue-400
      cardBg  = '#0b2247';
      break;
    case 'DKV': // Desain -> merah
      accent  = '#EF4444';  // red-500
      accent2 = '#F87171';  // red-400
      cardBg  = '#311112';
      break;
    case 'PTI': // Pendidikan TI -> hijau
      accent  = '#10B981';  // emerald-500
      accent2 = '#34D399';  // emerald-400
      cardBg  = '#0f2a20';
      break;
    default:
      // Biarkan tetap ungu (tema favorit), tidak perlu mengubah cardBg
      break;
  }

  root.style.setProperty('--accent', accent);
  root.style.setProperty('--accent-2', accent2);
  root.style.setProperty('--card-bg', cardBg);
}
