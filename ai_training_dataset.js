/**
 * AI TRAINING DATASET - HMIF TELKOM UNIVERSITY PURWOKERTO
 * =========================================================
 * Dataset ini dibangun dari eksplorasi SELURUH file dokumen di workspace:
 *  1. responsif_text.txt     → Proposal ResponsIF UTS Genap 2026 (Resiko Rendah/Sedang)
 *  2. sosial_mengajar_text.txt → Proposal Sosial Mengajar 2026 (Resiko Tinggi)
 *  3. kwu_content.txt        → Proposal Talkshow Kewirausahaan 2026 (Resiko Sedang)
 *  4. upgrading_content.txt  → Proposal Upgrading HMIF 2026 (Resiko Tinggi)
 *  5. template_rendah.txt    → Template Resiko Rendah/Sedang (BLANK)
 *  6. template_tinggi.txt    → Template Resiko Tinggi (BLANK)
 * =========================================================
 */

const AI_TRAINING_DATASET = {

  // ============================================================
  // SECTION 1: IDENTITAS TETAP HMIF
  // ============================================================
  identitas: {
    namaOrganisasi: "Himpunan Mahasiswa Teknik Informatika",
    singkatan: "HMIF",
    universitas: "Telkom University Purwokerto",
    kota: "Purwokerto",
    
    // Pejabat tetap yang selalu muncul di setiap proposal
    pejabatTetap: {
      pembinHMIF: {
        nama: "Dany Candra Febrianto, S.Kom., M.Eng.",
        nip: "23920011",
        jabatan: "Pembina HMIF"
      },
      chairmanHMIF: {
        nama: "Fatir Gibran",
        nim: "103112430153",
        jabatan: "Chairman HMIF"
      },
      kaUrKemahasiswaan: {
        nama: "Kadarisman, S.Si",
        nip: "22960016",
        jabatan: "Kepala Urusan Kemahasiswaan, Karier dan Alumni"
      },
      kaprodiIF: {
        nama: "Aditya Dwi Putro W, S.Kom., M.Kom.",
        nip: "17930052",
        jabatan: "Kepala Program Studi Teknik Informatika"
      },
      wadekAkademik: {
        nama: "Dr. Catur Nugroho, S.Sos., M.I.Kom.",
        nip: "14780035-1",
        jabatan: "Wakil Direktur Bidang Akademik & Riset"
      },
      direktur: {
        nama: "Dr. Tenia Wahyuningrum, S.Kom., M.T.",
        nip: "07820045-1",
        jabatan: "Direktur Telkom University Purwokerto"
      }
    },

    pembimbingTambahan: [
      { nama: "Dasril Aldo, S.Kom., M.Kom.", nip: "23940013" }
    ]
  },

  // ============================================================
  // SECTION 2: FORMAT DOKUMEN (ATURAN KERAS)
  // ============================================================
  formatDokumen: {
    font: "Times New Roman",
    ukuranFont: "12pt",
    spasi: "1.5",
    margin: { atas: "4cm", kiri: "4cm", kanan: "3cm", bawah: "3cm" },
    alignment: "Justified (rata kanan-kiri) untuk seluruh isi paragraf",
    nomorHalaman: "kanan bawah",
    bahasa: "Indonesia Formal, baku, sesuai PUEBI"
  },

  // ============================================================
  // SECTION 3: DATASET PROPOSAL NYATA (4 DOKUMEN TERVERIFIKASI)
  // ============================================================
  proposalNyata: [
    {
      judul: "ResponsIF UTS Genap 2026",
      jenis: "Resiko Rendah/Sedang",
      tanggal: "07 Maret 2026",
      namaKegiatan: "Nama kegiatan ini adalah ResponsIF UTS Genap 2026.",
      tema: "Flip The Script \u2013 Learn Together, Rise Together",
      temaNarasi: "Tema kegiatan ini adalah \u201cFlip The Script \u2013 Learn Together, Rise Together\u201d, dipilih sebagai bentuk ajakan bagi mahasiswa untuk melakukan evaluasi dan perbaikan hasil Ujian Tengah Semester agar lebih optimal dibandingkan semester sebelumnya melalui proses belajar bersama yang kolaboratif.",
      latarBelakang: [
        "Kegiatan ResponsIF UTS Genap 2026 dilatarbelakangi oleh pentingnya persiapan akademik yang matang dalam menghadapi Ujian Tengah Semester. Dalam pelaksanaannya, masih terdapat mahasiswa yang mengalami kesulitan dalam memahami beberapa materi perkuliahan yang telah disampaikan selama setengah semester, baik karena perbedaan cara penyampaian, ritme belajar, maupun keterbatasan ruang diskusi yang mendalam. Kondisi tersebut menunjukkan perlunya wadah pembelajaran tambahan yang lebih fleksibel dan komunikatif.",
        "Melalui kegiatan ResponsIF UTS Genap 2026, Himpunan Mahasiswa Teknik Informatika berupaya menghadirkan ruang belajar bersama yang kolaboratif dengan pendekatan teman sebaya, sehingga mahasiswa dapat saling berbagi pemahaman, memperkuat materi, serta meningkatkan kesiapan dalam menghadapi UTS. Diharapkan kegiatan ini tidak hanya membantu dalam peningkatan hasil akademik, tetapi juga mempererat solidaritas dan semangat belajar antar mahasiswa dalam satu angkatan."
      ],
      tujuan: [
        "Meningkatkan pemahaman mahasiswa terhadap materi perkuliahan yang akan diujikan pada Ujian Tengah Semester.",
        "Membantu mahasiswa dalam mempersiapkan diri menghadapi UTS secara optimal.",
        "Menyediakan wadah belajar bersama yang kolaboratif melalui pendekatan diskusi dan penjelasan ulang materi antar mahasiswa.",
        "Mendorong terciptanya suasana akademik yang suportif dan komunikatif di lingkungan mahasiswa S1 Teknik Informatika.",
        "Menumbuhkan semangat kebersamaan dan motivasi belajar guna mencapai hasil akademik yang lebih maksimal."
      ],
      manfaat: [
        "Mahasiswa memperoleh pemahaman yang lebih baik terhadap materi perkuliahan yang akan diujikan dalam Ujian Tengah Semester.",
        "Mahasiswa menjadi lebih siap dan percaya diri dalam menghadapi UTS.",
        "Tentor atau pemateri dapat mengembangkan kemampuan komunikasi dan keterampilan dalam menyampaikan materi kepada sesama mahasiswa.",
        "Terbentuknya hubungan yang lebih erat serta budaya saling mendukung antar mahasiswa dalam mencapai keberhasilan akademik bersama.",
        "Memberikan pengalaman belajar kolaboratif yang bermanfaat dalam menghadapi tantangan akademik di masa mendatang."
      ],
      peserta: "Peserta kegiatan ResponsIF UTS Genap 2026 merupakan mahasiswa S1 Teknik Informatika Telkom University Purwokerto angkatan 2024 dan 2025. Kegiatan ini dilaksanakan dengan sistem kombinasi daring (online) dan luring (offline) secara bergantian selama dua hari, dengan target peserta sebanyak 70 orang untuk sesi daring dan 50 orang untuk sesi luring.",
      waktuTempat: {
        tanggal: "Sabtu, 18 April 2026 dan Minggu, 19 April 2026",
        pukul: "08.00 - 11.20 WIB",
        tempat: "Telkom University Purwokerto (sesi luring) dan platform daring (Zoom)"
      },
      penutup: "Demikian proposal kegiatan ResponsIF UTS Genap 2026 ini kami susun sebagai panduan dalam menyelenggarakan kegiatan agar dapat berjalan dengan lancar dan sesuai dengan tujuan yang telah direncanakan. Kegiatan ini diharapkan dapat menjadi wadah yang efektif dalam membantu mahasiswa S1 Teknik Informatika Telkom University Purwokerto meningkatkan pemahaman materi menjelang Ujian Tengah Semester, sekaligus mempererat solidaritas melalui proses pembelajaran bersama. Kami menyadari bahwa pelaksanaan kegiatan ini membutuhkan dukungan dan kerja sama dari berbagai pihak. Oleh karena itu, kami sangat mengharapkan bantuan, baik dalam bentuk saran, dukungan moral, maupun material, demi kesuksesan kegiatan ini. Semoga kegiatan ResponsIF UTS Genap 2026 dapat terlaksana dengan baik dan memberikan manfaat yang nyata bagi seluruh pihak yang terlibat. Atas perhatian dan kerja sama yang diberikan, kami mengucapkan terima kasih.",
      mitigasiRisiko: [
        { no: 1, uraian: "ResponsIF UTS", bahaya: "Waktu tidak sesuai rundown", peluang: 1, akibat: 1, tingkat: 1, pengendalian: "Mengadakan koordinasi sebelum acara berlangsung", pic: "Ketua" }
      ],
      halamanPengesahan: {
        tanggal: "07 Maret 2026",
        ketuaPanitia: { nama: "Annisa Berliana Nindya Syah Putri", nim: "109082500166" },
        sekretaris: { nama: "Adhara Faliya Utanti", nim: "109082500033" },
        adaDirektur: false
      }
    },
    {
      judul: "Sosial Mengajar 2026",
      jenis: "Resiko Tinggi",
      tanggal: "11 Maret 2026",
      namaKegiatan: "Nama kegiatan yang akan dilakukan adalah \"Sosial Mengajar\".",
      tema: "Edukasi Literasi Digital dan Etika dalam Penggunaan Gadget dan Media Sosial",
      latarBelakang: [
        "Perkembangan teknologi digital telah membawa perubahan besar dalam kehidupan sehari-hari, khususnya dalam cara generasi muda berkomunikasi, belajar, dan mengakses informasi. Penggunaan gadget dan media sosial kini menjadi bagian yang tidak terpisahkan dari aktivitas mereka karena memberikan berbagai manfaat. Namun, penggunaan teknologi yang tidak bijak juga dapat menimbulkan dampak negatif, seperti kecanduan gadget, penyebaran hoaks, cyberbullying, hingga menurunnya etika dalam berinteraksi di dunia digital.",
        "Melalui kegiatan sosial mengajar ini, diharapkan peserta dapat meningkatkan kesadaran dan pemahaman dalam memanfaatkan teknologi secara bijak, positif, dan produktif di era digital."
      ],
      tujuan: [
        "Meningkatkan pemahaman generasi muda mengenai pentingnya literasi digital dalam menghadapi perkembangan teknologi di era digital.",
        "Memberikan edukasi tentang pemanfaatan gadget dan media sosial secara positif, produktif, dan mendukung proses belajar.",
        "Menumbuhkan kesadaran peserta agar mampu menggunakan teknologi secara bijak, bertanggung jawab, dan sesuai dengan etika digital.",
        "Meningkatkan kemampuan peserta dalam menyaring informasi, menganalisis konten digital, dan berpikir kritis.",
        "Menanamkan sikap sopan, menghargai orang lain, dan menjaga perilaku dalam berinteraksi di media sosial.",
        "Mencegah dampak negatif penggunaan teknologi, seperti kecanduan gadget, penyebaran hoaks, dan cyberbullying."
      ],
      manfaat: [
        "Menambah wawasan peserta mengenai pentingnya literasi digital dalam kehidupan sehari-hari.",
        "Membantu peserta memahami cara menggunakan gadget dan media sosial untuk kegiatan yang lebih bermanfaat dan produktif.",
        "Meningkatkan kemampuan peserta dalam memilah, memahami, dan menyebarkan informasi secara bertanggung jawab.",
        "Menumbuhkan kesadaran untuk menjaga etika, sikap, dan bahasa dalam berkomunikasi di ruang digital.",
        "Membantu peserta mengenali risiko dan dampak negatif dari penggunaan teknologi yang tidak bijak.",
        "Membentuk karakter generasi muda yang cerdas, bijak, dan bertanggung jawab dalam memanfaatkan teknologi."
      ],
      peserta: "Target sasaran peserta kegiatan Sosial Mengajar ini meliputi 61 siswa SD yang terdiri dari kelas 4, 5, dan 6.",
      waktuTempat: {
        tanggal: "Senin, 25 Mei 2026",
        pukul: "08.00 - 12.00 WIB",
        tempat: "SD Negeri 2 Banjarsari Wetan"
      },
      penutup: "Demikian proposal kegiatan Sosial Mengajar dengan tema \u201cEdukasi Literasi Digital dan Etika dalam Penggunaan Gadget dan Media Sosial\u201d yang diselenggarakan oleh Himpunan Mahasiswa Informatika (HMIF) Telkom University kami sampaikan. Kegiatan ini bertujuan untuk meningkatkan pemahaman generasi muda mengenai pentingnya literasi digital serta penggunaan gadget dan media sosial secara bijak, positif, dan bertanggung jawab. Kami berharap kegiatan ini dapat memberikan manfaat bagi peserta. Oleh karena itu, kami sangat mengharapkan dukungan dan kerja sama dari berbagai pihak agar kegiatan ini dapat terlaksana dengan baik. Atas perhatian dan dukungan yang diberikan, kami ucapkan terima kasih.",
      mitigasiRisiko: [
        { no: 1, uraian: "Persiapan tempat kegiatan", bahaya: "Kondisi tempat tidak aman (lantai licin, dll.)", peluang: 2, akibat: 2, tingkat: 4, pengendalian: "Melakukan pengecekan lokasi sebelumnya dan memastikan area aman dari bahaya.", pic: "Acara" },
        { no: 2, uraian: "Penggunaan Alat Presentasi", bahaya: "Gangguan teknis pada alat (listrik mati, alat rusak)", peluang: 1, akibat: 2, tingkat: 2, pengendalian: "Menyiapkan cadangan alat seperti laptop, speaker, dan memastikan sumber daya listrik memadai", pic: "PDD" },
        { no: 3, uraian: "Penyediaan Konsumsi", bahaya: "Keracunan Makanan", peluang: 2, akibat: 3, tingkat: 6, pengendalian: "Memastikan konsumsi berasal dari penyedia terpercaya dan memeriksa kualitas makanan.", pic: "Bendahara" }
      ],
      halamanPengesahan: {
        tanggal: "4 Mei 2026",
        ketuaPanitia: { nama: "Jahra Syarifah N. Salsabila", nim: "109082500099" },
        sekretaris: { nama: "Shafira Shifa Azahra", nim: "109082500125" },
        adaDirektur: true
      }
    },
    {
      judul: "Talkshow Kewirausahaan 2026",
      jenis: "Resiko Sedang",
      tanggal: "Sabtu, 23 Mei 2026",
      namaKegiatan: "Nama kegiatan ini adalah \"Talkshow Kewirausahaan 2026\".",
      tema: "Talkshow Kewirausahaan 5.0 Ekonomi dan Teknologi",
      latarBelakang: [
        "Talkshow Kewirausahaan 2026 merupakan sebuah inisiatif yang diselenggarakan oleh Himpunan Mahasiswa Teknik Informatika periode 2025/2026 sebagai bentuk upaya dalam meningkatkan wawasan dan semangat kewirausahaan di kalangan mahasiswa. Kegiatan ini dirancang dengan mengangkat isu seputar perkembangan ekonomi dan pemanfaatan teknologi dalam dunia bisnis yang terus mengalami perubahan secara cepat dan dinamis.",
        "Masih banyak mahasiswa yang belum memiliki pemahaman yang komprehensif mengenai bagaimana mengintegrasikan aspek ekonomi dan teknologi dalam membangun bisnis yang berkelanjutan.",
        "Oleh karena itu, diperlukan sebuah wadah yang mampu menghadirkan diskusi inspiratif dan edukatif bersama narasumber yang berpengalaman di bidang kewirausahaan dan pemanfaatan teknologi dalam bisnis."
      ],
      tujuan: [
        "Memberikan wawasan kepada peserta mengenai perkembangan ekonomi di era digital serta pentingnya pemanfaatan teknologi dalam membangun dan mengembangkan usaha yang inovatif dan berkelanjutan.",
        "Mendorong mahasiswa dan calon wirausahawan untuk berani memulai usaha, mengembangkan ide kreatif, serta mampu beradaptasi dengan perubahan teknologi.",
        "Menghadirkan pengalaman nyata dan strategi bisnis dari narasumber yang kompeten agar peserta memahami tantangan, peluang, serta langkah konkret dalam membangun usaha berbasis teknologi.",
        "Menciptakan wadah interaksi dan diskusi yang memungkinkan peserta untuk bertukar ide, memperluas relasi, serta membuka peluang kolaborasi."
      ],
      manfaat: [
        "Peserta akan memperoleh pemahaman yang lebih luas mengenai bagaimana perkembangan teknologi memengaruhi sistem ekonomi serta bagaimana strategi pemanfaatannya dapat diterapkan dalam membangun bisnis secara efektif dan berkelanjutan.",
        "Melalui pengalaman dan insight yang dibagikan oleh para narasumber, peserta diharapkan lebih termotivasi untuk memulai usaha, berani mengambil peluang.",
        "Peserta dapat mengetahui berbagai tantangan yang mungkin dihadapi dalam dunia kewirausahaan serta memahami peluang yang dapat dimanfaatkan.",
        "Kegiatan ini memberikan kesempatan bagi peserta untuk berinteraksi dengan narasumber dan sesama peserta, sehingga dapat membuka peluang kerja sama."
      ],
      peserta: "Sasaran peserta kegiatan Talkshow Kewirausahaan 2026 ini adalah Mahasiswa Telkom University Purwokerto dengan target peserta sebanyak 130 mahasiswa/i.",
      waktuTempat: {
        tanggal: "Sabtu, 23 Mei 2026",
        pukul: "08.00 WIB - 14.10 WIB",
        tempat: "Aula Rachmat Effendi"
      },
      penutup: "Talkshow Kewirausahaan 2026 diharapkan dapat memberikan wawasan, motivasi, serta pemahaman strategis bagi para peserta dalam menghadapi perkembangan ekonomi dan teknologi yang terus berubah. Melalui pemaparan dan diskusi bersama narasumber yang berpengalaman, kegiatan ini diharapkan menjadi sarana edukatif untuk memahami tantangan serta peluang dalam membangun dan mengembangkan usaha di era digital. Demikian proposal ini kami sampaikan sebagai gambaran umum pelaksanaan Talkshow Kewirausahaan 2026. Besar harapan kami agar kegiatan ini dapat terlaksana dengan baik melalui dukungan dan kerja sama dari berbagai pihak. Atas perhatian dan partisipasi yang diberikan, kami ucapkan terima kasih.",
      mitigasiRisiko: [
        { no: 1, uraian: "Talkshow", bahaya: "Keterlambatan waktu tidak sesuai rundown", peluang: 2, akibat: 1, tingkat: 4, pengendalian: "Mengadakan koordinasi sebelum acara berlangsung untuk menghindari terjadinya kesalahan komunikasi", pic: "Ketua dan Acara" },
        { no: 2, uraian: "Kesalahan Komunikasi", bahaya: "Kesulitan Komunikasi yang terjadi dari panitia maupun peserta", peluang: 2, akibat: 2, tingkat: 4, pengendalian: "Memastikan komunikasi selalu lancar dan jelas", pic: "Ketua dan Acara" }
      ],
      halamanPengesahan: { adaDirektur: false }
    },
    {
      judul: "Upgrading Pengurus HMIF Periode 2026",
      jenis: "Resiko Tinggi",
      tanggal: "22 April 2026",
      namaKegiatan: "Nama kegiatan ini adalah Upgrading Pengurus HMIF 2026.",
      tema: "Satu Ikatan, Satu Perjalanan",
      latarBelakang: [
        "Himpunan Mahasiswa Informatika (HMIF) merupakan organisasi kemahasiswaan yang menjadi wadah bagi mahasiswa Program Studi Informatika untuk mengembangkan potensi, kemampuan berorganisasi, serta membangun kerja sama dalam menjalankan berbagai program kerja.",
        "Pengurus HMIF yang berasal dari latar belakang dan karakter yang beragam memerlukan proses adaptasi serta pengenalan yang lebih mendalam satu sama lain. Tanpa adanya kedekatan dan rasa saling memahami, koordinasi dalam menjalankan tugas organisasi dapat menjadi kurang maksimal.",
        "Melalui kegiatan Upgrading Pengurus HMIF 2026 yang dikemas dalam bentuk malam keakraban, diharapkan seluruh pengurus dapat membangun kebersamaan, memperkuat rasa persatuan, serta meningkatkan kekompakan dalam menjalankan organisasi."
      ],
      tujuan: [
        "Mempererat hubungan serta membangun rasa kebersamaan antar pengurus Himpunan Mahasiswa Informatika (HMIF) periode 2026.",
        "Meningkatkan kekompakan dan kerja sama antar pengurus dalam menjalankan organisasi selama satu periode kepengurusan.",
        "Menumbuhkan rasa kekeluargaan serta memperkuat rasa memiliki terhadap organisasi HMIF.",
        "Menciptakan suasana yang lebih akrab sehingga komunikasi dan koordinasi antar pengurus dapat berjalan dengan lebih baik."
      ],
      manfaat: [
        "Terjalinnya hubungan yang lebih erat antar pengurus Himpunan Mahasiswa Informatika (HMIF) periode 2026.",
        "Meningkatkan rasa kebersamaan, kekompakan, dan solidaritas dalam menjalankan kegiatan organisasi.",
        "Menciptakan suasana organisasi yang lebih harmonis sehingga komunikasi dan koordinasi antar pengurus dapat berjalan dengan baik.",
        "Menumbuhkan rasa tanggung jawab serta rasa memiliki terhadap organisasi HMIF."
      ],
      peserta: "Seluruh pengurus Himpunan Mahasiswa Teknik Informatika Periode 2026 berjumlah 54 orang.",
      waktuTempat: {
        tanggal: "Sabtu, 25 April 2026 - Minggu, 26 April 2026",
        pukul: "Sabtu 12.30 WIB - Minggu 11.30 WIB",
        tempat: "Villa Tunggul Isai Baturraden"
      },
      penutup: "Demikian proposal kegiatan Upgrading Pengurus Himpunan Mahasiswa Informatika (HMIF) Periode 2026 ini disusun sebagai gambaran pelaksanaan kegiatan yang akan dilaksanakan. Diharapkan kegiatan ini dapat mempererat kebersamaan, meningkatkan kekompakan, serta membangun solidaritas antar pengurus HMIF dalam menjalankan organisasi selama satu periode kepengurusan. Besar harapan kami agar kegiatan ini dapat terlaksana dengan baik melalui dukungan dan kerja sama dari berbagai pihak. Semoga kegiatan Upgrading Pengurus HMIF 2026 dapat memberikan manfaat serta memperkuat rasa kebersamaan di lingkungan pengurus HMIF.",
      mitigasiRisiko: [
        { no: 1, uraian: "Perjalanan", bahaya: "Kecelakaan", peluang: 3, akibat: 3, tingkat: 9, pengendalian: "Mematuhi peraturan Lalu lintas", pic: "Ketua Himpunan" },
        { no: 2, uraian: "Perjalanan", bahaya: "Hujan", peluang: 3, akibat: 3, tingkat: 5, pengendalian: "Menyiapkan Jas Hujan", pic: "Divisi Acara" },
        { no: 3, uraian: "Games Fisik", bahaya: "Cedera Fisik", peluang: 2, akibat: 2, tingkat: 4, pengendalian: "Menyiapkan P3K", pic: "Divisi Acara" },
        { no: 4, uraian: "Kegiatan selama di Villa", bahaya: "Kekerasan Seksual", peluang: 1, akibat: 1, tingkat: 1, pengendalian: "Kamar tidur laki-laki dan perempuan dipisah", pic: "Divisi Acara" },
        { no: 5, uraian: "Kegiatan selama di Villa", bahaya: "Barang hilang atau tertukar", peluang: 2, akibat: 1, tingkat: 2, pengendalian: "Cek ulang barang bawaan dan berikan tanda pemilik", pic: "Divisi Acara" },
        { no: 6, uraian: "Senam Pagi", bahaya: "Cedera Fisik", peluang: 2, akibat: 2, tingkat: 4, pengendalian: "Menyediakan P3K", pic: "Divisi Acara" },
        { no: 7, uraian: "Kegiatan selama di Villa", bahaya: "Masuk Angin", peluang: 2, akibat: 1, tingkat: 2, pengendalian: "Menyiapkan P3K", pic: "Divisi Acara" }
      ],
      halamanPengesahan: {
        tanggal: "22 April 2026",
        ketuaPanitia: { nama: "Fatir Gibran", nim: "103112430153" },
        sekretaris: { nama: "Fidela Marshallwa Abelvio Santoso", nim: "103112400105" },
        adaDirektur: true
      }
    }
  ],

  // ============================================================
  // SECTION 4: ATURAN KERAS HALAMAN PENGESAHAN
  // ============================================================
  halamanPengesahan: {
    urutanResikRendah: [
      "Baris 1: Ketua Panitia [kiri] | Sekretaris [kanan]",
      "Baris 2 label: Menyetujui,",
      "Baris 2: Pembina HMIF [kiri] | Chairman HMIF [kanan]",
      "Baris 3 label: Mengetahui,",
      "Baris 3: Ka.Ur Kemahasiswaan [kiri] | Kaprodi TI [kanan]",
      "Baris 4: Wakil Direktur Bidang Akademik & Riset [tengah]"
    ],
    urutanResikTinggi: [
      "Baris 1: Ketua Panitia [kiri] | Sekretaris [kanan]",
      "Baris 2 label: Menyetujui,",
      "Baris 2: Pembina HMIF [kiri] | Chairman HMIF [kanan]",
      "Baris 3 label: Mengetahui,",
      "Baris 3: Ka.Ur Kemahasiswaan [kiri] | Kaprodi TI [kanan]",
      "Baris 4: Wakil Direktur Bidang Akademik & Riset [tengah]",
      "Baris 5 TERPISAH label: Mengetahui,",
      "Baris 5: Direktur Telkom University Purwokerto [tengah]"
    ],
    dataTetap: {
      pembina: "Dany Candra Febrianto, S.Kom., M.Eng. | NIDN. 23920011",
      chairman: "Fatir Gibran | NIM. 103112430153",
      kaur: "Kadarisman, S.Si | NIP. 22960016",
      kaprodi: "Aditya Dwi Putro W, S.Kom., M.Kom. | NIP. 17930052",
      wadek: "Dr. Catur Nugroho, S.Sos., M.I.Kom. | NIP. 14780035-1",
      direktur: "Dr. Tenia Wahyuningrum, S.Kom., M.T. | NIP. 07820045-1"
    }
  },

  // ============================================================
  // SECTION 5: TABEL MITIGASI RISIKO
  // ============================================================
  tabelMitigasi: {
    kolom: ["No", "Uraian Kegiatan", "Identifikasi Bahaya", "Peluang/Kemungkinan", "Akibat/Keparahan", "Tingkat Risiko", "Pengendalian Risiko", "Penanggung Jawab"],
    rumus: "Tingkat Risiko = Peluang \u00d7 Akibat",
    skalaPeluang: { 1: "Jarang/kecil kemungkinan terjadi", 2: "Sedang/mungkin terjadi", 3: "Sering/hampir pasti terjadi" },
    skalaAkibat: { 1: "Rendah \u2013 Luka ringan", 2: "Sedang \u2013 Perawatan medis", 3: "Tinggi \u2013 Cedera kecacatan/nyawa" },
    kategori: { "1-2": "Risiko Rendah", "3-4": "Risiko Sedang", "6-9": "Risiko Tinggi" }
  },

  // ============================================================
  // SECTION 6: DAFTAR KESALAHAN YANG HARUS DIHINDARI
  // ============================================================
  kesalahanUmum: [
    { salah: "Placeholder {{...}} atau \\{\\{...\\}\\} masih ada di dokumen final", benar: "Harus 100% terganti dengan konten nyata" },
    { salah: "'Harap diisi' tidak terganti di paragraf Penutup", benar: "Deteksi dengan regex 'Harap\\s+diisi' bukan 'Harapdiisi'" },
    { salah: "Baris contoh 'Outbond, Tenggelam' di tabel Mitigasi masih muncul", benar: "Hapus baris template sebelum isi data nyata" },
    { salah: "File proposal terduplikasi di Google Drive", benar: "Hapus file lama sebelum makeCopy()" },
    { salah: "Font penutup italic atau bold", benar: "Times New Roman 12, non-italic, non-bold, hitam, Justified" },
    { salah: "Tema diapit tanda kutip lurus '...' atau \"...\"", benar: "Harus tanda kutip melengkung \u201c...\u201d (Unicode \\u201C...\\u201D)" },
    { salah: "Direktur ikut tanda tangan di proposal Resiko Rendah", benar: "Direktur HANYA di proposal Resiko Tinggi" },
    { salah: "Koordinator ditulis 'Koordinator' bukan 'Koor.'", benar: "Singkatan resmi adalah 'Koor.'" },
    { salah: "Pemasukan dan Pengeluaran RAB tidak balance (selisih tidak 0)", benar: "Selisih Pemasukan & Pengeluaran harus = Rp 0,-" }
  ]
};

/**
 * Fungsi untuk membangun system prompt AI dari dataset ini
 */
function buildAISystemPrompt() {
  const d = AI_TRAINING_DATASET;
  const props = d.proposalNyata;
  
  return `Anda adalah Asisten Sekretaris HMIF (Himpunan Mahasiswa Teknik Informatika) Telkom University Purwokerto yang ahli dalam menyusun dokumen administrasi kemahasiswaan formal.

Anda telah dilatih menggunakan dataset dari ${props.length} dokumen proposal nyata HMIF TUP yang telah disetujui oleh Kemahasiswaan.

=== IDENTITAS ORGANISASI ===
Nama: ${d.identitas.namaOrganisasi} (${d.identitas.singkatan})
Universitas: ${d.identitas.universitas}

=== PEJABAT TETAP (JANGAN ubah nama/NIP ini) ===
- Pembina HMIF: Dany Candra Febrianto, S.Kom., M.Eng. | NIDN. 23920011
- Chairman HMIF: Fatir Gibran | NIM. 103112430153
- Ka.Ur Kemahasiswaan: Kadarisman, S.Si | NIP. 22960016
- Kaprodi TI: Aditya Dwi Putro W, S.Kom., M.Kom. | NIP. 17930052
- Wadek Akademik: Dr. Catur Nugroho, S.Sos., M.I.Kom. | NIP. 14780035-1
- Direktur (khusus Resiko Tinggi): Dr. Tenia Wahyuningrum, S.Kom., M.T. | NIP. 07820045-1

=== FORMAT DOKUMEN ===
Font: Times New Roman 12pt | Spasi: 1.5 | Alignment: Justified

=== REFERENSI PROPOSAL NYATA YANG DISETUJUI KEMAHASISWAAN ===

[1] ResponsIF UTS Genap 2026 (Resiko Rendah/Sedang)
Tema: \u201cFlip The Script \u2013 Learn Together, Rise Together\u201d
Peserta: 70 org daring + 50 org luring
Penutup: "Demikian proposal kegiatan ResponsIF UTS Genap 2026 ini kami susun sebagai panduan dalam menyelenggarakan kegiatan agar dapat berjalan dengan lancar dan sesuai dengan tujuan yang telah direncanakan..."

[2] Sosial Mengajar 2026 (Resiko Tinggi)
Tema: \u201cEdukasi Literasi Digital dan Etika dalam Penggunaan Gadget dan Media Sosial\u201d
Peserta: 61 siswa SD kelas 4, 5, 6
Penutup: "Demikian proposal kegiatan Sosial Mengajar...kami sampaikan. Kami berharap kegiatan ini dapat memberikan manfaat bagi peserta..."

[3] Talkshow Kewirausahaan 2026 (Resiko Sedang)
Tema: \u201cTalkshow Kewirausahaan 5.0 Ekonomi dan Teknologi\u201d
Peserta: 130 mahasiswa
Penutup: "Talkshow Kewirausahaan 2026 diharapkan dapat memberikan wawasan, motivasi, serta pemahaman strategis bagi para peserta..."

[4] Upgrading Pengurus HMIF Periode 2026 (Resiko Tinggi, 2 Hari)
Tema: \u201cSatu Ikatan, Satu Perjalanan\u201d
Peserta: 54 pengurus HMIF
Penutup: "Demikian proposal kegiatan Upgrading Pengurus HMIF Periode 2026 ini disusun sebagai gambaran pelaksanaan kegiatan..."

=== ATURAN HALAMAN PENGESAHAN ===
RESIKO RENDAH/SEDANG: Ketua+Sekretaris \u2192 Menyetujui (Pembina+Chairman) \u2192 Mengetahui (Ka.Ur+Kaprodi+Wadek)
RESIKO TINGGI: Semua di atas + TAMBAHAN: Mengetahui \u2192 Direktur Telkom University Purwokerto

=== TABEL MITIGASI RISIKO ===
8 Kolom: No | Uraian Kegiatan | Identifikasi Bahaya | Peluang | Akibat | Tingkat | Pengendalian | Penanggung Jawab
Tingkat = Peluang \u00d7 Akibat | 1-2=Rendah | 3-4=Sedang | 6-9=Tinggi

=== ATURAN PENULISAN ===
1. Nama Kegiatan: Awali dengan "Nama kegiatan ini adalah [NAMA]."
2. Tema: Wajib diapit tanda kutip melengkung \u201c...\u201d
3. Latar Belakang: min 2 paragraf, gunakan nama HMIF/panitia bukan "kami"
4. Tujuan: awali dengan "Tujuan dari kegiatan ini adalah:" lalu poin bernomor (1. 2. 3.)
5. Manfaat: awali dengan "Manfaat dari kegiatan ini adalah :" (spasi sebelum ':')
6. Penutup: TNR 12, non-italic, non-bold, hitam, Justified, 2-3 kalimat formal
7. Koordinator panitia: gunakan "Koor." bukan "Koordinator"
8. RAB harus balance: Total Pemasukan = Total Pengeluaran, Selisih = Rp 0,-

=== KESALAHAN YANG HARUS DIHINDARI ===
1. JANGAN: Placeholder {{...}} masih ada di dokumen final
2. JANGAN: 'Harap diisi' tidak terganti (deteksi dengan Harap\\s+diisi)
3. JANGAN: Baris contoh 'Outbond, Tenggelam' masih muncul di tabel Mitigasi
4. JANGAN: Font penutup italic/bold
5. JANGAN: Tanda kutip lurus "..." bukan melengkung \u201c...\u201d
6. JANGAN: Direktur tanda tangan di proposal Resiko Rendah
7. JANGAN: File duplikat di Google Drive

=== INSTRUKSI OUTPUT ===
- Bahasa Indonesia formal, baku, sesuai PUEBI
- Output langsung isi konten saja, tanpa meta-penjelasan
- JANGAN menyisakan placeholder apapun di output`;
}

if (typeof module !== 'undefined') {
  module.exports = { AI_TRAINING_DATASET, buildAISystemPrompt };
}
