/* ============================================================
   script.js
   INI BAGIAN "TUGAS JAVASCRIPT"-nya.
   Dipakai khusus di update-barang.html

   Alur kerja:
   1. Simpan semua barang yang sudah ditambahkan di dalam array "daftarBarang"
   2. Saat form di-submit -> jangan reload halaman, tapi validasi dulu
   3. Kalau valid -> masukkan data baru ke array, lalu render ulang tabel
   4. Tiap baris tabel punya tombol Hapus -> menghapus data dari array
   ============================================================ */

// 1. Array untuk menampung semua barang (ini "database sementara" di memori browser)
var daftarBarang = [];

// Ambil elemen-elemen yang dibutuhkan dari HTML
var form = document.getElementById("form-barang");
var tbody = document.getElementById("tbody-barang");
var pesanError = document.getElementById("pesan-error");

// ------------------------------------------------------------
// FUNGSI: menggambar ulang isi tabel berdasarkan isi array
// ------------------------------------------------------------
function renderTabel() {
  // Jika array kosong, tampilkan satu baris keterangan "belum ada data"
  if (daftarBarang.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" style="text-align:center; color:#777;">Belum ada data barang</td></tr>';
    return;
  }

  // .map() mengubah setiap object di array menjadi 1 baris <tr> HTML
  // .join("") menggabungkan semua baris jadi satu string HTML utuh
  tbody.innerHTML = daftarBarang
    .map(function (barang, index) {
      return (
        "<tr>" +
        "<td>" + barang.kode + "</td>" +
        "<td>" + barang.nama + "</td>" +
        "<td>" + barang.jumlah + "</td>" +
        "<td>" + barang.kondisi + "</td>" +
        "<td>" + barang.kategori.join(", ") + "</td>" + // gabungkan array kategori jadi teks "A, B, C"
        "<td>" + barang.lokasi + "</td>" +
        '<td><button type="button" class="btn-hapus" data-index="' + index + '">Hapus</button></td>' +
        "</tr>"
      );
    })
    .join("");
}

// ------------------------------------------------------------
// FUNGSI: validasi input sebelum data disimpan
// Mengembalikan pesan error (string), atau "" kalau semua valid
// ------------------------------------------------------------
function validasiForm(data) {
  if (data.nama.trim() === "") {
    return "Nama Barang tidak boleh kosong.";
  }
  if (isNaN(data.jumlah) || Number(data.jumlah) <= 0) {
    return "Jumlah harus diisi dengan angka lebih dari 0.";
  }
  if (data.kategori.length === 0) {
    return "Minimal pilih 1 Kategori.";
  }
  return ""; // tidak ada error
}

// ------------------------------------------------------------
// EVENT 1: saat form di-submit (tombol "Simpan" ditekan)
// ------------------------------------------------------------
form.addEventListener("submit", function (event) {
  event.preventDefault(); // <-- INI KUNCINYA: mencegah halaman reload

  // Ambil semua nilai dari form pakai form.namaInput.value
  var kodeBarang = form.kode_barang.value;
  var namaBarang = form.nama_barang.value;
  var jumlah = form.jumlah.value;
  var kondisi = form.kondisi.value; // otomatis ambil radio yg sedang dipilih

  // Ambil SEMUA checkbox kategori yang sedang dicentang
  var checkboxKategori = document.querySelectorAll('input[name="kategori[]"]:checked');
  var kategoriTerpilih = [];
  checkboxKategori.forEach(function (cb) {
    kategoriTerpilih.push(cb.value);
  });

  var lokasi = form.lokasi.value;
  var keterangan = form.keterangan.value;

  // Bungkus semua nilai jadi satu object, supaya rapi dikirim ke fungsi validasi
  var dataBaru = {
    kode: kodeBarang,
    nama: namaBarang,
    jumlah: jumlah,
    kondisi: kondisi,
    kategori: kategoriTerpilih,
    lokasi: lokasi,
    keterangan: keterangan,
  };

  // 2. Validasi dulu sebelum disimpan
  var error = validasiForm(dataBaru);
  if (error !== "") {
    pesanError.textContent = error;
    pesanError.classList.remove("hidden");
    return; // hentikan proses, jangan simpan data
  }

  pesanError.classList.add("hidden");

  // 3. Kalau lolos validasi, masukkan ke array lalu render ulang tabel
  daftarBarang.push(dataBaru);
  renderTabel();

  // Kosongkan kembali form setelah data tersimpan
  form.reset();
});

// ------------------------------------------------------------
// EVENT 2: klik tombol "Hapus" di salah satu baris tabel
// (event delegation: 1 listener di tbody, cukup untuk semua tombol hapus
//  yang muncul belakangan lewat innerHTML)
// ------------------------------------------------------------
tbody.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-hapus")) {
    var index = event.target.getAttribute("data-index");
    daftarBarang.splice(index, 1); // menghapus 1 data dari array sesuai posisinya
    renderTabel(); // gambar ulang tabel tanpa data yang sudah dihapus
  }
});

// Render tabel pertama kali saat halaman dibuka (supaya muncul "Belum ada data")
renderTabel();