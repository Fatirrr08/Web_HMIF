const fs = require('fs');
const path = require('path');

function loadLocalEnv() {
    try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const lines = envContent.split('\n');
            const env = {};
            for (const line of lines) {
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1];
                    let value = match[2] || '';
                    env[key] = value.trim().replace(/(^['"]|['"]$)/g, '');
                }
            }
            return env;
        }
    } catch (e) {
        // ignore
    }
    return {};
}

module.exports = function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const localEnv = loadLocalEnv();
    const model = process.env.OPENROUTER_AI_MODEL || localEnv.OPENROUTER_AI_MODEL || "anthropic/claude-3.5-sonnet";
    const rules = process.env.OPENROUTER_AI_RULES || localEnv.OPENROUTER_AI_RULES || `1. LEMBAR KENDALI ADMINISTRASI: Wajib ada di Halaman 1. Harus memuat Tanggal, Nomor, Perihal, Unit Organisasi (Himpunan Mahasiswa Teknik Informatika), DITETAPKAN oleh Wakil Direktur Bidang Akademik & Riset (Dr. Catur Nugroho, S.Sos., M.I.Kom.), DIPERIKSA oleh Ka.Ur Kemahasiswaan (Kadarisman, S.Si), Kaprodi (Aditya Dwi Putro W), Pembina HMIF (Dany Candra Febrianto), Chairman HMIF (Fatir Gibran), dan Ketua Panitia, serta DISUSUN OLEH Sekretaris.
2. TYPOGRAPHY & HEADING: Hapus semua angka Romawi pada sub-judul (gunakan Bold saja). Teks deskripsi/paragraf wajib Justify, sedangkan Cover, Judul Pengesahan, dan Lampiran wajib Center.
3. PEMBERSIHAN DATA: Bersihkan redundansi teks (seperti "Closingan.Closingan.") dan perbaiki NIM duplikat (seperti 12 digit tertempel ganda) menjadi format 12 digit tunggal yang valid. Auto-generate Tema Kegiatan jika kosong.
4. FORMAT TABEL:
   - Tabel Mitigasi wajib 8 kolom: No | Uraian Kegiatan | Identifikasi Bahaya | Peluang/Kemungkinan | Akibat/Keparahan | Tingkat Risiko | Pengendalian Risiko | Penanggung Jawab.
   - Tabel Anggaran wajib dipisah PEMASUKAN dan PENGELUARAN dengan Selisih = 0 (seimbang).
   - Tabel Capaian Pelaksanaan Program (CPP): Berikan tanda centang (✓) hanya pada 3-5 target yang paling relevan.
5. HALAMAN PENGESAHAN: Terletak setelah Penutup. Blok tanda tangan Kiri-Kanan: Baris 1 (Ketua & Sekretaris), Baris 2 (Pembina & Chairman), Baris 3 (Ka.Ur Kemahasiswaan & Kaprodi), Baris 4 (Wakil Direktur di Tengah Bawah). Wajib mencantumkan nama lengkap, gelar, dan NIP/NIM yang valid.
6. LAMPIRAN DOKUMEN: Lampiran I (Susunan Panitia), Lampiran II (Rancangan Anggaran Pemasukan/Pengeluaran), Lampiran III (Susunan Acara dengan kolom: No | Waktu | Kegiatan | PJ | Keterangan).`;

    const geminiKey = process.env.GEMINI_API_KEY || localEnv.GEMINI_API_KEY || "";
    res.status(200).json({ model, rules, geminiKey });
};
