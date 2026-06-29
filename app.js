/**
 * WEB_SECRETARY HMIF - Core Logic with Google Drive Integration
 * Project Antigravity
 */

// Hardcoded Google Apps Script Web App URL from your deployment
const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbwMigDJ9a5NYMjnax7CRUPmVzMB2dTWW9QuwP9G44KEwB9Jynv1qQA4TO7oZ_3TFK9Q/exec";

// Fallback Database pre-parsed from surat.xlsx to ensure the app works in case Google Drive fails
const defaultActivities = {
    "KULIAH UMUM": { abbrev: "KU", max_sequence: 12 },
    "HMIF": { abbrev: "HMIF", max_sequence: 8 },
    "DONOR DARAH": { abbrev: "DD", max_sequence: 1 },
    "STUDI BANDING UGM": { abbrev: "SB", max_sequence: 1 },
    "PENGABDIAN MASYARAKAT": { abbrev: "PM", max_sequence: 1 },
    "WPI 2026": { abbrev: "WPI", max_sequence: 2 },
    "WORKSHOP INTERNAL OBS": { abbrev: "WOBS", max_sequence: 3 },
    "SERTIJAB": { abbrev: "SERTIJAB", max_sequence: 6 },
    "AKROBAT": { abbrev: "AKROBAT", max_sequence: 4 },
    "UPGRADING": { abbrev: "UPGRADING", max_sequence: 3 },
    "RESPONSIF UTS GENAP": { abbrev: "RUTSGENAP", max_sequence: 6 },
    "RESPONSIF UAS GENAP": { abbrev: "RUASGENAP", max_sequence: 3 },
    "PODCAST INFORMATICS": { abbrev: "PODCAST", max_sequence: 5 },
    "SOSIAL BERBAGI": { abbrev: "SOSBER", max_sequence: 4 },
    "WEBINAR": { abbrev: "WEBINAR", max_sequence: 5 },
    "SOSIAL MENGAJAR": { abbrev: "SOSMENG", max_sequence: 6 },
    "FIT & FUN": { abbrev: "FITNFUN", max_sequence: 3 },
    "HMIF KREATIF": { abbrev: "HMKREATIF", max_sequence: 5 },
    "SHORT MOVIE": { abbrev: "SM", max_sequence: 3 },
    "TALKSHOW KWU": { abbrev: "TALKSHOWKWU", max_sequence: 13 },
    "LDK": { abbrev: "LDK", max_sequence: 5 },
    "CERDAS CERMAT": { abbrev: "LCC", max_sequence: 4 },
    "NGAFIRMATICS": { abbrev: "NGAFIRMATICS", max_sequence: 6 }
};

// Fallback Committee Database pre-hardcoded based on HMIF Periode 2026 data
const defaultCommittee = [
    { name: "Fatir Gibran", nim: "103112430153", position: "Chairman" },
    { name: "Aedil Riski Ansyah", nim: "103112400101", position: "Vice Chairman" },
    { name: "Fidela Marshallwa Abelvio Santoso", nim: "103112400105", position: "General Secretary" },
    { name: "Salsadilla Hanny Azizah", nim: "109082500014", position: "Associate Secretary" },
    { name: "Alya Maghfira Pratiwi", nim: "103112400240", position: "General Treasurer" },
    { name: "Sarah Maulidya Natasyah", nim: "109082530023", position: "Associate Treasurer" },
    { name: "Chilya Fadhilatin Nisa", nim: "103112430010", position: "Core of Human Capital & Character Building" },
    { name: "Tio Armani", nim: "103112430225", position: "Staff of Human Capital & Character Building" },
    { name: "Diva Zahrah Nabila", nim: "109082500112", position: "Staff of Human Capital & Character Building" },
    { name: "Barret Fairuz Azizah", nim: "109082530034", position: "Staff of Human Capital & Character Building" },
    { name: "Amanda Septiana Salsabila", nim: "109082500145", position: "Staff of Human Capital & Character Building" },
    { name: "Adhara Faliya Utanti", nim: "109082500033", position: "Staff of Human Capital & Character Building" },
    { name: "Annisa Berliana Nindya Syah Putri", nim: "109082500166", position: "Staff of Human Capital & Character Building" },
    { name: "Nehemia Pandu Indragiri", nim: "109082500019", position: "Staff of Human Capital & Character Building" },
    { name: "Ridha Akifah", nim: "103112400132", position: "Core of Talent Development & Innovation" },
    { name: "Marzhendo Galang Saputra", nim: "103112400102", position: "Staff of Talent Development & Innovation" },
    { name: "Rizky Al Kahfi", nim: "103112400104", position: "Staff of Talent Development & Innovation" },
    { name: "Rista Sania Putri", nim: "109082530026", position: "Staff of Talent Development & Innovation" },
    { name: "Nawwar Ulayya Frodine", nim: "109082500153", position: "Staff of Talent Development & Innovation" },
    { name: "Ahmad Luthfi Habibie", nim: "109082500190", position: "Staff of Talent Development & Innovation" },
    { name: "Raysa Rahma Irahim", nim: "109082500167", position: "Staff of Talent Development & Innovation" },
    { name: "Brilyant Keyza Hidayat", nim: "109082500106", position: "Staff of Talent Development & Innovation" },
    { name: "Muhammad Fachri Auravyano Saka", nim: "103112430180", position: "Core of Humanity Impact & Development" },
    { name: "Jahraa Syarifah Naqiyyah Salsabila", nim: "109082500099", position: "Staff of Humanity Impact & Development" },
    { name: "Shafira Shifa Azahra", nim: "109082500125", position: "Staff of Humanity Impact & Development" },
    { name: "Muhammad Farrel Argiyanto", nim: "109082500018", position: "Staff of Humanity Impact & Development" },
    { name: "Mukhammad Ari Trianirto", nim: "109082530027", position: "Staff of Humanity Impact & Development" },
    { name: "Assyifa Zahra", nim: "109082500196", position: "Staff of Humanity Impact & Development" },
    { name: "Rafi Oktarino Ramadhan", nim: "109082500217", position: "Staff of Humanity Impact & Development" },
    { name: "Hiliyati Aulia", nim: "109082500157", position: "Staff of Humanity Impact & Development" },
    { name: "Syahla Kheisya Mayastria", nim: "103112430018", position: "Core of Finance & Enterprise Development" },
    { name: "Herdian Abdillah Purnomo", nim: "103112430048", position: "Staff of Finance & Enterprise Development" },
    { name: "Nabella Rahmatus Sania", nim: "103112430002", position: "Staff of Finance & Enterprise Development" },
    { name: "Amelia Candradewi", nim: "103112400140", position: "Staff of Finance & Enterprise Development" },
    { name: "Shasa Olivia Rose", nim: "109082500207", position: "Staff of Finance & Enterprise Development" },
    { name: "Aqilah Izani", nim: "109082530006", position: "Staff of Finance & Enterprise Development" },
    { name: "Rafi Azis Faozan", nim: "109082500069", position: "Staff of Finance & Enterprise Development" },
    { name: "Dafa Awal Wahyu Pambudi", nim: "103112400275", position: "Core of Creative Content & Outreach" },
    { name: "Chadafya Putra Zulfikar", nim: "103112430173", position: "Staff of Creative Content & Outreach" },
    { name: "Muh. Haidar Az Zacky", nim: "109082530035", position: "Staff of Creative Content & Outreach" },
    { name: "Manggala Patra Raditya", nim: "109082500179", position: "Staff of Creative Content & Outreach" },
    { name: "Pamela Sandra Amelia Br Ginting", nim: "103112430152", position: "Staff of Creative Content & Outreach" },
    { name: "Mahardhika Putra Azlian", nim: "109082500025", position: "Staff of Creative Content & Outreach" },
    { name: "Muhammad Zacky Permana", nim: "103112430228", position: "Staff of Creative Content & Outreach" },
    { name: "Laluna Afril Diasyifa", nim: "109082500009", position: "Staff of Creative Content & Outreach" },
    { name: "Aqilla Rachel Rabbani", nim: "109082500199", position: "Staff of Creative Content & Outreach" },
    { name: "Moh. Chandra Wardana", nim: "109082530025", position: "Staff of Creative Content & Outreach" },
    { name: "Damanik, Yohanes Geovan Ondova", nim: "103112400022", position: "Core of External Relations & Advocacy" },
    { name: "Elfan Endriyanto", nim: "103112430040", position: "Staff of External Relations & Advocacy" },
    { name: "Ais Nurhanifah", nim: "109082500162", position: "Staff of External Relations & Advocacy" },
    { name: "Ilham Sulistyo Rizqi", nim: "109082500121", position: "Staff of External Relations & Advocacy" },
    { name: "Angelina Loria Timba", nim: "109082500146", position: "Staff of External Relations & Advocacy" },
    { name: "Rayhan Ahza Widayamukti", nim: "109082500210", position: "Staff of External Relations & Advocacy" },
    { name: "Rakhmat Pratama", nim: "109082530037", position: "Staff of External Relations & Advocacy" }
];

// State Variables
let activitiesDb = {};
let committeeDb = [...defaultCommittee];

// DOM Elements - Navigation Tabs
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// DOM Elements - Tab 1: Auto-Numbering
const docTypeSelect = document.getElementById("document-type");
const activitySelect = document.getElementById("activity-select");
const newActivityContainer = document.getElementById("new-activity-container");
const newActivityNameInput = document.getElementById("new-activity-name");
const abbrevInput = document.getElementById("activity-abbreviation");
const seqInput = document.getElementById("sequence-number");
const letterSubjectInput = document.getElementById("letter-subject");
const monthRomanVal = document.getElementById("current-month-roman");
const yearVal = document.getElementById("current-year");
const btnGenerate = document.getElementById("btn-generate");
const resultCard = document.getElementById("result-card");
const generatedNumDisplay = document.getElementById("generated-number");
const btnCopy = document.getElementById("btn-copy");
const btnLogDrive = document.getElementById("btn-log-drive");
const copyToast = document.getElementById("copy-toast");
const dataStatusBadge = document.getElementById("data-status-badge");

// DOM Elements - Tab 2: Document Generator
const genDocTypeSelect = document.getElementById("gen-doc-type");
const genRiskTypeSelect = document.getElementById("gen-risk-type");
const genRiskContainer = document.getElementById("gen-risk-container");
const genActivitySelect = document.getElementById("gen-activity-select");
const genNewActivityContainer = document.getElementById("gen-new-activity-container");
const genNewActivityName = document.getElementById("gen-new-activity-name");
const genDateInput = document.getElementById("gen-date");
const genTimeInput = document.getElementById("gen-time");
const genApprovalDateInput = document.getElementById("gen-approval-date");
const genPlaceInput = document.getElementById("gen-place");
const genTemaInput = document.getElementById("gen-tema");
const genChairInput = document.getElementById("gen-chair");
const genNimInput = document.getElementById("gen-nim");
const genCustomChairContainer = document.getElementById("gen-custom-chair-container");
const genCustomChairName = document.getElementById("gen-custom-chair-name");
const genDeptInput = document.getElementById("gen-dept");
const genDescInput = document.getElementById("gen-desc");
const genTujuanInput = document.getElementById("gen-tujuan");
const genManfaatInput = document.getElementById("gen-manfaat");
const genPesertaInput = document.getElementById("gen-peserta");
const genSecretarySelect = document.getElementById("gen-secretary");
const genSecretaryNimInput = document.getElementById("gen-secretary-nim");
const genPenutupInput = document.getElementById("gen-penutup");
const genBudgetSection = document.getElementById("gen-budget-section");
const btnAddBudgetRow = document.getElementById("btn-add-budget-row");
const budgetInputTbody = document.getElementById("budget-input-tbody");
const genTotalBudgetDisplay = document.getElementById("gen-total-budget-display");
const btnGenerateDoc = document.getElementById("btn-generate-doc");
const docResultCard = document.getElementById("doc-result-card");
const generatedDocTitle = document.getElementById("generated-doc-title");
const btnOpenDoc = document.getElementById("btn-open-doc");
const docStatusBadge = document.getElementById("doc-status-badge");

// Sync AI configuration from server env variables
async function tryFetchAIConfig() {
    try {
        const res = await fetch("/api/config");
        if (res.ok) {
            const data = await res.json();
            if (data.model) localStorage.setItem("openrouter_ai_model", data.model);
            if (data.rules) localStorage.setItem("openrouter_ai_rules", data.rules);
            if (data.geminiKey) localStorage.setItem("gemini_api_key", data.geminiKey);
            console.log("AI Config synced from server envs");
        }
    } catch (err) {
        console.warn("Failed to fetch AI config from server:", err);
    }
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    // Sync config from server envs
    tryFetchAIConfig();

    initTabNavigation();
    initDates();
    tryFetchDatabase();
    setupEventListeners();
    setupBudgetTable();
});

// Setup Tab Navigation Handler
function initTabNavigation() {
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active status
            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => {
                c.classList.add("hidden");
                c.classList.remove("active-content");
            });
            
            // Set current active
            btn.classList.add("active");
            const targetTabId = btn.getAttribute("data-tab");
            const targetTab = document.getElementById(targetTabId);
            targetTab.classList.remove("hidden");
            targetTab.classList.add("active-content");
        });
    });
}

// Calculate Roman numeral for current month and get year
function initDates() {
    const today = new Date();
    const monthIndex = today.getMonth(); // 0-11
    const year = today.getFullYear();
    
    const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    
    monthRomanVal.textContent = romanMonths[monthIndex];
    yearVal.textContent = year.toString();
}

// Event Listeners setup
function setupEventListeners() {
    // TAB 1 Event Listeners
    activitySelect.addEventListener("change", handleActivityChange);
    newActivityNameInput.addEventListener("input", () => {
        const text = newActivityNameInput.value;
        abbrevInput.value = generateAbbreviation(text);
    });
    btnGenerate.addEventListener("click", generateLetterNumber);
    btnCopy.addEventListener("click", copyToClipboard);
    btnLogDrive.addEventListener("click", logLetterToGoogleDrive);
    const btnShowNew = document.getElementById("btn-show-new-activity");
    if (btnShowNew) btnShowNew.addEventListener("click", () => toggleNewActivity("numbering"));
    const btnSaveNewActivity = document.getElementById("btn-save-new-activity");
    if (btnSaveNewActivity) btnSaveNewActivity.addEventListener("click", saveNewActivity);

    // TAB 2 Event Listeners
    genDocTypeSelect.addEventListener("change", handleDocTypeChange);
    genRiskTypeSelect.addEventListener("change", toggleDosenContainer);
    genActivitySelect.addEventListener("change", handleGenActivityChange);
    genChairInput.addEventListener("change", handleChairChange);
    genSecretarySelect.addEventListener("change", handleSecretaryChange);
    document.getElementById("gen-sub-chair").addEventListener("change", handleSubChairChange);
    document.getElementById("gen-treasurer-1").addEventListener("change", handleTreasurer1Change);
    document.getElementById("gen-treasurer-2").addEventListener("change", handleTreasurer2Change);
    btnAddBudgetRow.addEventListener("click", () => addBudgetRow("", 1, 0));
    btnGenerateDoc.addEventListener("click", generateDocumentOnDrive);
    setupAIButtons();
    setupAIAutofix();
    setupAutosaveListeners();
    setupCollapsiblePanels();
    // Restore Drive training status dari localStorage
    (function restoreDriveTrainingStatus() {
        const count = parseInt(localStorage.getItem("drive_training_doc_count") || "0");
        const lastScan = localStorage.getItem("drive_training_last_scan") || "";
        const countWrapper = document.getElementById("drive-training-count-wrapper");
        const idleEl = document.getElementById("drive-training-idle");
        const countEl = document.getElementById("drive-training-count");
        const lastEl = document.getElementById("drive-training-last");
        if (count > 0 && countWrapper) {
            countWrapper.style.display = "inline";
            if (idleEl) idleEl.style.display = "none";
            if (countEl) countEl.textContent = count;
            if (lastEl) lastEl.textContent = lastScan ? " · Terakhir: " + lastScan : "";
        }
    })();
    const btnShowGen = document.getElementById("btn-show-gen-activity");
    if (btnShowGen) btnShowGen.addEventListener("click", () => toggleNewActivity("generator"));
    const btnSaveGenActivity = document.getElementById("btn-save-gen-activity");
    if (btnSaveGenActivity) btnSaveGenActivity.addEventListener("click", saveGenNewActivity);
    setupAnnexFields();
    setupTreasurerTab();

    // AI Settings Modal event listeners
    const btnOpenSettings = document.getElementById("btn-open-settings");
    const btnOpenSettingsFloating = document.getElementById("btn-open-settings-floating");
    const btnCloseSettings = document.getElementById("btn-close-settings");
    const btnSaveSettings = document.getElementById("btn-save-settings");
    const settingsModal = document.getElementById("settings-modal");
    
    const openSettingsFunc = () => {
        // Load values
        document.getElementById("settings-openrouter-key").value = localStorage.getItem("openrouter_api_key") || "";
        document.getElementById("settings-ai-model").value = localStorage.getItem("openrouter_ai_model") || "anthropic/claude-3.5-sonnet";
        
        const defaultRules = `1. LEMBAR KENDALI ADMINISTRASI: Wajib ada di Halaman 1. Harus memuat Tanggal, Nomor, Perihal, Unit Organisasi (Himpunan Mahasiswa Teknik Informatika), DITETAPKAN oleh Wakil Direktur Bidang Akademik & Riset (Dr. Catur Nugroho, S.Sos., M.I.Kom.), DIPERIKSA oleh Ka.Ur Kemahasiswaan (Kadarisman, S.Si), Kaprodi (Aditya Dwi Putro W), Pembina HMIF (Dany Candra Febrianto), Chairman HMIF (Fatir Gibran), dan Ketua Panitia, serta DISUSUN OLEH Sekretaris.
2. TYPOGRAPHY & HEADING: Hapus semua angka Romawi pada sub-judul (gunakan Bold saja). Teks deskripsi/paragraf wajib Justify, sedangkan Cover, Judul Pengesahan, dan Lampiran wajib Center.
3. PEMBERSIHAN DATA: Bersihkan redundansi teks (seperti "Closingan.Closingan.") dan perbaiki NIM duplikat (seperti 12 digit tertempel ganda) menjadi format 12 digit tunggal yang valid. Auto-generate Tema Kegiatan jika kosong.
4. FORMAT TABEL:
   - Tabel Mitigasi wajib 8 kolom: No | Uraian Kegiatan | Identifikasi Bahaya | Peluang/Kemungkinan | Akibat/Keparahan | Tingkat Risiko | Pengendalian Risiko | Penanggung Jawab.
   - Tabel Anggaran wajib dipisah PEMASUKAN dan PENGELUARAN dengan Selisih = 0 (seimbang).
   - Tabel Capaian Pelaksanaan Program (CPP): Berikan tanda centang (✓) hanya pada 3-5 target yang paling relevan.
5. HALAMAN PENGESAHAN: Terletak setelah Penutup. Blok tanda tangan Kiri-Kanan: Baris 1 (Ketua & Sekretaris), Baris 2 (Pembina & Chairman), Baris 3 (Ka.Ur Kemahasiswaan & Kaprodi), Baris 4 (Wakil Direktur di Tengah Bawah). Wajib mencantumkan nama lengkap, gelar, dan NIP/NIM yang valid.
6. LAMPIRAN DOKUMEN: Lampiran I (Susunan Panitia), Lampiran II (Rancangan Anggaran Pemasukan/Pengeluaran), Lampiran III (Susunan Acara dengan kolom: No | Waktu | Kegiatan | PJ | Keterangan).`;
        
        document.getElementById("settings-ai-rules").value = localStorage.getItem("openrouter_ai_rules") || defaultRules;
        settingsModal.classList.remove("hidden");
    };

    if (btnOpenSettings) btnOpenSettings.addEventListener("click", openSettingsFunc);
    if (btnOpenSettingsFloating) btnOpenSettingsFloating.addEventListener("click", openSettingsFunc);
    
    if (btnCloseSettings) btnCloseSettings.addEventListener("click", () => {
        settingsModal.classList.add("hidden");
    });
    
    if (btnSaveSettings) btnSaveSettings.addEventListener("click", () => {
        const key = document.getElementById("settings-openrouter-key").value.trim();
        const model = document.getElementById("settings-ai-model").value;
        const rules = document.getElementById("settings-ai-rules").value.trim();
        
        localStorage.setItem("openrouter_api_key", key);
        localStorage.setItem("openrouter_ai_model", model);
        localStorage.setItem("openrouter_ai_rules", rules);
        
        settingsModal.classList.add("hidden");
        alert("Konfigurasi AI Agent OpenRouter berhasil disimpan!");
    });
}

// Fetch database dynamically from Google Drive
function tryFetchDatabase() {
    const treasurerStatusBadge = document.getElementById("treasurer-status-badge");
    
    dataStatusBadge.textContent = "Menghubungkan ke Drive...";
    docStatusBadge.textContent = "Menghubungkan ke Drive...";
    if (treasurerStatusBadge) treasurerStatusBadge.textContent = "Menghubungkan ke Drive...";

    fetch(googleAppsScriptUrl)
        .then(res => {
            if (!res.ok) throw new Error("Google Sheets Web App returned status " + res.status);
            return res.json();
        })
        .then(data => {
            activitiesDb = data.activities || data;
            committeeDb = data.committee || [];
            
            // Set dynamic badges to connected state
            dataStatusBadge.textContent = "Google Drive Terhubung";
            dataStatusBadge.style.backgroundColor = "hsl(142, 69%, 95%)";
            dataStatusBadge.style.color = "var(--success-color)";
            dataStatusBadge.style.borderColor = "hsl(142, 45%, 85%)";
            
            docStatusBadge.textContent = "Google Drive Terhubung";
            docStatusBadge.style.backgroundColor = "hsl(142, 69%, 95%)";
            docStatusBadge.style.color = "var(--success-color)";
            docStatusBadge.style.borderColor = "hsl(142, 45%, 85%)";

            if (treasurerStatusBadge) {
                treasurerStatusBadge.textContent = "Google Drive Terhubung";
                treasurerStatusBadge.style.backgroundColor = "hsl(142, 69%, 95%)";
                treasurerStatusBadge.style.color = "var(--success-color)";
                treasurerStatusBadge.style.borderColor = "hsl(142, 45%, 85%)";
            }
            
            populateDropdowns();
        })
        .catch(err => {
            console.warn("Failed to fetch database from Google Apps Script. Fallback used. Error:", err);
            activitiesDb = { ...defaultActivities };
            committeeDb = [...defaultCommittee];
            
            dataStatusBadge.textContent = "Database Lokal (Fallback)";
            dataStatusBadge.style.backgroundColor = "var(--primary-light)";
            dataStatusBadge.style.color = "var(--primary-color)";
            dataStatusBadge.style.borderColor = "hsl(150, 45%, 88%)";
            
            docStatusBadge.textContent = "Database Lokal (Fallback)";
            docStatusBadge.style.backgroundColor = "var(--primary-light)";
            docStatusBadge.style.color = "var(--primary-color)";
            docStatusBadge.style.borderColor = "hsl(150, 45%, 88%)";

            if (treasurerStatusBadge) {
                treasurerStatusBadge.textContent = "Database Lokal (Fallback)";
                treasurerStatusBadge.style.backgroundColor = "var(--primary-light)";
                treasurerStatusBadge.style.color = "var(--primary-color)";
                treasurerStatusBadge.style.borderColor = "hsl(150, 45%, 88%)";
            }
            
            populateDropdowns();
        });
}

// Populate both activity selects and committee dropdown
function populateDropdowns() {
    populateSelect(activitySelect);
    populateSelect(genActivitySelect);
    populateCommitteeDropdown();
    populateTreasurerDropdowns();
    
    // Load autosaved form state once dropdowns are populated
    loadFormState();
}

// Populate Committee dropdown from Google Sheets database
function populateCommitteeDropdown() {
    const sortedMembers = committeeDb.sort((a, b) => a.name.localeCompare(b.name));
    populateChairSelect(sortedMembers);
    handleChairChange();
    handleSubChairChange();
    handleTreasurer1Change();
    handleTreasurer2Change();
}

function populateChairSelect(members) {
    const previousChair = genChairInput.value;
    const previousSec = genSecretarySelect.value;
    const previousSub = document.getElementById("gen-sub-chair").value;
    const previousTres1 = document.getElementById("gen-treasurer-1").value;
    const previousTres2 = document.getElementById("gen-treasurer-2").value;

    genChairInput.innerHTML = '<option value="" disabled selected>-- Pilih Ketua Pelaksana --</option>';
    genSecretarySelect.innerHTML = '<option value="">-- Pilih Sekretaris (opsional) --</option>';
    
    const subSelect = document.getElementById("gen-sub-chair");
    const tres1Select = document.getElementById("gen-treasurer-1");
    const tres2Select = document.getElementById("gen-treasurer-2");
    
    subSelect.innerHTML = '<option value="">-- Pilih Wakil (opsional) --</option>';
    tres1Select.innerHTML = '<option value="">-- Pilih Bendahara I (opsional) --</option>';
    tres2Select.innerHTML = '<option value="">-- Pilih Bendahara II (opsional) --</option>';
    
    members.forEach(m => {
        const optChair = document.createElement("option");
        optChair.value = m.name;
        optChair.dataset.nim = m.nim;
        optChair.dataset.dept = getDepartmentName(m.position);
        optChair.textContent = m.name;
        if (m.name === previousChair) optChair.selected = true;
        genChairInput.appendChild(optChair);

        const optSec = document.createElement("option");
        optSec.value = m.name;
        optSec.dataset.nim = m.nim;
        optSec.textContent = m.name;
        if (m.name === previousSec) optSec.selected = true;
        genSecretarySelect.appendChild(optSec);

        const optSub = document.createElement("option");
        optSub.value = m.name;
        optSub.dataset.nim = m.nim;
        optSub.textContent = m.name;
        if (m.name === previousSub) optSub.selected = true;
        subSelect.appendChild(optSub);

        const optTres1 = document.createElement("option");
        optTres1.value = m.name;
        optTres1.dataset.nim = m.nim;
        optTres1.textContent = m.name;
        if (m.name === previousTres1) optTres1.selected = true;
        tres1Select.appendChild(optTres1);

        const optTres2 = document.createElement("option");
        optTres2.value = m.name;
        optTres2.dataset.nim = m.nim;
        optTres2.textContent = m.name;
        if (m.name === previousTres2) optTres2.selected = true;
        tres2Select.appendChild(optTres2);
    });

    const customOpt = document.createElement("option");
    customOpt.value = "__CUSTOM__";
    customOpt.textContent = "+ Input Manual";
    if (previousChair === "__CUSTOM__") customOpt.selected = true;
    genChairInput.appendChild(customOpt);
}

// Handler for when Ketua Pelaksana is selected
function handleChairChange() {
    const val = genChairInput.value;
    const activityVal = genActivitySelect.value;
    
    // Determine department from activity first, then fallback to chairman's position
    let suggestedDept = "";
    if (activityVal && activityVal !== "__NEW__" && activityDeptMap[activityVal]) {
        suggestedDept = activityDeptMap[activityVal];
    }
    
    if (val === "__CUSTOM__") {
        genCustomChairContainer.classList.remove("hidden-transition");
        genCustomChairContainer.classList.add("show-transition");
        genCustomChairName.required = true;
        
        genNimInput.value = "";
        genNimInput.readOnly = false;
        genNimInput.placeholder = "Masukkan NIM secara manual";
        
        genDeptInput.value = suggestedDept;
        genDeptInput.readOnly = false;
        genDeptInput.placeholder = "Masukkan nama departemen secara manual";
    } else if (val !== "__CUSTOM__" && val !== "") {
        genCustomChairContainer.classList.add("hidden-transition");
        genCustomChairContainer.classList.remove("show-transition");
        genCustomChairName.required = false;
        
        const selected = genChairInput.options[genChairInput.selectedIndex];
        genNimInput.value = selected.dataset.nim || "";
        genNimInput.readOnly = true;
        
        // Priority: activity map > chairman position dept
        genDeptInput.value = suggestedDept || selected.dataset.dept || "";
        genDeptInput.readOnly = true;
    } else {
        genCustomChairContainer.classList.add("hidden-transition");
        genCustomChairContainer.classList.remove("show-transition");
        genCustomChairName.required = false;
        
        genNimInput.value = "";
        genNimInput.readOnly = true;
        genNimInput.placeholder = "NIM otomatis terisi";
        
        genDeptInput.value = suggestedDept;
        genDeptInput.readOnly = true;
        genDeptInput.placeholder = "Departemen otomatis terisi";
    }
}

// TAB 2: Secretary selection handler
function handleSecretaryChange() {
    const val = genSecretarySelect.value;
    if (val && val !== "") {
        const selected = genSecretarySelect.options[genSecretarySelect.selectedIndex];
        genSecretaryNimInput.value = selected.dataset.nim || "";
    } else {
        genSecretaryNimInput.value = "";
    }
}

function handleSubChairChange() {
    const el = document.getElementById("gen-sub-chair");
    const val = el.value;
    const nimInput = document.getElementById("gen-sub-chair-nim");
    if (val) {
        nimInput.value = el.options[el.selectedIndex].dataset.nim || "";
    } else {
        nimInput.value = "";
    }
}

function handleTreasurer1Change() {
    const el = document.getElementById("gen-treasurer-1");
    const val = el.value;
    const nimInput = document.getElementById("gen-treasurer-1-nim");
    if (val) {
        nimInput.value = el.options[el.selectedIndex].dataset.nim || "";
    } else {
        nimInput.value = "";
    }
}

function handleTreasurer2Change() {
    const el = document.getElementById("gen-treasurer-2");
    const val = el.value;
    const nimInput = document.getElementById("gen-treasurer-2-nim");
    if (val) {
        nimInput.value = el.options[el.selectedIndex].dataset.nim || "";
    } else {
        nimInput.value = "";
    }
}

// Activity-to-Department mapping aligned 100% with the real Google Drive folder structure
const activityDeptMap = {
    "KULIAH UMUM": "KEGIATAN LAINNYA",
    "HMIF": "KEGIATAN LAINNYA",
    "DONOR DARAH": "Humanity Impact & Development",
    "STUDI BANDING UGM": "External Relations & Advocacy",
    "PENGABDIAN MASYARAKAT": "Humanity Impact & Development",
    "WPI 2026": "Human Capital & Character Building",
    "WORKSHOP INTERNAL OBS": "Human Capital & Character Building",
    "SERTIJAB": "KEGIATAN LAINNYA",
    "AKROBAT": "External Relations & Advocacy",
    "UPGRADING": "KEGIATAN LAINNYA",
    "RESPONSIF UTS GENAP": "Human Capital & Character Building",
    "RESPONSIF UAS GENAP": "Human Capital & Character Building",
    "PODCAST INFORMATICS": "Talent Development & Innovation",
    "SOSIAL BERBAGI": "Humanity Impact & Development",
    "WEBINAR": "Human Capital & Character Building",
    "SOSIAL MENGAJAR": "Humanity Impact & Development",
    "FIT & FUN": "Talent Development & Innovation",
    "HMIF KREATIF": "Creative Content & Outreach",
    "SHORT MOVIE": "Creative Content & Outreach",
    "TALKSHOW KWU": "Finance & Enterprise Development",
    "LDK": "KEGIATAN LAINNYA",
    "CERDAS CERMAT": "Talent Development & Innovation",
    "NGAFIRMATICS": "Talent Development & Innovation"
};

// Map position title to Department name
function getDepartmentName(position) {
    if (!position) return "";
    const pos = position.toLowerCase();
    
    // Chairman, Vice Chairman -> KEGIATAN LAINNYA (rules baru)
    if (pos.includes("vice chairman") || (pos.includes("chairman") && !pos.includes("vice"))) {
        return "KEGIATAN LAINNYA";
    } else if (pos.includes("secretary") || pos.includes("treasure")) {
        return "Executive Board (EB)";
    } else if (pos.includes("human capital")) {
        return "Human Capital & Character Building";
    } else if (pos.includes("talent development")) {
        return "Talent Development & Innovation";
    } else if (pos.includes("humanity impact")) {
        return "Humanity Impact & Development";
    } else if (pos.includes("finance & enterprise")) {
        return "Finance & Enterprise Development";
    } else if (pos.includes("creative content")) {
        return "Creative Content & Outreach";
    } else if (pos.includes("external relation")) {
        return "External Relations & Advocacy";
    }
    return position;
}

function populateSelect(selectElement) {
    const previousSelection = selectElement.value;
    selectElement.innerHTML = "";
    
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = !previousSelection;
    placeholder.textContent = "-- Pilih Kegiatan --";
    selectElement.appendChild(placeholder);
    
    // Sort and insert activities
    Object.keys(activitiesDb).sort().forEach(actName => {
        const option = document.createElement("option");
        option.value = actName;
        option.textContent = actName;
        if (actName === previousSelection) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
    
    const newOption = document.createElement("option");
    newOption.value = "__NEW__";
    newOption.textContent = "+ Tambah Kegiatan Baru";
    if (previousSelection === "__NEW__") {
        newOption.selected = true;
    }
    selectElement.appendChild(newOption);
}

// TAB 1 Handler: Activity selection change
function handleActivityChange() {
    const val = activitySelect.value;
    
    if (val === "__NEW__") {
        newActivityContainer.classList.remove("hidden-transition");
        newActivityContainer.classList.add("show-transition");
        newActivityNameInput.required = true;
        
        newActivityNameInput.value = "";
        abbrevInput.value = "";
        seqInput.value = "1";
    } else if (val) {
        newActivityContainer.classList.add("hidden-transition");
        newActivityContainer.classList.remove("show-transition");
        newActivityNameInput.required = false;
        
        const act = activitiesDb[val];
        abbrevInput.value = act.abbrev || "";
        
        const nextSeq = (act.max_sequence || 0) + 1;
        seqInput.value = nextSeq;
    } else {
        newActivityContainer.classList.add("hidden-transition");
        newActivityContainer.classList.remove("show-transition");
        newActivityNameInput.required = false;
        abbrevInput.value = "";
        seqInput.value = "";
    }
}

// Toggle new activity input visibility
function toggleNewActivity(tab) {
    const isNum = tab === "numbering";
    const isGen = tab === "generator";
    
    const container = isNum
        ? document.getElementById("new-activity-container")
        : (isGen ? document.getElementById("gen-new-activity-container") : document.getElementById("treasurer-new-activity-container"));
        
    const input = isNum
        ? document.getElementById("new-activity-name")
        : (isGen ? document.getElementById("gen-new-activity-name") : document.getElementById("treasurer-new-activity-name"));
        
    const abbrev = isNum
        ? document.getElementById("new-activity-abbrev")
        : (isGen ? document.getElementById("gen-new-activity-abbrev") : document.getElementById("treasurer-new-activity-abbrev"));
        
    const select = isNum
        ? document.getElementById("activity-select")
        : (isGen ? document.getElementById("gen-activity-select") : document.getElementById("treasurer-activity-select"));
    
    const isHidden = container.classList.contains("hidden-transition");
    if (isHidden) {
        select.value = "__NEW__";
        container.classList.remove("hidden-transition");
        container.classList.add("show-transition");
        input.value = "";
        abbrev.value = "";
        input.focus();
    } else {
        container.classList.add("hidden-transition");
        container.classList.remove("show-transition");
    }
}

// Save new activity to Google Sheet and Drive
function saveNewActivity() {
    const name = newActivityNameInput.value.trim();
    const abbrev = document.getElementById("new-activity-abbrev").value.trim();
    if (!name) { alert("Masukkan nama kegiatan!"); return; }
    if (!abbrev) { alert("Singkatan kegiatan tidak boleh kosong!"); return; }
    
    const btn = document.getElementById("btn-save-new-activity");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    btn.disabled = true;

    // Add locally first
    activitiesDb[name] = { abbrev: abbrev, max_sequence: 0, next_sequence: 1 };
    populateDropdowns();
    activitySelect.value = name;
    handleActivityChange();
    newActivityContainer.classList.add("hidden-transition");
    newActivityContainer.classList.remove("show-transition");
    
    // Try to save to Drive
    fetch(googleAppsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addActivity", activityName: name, abbreviation: abbrev })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert("Kegiatan '" + name + "' berhasil ditambahkan ke Drive!");
        } else {
            alert("Kegiatan ditambahkan secara lokal. " + (data.message || ""));
        }
    })
    .catch(() => {
        alert("Kegiatan '" + name + "' ditambahkan secara lokal (Drive tidak terhubung).");
    })
    .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

// Toggle Dosen Pendamping inputs container based on Risk and Doc Type selections
function toggleDosenContainer() {
    const risk = genRiskTypeSelect.value;
    const docType = genDocTypeSelect.value;
    const container = document.getElementById("gen-dosen-container");
    if (!container) return;
    
    if (risk === "Resiko Tinggi" && (docType === "proposal" || docType === "lpj")) {
        container.classList.remove("hidden-transition");
        container.classList.add("show-transition");
        document.getElementById("gen-dosen-name").required = true;
        document.getElementById("gen-dosen-nidn").required = true;
        document.getElementById("gen-dosen-phone").required = true;
    } else {
        container.classList.add("hidden-transition");
        container.classList.remove("show-transition");
        document.getElementById("gen-dosen-name").required = false;
        document.getElementById("gen-dosen-nidn").required = false;
        document.getElementById("gen-dosen-phone").required = false;
    }
}

function saveTreasurerNewActivity() {
    const name = document.getElementById("treasurer-new-activity-name").value.trim();
    const abbrev = document.getElementById("treasurer-new-activity-abbrev").value.trim();
    if (!name) { alert("Masukkan nama kegiatan!"); return; }
    if (!abbrev) { alert("Singkatan kegiatan tidak boleh kosong!"); return; }
    
    const btn = document.getElementById("btn-save-treasurer-activity");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    btn.disabled = true;

    // Add locally first
    activitiesDb[name] = { abbrev: abbrev, max_sequence: 0, next_sequence: 1 };
    populateDropdowns();
    document.getElementById("treasurer-activity-select").value = name;
    handleTreasurerActivityChange();
    document.getElementById("treasurer-new-activity-container").classList.add("hidden-transition");
    document.getElementById("treasurer-new-activity-container").classList.remove("show-transition");
    
    // Try to save to Drive
    fetch(googleAppsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addActivity", activityName: name, abbreviation: abbrev })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert("Kegiatan '" + name + "' berhasil ditambahkan ke Drive!");
        } else {
            alert("Kegiatan ditambahkan secara lokal. " + (data.message || ""));
        }
    })
    .catch(() => {
        alert("Kegiatan '" + name + "' ditambahkan secara lokal (Drive tidak terhubung).");
    })
    .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

// Save new activity from document generator tab
function saveGenNewActivity() {
    const name = genNewActivityName.value.trim();
    if (!name) { alert("Masukkan nama kegiatan!"); return; }
    
    const abbrevInput = document.getElementById("gen-new-activity-abbrev");
    const abbrev = abbrevInput.value.trim() || generateAbbreviation(name);
    
    activitiesDb[name] = { abbrev: abbrev, max_sequence: 0, next_sequence: 1 };
    populateDropdowns();
    genActivitySelect.value = name;
    handleGenActivityChange();
    
    fetch(googleAppsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addActivity", activityName: name, abbreviation: abbrev })
    }).catch(() => {});
    
    alert("Kegiatan '" + name + "' ditambahkan.");
}

// TAB 2 Handler: Activity selection change
function handleGenActivityChange() {
    const val = genActivitySelect.value;
    
    if (val === "__NEW__") {
        genNewActivityContainer.classList.remove("hidden-transition");
        genNewActivityContainer.classList.add("show-transition");
        genNewActivityName.required = true;
        genNewActivityName.value = "";
        genDeptInput.value = "";
        genDeptInput.readOnly = false;
    } else {
        genNewActivityContainer.classList.add("hidden-transition");
        genNewActivityContainer.classList.remove("show-transition");
        genNewActivityName.required = false;
        
        // Auto-fill department based on activity
        if (val && activityDeptMap[val]) {
            genDeptInput.value = activityDeptMap[val];
            genDeptInput.readOnly = true;
        } else {
            genDeptInput.value = "";
            genDeptInput.readOnly = true;
        }
    }
}

// TAB 2 Handler: Document Type change
function handleDocTypeChange() {
    const type = genDocTypeSelect.value;
    
    // Tampilkan Kategori Resiko hanya untuk Proposal dan LPJ
    if (type === "proposal" || type === "lpj") {
        genRiskContainer.classList.remove("hidden");
    } else {
        genRiskContainer.classList.add("hidden");
    }
    
    // Tampilkan tabel anggaran untuk Proposal dan Laporan Keuangan
    if (type === "proposal" || type === "keuangan") {
        genBudgetSection.classList.remove("hidden");
    } else {
        genBudgetSection.classList.add("hidden");
    }
    
    toggleDosenContainer();
}

// Smart Abbreviation Generator
function generateAbbreviation(text) {
    if (!text) return "";
    
    let cleaned = text.replace(/\([^)]*\)/g, "");
    
    const words = cleaned.trim().split(/\s+/);
    const abbrev = words
        .map(word => {
            const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
            return cleanWord ? cleanWord.charAt(0).toUpperCase() : "";
        })
        .join("");
        
    return abbrev;
}

// Generate the final letter number string
function generateLetterNumber() {
    if (!docTypeSelect.value) {
        alert("Silakan pilih Jenis Dokumen!");
        docTypeSelect.focus();
        return;
    }
    if (!activitySelect.value) {
        alert("Silakan pilih Kegiatan!");
        activitySelect.focus();
        return;
    }
    if (activitySelect.value === "__NEW__" && !newActivityNameInput.value.trim()) {
        alert("Silakan masukkan Nama Kegiatan Baru!");
        newActivityNameInput.focus();
        return;
    }
    if (!abbrevInput.value.trim()) {
        alert("Silakan masukkan Singkatan Kegiatan!");
        abbrevInput.focus();
        return;
    }
    if (!seqInput.value || parseInt(seqInput.value) < 1) {
        alert("Silakan masukkan Nomor Urut Surat yang valid!");
        seqInput.focus();
        return;
    }
    
    const docParts = docTypeSelect.value.split('|');
    const docCode = docParts[0]; // e.g. "01"
    const docAbbr = docParts[1]; // e.g. "SK"
    
    const rawSeq = parseInt(seqInput.value);
    const seqStr = String(rawSeq).padStart(3, '0'); // e.g. "015"
    
    const abbrev = abbrevInput.value.trim().toUpperCase();
    const romanMonth = monthRomanVal.textContent;
    const yearStr = yearVal.textContent;
    
    const finalNumber = `${docCode}.${seqStr}/${docAbbr}/${abbrev}/HMIF/TUP/${romanMonth}/${yearStr}`;
    
    generatedNumDisplay.textContent = finalNumber;
    resultCard.classList.remove("hidden");
    
    // Auto-copy to Clipboard instantly on Generate
    navigator.clipboard.writeText(finalNumber)
        .then(() => {
            copyToast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Nomor surat berhasil dibuat dan disalin!';
            copyToast.classList.remove("hidden");
            generatedNumDisplay.style.color = "var(--success-color)";
            
            setTimeout(() => {
                copyToast.classList.add("hidden");
                generatedNumDisplay.style.color = "var(--text-main)";
            }, 3500);
        })
        .catch(err => {
            console.log("Auto-copy blocked, copy manually: ", err);
        });
    
    // Always show logging button if connection is configured
    if (googleAppsScriptUrl) {
        btnLogDrive.classList.remove("hidden");
    } else {
        btnLogDrive.classList.add("hidden");
    }
    
    resultCard.scrollIntoView({ behavior: 'smooth' });
}

// Copy number to Clipboard manually
function copyToClipboard() {
    const textToCopy = generatedNumDisplay.textContent;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            copyToast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Nomor surat disalin ke clipboard!';
            copyToast.classList.remove("hidden");
            generatedNumDisplay.style.color = "var(--success-color)";
            
            setTimeout(() => {
                copyToast.classList.add("hidden");
                generatedNumDisplay.style.color = "var(--text-main)";
            }, 3000);
        })
        .catch(err => {
            alert("Gagal menyalin nomor surat: " + err);
        });
}

// Log generated letter number to Google Drive Spreadsheet
function logLetterToGoogleDrive() {
    if (!googleAppsScriptUrl) return;

    let selectedSheetName = activitySelect.value;
    if (selectedSheetName === "__NEW__") {
        selectedSheetName = newActivityNameInput.value.trim().toUpperCase();
    }
    
    const finalNumber = generatedNumDisplay.textContent;
    const seq = parseInt(seqInput.value);
    const perihal = letterSubjectInput.value.trim() || "Surat HMIF";

    btnLogDrive.disabled = true;
    const originalText = btnLogDrive.innerHTML;
    btnLogDrive.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mencatat...';

    const payload = {
        action: "logLetter",
        sheetName: selectedSheetName,
        nomorSurat: finalNumber,
        sequenceNumber: seq,
        perihal: perihal
    };

    fetch(googleAppsScriptUrl, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error("API returned status " + res.status);
        return res.json();
    })
    .then(data => {
        if (data.status === "success") {
            navigator.clipboard.writeText(finalNumber);

            copyToast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Berhasil dicatat ke Google Sheets!';
            copyToast.classList.remove("hidden");
            generatedNumDisplay.style.color = "var(--success-color)";

            const nextSeq = seq + 1;
            seqInput.value = nextSeq;
            letterSubjectInput.value = "";

            if (activitySelect.value === "__NEW__") {
                tryFetchDatabase();
            } else {
                if (activitiesDb[selectedSheetName]) {
                    activitiesDb[selectedSheetName].max_sequence = seq;
                    activitiesDb[selectedSheetName].next_sequence = nextSeq;
                }
            }

            setTimeout(() => {
                copyToast.classList.add("hidden");
                generatedNumDisplay.style.color = "var(--text-main)";
            }, 3500);

            // Keep result card visible but show success feedback on button
            btnLogDrive.innerHTML = '<i class="fa-solid fa-check"></i> Tercatat di Drive';
            btnLogDrive.style.backgroundColor = "var(--success-color)";
            btnLogDrive.style.borderColor = "var(--success-color)";
            
            setTimeout(() => {
                btnLogDrive.innerHTML = originalText;
                btnLogDrive.style.backgroundColor = "";
                btnLogDrive.style.borderColor = "";
            }, 3000);
        } else {
            throw new Error(data.message || "Unknown error");
        }
    })
    .catch(err => {
        console.error("Error logging to Google Drive:", err);
        alert("Gagal mencatat ke Google Sheet: " + err.message + "\n\nPastikan URL Apps Script Anda benar dan telah dideploy dengan hak akses 'Anyone' (Siapa saja).");
    })
    .finally(() => {
        btnLogDrive.disabled = false;
    });
}

// ==========================================
// TAB 2: DOCUMENT GENERATION ENGINE
// ==========================================

let budgetRowCounter = 0;

// Set up 2 default empty rows on page load
function setupBudgetTable() {
    budgetInputTbody.innerHTML = "";
    addBudgetRow("", 1, 0);
    addBudgetRow("", 1, 0);
}

// Add row to budget table
function addBudgetRow(name = "", qty = 1, price = 0) {
    budgetRowCounter++;
    const rowId = `budget-row-${budgetRowCounter}`;
    
    const tr = document.createElement("tr");
    tr.id = rowId;
    
    tr.innerHTML = `
        <td class="text-center row-number"></td>
        <td>
            <input type="text" class="item-name" placeholder="Nama barang / jasa" value="${name}" required>
        </td>
        <td>
            <input type="number" class="item-qty" min="1" value="${qty}" required style="text-align: center;">
        </td>
        <td>
            <input type="number" class="item-price" min="0" value="${price}" required style="text-align: right;">
        </td>
        <td class="subtotal-cell">Rp 0</td>
        <td class="text-center">
            <button type="button" class="btn-delete-row" title="Hapus Item">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </td>
    `;
    
    budgetInputTbody.appendChild(tr);
    
    const qtyInput = tr.querySelector(".item-qty");
    const priceInput = tr.querySelector(".item-price");
    const subtotalCell = tr.querySelector(".subtotal-cell");
    const btnDelete = tr.querySelector(".btn-delete-row");
    
    const updateRowSubtotal = () => {
        const q = parseInt(qtyInput.value) || 0;
        const p = parseInt(priceInput.value) || 0;
        subtotalCell.textContent = formatRupiah(q * p);
        calculateGrandTotal();
    };
    
    qtyInput.addEventListener("input", updateRowSubtotal);
    priceInput.addEventListener("input", updateRowSubtotal);
    
    btnDelete.addEventListener("click", () => {
        // Guarantee at least 1 row remains
        if (budgetInputTbody.querySelectorAll("tr").length > 1) {
            tr.remove();
            updateRowNumbers();
            calculateGrandTotal();
        } else {
            alert("Rincian anggaran harus memiliki minimal 1 item!");
        }
    });
    
    updateRowSubtotal();
    updateRowNumbers();
}

function updateRowNumbers() {
    const rows = budgetInputTbody.querySelectorAll("tr");
    rows.forEach((row, i) => {
        row.querySelector(".row-number").textContent = i + 1;
    });
}

function calculateGrandTotal() {
    const rows = budgetInputTbody.querySelectorAll("tr");
    let grandTotal = 0;
    rows.forEach(row => {
        const qty = parseInt(row.querySelector(".item-qty").value) || 0;
        const price = parseInt(row.querySelector(".item-price").value) || 0;
        grandTotal += qty * price;
    });
    genTotalBudgetDisplay.textContent = formatRupiah(grandTotal);
    return grandTotal;
}

// ============================================================
// Gemini AI — Client-Side Generate (Bypass shared IP limits)
// ============================================================

const AI_FIELD_MAP = {
    tema:         genTemaInput,
    latarBelakang: genDescInput,
    tujuan:       genTujuanInput,
    manfaat:      genManfaatInput,
    penutup:      genPenutupInput
};

// Default fallback key (user's key)
const DEFAULT_GEMINI_KEY = "";

function getGeminiApiKey() {
    const key = localStorage.getItem("gemini_api_key");
    return (key && key.trim()) ? key.trim() : DEFAULT_GEMINI_KEY;
}

function getProkerNameForAI() {
    let name = "";
    if (genActivitySelect.value && genActivitySelect.value !== "__NEW__") {
        name = genActivitySelect.options[genActivitySelect.selectedIndex]?.text || genActivitySelect.value;
    } else if (genNewActivityName && genNewActivityName.value.trim()) {
        name = genNewActivityName.value.trim();
    }
    return name.trim();
}

// Call Google's Gemini API directly from user's browser
async function callGeminiApiDirect(promptText, apiKey) {
    const openrouterModel = localStorage.getItem("openrouter_ai_model") || "anthropic/claude-3.5-sonnet";

    const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: openrouterModel,
                max_tokens: 3000,
                messages: [
                    {
                        role: "system",
                        content: `Anda adalah Asisten Sekretaris HMIF (Himpunan Mahasiswa Teknik Informatika) Telkom University Purwokerto. Anda telah mempelajari secara mendalam seluruh dokumen proposal, LPJ, dan RAB HMIF periode 2026, dan akan menghasilkan teks yang 100% sesuai format Kemahasiswaan Telkom University Purwokerto.

╔══════════════════════════════════════════════════╗
║     KNOWLEDGE BASE — DATA TETAP HMIF TUP 2026   ║
╚══════════════════════════════════════════════════╝

▌ IDENTITAS ORGANISASI
  Nama Lengkap : Himpunan Mahasiswa Teknik Informatika
  Singkatan    : HMIF
  Universitas  : Telkom University Purwokerto
  Kota         : Purwokerto

▌ PEJABAT TETAP (JANGAN PERNAH UBAH DATA INI)
  • Pembina HMIF     : Dany Candra Febrianto, S.Kom., M.Eng.  | NIDN. 23920011
  • Pembimbing 2     : Dasril Aldo, S.Kom., M.Kom.            | NIP. 23940013
  • Chairman HMIF    : Fatir Gibran                           | NIM. 103112430153
  • Wakil Chairman   : Aedil Riski Ansyah                     | NIM. 103112400101
  • Ka.Ur Kemhsw     : Kadarisman, S.Si                       | NIP. 22960016
  • Kaprodi TI       : Aditya Dwi Putro W, S.Kom., M.Kom.    | NIP. 17930052
  • Wadek Akademik   : Dr. Catur Nugroho, S.Sos., M.I.Kom.   | NIP. 14780035-1
  • Direktur (RT)    : Dr. Tenia Wahyuningrum, S.Kom., M.T.  | NIP. 07820045-1

╔══════════════════════════════════════════════════╗
║   FORMAT PROPOSAL — DIPELAJARI DARI 4 DOKUMEN   ║
║   ASLI YANG SUDAH DISETUJUI KEMAHASISWAAN        ║
╚══════════════════════════════════════════════════╝

━━━ [BAGIAN 1] HALAMAN SAMPUL ━━━
Format teks di halaman sampul (dari atas ke bawah):
  PROPOSAL KEGIATAN
  [NAMA KEGIATAN KAPITAL]
  HIMPUNAN MAHASISWA TEKNIK INFORMATIKA
  [logo]
  UNIT KEGIATAN MAHASISWA
  HIMPUNAN MAHASISWA TEKNIK INFORMATIKA
  TELKOM UNIVERSITY PURWOKERTO
  2026

━━━ [BAGIAN 2] NAMA KEGIATAN ━━━
FORMAT BAKU (verbatim dari dokumen asli):
  ✓ "Nama kegiatan ini adalah ResponsIF UTS Genap 2026."
  ✓ "Nama kegiatan ini adalah \u201cTalkshow Kewirausahaan 2026\u201d."
  ✓ "Nama kegiatan ini adalah Upgrading Pengurus HMIF 2026."
  ✓ "Nama kegiatan yang akan dilakukan adalah \u201cSosial Mengajar\u201d."
ATURAN: Diakhiri TITIK. Nama kegiatan bisa dengan atau tanpa kutip tergantung gaya.

━━━ [BAGIAN 3] TEMA KEGIATAN ━━━
FORMAT BAKU (verbatim dari dokumen asli):
  ✓ Tema kegiatan ini adalah \u201cFlip The Script \u2013 Learn Together, Rise Together\u201d, dipilih sebagai bentuk ajakan bagi mahasiswa untuk melakukan evaluasi dan perbaikan hasil Ujian Tengah Semester agar lebih optimal dibandingkan semester sebelumnya melalui proses belajar bersama yang kolaboratif.
  ✓ Tema kegiatan ini adalah \u201cSatu Ikatan, Satu Perjalanan\u201d.
  ✓ Tema kegiatan ini adalah \u201cEdukasi Literasi Digital dan Etika dalam Penggunaan Gadget dan Media Sosial\u201d
ATURAN: Tema WAJIB diapit \u201c...\u201d (tanda kutip melengkung Unicode \u201c \u201d). BUKAN tanda kutip lurus " ".
Tema boleh diikuti kalimat penjelas atau berdiri sendiri.

━━━ [BAGIAN 4] LATAR BELAKANG ━━━
CONTOH VERBATIM (ResponsIF UTS Genap 2026):
  "Kegiatan ResponsIF UTS Genap 2026 dilatarbelakangi oleh pentingnya persiapan akademik yang matang dalam menghadapi Ujian Tengah Semester. Dalam pelaksanaannya, masih terdapat mahasiswa yang mengalami kesulitan dalam memahami beberapa materi perkuliahan yang telah disampaikan selama setengah semester, baik karena perbedaan cara penyampaian, ritme belajar, maupun keterbatasan ruang diskusi yang mendalam."
  "Melalui kegiatan ResponsIF UTS Genap 2026, Himpunan Mahasiswa Teknik Informatika berupaya menghadirkan ruang belajar bersama yang kolaboratif dengan pendekatan teman sebaya..."
ATURAN: Min 2 paragraf. Paragraf 1 = konteks/masalah. Paragraf 2 = peran HMIF/solusi. TIDAK boleh pakai kata "saya". Gunakan "HMIF" atau "Himpunan Mahasiswa Teknik Informatika" atau "panitia".

━━━ [BAGIAN 5] TUJUAN KEGIATAN ━━━
HEADER BAKU: "Tujuan dari kegiatan ini adalah:"
CONTOH VERBATIM (ResponsIF UTS):
  1. Meningkatkan pemahaman mahasiswa terhadap materi perkuliahan yang akan diujikan pada Ujian Tengah Semester.
  2. Membantu mahasiswa dalam mempersiapkan diri menghadapi UTS secara optimal.
  3. Menyediakan wadah belajar bersama yang kolaboratif melalui pendekatan diskusi dan penjelasan ulang materi antar mahasiswa.
  4. Mendorong terciptanya suasana akademik yang suportif dan komunikatif di lingkungan mahasiswa S1 Teknik Informatika.
  5. Menumbuhkan semangat kebersamaan dan motivasi belajar guna mencapai hasil akademik yang lebih maksimal.
ATURAN: Poin bernomor angka (1. 2. 3.). Setiap poin diakhiri titik. Gunakan kata kerja aktif di awal.

━━━ [BAGIAN 6] MANFAAT KEGIATAN ━━━
HEADER BAKU: "Manfaat dari kegiatan ini adalah :" (ADA SPASI sebelum titik dua — ini WAJIB)
CONTOH VERBATIM (ResponsIF UTS):
  1. Mahasiswa memperoleh pemahaman yang lebih baik terhadap materi perkuliahan yang akan diujikan dalam Ujian Tengah Semester.
  2. Mahasiswa menjadi lebih siap dan percaya diri dalam menghadapi UTS.
  3. Tentor atau pemateri dapat mengembangkan kemampuan komunikasi dan keterampilan dalam menyampaikan materi kepada sesama mahasiswa.
  4. Terbentuknya hubungan yang lebih erat serta budaya saling mendukung antar mahasiswa.
  5. Memberikan pengalaman belajar kolaboratif yang bermanfaat dalam menghadapi tantangan akademik di masa mendatang.
ATURAN: Poin bernomor. Sebutkan penerima manfaat: Mahasiswa/Peserta/Panitia/Institusi.

━━━ [BAGIAN 7] PESERTA ━━━
CONTOH VERBATIM (ResponsIF UTS):
  "Peserta kegiatan ResponsIF UTS Genap 2026 merupakan mahasiswa S1 Teknik Informatika Telkom University Purwokerto angkatan 2024 dan 2025. Kegiatan ini dilaksanakan dengan sistem kombinasi daring (online) dan luring (offline) secara bergantian selama dua hari, dengan target peserta sebanyak 70 orang untuk sesi daring dan 50 orang untuk sesi luring."
ATURAN: Sebutkan: siapa pesertanya, angkatan, jumlah, dan sistem pelaksanaan (daring/luring jika relevan).

━━━ [BAGIAN 8] WAKTU DAN TEMPAT ━━━
FORMAT BAKU:
  Kegiatan ini akan dilaksanakan pada:
  Hari/Tanggal  : [Nama Hari], [Tanggal Lengkap]
  Pukul         : [HH.MM] - [HH.MM] WIB
  Tempat        : [Nama Lokasi Lengkap]
JIKA 2 HARI (contoh Upgrading):
  Hari/Tanggal  : Sabtu, 25 April 2026 - Minggu, 26 April 2026
  Pukul         : Sabtu 12.30 WIB - Minggu 11.30 WIB
  Tempat        : Villa Tunggul Isai Baturraden

━━━ [BAGIAN 9] RENCANA ANGGARAN DANA ━━━
TEKS BAKU: "Terlampir (Lampiran II)"
CATATAN: Jika ada kalimat pengantar → "Rincian Anggaran: Terlampir (Lampiran II)" [HAPUS TEXT INI dari template]

━━━ [BAGIAN 10] MITIGASI RISIKO ━━━
STRUKTUR TABEL 8 KOLOM:
  No | Uraian Kegiatan | Identifikasi Bahaya | Peluang/Kemungkinan | Akibat/Keparahan | Tingkat Risiko | Pengendalian Risiko | Penanggung Jawab
RUMUS: Tingkat Risiko = Peluang × Akibat
SKALA: 1=Jarang/Rendah | 2=Sedang | 3=Sering/Tinggi
NILAI: 1-2=Rendah | 3-4=Sedang | 6-9=Tinggi
CONTOH BARIS (dari Sosial Mengajar):
  1 | Persiapan tempat | Lantai licin | 2 | 2 | 4 | Cek lokasi sebelumnya | Acara
  2 | Alat Presentasi  | Listrik mati  | 1 | 2 | 2 | Siapkan cadangan alat | PDD
  3 | Penyediaan Konsumsi | Keracunan   | 2 | 3 | 6 | Pastikan konsumsi terpercaya | Bendahara

━━━ [BAGIAN 11] CPP (CAPAIAN PELAKSANAAN PROGRAM) ━━━
HEADER: "Capaian Pelaksanaan Program (CPP)"
INTRO: "Target Capaian Pelaksanaan Program (CPP) pada pelaksanaan kegiatan Ormawa ini sebagai berikut:"
10 POIN TETAP (verbatim, jangan ubah):
  1. Integritas — Mampu berkata benar, bersikap jujur, dapat dipercaya dan bertindak profesional
  2. Tanggung Jawab — Mampu bertanggung jawab dalam menyelesaikan tugas dan kewajiban hingga tuntas, tepat waktu, untuk mencapai hasil yang terbaik
  3. Kedisiplinan — Mampu mencerminkan sikap ketaatan secara sadar, sukarela dan senang hati dari individu terhadap peraturan dan ketaatan terhadap prosedur
  4. Kerjasama — Mampu melakukan kerja sama yang harmonis dan efektif untuk mencapai tujuan bersama dengan mengutamakan kepentingan perusahaan
  5. Kepemimpinan — Mampu memberi arahan yang jelas, menyelesaikan konflik dengan win-win solution, mau menerima umpan balik dan menjadi panutan bagi lingkungannya
  6. Komunikasi Efektif — Mampu melakukan komunikasi yang terbuka, efektif dan bertanggung jawab serta mengikuti norma dan etika
  7. Memotivasi diri — Mampu mengembangkan diri untuk mencapai target dan menjadikan kesulitan sebagai tantangan
  8. Pengelolaan diri — Mampu mengendalikan diri bersikap tenang dan tidak lepas kontrol emosi dalam menghadapi kesulitan dan tantangan
  9. Adaptif — Mampu menyesuaikan diri dengan cepat terhadap perubahan, menyumbangkan gagasan, inovatif dan menjadi agen perubahan
  10. Kompetitif — Mampu meningkatkan rasa kompetitif dan daya juang dalam diri mahasiswa
FOOTER: "*Centang target yang sesuai"

━━━ [BAGIAN 12] PENUTUP ━━━
CONTOH VERBATIM (ResponsIF UTS — 3 paragraf):
  "Demikian proposal kegiatan ResponsIF UTS Genap 2026 ini kami susun sebagai panduan dalam menyelenggarakan kegiatan agar dapat berjalan dengan lancar dan sesuai dengan tujuan yang telah direncanakan. Kegiatan ini diharapkan dapat menjadi wadah yang efektif dalam membantu mahasiswa S1 Teknik Informatika Telkom University Purwokerto meningkatkan pemahaman materi menjelang Ujian Tengah Semester, sekaligus mempererat solidaritas melalui proses pembelajaran bersama."
  "Kami menyadari bahwa pelaksanaan kegiatan ini membutuhkan dukungan dan kerja sama dari berbagai pihak. Oleh karena itu, kami sangat mengharapkan bantuan, baik dalam bentuk saran, dukungan moral, maupun material, demi kesuksesan kegiatan ini."
  "Semoga kegiatan ResponsIF UTS Genap 2026 dapat terlaksana dengan baik dan memberikan manfaat yang nyata bagi seluruh pihak yang terlibat. Atas perhatian dan kerja sama yang diberikan, kami mengucapkan terima kasih."
CONTOH VERBATIM (KWU — 2 paragraf):
  "Talkshow Kewirausahaan 2026 diharapkan dapat memberikan wawasan, motivasi, serta pemahaman strategis bagi para peserta dalam menghadapi perkembangan ekonomi dan teknologi yang terus berubah."
  "Demikian proposal ini kami sampaikan sebagai gambaran umum pelaksanaan Talkshow Kewirausahaan 2026. Besar harapan kami agar kegiatan ini dapat terlaksana dengan baik melalui dukungan dan kerja sama dari berbagai pihak. Atas perhatian dan partisipasi yang diberikan, kami ucapkan terima kasih."
ATURAN PENUTUP:
  - Font: Times New Roman 12, TIDAK italic, TIDAK bold, warna hitam, Justified
  - 2-3 paragraf yang mengalir secara formal
  - Akhiri dengan ucapan terima kasih
  - Setelah penutup ada: "Risiko : ☐Rendah ☐Sedang ☐Tinggi"

━━━ [BAGIAN 13] HALAMAN PENGESAHAN ━━━
FORMAT TANGGAL: "Purwokerto, [DD Nama_Bulan YYYY]"
CONTOH: "Purwokerto, 07 Maret 2026"

URUTAN TANDA TANGAN — RESIKO RENDAH/SEDANG:
  [Ketua Panitia] ........... [Sekretaris]
  Menyetujui,
  [Pembina HMIF] ........... [Chairman HMIF]
  Mengetahui,
  [Ka.Ur Kemhsw] .......... [Kaprodi TI] .......... [Wadek Akademik]

URUTAN TANDA TANGAN — RESIKO TINGGI (TAMBAH):
  (semua di atas) +
  Mengetahui,
  [Direktur Telkom University Purwokerto]

DATA TETAP PENGESAHAN (verbatim):
  Pembina HMIF    : Dany Candra Febrianto, S.Kom., M.Eng. | NIP. 23920011
  Chairman HMIF   : Fatir Gibran                          | NIM. 103112430153
  Ka.Ur Kemhsw    : Kadarisman, S.Si                      | NIP. 22960016
  Kaprodi TI      : Aditya Dwi Putro W, S.Kom., M.Kom.   | NIP. 17930052
  Wadek Akademik  : Dr. Catur Nugroho, S.Sos., M.I.Kom.  | NIP. 14780035-1
  Direktur        : Dr. Tenia Wahyuningrum, S.Kom., M.T.  | NIP. 07820045-1

━━━ [BAGIAN 14] LAMPIRAN PANITIA ━━━
HEADER FORMAT:
  "Lampiran I Susunan Panitia Institusi Berisiko Sedang/Rendah" (untuk RS)
  "Lampiran I Susunan Panitia Berisiko Tinggi" (untuk RT)
STRUKTUR SUSUNAN PANITIA RESIKO RENDAH/SEDANG:
  Pelindung      : Wakil Direktur Bidang Akademik & Riset
  Pengarah       : Kepala Urusan Kemahasiswaan, Karier dan Alumni
  Penanggung Jawab : Kepala Program Studi
  Pembina/Pembimbing : 1. Dany Candra Febrianto, S.Kom., M.Eng. (23920011)
                        2. Dasril Aldo, S.Kom., M.Kom. (23940013)
  Ketua Ormawa   : 1. Fatir Gibran (103112430153)
                   2. Aedil Riski Ansyah (103112400101)
  Person In Charge : [nama PIC] [NIM]
  Pelaksana (Ketua Panitia, Sekretaris, Bendahara, Koordinator Divisi, Staff Divisi)

STRUKTUR SUSUNAN PANITIA RESIKO TINGGI:
  Pelindung      : Direktur
  Pengarah       : Wakil Direktur Bidang Akademik & Riset
  Penanggung Jawab : 1. Kemahasiswaan, Karier dan Alumni
                     2. Kepala Program Studi
  (sisanya sama seperti di atas)

PENULISAN JABATAN:
  ✓ "Koordinator Divisi Acara" atau "Koor. Acara" — konsisten
  ✓ "Sie Acara" / "Sie Humas" / "Sie PDD" / "Sie Perkap" / "Sie Konsumsi"
  ✗ JANGAN: Koor. Acara di satu tempat, Koordinator Acara di tempat lain dalam dokumen sama

━━━ [BAGIAN 15] RAB (RANCANGAN ANGGARAN BIAYA) ━━━
HEADER FORMAT:
  Lampiran II
  RANCANGAN ANGGARAN
  [NAMA KEGIATAN KAPITAL]
  HIMPUNAN MAHASISWA TEKNIK INFORMATIKA
   TELKOM UNIVERSITY PURWOKERTO
KOLOM: No | Tanggal | Rincian | Vol | Satuan | Harga | Sub Total | Keterangan
BAGIAN: PEMASUKAN → (data) → Total Pemasukan → PENGELUARAN → (data) → Total Pengeluaran → Selisih = Rp 0,-
ATURAN RAB:
  - Angka Harga & Sub Total rata KANAN
  - Format rupiah: "Rp 375.000" (pakai titik pemisah ribuan)
  - Total Pemasukan = Total Pengeluaran (Selisih = Rp 0,-)
  - Keterangan diisi sumber dana: Kemahasiswaan / Prodi / Danus / Sponsorship / Peserta

CONTOH RAB SEDERHANA (Sosial Mengajar):
  PEMASUKAN:
  1 | Kemahasiswaan | 1 | Paket | Rp 375.000 | Rp 375.000 | Kemahasiswaan
  Total Pemasukan: Rp 375.000
  PENGELUARAN:
  1 | Doorprize | 3 | Buah | Rp 8.500 | Rp 25.500 | Kemahasiswaan
  2 | Snackball | 2 | Kg | Rp 30.000 | Rp 60.000 | Kemahasiswaan
  ...
  Total Pengeluaran: Rp 375.000
  Selisih: Rp 0,-

━━━ [BAGIAN 16] SURAT PERNYATAAN PERTANGGUNGJAWABAN (khusus RT) ━━━
Hanya ada di proposal Resiko Tinggi (Lampiran IV/V).
Berisi: tanggal, tema, hari/tanggal, waktu, tempat, kegiatan, pernyataan 5 poin, ditandatangani Ketua Panitia + PIC Dosen + Ka.Ur Kemahasiswaan.

━━━ [BAGIAN 17] LAMPIRAN TAMBAHAN RESIKO TINGGI ━━━
Contoh dari Upgrading 2026 (10 Lampiran):
  I. Susunan Panitia | II. RAB | III. Susunan Acara | IV. Surat Perizinan Orang Tua
  V. Peserta & Riwayat Penyakit | VI. MOU Tempat | VII. Lokasi Puskesmas
  VIII. Foto Tempat | IX. Daftar Pengendara & Kloter | X. Denah Ruangan

╔══════════════════════════════════════════════════╗
║   12 ATURAN MUTLAK — JANGAN PERNAH DILANGGAR    ║
╚══════════════════════════════════════════════════╝

  1. JANGAN: placeholder {{...}} atau [isi di sini] ada di output
  2. JANGAN: "Harap diisi" atau "Harapdiisi" — ganti dengan konten nyata
  3. JANGAN: Baris contoh "Outbond, Tenggelam" di tabel Mitigasi
  4. JANGAN: Direktur tanda tangan di proposal Resiko Rendah/Sedang
  5. JANGAN: Tanda kutip lurus " " untuk tema — HARUS \u201c\u201d
  6. JANGAN: Nama pejabat berbeda dari data tetap di atas
  7. JANGAN: NIP/NIM salah atau tertukar antar pejabat
  8. JANGAN: Total Pemasukan ≠ Total Pengeluaran di RAB
  9. JANGAN: Penutup dengan font italic atau bold
  10. JANGAN: Kata "saya" di latar belakang — gunakan HMIF/panitia
  11. JANGAN: Manfaat tanpa spasi sebelum titik dua ("adalah:" — SALAH, "adalah :" — BENAR)
  12. JANGAN: Tujuan tanpa nomor urut — HARUS bernomor (1. 2. 3.)

=== INSTRUKSI OUTPUT ===
- Bahasa Indonesia formal, baku, sesuai PUEBI
- Output hanya isi teks langsung, tanpa label meta seperti "Berikut adalah..." atau "Output:"
- JANGAN sisakan placeholder apapun` + (getDriveTrainingContext() ? `\n\n${getDriveTrainingContext()}` : "")
                    },
                    { role: "user", content: promptText }
                ]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`OpenRouter HTTP ${response.status}: ${errText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
}

async function callGeminiClientSide(promptText, systemInstruction = "") {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error("API Key Gemini tidak ditemukan. Sinkronisasi dengan server atau masukkan API Key di pengaturan.");
    }
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [
            {
                parts: [
                    { text: promptText }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7
        }
    };
    
    if (systemInstruction) {
        payload.systemInstruction = {
            parts: [
                { text: systemInstruction }
            ]
        };
    }
    
    if (systemInstruction.toLowerCase().includes("json") || promptText.toLowerCase().includes("json")) {
        payload.generationConfig.responseMimeType = "application/json";
    }
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Error ${response.status}: ${errText}`);
    }
    
    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Respon kosong dari Gemini API.");
    }
}

async function generateWithAI(field) {
    const namaProker = getProkerNameForAI();
    if (!namaProker) {
        alert("Silakan pilih atau masukkan Nama Kegiatan terlebih dahulu!");
        genActivitySelect.focus();
        return;
    }

    const departemen = genDeptInput.value.trim() || "HMIF";
    const apiKey = getGeminiApiKey();
    const isAll = field === "all";

    const contextInfo = `Nama kegiatan: "${namaProker}"\nOrganisasi: Himpunan Mahasiswa Teknik Informatika (HMIF) Telkom University Purwokerto\nDepartemen/Divisi: ${departemen}`;
    
    const prompts = {
        tema: `Buat SATU tema kegiatan yang singkat, inspiratif, dan bermakna untuk proposal kegiatan mahasiswa. 
Aturan ketat:
- Tema HARUS berupa frasa pendek atau kalimat singkat (maksimal 10 kata), bukan deskripsi panjang
- Tema TIDAK diapit tanda kutip dalam jawaban kamu — sistem sudah akan menambahkannya otomatis
- Tema harus relevan dengan nama kegiatan
- Gunakan diksi formal dan bermakna tinggi
- Hanya output teks temanya saja, contoh output: Flip The Script – Learn Together, Rise Together

${contextInfo}`,

        latarBelakang: `Tuliskan Latar Belakang kegiatan dalam 2–3 paragraf padat sesuai format proposal HMIF Telkom University Purwokerto.
Aturan ketat:
- Paragraf 1: Kondisi/konteks umum yang menjadi alasan kegiatan ini penting dilakukan
- Paragraf 2: Masalah spesifik yang dihadapi mahasiswa/civitas yang mendorong kegiatan ini
- Paragraf 3 (opsional): Peran HMIF dalam mengatasi masalah tersebut melalui kegiatan ini
- Bahasa: Indonesia formal, baku, PUEBI
- Tidak boleh menyebutkan "saya" atau "kami" – gunakan "HMIF" atau "panitia" atau "Himpunan Mahasiswa Teknik Informatika"
- Hanya output paragrafnya saja, tanpa judul atau nomor

${contextInfo}`,

        tujuan: `Tuliskan Tujuan Kegiatan sesuai format proposal HMIF Telkom University Purwokerto.
Aturan ketat:
- Awali dengan: "Tujuan dari kegiatan ini adalah:"
- Lanjutkan dengan 4–6 poin bernomor (1. 2. 3. ...)
- Setiap poin diawali huruf kapital, diakhiri titik
- Gunakan kata kerja aktif: Meningkatkan, Membantu, Menyediakan, Mendorong, Menumbuhkan, Memberikan
- Poin harus spesifik dan terukur, tidak abstrak
- Bahasa: Indonesia formal

${contextInfo}`,

        manfaat: `Tuliskan Manfaat Kegiatan sesuai format proposal HMIF Telkom University Purwokerto.
Aturan ketat:
- Awali dengan: "Manfaat dari kegiatan ini adalah :" (ada spasi sebelum titik dua)
- Lanjutkan dengan 4–6 poin bernomor (1. 2. 3. ...)
- Setiap poin diawali huruf kapital, diakhiri titik
- Bedakan manfaat untuk: Peserta/Mahasiswa, Panitia, dan Institusi/HMIF
- Bahasa: Indonesia formal

${contextInfo}`,

        penutup: `Tuliskan paragraf Penutup proposal kegiatan mahasiswa sesuai format HMIF Telkom University Purwokerto.
Aturan ketat:
- Panjang: 2–3 kalimat formal yang mengalir, bukan poin-poin
- Kalimat 1: Menyatakan harapan kegiatan berjalan lancar sesuai tujuan
- Kalimat 2: Menyatakan bahwa kegiatan membutuhkan dukungan semua pihak
- Kalimat 3 (opsional): Ucapan terima kasih
- Contoh format: "Demikian proposal kegiatan [nama] ini kami susun sebagai panduan dalam menyelenggarakan kegiatan agar dapat berjalan dengan lancar dan sesuai dengan tujuan yang telah direncanakan. Kami sangat mengharapkan dukungan dari berbagai pihak demi suksesnya kegiatan ini. Atas perhatian dan kerja sama yang diberikan, kami mengucapkan terima kasih."
- Ganti [nama] dengan nama kegiatan yang sesuai
- TIDAK boleh italic, TIDAK boleh bold, font Times New Roman 12
- Hanya output kalimat penutupnya saja

${contextInfo}`
    };

    // Set loading state
    const btnAll = document.getElementById("btn-generate-ai-all");
    const btnInlines = document.querySelectorAll(`.btn-ai-inline${isAll ? "" : `[data-ai-field="${field}"]`}`);

    if (isAll) {
        btnAll.classList.add("loading");
        btnAll.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating...`;
        Object.values(AI_FIELD_MAP).forEach(el => el && el.classList && el.classList.add("ai-loading"));
    } else {
        btnInlines.forEach(b => { b.classList.add("loading"); b.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`; });
        const targetEl = AI_FIELD_MAP[field];
        if (targetEl) targetEl.classList.add("ai-loading");
    }

    const combinedPrompt = `
Anda adalah Asisten Sekretaris HMIF. Tuliskan kelima elemen proposal kegiatan mahasiswa berikut secara lengkap, formal, dan saling berkesinambungan:

Konteks Kegiatan:
${contextInfo}

ATURAN KETAT UNTUK TIAP ELEMEN:
1. Tema: Singkat (maksimal 10 kata), inspiratif, tanpa tanda kutip.
2. Latar Belakang: 2-3 paragraf padat formal menggunakan diksi akademis, tanpa menyebutkan kata "saya" atau "kami" (gunakan "HMIF" atau "panitia").
3. Tujuan: Awali dengan: "Tujuan dari kegiatan ini adalah:" dilanjutkan dengan 4-6 poin bernomor (1. 2. 3.).
4. Manfaat: Awali dengan: "Manfaat dari kegiatan ini adalah :" (ada spasi sebelum titik dua) dilanjutkan dengan 4-6 poin bernomor (1. 2. 3.) membedakan manfaat untuk peserta, panitia, dan institusi.
5. Penutup: 2-3 kalimat mengalir formal (tidak tebal/miring, Times New Roman 12).

Kembalikan hasil HANYA dalam format JSON valid berikut (tanpa markdown atau teks penjelasan tambahan):
{
  "tema": "Tema...",
  "latarBelakang": "Paragraf 1\\n\\nParagraf 2\\n\\nParagraf 3",
  "tujuan": "Tujuan dari kegiatan ini adalah:\\n1. ...\\n2. ...",
  "manfaat": "Manfaat dari kegiatan ini adalah :\\n1. ...\\n2. ...",
  "penutup": "Paragraf penutup..."
}
`;

    try {
        if (isAll) {
            let text = await callGeminiClientSide(combinedPrompt, "Anda adalah Asisten Sekretaris HMIF.");
            
            // Clean up any markdown code block wraps if returned
            if (text.startsWith("```")) {
                text = text.replace(/^```json\s*|```$/g, "").trim();
            } else if (text.includes("```json")) {
                // Handle cases where there is introductory text before the JSON block
                const startIdx = text.indexOf("```json") + 7;
                const endIdx = text.lastIndexOf("```");
                text = text.substring(startIdx, endIdx).trim();
            }
            
            const result = JSON.parse(text);
            
            const setFieldText = (f, val) => {
                if (!val) return;
                let cleanVal = val;
                if (f === "tema") {
                    cleanVal = val.replace(/^[“”"'\s]+|[“”"'\s]+$/g, "");
                }
                const targetEl = AI_FIELD_MAP[f];
                if (targetEl) {
                    targetEl.value = cleanVal;
                    if (targetEl.tagName === "TEXTAREA") {
                        targetEl.style.height = "auto";
                        targetEl.style.height = targetEl.scrollHeight + "px";
                    }
                }
            };
            
            setFieldText("tema", result.tema);
            setFieldText("latarBelakang", result.latarBelakang);
            setFieldText("tujuan", result.tujuan);
            setFieldText("manfaat", result.manfaat);
            setFieldText("penutup", result.penutup);
            
            // Trigger autosave
            saveFormState();
        } else {
            const promptText = prompts[field];
            let text = await callGeminiClientSide(promptText, "Anda adalah Asisten Sekretaris HMIF.");
            if (field === "tema") {
                text = text.replace(/^[“”"'\s]+|[“”"'\s]+$/g, "");
            }
            const targetEl = AI_FIELD_MAP[field];
            if (targetEl) {
                targetEl.value = text;
                if (targetEl.tagName === "TEXTAREA") {
                    targetEl.style.height = "auto";
                    targetEl.style.height = targetEl.scrollHeight + "px";
                }
            }
            // Trigger autosave
            saveFormState();
        }
    } catch (err) {
        console.error("AI Generation failed:", err);
        alert("Gagal generate konten dengan AI: " + err.message);
    } finally {
        // Reset loading state
        if (isAll) {
            btnAll.classList.remove("loading");
            btnAll.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Semua`;
            Object.values(AI_FIELD_MAP).forEach(el => el && el.classList && el.classList.remove("ai-loading"));
        } else {
            btnInlines.forEach(b => {
                b.classList.remove("loading");
                b.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i>`;
            });
            const targetEl = AI_FIELD_MAP[field];
            if (targetEl) targetEl.classList.remove("ai-loading");
        }
    }
}

function setupAIButtons() {
    // Tombol "Generate Semua"
    const btnAll = document.getElementById("btn-generate-ai-all");
    if (btnAll) btnAll.addEventListener("click", () => generateWithAI("all"));

    // Tombol inline per-field
    document.querySelectorAll(".btn-ai-inline").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const field = btn.dataset.aiField;
            if (field) generateWithAI(field);
        });
    });

    // Tombol Training AI dari Drive
    const btnTrainDrive = document.getElementById("btn-train-ai-drive");
    if (btnTrainDrive) btnTrainDrive.addEventListener("click", () => scanDriveForAITraining());
}

// ============================================================
// DRIVE TRAINING CONTEXT — Cache dan fungsi scan Google Drive
// ============================================================

// Cache kontext training dari Drive (isi setelah scan)
let driveTrainingContext = localStorage.getItem("drive_training_context") || "";
let driveTrainingDocCount = parseInt(localStorage.getItem("drive_training_doc_count") || "0");

/**
 * Scan semua proposal di Google Drive dan simpan konteksnya ke localStorage
 * Context ini akan otomatis diinjeksikan ke system prompt AI saat generate
 */
async function scanDriveForAITraining() {
    const statusEl = document.getElementById("drive-training-status");
    const countEl = document.getElementById("drive-training-count");
    const btnEl = document.getElementById("btn-train-ai-drive");

    if (statusEl) statusEl.textContent = "🔄 Sedang scan Google Drive...";
    if (btnEl) { btnEl.disabled = true; btnEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning...'; }

    try {
        const url = `${googleAppsScriptUrl}?action=scanDriveForTraining`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json();

        if (data.status !== "success") throw new Error(data.message || "Scan gagal");

        const docs = data.docs || [];
        if (docs.length === 0) {
            if (statusEl) statusEl.textContent = "⚠️ Tidak ada dokumen proposal ditemukan di Drive.";
            return;
        }

        // Bangun konteks training dari semua dokumen yang ditemukan
        let contextParts = [];
        contextParts.push(`\n=== KONTEKS TAMBAHAN DARI GOOGLE DRIVE (${docs.length} DOKUMEN NYATA) ===\n`);

        docs.forEach((doc, idx) => {
            contextParts.push(`\n--- Referensi ${idx + 1}: ${doc.name} ---`);
            contextParts.push(`Path Drive: ${doc.path}`);
            // Ambil hanya bagian penting: nama kegiatan, tema, tujuan, penutup
            const excerpt = doc.excerpt || "";
            const lines = excerpt.split('\n').filter(l => l.trim().length > 0);
            // Ambil max 80 baris paling informatif
            const keyLines = lines.slice(0, 80).join('\n');
            contextParts.push(keyLines);
            contextParts.push(`--- Akhir Referensi ${idx + 1} ---\n`);
        });

        driveTrainingContext = contextParts.join('\n');
        driveTrainingDocCount = docs.length;

        // Simpan ke localStorage agar persist
        localStorage.setItem("drive_training_context", driveTrainingContext);
        localStorage.setItem("drive_training_doc_count", driveTrainingDocCount.toString());
        localStorage.setItem("drive_training_last_scan", new Date().toLocaleString("id-ID"));

        if (statusEl) statusEl.textContent = `✅ Berhasil melatih AI dengan ${docs.length} dokumen dari Drive!`;
        if (countEl) countEl.textContent = `${docs.length} dokumen`;

        // Tampilkan daftar dokumen yang berhasil dibaca
        const listEl = document.getElementById("drive-training-doclist");
        if (listEl) {
            listEl.innerHTML = docs.map(d =>
                `<li>📄 <a href="${d.url}" target="_blank">${d.name}</a> <span style="opacity:0.6;font-size:11px">${d.charCount.toLocaleString()} karakter</span></li>`
            ).join('');
        }

        // Notifikasi sukses
        const toast = document.getElementById("notif-bar");
        if (toast) {
            toast.textContent = `✅ AI berhasil diperkaya dengan ${docs.length} proposal dari Google Drive!`;
            toast.style.display = "block";
            setTimeout(() => { toast.style.display = "none"; }, 5000);
        }

    } catch (err) {
        if (statusEl) statusEl.textContent = "❌ Gagal scan Drive: " + err.message;
        console.error("scanDriveForAITraining error:", err);
    } finally {
        if (btnEl) { btnEl.disabled = false; btnEl.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> Scan & Train dari Drive'; }
    }
}

/**
 * Ambil konteks Drive yang tersimpan (digunakan saat generate AI)
 */
function getDriveTrainingContext() {
    // Refresh dari localStorage jika ada
    const stored = localStorage.getItem("drive_training_context");
    if (stored) driveTrainingContext = stored;
    return driveTrainingContext || "";
}


// Generate Document on Google Drive via POST
function generateDocumentOnDrive() {
    // Validation
    if (!genActivitySelect.value) {
        alert("Silakan pilih Kegiatan!");
        genActivitySelect.focus();
        return;
    }
    if (genActivitySelect.value === "__NEW__" && !genNewActivityName.value.trim()) {
        alert("Silakan masukkan Nama Kegiatan Baru!");
        genNewActivityName.focus();
        return;
    }
    if (!genDateInput.value.trim()) {
        alert("Silakan masukkan Tanggal Pelaksanaan!");
        genDateInput.focus();
        return;
    }
    if (!genPlaceInput.value.trim()) {
        alert("Silakan masukkan Tempat Pelaksanaan!");
        genPlaceInput.focus();
        return;
    }
    if (!genChairInput.value) {
        alert("Silakan pilih Ketua Pelaksana!");
        genChairInput.focus();
        return;
    }
    if (genChairInput.value === "__CUSTOM__" && !genCustomChairName.value.trim()) {
        alert("Silakan masukkan Nama Ketua Pelaksana manual!");
        genCustomChairName.focus();
        return;
    }
    if (!genNimInput.value.trim()) {
        alert("Silakan masukkan NIM Ketua!");
        genNimInput.focus();
        return;
    }
    if (!genDescInput.value.trim()) {
        alert("Silakan masukkan Ringkasan Kegiatan!");
        genDescInput.focus();
        return;
    }

    // Determine Chair Name
    let chairName = genChairInput.value;
    if (chairName === "__CUSTOM__") {
        chairName = genCustomChairName.value.trim();
    }

    // Assemble Budget Items if it is a proposal or keuangan
    const docType = genDocTypeSelect.value;
    const budgetItems = [];
    
    if (docType === "proposal" || docType === "keuangan") {
        const rows = budgetInputTbody.querySelectorAll("tr");
        let hasIncompleteRow = false;
        
        rows.forEach(row => {
            const name = row.querySelector(".item-name").value.trim();
            const qty = parseInt(row.querySelector(".item-qty").value) || 0;
            const price = parseInt(row.querySelector(".item-price").value) || 0;
            
            if (name) {
                budgetItems.push({ name, qty, price });
            } else if (rows.length > 1) {
                // If row is completely empty, we can skip it, but if it has qty/price and no name, warn
                if (price > 0) hasIncompleteRow = true;
            } else {
                hasIncompleteRow = true;
            }
        });

        if (hasIncompleteRow || budgetItems.length === 0) {
            alert("Harap isi rincian nama item anggaran secara lengkap!");
            return;
        }
    }

    // Dosen Pendamping validation for High Risk
    let dosenName = "";
    let dosenNidn = "";
    let dosenPhone = "";
    if (genRiskTypeSelect.value === "Resiko Tinggi" && (docType === "proposal" || docType === "lpj")) {
        dosenName = document.getElementById("gen-dosen-name").value.trim();
        dosenNidn = document.getElementById("gen-dosen-nidn").value.trim();
        dosenPhone = document.getElementById("gen-dosen-phone").value.trim();
        
        if (!dosenName) { alert("Silakan masukkan Nama Dosen Pendamping!"); document.getElementById("gen-dosen-name").focus(); return; }
        if (!dosenNidn) { alert("Silakan masukkan NIDN/NIK Dosen Pendamping!"); document.getElementById("gen-dosen-nidn").focus(); return; }
        if (!dosenPhone) { alert("Silakan masukkan Nomor Telp Dosen Pendamping!"); document.getElementById("gen-dosen-phone").focus(); return; }
    }

    // CPP Selections checklist
    const cppSelections = [];
    document.querySelectorAll(".cpp-checkbox:checked").forEach(cb => {
        cppSelections.push(cb.value);
    });

    // --- Gather Annex: Kepanitiaan (Wakil, Bendahara, Divisi) ---
    const subChairName = document.getElementById("gen-sub-chair").value || "";
    const subChairNim = document.getElementById("gen-sub-chair-nim").value || "";
    const treasurer1Name = document.getElementById("gen-treasurer-1").value || "";
    const treasurer1Nim = document.getElementById("gen-treasurer-1-nim").value || "";
    const treasurer2Name = document.getElementById("gen-treasurer-2").value || "";
    const treasurer2Nim = document.getElementById("gen-treasurer-2-nim").value || "";

    const divisions = [];
    document.querySelectorAll("#division-container .division-card").forEach(card => {
        const name = card.querySelector(".div-name").value.trim();
        let coor = card.querySelector(".div-coor-select").value || "";
        if (coor === "__CUSTOM__") {
            const customCoorEl = card.querySelector(".div-coor-custom-name");
            if (customCoorEl) coor = customCoorEl.value.trim();
        }
        const coorNim = card.querySelector(".div-coor-nim").value || "";
        
        // Serialize dynamic staff rows into a single string for backwards compatibility
        const staffItems = [];
        card.querySelectorAll(".staff-row").forEach(row => {
            const selectEl = row.querySelector(".staff-select");
            let sName = "";
            let sNim = "";
            if (selectEl && selectEl.value === "__CUSTOM__") {
                sName = row.querySelector(".staff-custom-name").value.trim();
                sNim = row.querySelector(".staff-nim").value.trim();
            } else if (selectEl && selectEl.value) {
                sName = selectEl.value;
                sNim = row.querySelector(".staff-nim").value.trim();
            }
            if (sName) {
                if (sNim) {
                    staffItems.push(`${sName} (NIM. ${sNim})`);
                } else {
                    staffItems.push(sName);
                }
            }
        });
        const staffs = staffItems.join("\n");
        if (name) {
            divisions.push({ name, coor, coorNim, staffs });
        }
    });

    // --- Gather Annex: Rundown ---
    const rundownRows = [];
    document.querySelectorAll("#rundown-tbody tr").forEach(row => {
        const start = row.querySelector(".run-start").value.trim();
        const end = row.querySelector(".run-end").value.trim();
        const duration = row.querySelector(".run-duration").value.trim();
        const activity = row.querySelector(".run-activity").value.trim();
        const pic = row.querySelector(".run-pic").value.trim();
        const place = row.querySelector(".run-place").value.trim();
        const dress = row.querySelector(".run-dress").value.trim();
        if (start && activity) {
            rundownRows.push({ start, end, duration, activity, pic, place, dress });
        }
    });

    // --- Gather Annex: Mitigasi Risiko ---
    const mitigationRows = [];
    document.querySelectorAll("#mitigation-tbody tr").forEach(row => {
        const activity = row.querySelector(".mit-activity").value.trim();
        const danger = row.querySelector(".mit-danger").value.trim();
        const prob = row.querySelector(".mit-prob").value;
        const sev = row.querySelector(".mit-sev").value;
        const control = row.querySelector(".mit-control").value.trim();
        const pic = row.querySelector(".mit-pic").value.trim();
        if (activity && danger) {
            mitigationRows.push({ activity, danger, prob, sev, control, pic });
        }
    });

    // Disable button & show spinner
    btnGenerateDoc.disabled = true;
    const originalText = btnGenerateDoc.innerHTML;
    btnGenerateDoc.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sedang Membuat Dokumen di Google Drive...';
    docResultCard.classList.add("hidden");

    // Extract Proker Name
    const prokerName = genActivitySelect.value === "__NEW__" 
        ? genNewActivityName.value.trim().toUpperCase() 
        : genActivitySelect.value;

    const payload = {
        action: "createDoc",
        docType: docType,
        riskType: genRiskTypeSelect.value,
        prokerName: prokerName,
        tanggal: genDateInput.value.trim(),
        pukul: genTimeInput.value.trim(),
        tempat: genPlaceInput.value.trim(),
        tema: genTemaInput.value.trim(),
        ketua: chairName,
        nim: genNimInput.value.trim(),
        departemen: genDeptInput.value.trim(),
        deskripsi: genDescInput.value.trim(),
        tujuan: genTujuanInput.value.trim(),
        manfaat: genManfaatInput.value.trim(),
        peserta: genPesertaInput.value.trim(),
        sekretaris: genSecretarySelect.value || "",
        nimSekretaris: genSecretaryNimInput.value.trim(),
        penutup: genPenutupInput.value.trim(),
        tanggalPengesahan: genApprovalDateInput.value.trim(),
        budgetItems: budgetItems,
        totalAnggaran: (docType === "proposal" || docType === "keuangan") ? calculateGrandTotal() : 0,
        
        // New Annexes Data
        subChairName,
        subChairNim,
        treasurer1Name,
        treasurer1Nim,
        treasurer2Name,
        treasurer2Nim,
        divisions,
        rundownRows,
        mitigationRows,
        
        // Dosen Info & CPP selections
        dosenName,
        dosenNidn,
        dosenPhone,
        cppSelections
    };

    fetch(googleAppsScriptUrl, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error("Google Apps Script returned status " + res.status);
        return res.json();
    })
    .then(data => {
        if (data.status === "success") {
            // Show Success Card
            generatedDocTitle.textContent = data.fileName;
            btnOpenDoc.href = data.docUrl;
            docResultCard.classList.remove("hidden");
            
            // Trigger AI QA Audit
            try {
                const docIdMatch = data.docUrl.match(/id=([^&]+)/) || data.docUrl.match(/\/d\/([^/]+)/);
                const docId = docIdMatch ? docIdMatch[1] : null;
                if (docId) {
                    runAIAudit(docId, payload);
                }
            } catch (auditErr) {
                console.error("Gagal men-trigger AI audit:", auditErr);
            }
            
            /*
            // Clear fields
            genDateInput.value = "";
            genTimeInput.value = "";
            genApprovalDateInput.value = "";
            genPlaceInput.value = "";
            genTemaInput.value = "";
            genChairInput.selectedIndex = 0;
            genCustomChairName.value = "";
            genCustomChairContainer.classList.add("hidden-transition");
            genCustomChairContainer.classList.remove("show-transition");
            genNimInput.value = "";
            genNimInput.readOnly = true;
            genDeptInput.value = "";
            genDeptInput.readOnly = true;
            genDescInput.value = "";
            genTujuanInput.value = "";
            genManfaatInput.value = "";
            genPesertaInput.value = "";
            genSecretarySelect.selectedIndex = 0;
            genSecretaryNimInput.value = "";
            genPenutupInput.value = "";
            
            // Clear Dosen info fields
            const dosenContainer = document.getElementById("gen-dosen-container");
            if (dosenContainer) {
                dosenContainer.classList.add("hidden-transition");
                dosenContainer.classList.remove("show-transition");
            }
            const dosenNameInput = document.getElementById("gen-dosen-name");
            if (dosenNameInput) dosenNameInput.value = "";
            const dosenNidnInput = document.getElementById("gen-dosen-nidn");
            if (dosenNidnInput) dosenNidnInput.value = "";
            const dosenPhoneInput = document.getElementById("gen-dosen-phone");
            if (dosenPhoneInput) dosenPhoneInput.value = "";
            
            // Reset CPP checkboxes
            document.querySelectorAll(".cpp-checkbox").forEach(cb => {
                cb.checked = (cb.value === "Integritas" || cb.value === "Tanggung Jawab" || cb.value === "Kedisiplinan" || cb.value === "Kerjasama");
            });
            
            // Clear new annex inputs
            document.getElementById("gen-sub-chair").selectedIndex = 0;
            document.getElementById("gen-sub-chair-nim").value = "";
            document.getElementById("gen-treasurer-1").selectedIndex = 0;
            document.getElementById("gen-treasurer-1-nim").value = "";
            document.getElementById("gen-treasurer-2").selectedIndex = 0;
            document.getElementById("gen-treasurer-2-nim").value = "";
            
            document.getElementById("division-container").innerHTML = "";
            document.getElementById("rundown-tbody").innerHTML = "";
            document.getElementById("mitigation-tbody").innerHTML = "";
            
            setupBudgetTable();
            setupAnnexFields(); // re-initialize default rows
            */
            
            // Refresh Database to get the new activity in dropdown lists if created
            if (genActivitySelect.value === "__NEW__") {
                tryFetchDatabase();
            }
            
            docResultCard.scrollIntoView({ behavior: 'smooth' });
        } else {
            throw new Error(data.message || "Unknown error occurred on Google Drive");
        }
    })
    .catch(err => {
        console.error("Error creating document:", err);
        alert("Gagal membuat dokumen di Google Drive: " + err.message + "\n\nPastikan template Anda bernama 'Template Proposal' atau 'Template LPJ' dan berada di dalam folder yang benar.");
    })
    .finally(() => {
        btnGenerateDoc.disabled = false;
        btnGenerateDoc.innerHTML = originalText;
    });
}

// Formatting rupiah in UI
function formatRupiah(amount) {
    if (amount === null || amount === undefined) return "Rp 0";
    const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "Rp " + formatted;
}

// ============================================================
// Collapsible Panels (Expander UI) Logic
// ============================================================
function setupCollapsiblePanels() {
    const headers = document.querySelectorAll(".collapsible-header");
    headers.forEach(header => {
        header.addEventListener("click", () => {
            const panel = header.parentElement;
            const content = panel.querySelector(".collapsible-content");
            const isOpen = panel.classList.contains("active-panel");
            
            if (isOpen) {
                panel.classList.remove("active-panel");
                content.style.display = "none";
            } else {
                panel.classList.add("active-panel");
                content.style.display = "flex";
            }
        });
    });
}

// ============================================================
// Dynamic Annex Fields Logic (Panitia, Rundown, Mitigasi)
// ============================================================
function setupAnnexFields() {
    // Buttons
    const btnAddDiv = document.getElementById("btn-add-division");
    const btnAddRun = document.getElementById("btn-add-rundown");
    const btnAddMit = document.getElementById("btn-add-mitigation");

    // Add event listeners
    if (btnAddDiv) btnAddDiv.addEventListener("click", () => addDivisionCard());
    if (btnAddRun) btnAddRun.addEventListener("click", () => addRundownRow());
    if (btnAddMit) btnAddMit.addEventListener("click", () => addMitigationRow());

    // Add first rows by default (optional, let's add one by default to make it visible)
    addRundownRow("08.00", "08.30", 30, "Registrasi Peserta", "Sie Acara", "Aula", "Baju Bebas Sopan");
    addMitigationRow("Perjalanan ke Lokasi", "Kecelakaan Lalu Lintas", 2, 4, "Mematuhi rambu lalu lintas & berdoa", "Ketua Panitia");
}

// 👥 Dynamic Division Card
function addDivisionCard(divName = "", coorName = "", coorNim = "", staffsText = "") {
    const container = document.getElementById("division-container");
    if (!container) return;

    const divCard = document.createElement("div");
    divCard.className = "division-card";

    // Determine if the coordinator name is custom (not in committeeDb)
    const isCustomCoor = coorName && coorName !== "" && !committeeDb.some(m => m.name === coorName);
    const coorSelectValue = isCustomCoor ? "__CUSTOM__" : coorName;

    // Populate coordinator options
    let coorOptions = '<option value="" disabled selected>-- Pilih Koor (opsional) --</option>';
    committeeDb.forEach(m => {
        const selected = m.name === coorSelectValue ? "selected" : "";
        coorOptions += `<option value="${m.name}" data-nim="${m.nim}" ${selected}>${m.name}</option>`;
    });
    coorOptions += `<option value="__CUSTOM__" ${isCustomCoor ? "selected" : ""}>-- Masukkan Manual --</option>`;

    divCard.innerHTML = `
        <button type="button" class="btn-remove-division" title="Hapus Divisi">&times;</button>
        <div class="input-row">
            <div class="input-group">
                <label>Nama Divisi/Seksi</label>
                <input type="text" class="div-name" placeholder="Contoh: Sie Perlengkapan" value="${divName}" required>
            </div>
            <div class="input-row" style="margin: 0; width: 100%;">
                <div class="input-group">
                    <label>Koordinator</label>
                    <select class="div-coor-select">
                        ${coorOptions}
                    </select>
                    <input type="text" class="div-coor-custom-name ${isCustomCoor ? "" : "hidden"}" placeholder="Nama koordinator manual" value="${isCustomCoor ? coorName : ""}" style="margin-top: 8px;">
                </div>
                <div class="input-group">
                    <label>NIM Koor</label>
                    <input type="text" class="div-coor-nim" placeholder="NIM" value="${coorNim}" ${isCustomCoor ? "" : "readonly"}>
                </div>
            </div>
        </div>
        <div class="input-group staff-list-group">
            <label>Anggota Staff</label>
            <div class="staff-rows-container"></div>
            <button type="button" class="btn-add-staff">
                <i class="fa-solid fa-plus"></i> Tambah Staff
            </button>
        </div>
    `;

    // Remove button handler
    divCard.querySelector(".btn-remove-division").addEventListener("click", () => {
        divCard.remove();
    });

    // Coordinator select handler (auto fill NIM & toggle manual input)
    const selectEl = divCard.querySelector(".div-coor-select");
    const nimEl = divCard.querySelector(".div-coor-nim");
    const customNameEl = divCard.querySelector(".div-coor-custom-name");

    selectEl.addEventListener("change", () => {
        if (selectEl.value === "__CUSTOM__") {
            customNameEl.classList.remove("hidden");
            customNameEl.required = true;
            customNameEl.value = "";
            nimEl.value = "";
            nimEl.readOnly = false;
            nimEl.placeholder = "Masukkan NIM Koor manual";
        } else if (selectEl.value) {
            customNameEl.classList.add("hidden");
            customNameEl.required = false;
            nimEl.value = selectEl.options[selectEl.selectedIndex].dataset.nim || "";
            nimEl.readOnly = true;
        } else {
            customNameEl.classList.add("hidden");
            customNameEl.required = false;
            nimEl.value = "";
            nimEl.readOnly = true;
            nimEl.placeholder = "NIM";
        }
    });

    // Add Staff row handler
    const btnAddStaff = divCard.querySelector(".btn-add-staff");
    btnAddStaff.addEventListener("click", () => {
        addStaffRow(divCard);
    });

    // Populate staff rows from staffsText
    if (staffsText) {
        const lines = staffsText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        lines.forEach(line => {
            let name = line;
            let nim = "";

            const nimMatch = line.match(/(.*?)\s*[\(\-\/]\s*NIM\.?\s*(\d+)\s*\)?/i) || 
                             line.match(/(.*?)\s*[\(\-\/]\s*(\d+)\s*\)?/);
            if (nimMatch) {
                name = nimMatch[1].trim();
                nim = nimMatch[2].trim();
            }

            const member = committeeDb.find(m => m.name.toLowerCase() === name.toLowerCase());
            if (member) {
                addStaffRow(divCard, member.name, member.nim, false);
            } else {
                addStaffRow(divCard, name, nim, true);
            }
        });
    } else {
        // Add one empty staff row by default for convenience
        addStaffRow(divCard);
    }

    container.appendChild(divCard);
}

// 👥 Add Individual Staff Row Helper
function addStaffRow(divCard, staffName = "", staffNim = "", isManual = false) {
    const container = divCard.querySelector(".staff-rows-container");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "staff-row";
    
    // Check if staff name is manually entered or matches a Himpunan member
    const matchesHimpunan = !isManual && staffName && committeeDb.some(m => m.name === staffName);
    const selectedVal = matchesHimpunan ? staffName : (staffName ? "__CUSTOM__" : "");
    const showCustomInput = !matchesHimpunan && staffName !== "";
    
    // Build options
    let staffOptions = '<option value="" disabled selected>-- Pilih Staff --</option>';
    committeeDb.forEach(m => {
        const selected = m.name === selectedVal ? "selected" : "";
        staffOptions += `<option value="${m.name}" data-nim="${m.nim}" ${selected}>${m.name}</option>`;
    });
    staffOptions += `<option value="__CUSTOM__" ${selectedVal === "__CUSTOM__" ? "selected" : ""}>-- Masukkan Manual --</option>`;

    row.innerHTML = `
        <select class="staff-select">
            ${staffOptions}
        </select>
        <input type="text" class="staff-custom-name ${showCustomInput ? "" : "hidden"}" placeholder="Nama staff manual" value="${!matchesHimpunan ? staffName : ""}">
        <input type="text" class="staff-nim" placeholder="NIM" value="${staffNim}" ${showCustomInput || isManual ? "" : "readonly"}>
        <button type="button" class="btn-remove-staff" title="Hapus Staff">&times;</button>
    `;

    const selectEl = row.querySelector(".staff-select");
    const customNameEl = row.querySelector(".staff-custom-name");
    const nimEl = row.querySelector(".staff-nim");

    selectEl.addEventListener("change", () => {
        if (selectEl.value === "__CUSTOM__") {
            customNameEl.classList.remove("hidden");
            customNameEl.required = true;
            customNameEl.value = "";
            nimEl.value = "";
            nimEl.readOnly = false;
            nimEl.placeholder = "NIM manual";
            row.classList.add("has-custom");
        } else if (selectEl.value) {
            customNameEl.classList.add("hidden");
            customNameEl.required = false;
            nimEl.value = selectEl.options[selectEl.selectedIndex].dataset.nim || "";
            nimEl.readOnly = true;
            nimEl.placeholder = "NIM";
            row.classList.remove("has-custom");
        } else {
            customNameEl.classList.add("hidden");
            customNameEl.required = false;
            nimEl.value = "";
            nimEl.readOnly = true;
            nimEl.placeholder = "NIM";
            row.classList.remove("has-custom");
        }
    });

    if (showCustomInput || isManual) {
        row.classList.add("has-custom");
    }

    row.querySelector(".btn-remove-staff").addEventListener("click", () => {
        row.remove();
    });

    container.appendChild(row);
}

// 📅 Dynamic Rundown Row
function addRundownRow(start = "", end = "", duration = 0, activity = "", pic = "", place = "", dress = "") {
    const tbody = document.getElementById("rundown-tbody");
    if (!tbody) return;

    // If no start time is specified, default to the previous row's end time
    if (!start) {
        const rows = tbody.querySelectorAll("tr");
        if (rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            const lastEndInput = lastRow.querySelector(".run-end");
            if (lastEndInput) {
                start = lastEndInput.value.trim();
            }
        }
    }

    // Default end time to start time if empty
    if (!end && start) {
        end = start;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>
            <div style="display: flex; gap: 4px; align-items: center;">
                <input type="text" class="run-start" placeholder="08.00" value="${start}" style="padding: 4px;" required>
                <span>-</span>
                <input type="text" class="run-end" placeholder="08.30" value="${end}" style="padding: 4px;" required>
            </div>
        </td>
        <td><input type="number" class="run-duration" placeholder="30" value="${duration}" required></td>
        <td><input type="text" class="run-activity" placeholder="Pembukaan Acara" value="${activity}" required></td>
        <td><input type="text" class="run-pic" placeholder="Sie Acara" value="${pic}" required></td>
        <td><input type="text" class="run-place" placeholder="Aula Utama" value="${place}" required></td>
        <td><input type="text" class="run-dress" placeholder="Batik HMIF" value="${dress}"></td>
        <td><button type="button" class="btn-remove-row" style="background:transparent; border:none; color:#cbd5e1; font-size:1.2rem; cursor:pointer;">&times;</button></td>
    `;

    const startInput = tr.querySelector(".run-start");
    const endInput = tr.querySelector(".run-end");

    // Listen to changes in the end time to update the start time of the next row
    endInput.addEventListener("input", () => {
        const nextTr = tr.nextElementSibling;
        if (nextTr) {
            const nextStartInput = nextTr.querySelector(".run-start");
            if (nextStartInput) {
                nextStartInput.value = endInput.value;
            }
        }
    });

    // Remove row handler
    tr.querySelector(".btn-remove-row").addEventListener("click", () => {
        tr.remove();
    });

    tbody.appendChild(tr);
}

// 🛡️ Dynamic Mitigation Row
function addMitigationRow(activity = "", danger = "", probability = 1, severity = 1, control = "", pic = "") {
    const tbody = document.getElementById("mitigation-tbody");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input type="text" class="mit-activity" placeholder="Pemasangan Tenda" value="${activity}" required></td>
        <td><input type="text" class="mit-danger" placeholder="Tenda Roboh tertiup angin" value="${danger}" required></td>
        <td>
            <select class="mit-prob">
                ${[1,2,3,4,5].map(n => `<option value="${n}" ${n == probability ? "selected" : ""}>${n}</option>`).join("")}
            </select>
        </td>
        <td>
            <select class="mit-sev">
                ${[1,2,3,4,5].map(n => `<option value="${n}" ${n == severity ? "selected" : ""}>${n}</option>`).join("")}
            </select>
        </td>
        <td><span class="mitigation-level-display risk-low">1</span></td>
        <td><input type="text" class="mit-control" placeholder="Memastikan jangkar tenda kuat & dipantau berkala" value="${control}" required></td>
        <td><input type="text" class="mit-pic" placeholder="Koor Perkap" value="${pic}" required></td>
        <td><button type="button" class="btn-remove-row" style="background:transparent; border:none; color:#cbd5e1; font-size:1.2rem; cursor:pointer;">&times;</button></td>
    `;

    // Calculate Risk Level (Probability * Severity)
    const probSelect = tr.querySelector(".mit-prob");
    const sevSelect = tr.querySelector(".mit-sev");
    const levelDisplay = tr.querySelector(".mitigation-level-display");

    const updateRiskLevel = () => {
        const prob = parseInt(probSelect.value) || 1;
        const sev = parseInt(sevSelect.value) || 1;
        const total = prob * sev;
        
        levelDisplay.textContent = total;
        levelDisplay.className = "mitigation-level-display";
        
        if (total <= 5) {
            levelDisplay.classList.add("risk-low");
        } else if (total <= 12) {
            levelDisplay.classList.add("risk-medium");
        } else {
            levelDisplay.classList.add("risk-high");
        }
    };

    probSelect.addEventListener("change", updateRiskLevel);
    sevSelect.addEventListener("change", updateRiskLevel);
    updateRiskLevel(); // Initial calculation

    // Remove row handler
    tr.querySelector(".btn-remove-row").addEventListener("click", () => {
        tr.remove();
    });

    tbody.appendChild(tr);
}

// ============================================================
// TAB 3: TREASURER (BENDAHARA) DOCUMENT GENERATOR
// ============================================================

function setupTreasurerTab() {
    const actSelect = document.getElementById("treasurer-activity-select");
    const templateSelect = document.getElementById("treasurer-template-select");
    const btnAddRab = document.getElementById("btn-add-rab-row");
    const btnAddLpj = document.getElementById("btn-add-lpj-row");
    const btnGenerate = document.getElementById("btn-generate-treasurer");

    populateTreasurerDropdowns();
    fetchTreasurerTemplates();

    if (actSelect) actSelect.addEventListener("change", handleTreasurerActivityChange);
    if (templateSelect) templateSelect.addEventListener("change", handleTreasurerTemplateChange);
    if (btnAddRab) btnAddRab.addEventListener("click", () => addRabRow());
    if (btnAddLpj) btnAddLpj.addEventListener("click", () => addLpjRow());
    if (btnGenerate) btnGenerate.addEventListener("click", generateTreasurerDocument);

    const btnShowTreas = document.getElementById("btn-show-treasurer-activity");
    if (btnShowTreas) btnShowTreas.addEventListener("click", () => toggleNewActivity("treasurer"));
    const btnSaveTreas = document.getElementById("btn-save-treasurer-activity");
    if (btnSaveTreas) btnSaveTreas.addEventListener("click", saveTreasurerNewActivity);

    addRabRow("", 1, "", 0, "");
    addLpjRow("", "", 0, 0);
}

function populateTreasurerDropdowns() {
    const actSelect = document.getElementById("treasurer-activity-select");
    if (!actSelect) return;
    const previousSelection = actSelect.value;
    actSelect.innerHTML = "";
    
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = !previousSelection;
    placeholder.textContent = "-- Pilih Kegiatan --";
    actSelect.appendChild(placeholder);
    
    Object.keys(activitiesDb).sort().forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        if (name === previousSelection) opt.selected = true;
        actSelect.appendChild(opt);
    });
    
    const newOption = document.createElement("option");
    newOption.value = "__NEW__";
    newOption.textContent = "+ Tambah Kegiatan Baru";
    if (previousSelection === "__NEW__") newOption.selected = true;
    actSelect.appendChild(newOption);
}

function fetchTreasurerTemplates() {
    const templateSelect = document.getElementById("treasurer-template-select");
    const badge = document.getElementById("treasurer-status-badge");
    if (!templateSelect) return;
    templateSelect.innerHTML = '<option value="" disabled selected>-- Memuat Template dari Drive... --</option>';

    populateTreasurerFallbackTemplates();

    fetch(googleAppsScriptUrl + "?action=listTreasurerTemplates")
        .then(res => res.json())
        .then(data => {
            if (data && data.status === "success" && Array.isArray(data.files) && data.files.length > 0) {
                const validFiles = data.files.filter(f => {
                    const mime = f.mimeType || "";
                    return mime === "application/vnd.google-apps.document" ||
                           mime === "application/vnd.google-apps.spreadsheet";
                });
                if (validFiles.length > 0) {
                    templateSelect.innerHTML = '<option value="" disabled selected>-- Pilih Template Bendahara --</option>';
                    validFiles.forEach(f => {
                        const opt = document.createElement("option");
                        opt.value = f.id;
                        opt.textContent = f.name;
                        opt.dataset.mime = f.mimeType;
                        templateSelect.appendChild(opt);
                    });
                    if (badge) {
                        badge.textContent = validFiles.length + " Template Tersedia";
                        badge.style.backgroundColor = "hsl(142, 69%, 95%)";
                        badge.style.color = "var(--success-color)";
                        badge.style.borderColor = "hsl(142, 45%, 85%)";
                    }
                }
            } else {
                console.warn("Template data tidak valid dari server, menggunakan fallback lokal.");
                if (badge) {
                    badge.textContent = "Database Lokal (Fallback)";
                    badge.style.backgroundColor = "var(--primary-light)";
                    badge.style.color = "var(--primary-color)";
                    badge.style.borderColor = "hsl(150, 45%, 88%)";
                }
            }
        })
        .catch(err => {
            console.warn("Gagal memuat template bendahara:", err);
            if (badge) {
                badge.textContent = "Database Lokal (Fallback)";
                badge.style.backgroundColor = "var(--primary-light)";
                badge.style.color = "var(--primary-color)";
                badge.style.borderColor = "hsl(150, 45%, 88%)";
            }
        });
}

function populateTreasurerFallbackTemplates() {
    const templateSelect = document.getElementById("treasurer-template-select");
    if (!templateSelect) return;
    templateSelect.innerHTML = '<option value="" disabled selected>-- Pilih Template Bendahara --</option>';
    const fallback = [
        { id: "rab", name: "Template RAB (Local Mode)" },
        { id: "lpjkeu", name: "Template LPJ Keuangan (Local Mode)" }
    ];
    fallback.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f.id;
        opt.textContent = f.name;
        templateSelect.appendChild(opt);
    });
}

function handleTreasurerActivityChange() {
    const actSelect = document.getElementById("treasurer-activity-select");
    const deptInput = document.getElementById("treasurer-dept-input");
    if (!actSelect || !deptInput) return;
    const val = actSelect.value;
    if (val === "__NEW__") {
        const container = document.getElementById("treasurer-new-activity-container");
        if (container) {
            container.classList.remove("hidden-transition");
            container.classList.add("show-transition");
        }
        const nameInput = document.getElementById("treasurer-new-activity-name");
        if (nameInput) {
            nameInput.required = true;
            nameInput.value = "";
            nameInput.focus();
        }
        deptInput.value = "";
        deptInput.readOnly = false;
        return;
    } else {
        const container = document.getElementById("treasurer-new-activity-container");
        if (container) {
            container.classList.add("hidden-transition");
            container.classList.remove("show-transition");
        }
        const nameInput = document.getElementById("treasurer-new-activity-name");
        if (nameInput) nameInput.required = false;
    }
    
    if (val) {
        const matchingActivity = Object.keys(activitiesDb).find(k => k === val);
        if (matchingActivity) {
            const entry = activitiesDb[matchingActivity];
            const dept = entry.department || getDeptForActivity(val);
            deptInput.value = dept;
        } else {
            deptInput.value = getDeptForActivity(val);
        }
        deptInput.readOnly = true;
    } else {
        deptInput.value = "";
        deptInput.readOnly = true;
    }
}

function getDeptForActivity(activityName) {
    if (!activityName) return "Executive Board (EB)";
    if (activityDeptMap[activityName]) return activityDeptMap[activityName];
    const act = activityName.toUpperCase();
    if (act.indexOf("TALENT DEVELOPMENT") !== -1 || act.indexOf("TDI") !== -1) return "Talent Development & Innovation";
    if (act.indexOf("HUMANITY IMPACT") !== -1 || act.indexOf("HID") !== -1) return "Humanity Impact & Development";
    if (act.indexOf("HUMAN CAPITAL") !== -1 || act.indexOf("HCCB") !== -1) return "Human Capital & Character Building";
    if (act.indexOf("FINANCE") !== -1 || act.indexOf("FED") !== -1) return "Finance & Enterprise Development";
    if (act.indexOf("EXTERNAL") !== -1 || act.indexOf("ERA") !== -1) return "External Relations & Advocacy";
    if (act.indexOf("CREATIVE CONTENT") !== -1 || act.indexOf("CCO") !== -1) return "Creative Content & Outreach";
    return "Executive Board (EB)";
}

function handleTreasurerTemplateChange() {
    const templateSelect = document.getElementById("treasurer-template-select");
    const rabSection = document.getElementById("rab-table-section");
    const lpjSection = document.getElementById("lpj-table-section");
    const subsidiGroup = document.getElementById("subsidi-input-group");

    if (!templateSelect) return;
    const val = templateSelect.value;
    if (!val) {
        if (rabSection) rabSection.classList.add("hidden-transition");
        if (lpjSection) lpjSection.classList.add("hidden-transition");
        if (subsidiGroup) subsidiGroup.classList.add("hidden-transition");
        return;
    }

    const isRAB = val === "rab" || document.querySelector(`#treasurer-template-select option[value="${val}"]`)?.textContent.toUpperCase().indexOf("RAB") !== -1;

    if (isRAB) {
        if (rabSection) { rabSection.classList.remove("hidden-transition"); rabSection.classList.add("show-transition"); }
        if (lpjSection) { lpjSection.classList.add("hidden-transition"); lpjSection.classList.remove("show-transition"); }
        if (subsidiGroup) { subsidiGroup.classList.add("hidden-transition"); subsidiGroup.classList.remove("show-transition"); }
    } else {
        if (rabSection) { rabSection.classList.add("hidden-transition"); rabSection.classList.remove("show-transition"); }
        if (lpjSection) { lpjSection.classList.remove("hidden-transition"); lpjSection.classList.add("show-transition"); }
        if (subsidiGroup) { subsidiGroup.classList.remove("hidden-transition"); subsidiGroup.classList.add("show-transition"); }
    }
}

let rabRowCounter = 0;
let lpjRowCounter = 0;

function addRabRow(name = "", qty = 1, unit = "", price = 0, desc = "", type = "pengeluaran") {
    rabRowCounter++;
    const tbody = document.getElementById("rab-table-body");
    if (!tbody) return;
    const tr = document.createElement("tr");
    tr.id = `rab-row-${rabRowCounter}`;
    tr.innerHTML = `
        <td>
            <select class="rab-type" style="width:100%;padding:6px;border:1px solid var(--border-color);border-radius:6px;">
                <option value="pemasukan" ${type === "pemasukan" ? "selected" : ""}>Pemasukan</option>
                <option value="pengeluaran" ${type === "pengeluaran" ? "selected" : ""}>Pengeluaran</option>
            </select>
        </td>
        <td><input type="text" class="rab-name" placeholder="Nama item" value="${name}" style="width:100%;padding:6px;border:1px solid var(--border-color);border-radius:6px;"></td>
        <td><input type="number" class="rab-qty" min="1" value="${qty}" style="width:100%;padding:6px;border:1px solid var(--border-color);border-radius:6px;text-align:center;"></td>
        <td><input type="text" class="rab-unit" placeholder="Paket" value="${unit}" style="width:100%;padding:6px;border:1px solid var(--border-color);border-radius:6px;"></td>
        <td><input type="number" class="rab-price" min="0" value="${price}" style="width:100%;padding:6px;border:1px solid var(--border-color);border-radius:6px;text-align:right;"></td>
        <td><input type="text" class="rab-desc" placeholder="Keterangan" value="${desc}" style="width:100%;padding:6px;border:1px solid var(--border-color);border-radius:6px;"></td>
        <td style="text-align:center;">
            <button type="button" class="btn-delete-row" style="background:transparent;border:none;color:#e53e3e;padding:6px;cursor:pointer;">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </td>
    `;
    tr.querySelector(".btn-delete-row").addEventListener("click", () => {
        if (tbody.querySelectorAll("tr").length > 1) {
            tr.remove();
        } else {
            alert("RAB harus memiliki minimal 1 item!");
        }
    });
    tbody.appendChild(tr);
}

function addLpjRow(date = "", desc = "", priceBefore = 0, pphCut = 0) {
    lpjRowCounter++;
    const tbody = document.getElementById("lpj-table-body");
    if (!tbody) return;
    const tr = document.createElement("tr");
    tr.id = `lpj-row-${lpjRowCounter}`;
    const paid = priceBefore - pphCut;
    tr.innerHTML = `
        <td><input type="text" class="lpj-date" placeholder="Tgl" value="${date}" style="width:100%;padding:6px;border:1px solid var(--border-color);border-radius:6px;"></td>
        <td><input type="text" class="lpj-desc" placeholder="Uraian Belanja" value="${desc}" style="width:100%;padding:6px;border:1px solid var(--border-color);border-radius:6px;"></td>
        <td><input type="number" class="lpj-price" min="0" value="${priceBefore}" style="width:100%;padding:6px;border:1px solid var(--border-color);border-radius:6px;text-align:right;"></td>
        <td><input type="number" class="lpj-pph" min="0" value="${pphCut}" style="width:100%;padding:6px;border:1px solid var(--border-color);border-radius:6px;text-align:right;"></td>
        <td style="text-align:right;font-weight:700;" class="lpj-paid-display">${formatRupiah(paid)}</td>
        <td style="text-align:center;">
            <button type="button" class="btn-delete-row" style="background:transparent;border:none;color:#e53e3e;padding:6px;cursor:pointer;">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </td>
    `;
    const priceInput = tr.querySelector(".lpj-price");
    const pphInput = tr.querySelector(".lpj-pph");
    const paidDisplay = tr.querySelector(".lpj-paid-display");
    const updatePaid = () => {
        const p = parseFloat(priceInput.value) || 0;
        const cut = parseFloat(pphInput.value) || 0;
        paidDisplay.textContent = formatRupiah(p - cut);
    };
    priceInput.addEventListener("input", updatePaid);
    pphInput.addEventListener("input", updatePaid);
    tr.querySelector(".btn-delete-row").addEventListener("click", () => {
        if (tbody.querySelectorAll("tr").length > 1) {
            tr.remove();
        } else {
            alert("LPJ harus memiliki minimal 1 transaksi!");
        }
    });
    tbody.appendChild(tr);
}

function generateTreasurerDocument() {
    const actSelect = document.getElementById("treasurer-activity-select");
    const deptInput = document.getElementById("treasurer-dept-input");
    const templateSelect = document.getElementById("treasurer-template-select");
    const subsidiInput = document.getElementById("treasurer-subsidi-input");
    const btnGen = document.getElementById("btn-generate-treasurer");
    const resultCard = document.getElementById("treasurer-result-card");
    const docTitle = document.getElementById("treasurer-doc-title");
    const openLink = document.getElementById("btn-open-treasurer-doc");

    if (!actSelect.value) { alert("Silakan pilih Nama Kegiatan!"); actSelect.focus(); return; }
    if (!templateSelect.value) { alert("Silakan pilih Template!"); templateSelect.focus(); return; }
    if (templateSelect.value === "rab" || templateSelect.value === "lpjkeu") {
        alert("Template tidak tersedia di Google Drive. Periksa koneksi atau folder BENDAHARA di Drive.");
        return;
    }
    if (!deptInput.value.trim()) { alert("Departemen tidak boleh kosong!"); deptInput.focus(); return; }

    btnGen.disabled = true;
    btnGen.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Membuat Dokumen Keuangan...';
    if (resultCard) resultCard.classList.add("hidden");

    const isRAB = templateSelect.value === "rab" || document.querySelector(`#treasurer-template-select option[value="${templateSelect.value}"]`)?.textContent.toUpperCase().indexOf("RAB") !== -1;

    let items = [];
    if (isRAB) {
        document.querySelectorAll("#rab-table-body tr").forEach(row => {
            const name = row.querySelector(".rab-name")?.value.trim();
            if (name) {
                items.push({
                    type: row.querySelector(".rab-type")?.value || "pengeluaran",
                    name: name,
                    qty: parseFloat(row.querySelector(".rab-qty")?.value) || 1,
                    unit: row.querySelector(".rab-unit")?.value.trim() || "Paket",
                    price: parseFloat(row.querySelector(".rab-price")?.value) || 0,
                    desc: row.querySelector(".rab-desc")?.value.trim() || ""
                });
            }
        });
    } else {
        document.querySelectorAll("#lpj-table-body tr").forEach(row => {
            const desc = row.querySelector(".lpj-desc")?.value.trim();
            if (desc) {
                items.push({
                    date: row.querySelector(".lpj-date")?.value.trim() || "",
                    desc: desc,
                    priceBeforePPh: parseFloat(row.querySelector(".lpj-price")?.value) || 0,
                    pphCut: parseFloat(row.querySelector(".lpj-pph")?.value) || 0
                });
            }
        });
    }

    if (items.length === 0) {
        alert("Harap isi minimal 1 item pada tabel!");
        btnGen.disabled = false;
        btnGen.innerHTML = '<i class="fa-solid fa-file-circle-plus"></i> Buat Dokumen Keuangan';
        return;
    }

    const payload = {
        action: "createTreasurerDocument",
        templateId: templateSelect.value,
        prokerName: actSelect.value,
        departemen: deptInput.value.trim(),
        subsidi: parseFloat(subsidiInput?.value) || 0,
        items: items
    };

    fetch(googleAppsScriptUrl, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error("API returned status " + res.status);
        return res.json();
    })
    .then(data => {
        if (data.status === "success") {
            if (docTitle) docTitle.textContent = data.fileName;
            if (openLink) openLink.href = data.docUrl;
            if (resultCard) resultCard.classList.remove("hidden");
            if (resultCard) resultCard.scrollIntoView({ behavior: "smooth" });
        } else {
            throw new Error(data.message || "Gagal membuat dokumen");
        }
    })
    .catch(err => {
        console.error("Error creating treasurer document:", err);
        alert("Gagal membuat dokumen keuangan: " + err.message);
    })
    .finally(() => {
        btnGen.disabled = false;
        btnGen.innerHTML = '<i class="fa-solid fa-file-circle-plus"></i> Buat Dokumen Keuangan';
    });
}

// ============================================================
// 🤖 AI Agent QA Auditor — Client-Side verification
// ============================================================
function runAIAudit(docId, payload) {
    const aiPanel = document.getElementById("ai-auditor-panel");
    const aiStatus = document.getElementById("ai-auditor-status");
    const aiFeedback = document.getElementById("ai-auditor-feedback");
    
    // Reset classes
    document.getElementById("audit-signatures").className = "";
    document.getElementById("audit-signatures").innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memeriksa Halaman Pengesahan & Tanda Tangan';
    document.getElementById("audit-risk").className = "";
    document.getElementById("audit-risk").innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memeriksa Dokumen Pendamping & Mitigasi Risiko';
    document.getElementById("audit-placeholders").className = "";
    document.getElementById("audit-placeholders").innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memeriksa Pembersihan Placeholder & Panduan Merah';
    document.getElementById("audit-tables").className = "";
    document.getElementById("audit-tables").innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memeriksa Penyelarasan Tabel & Font (Times New Roman 12)';
    document.getElementById("audit-panitia").className = "";
    document.getElementById("audit-panitia").innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memeriksa Kerapian Lampiran & Seksi Panitia';
    
    aiPanel.classList.remove("hidden");
    aiStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sedang mengambil isi dokumen dari Drive...';
    aiFeedback.classList.add("hidden");
    
    // Fetch document text from Apps Script
    fetch(googleAppsScriptUrl + "?action=readDoc&docId=" + docId)
        .then(res => {
            if (!res.ok) throw new Error("Gagal menghubungi server Apps Script.");
            return res.json();
        })
        .then(data => {
            if (data.status !== "success") {
                throw new Error(data.message || "Gagal membaca isi dokumen Google Doc.");
            }
            
            const docText = data.text;
            aiStatus.innerHTML = '<i class="fa-solid fa-brain fa-spin"></i> AI Agent sedang mengevaluasi format kemahasiswaan...';
            
            // Build the evaluation prompt with user's customized rules
            const customRules = localStorage.getItem("openrouter_ai_rules") || `1. LEMBAR KENDALI ADMINISTRASI: Wajib ada di Halaman 1. Harus memuat Tanggal, Nomor, Perihal, Unit Organisasi (Himpunan Mahasiswa Teknik Informatika), DITETAPKAN oleh Wakil Direktur Bidang Akademik & Riset (Dr. Catur Nugroho, S.Sos., M.I.Kom.), DIPERIKSA oleh Ka.Ur Kemahasiswaan (Kadarisman, S.Si), Kaprodi (Aditya Dwi Putro W), Pembina HMIF (Dany Candra Febrianto), Chairman HMIF (Fatir Gibran), dan Ketua Panitia, serta DISUSUN OLEH Sekretaris.
2. TYPOGRAPHY & HEADING: Hapus semua angka Romawi pada sub-judul (gunakan Bold saja). Teks deskripsi/paragraf wajib Justify, sedangkan Cover, Judul Pengesahan, dan Lampiran wajib Center.
3. PEMBERSIHAN DATA: Bersihkan redundansi teks (seperti "Closingan.Closingan.") dan perbaiki NIM duplikat (seperti 12 digit tertempel ganda) menjadi format 12 digit tunggal yang valid. Auto-generate Tema Kegiatan jika kosong.
4. FORMAT TABEL:
   - Tabel Mitigasi wajib 8 kolom: No | Uraian Kegiatan | Identifikasi Bahaya | Peluang/Kemungkinan | Akibat/Keparahan | Tingkat Risiko | Pengendalian Risiko | Penanggung Jawab.
   - Tabel Anggaran wajib dipisah PEMASUKAN dan PENGELUARAN dengan Selisih = 0 (seimbang).
   - Tabel Capaian Pelaksanaan Program (CPP): Berikan tanda centang (✓) hanya pada 3-5 target yang paling relevan.
5. HALAMAN PENGESAHAN: Terletak setelah Penutup. Blok tanda tangan Kiri-Kanan: Baris 1 (Ketua & Sekretaris), Baris 2 (Pembina & Chairman), Baris 3 (Ka.Ur Kemahasiswaan & Kaprodi), Baris 4 (Wakil Direktur di Tengah Bawah). Wajib mencantumkan nama lengkap, gelar, dan NIP/NIM yang valid.
6. LAMPIRAN DOKUMEN: Lampiran I (Susunan Panitia), Lampiran II (Rancangan Anggaran Pemasukan/Pengeluaran), Lampiran III (Susunan Acara dengan kolom: No | Waktu | Kegiatan | PJ | Keterangan).`;

            const prompt = `
            Anda adalah AI Agent QA Auditor Administrasi Kemahasiswaan Telkom University Purwokerto.
            Tugas Anda adalah memeriksa dokumen proposal yang dihasilkan berdasarkan payload input asal.
            
            PAYLOAD INPUT:
            ${JSON.stringify(payload, null, 2)}
            
            TEKS DOKUMEN YANG DIHASILKAN:
            ${docText}
            
            Periksa 5 kriteria kelayakan berikut secara ketat sesuai aturan Kemahasiswaan berikut:
            ${customRules}
            
            Kriteria pemetaan JSON:
            - audit-signatures: Evaluasi halaman pengesahan, jabatan, nama, NIM, dan font penutup.
            - audit-risk: Evaluasi PIC Dosen, nomor telp, dan tabel mitigasi risiko.
            - audit-placeholders: Evaluasi pembersihan placeholder {{...}} dan panduan teks merah.
            - audit-tables: Evaluasi kerapian lebar kolom dan penyelarasan rata kiri/tengah/kanan di tabel.
            - audit-panitia: Evaluasi kerapian format lampiran panitia seksi-seksi dan rundown.
            
            Tentukan status PASS (lulus) atau WARN (peringatan) untuk masing-masing kriteria.
            Berikan pula komentar evaluasi singkat berupa kesimpulan akhir di bagian feedback.
            
            Kembalikan respon hanya dalam format JSON valid berikut (tanpa markdown atau teks penjelasan tambahan):
            {
              "audit-signatures": { "status": "pass", "details": "Keterangan singkat..." },
              "audit-risk": { "status": "pass", "details": "Keterangan singkat..." },
              "audit-placeholders": { "status": "pass", "details": "Keterangan singkat..." },
              "audit-tables": { "status": "pass", "details": "Keterangan singkat..." },
              "audit-panitia": { "status": "pass", "details": "Keterangan singkat..." },
              "feedback": "Tuliskan saran/feedback dari AI Agent di sini."
            }
            `;
            
            // Call Gemini API directly from the browser to bypass Vercel serverless 10-second timeout
            const apiKey = getGeminiApiKey();
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            
            const geminiPayload = {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: "application/json"
                },
                systemInstruction: {
                    parts: [
                        { text: "Anda adalah AI Agent QA Auditor beroutput JSON." }
                    ]
                }
            };
            
            return fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(geminiPayload)
            });
        })
        .then(res => {
            if (!res.ok) throw new Error("Gagal menghubungi API layanan AI (Direct Gemini).");
            return res.json();
        })
        .then(geminiRes => {
            if (!geminiRes.candidates || geminiRes.candidates.length === 0) {
                throw new Error("Respon AI tidak valid atau kosong.");
            }
            const responseText = geminiRes.candidates[0].content.parts[0].text;
            const auditResult = JSON.parse(responseText.trim());
            
            aiStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #34d399;"></i> Evaluasi AI Agent selesai!';
            
            // Update UI list items
            const keys = ["audit-signatures", "audit-risk", "audit-placeholders", "audit-tables", "audit-panitia"];
            const labels = {
                "audit-signatures": "Halaman Pengesahan & Tanda Tangan",
                "audit-risk": "Dokumen Pendamping & Mitigasi Risiko",
                "audit-placeholders": "Pembersihan Placeholder & Panduan Merah",
                "audit-tables": "Penyelarasan Tabel & Font (Times New Roman 12)",
                "audit-panitia": "Kerapian Lampiran & Seksi Panitia"
            };
            
            let hasWarnings = false;
            keys.forEach(key => {
                const el = document.getElementById(key);
                const res = auditResult[key];
                if (res && res.status === "pass") {
                    el.className = "pass";
                    el.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${labels[key]}: <strong>Lulus</strong> (${res.details})`;
                } else if (res) {
                    el.className = "warn";
                    el.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${labels[key]}: <strong>Peringatan</strong> (${res.details})`;
                    hasWarnings = true;
                }
            });
            
            // Show Autofix button if there are warnings
            const btnAutofix = document.getElementById("btn-ai-autofix");
            if (btnAutofix) {
                if (hasWarnings) {
                    btnAutofix.classList.remove("hidden");
                } else {
                    btnAutofix.classList.add("hidden");
                }
            }
            
            // Show Feedback
            aiFeedback.innerHTML = `<strong>💡 Rekomendasi AI Agent:</strong><br>${auditResult.feedback}`;
            aiFeedback.classList.remove("hidden");
        })
        .catch(err => {
            console.error("Audit AI gagal:", err);
            aiStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: #fbbf24;"></i> AI Agent gagal mengaudit dokumen.';
            aiFeedback.innerHTML = `<strong>Pesan Error:</strong> ${err.message || err}`;
            aiFeedback.classList.remove("hidden");
        });
}

// --- AI Auto-Fix & Autosave System ---

function setupAIAutofix() {
    const btnAutofix = document.getElementById("btn-ai-autofix");
    if (!btnAutofix) return;

    btnAutofix.addEventListener("click", async () => {
        btnAutofix.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sedang merapikan form...`;
        btnAutofix.disabled = true;

        // Compile budget items
        const budgetItems = [];
        document.querySelectorAll("#budget-input-tbody tr").forEach(row => {
            const nameInput = row.querySelector(".item-name");
            if (nameInput) {
                const name = nameInput.value.trim();
                const qty = parseInt(row.querySelector(".item-qty")?.value) || 0;
                const price = parseInt(row.querySelector(".item-price")?.value) || 0;
                if (name) budgetItems.push({ name, qty, price });
            }
        });

        // Compile rundown items
        const rundownItems = [];
        document.querySelectorAll("#rundown-tbody tr").forEach(row => {
            const startInput = row.querySelector(".run-start");
            if (startInput) {
                const start = startInput.value.trim();
                const end = (row.querySelector(".run-end")?.value || "").trim();
                const activity = (row.querySelector(".run-activity")?.value || "").trim();
                const pj = (row.querySelector(".run-pic")?.value || "").trim();
                const desc = (row.querySelector(".run-place")?.value || "").trim();
                if (start) rundownItems.push({ start, end, activity, pj, desc });
            }
        });

        const rules = localStorage.getItem("openrouter_ai_rules") || "";

        const autoFixPrompt = `
Anda adalah AI Secretary Auto-Fixer untuk HMIF Telkom University Purwokerto.
Tugas Anda adalah merapikan data draf proposal secara cerdas berdasarkan aturan kemahasiswaan.

DATA DRAF SAAT INI:
- Tema Kegiatan: "${document.getElementById("gen-tema").value}"
- Latar Belakang: "${document.getElementById("gen-latar").value}"
- Tujuan: "${document.getElementById("gen-tujuan").value}"
- Manfaat: "${document.getElementById("gen-manfaat").value}"
- Penutup: "${document.getElementById("gen-penutup").value}"
- NIM Ketua: "${document.getElementById("chairperson-nim").value}"
- NIM Sekretaris: "${document.getElementById("secretary-nim").value}"
- Rincian Anggaran: ${JSON.stringify(budgetItems)}
- Susunan Rundown: ${JSON.stringify(rundownItems)}

ATURAN KETAT KEMAHASISWAAN:
${rules}

LAKUKAN PERBAIKAN BERIKUT SECARA CERDAS (AUTO-FIX):
1. Jika Latar Belakang, Tema, Tujuan, Manfaat, atau Penutup kosong/singkat, generate/perbaiki agar panjang, formal, dan logis sesuai aturan kemahasiswaan.
2. NIM Ketua dan Sekretaris wajib 12 digit. Jika ada NIM ganda yang tertempel (seperti 103112430153103112430153), potong menjadi NIM 12 digit tunggal yang benar.
3. Seimbangkan anggaran (Pemasukan vs Pengeluaran). Jika ada item pengeluaran tetapi total tidak seimbang dengan pemasukan, sesuaikan harga satuan atau tambahkan subsidi agar total pemasukan sama dengan total pengeluaran (Selisih = 0).
4. Pastikan waktu rundown mengalir logis (waktu mulai acara mengikuti waktu akhir acara sebelumnya).

Kembalikan respon HANYA dalam format JSON valid berikut (tanpa markdown atau teks penjelasan tambahan):
{
  "tema": "Tema baru...",
  "latarBelakang": "Paragraf latar belakang baru...",
  "tujuan": "Tujuan dari kegiatan ini adalah:\\n1. ...\\n2. ...",
  "manfaat": "Manfaat dari kegiatan ini adalah :\\n1. ...\\n2. ...",
  "penutup": "Paragraf penutup baru...",
  "chairpersonNim": "NIM Ketua hasil perbaikan...",
  "secretaryNim": "NIM Sekretaris hasil perbaikan...",
  "budget": [
    { "name": "Nama item", "qty": 1, "price": 1000 }
  ],
  "rundown": [
    { "start": "08.00", "end": "08.30", "activity": "Kegiatan", "pj": "PJ", "desc": "Keterangan" }
  ]
}
`;

        try {
            const res = await fetch("/api/completion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: localStorage.getItem("openrouter_ai_model") || "anthropic/claude-3.5-sonnet",
                    messages: [
                        { role: "system", content: "Anda adalah AI Auto-Fixer beroutput JSON valid." },
                        { role: "user", content: autoFixPrompt }
                    ]
                })
            });

            if (!res.ok) throw new Error("Gagal memanggil API Auto-Fixer");
            const data = await res.json();
            const text = data.choices[0].message.content.trim();
            const result = JSON.parse(text);

            // Update form inputs
            if (result.tema) document.getElementById("gen-tema").value = result.tema;
            if (result.latarBelakang) document.getElementById("gen-latar").value = result.latarBelakang;
            if (result.tujuan) document.getElementById("gen-tujuan").value = result.tujuan;
            if (result.manfaat) document.getElementById("gen-manfaat").value = result.manfaat;
            if (result.penutup) document.getElementById("gen-penutup").value = result.penutup;
            if (result.chairpersonNim) document.getElementById("chairperson-nim").value = result.chairpersonNim;
            if (result.secretaryNim) document.getElementById("secretary-nim").value = result.secretaryNim;

            // Update budget table
            if (result.budget && result.budget.length > 0) {
                const tbody = document.getElementById("budget-input-tbody");
                if (tbody) {
                    tbody.innerHTML = "";
                    result.budget.forEach(item => {
                        addBudgetRow(item.name, parseInt(item.qty) || 1, parseInt(item.price) || 0);
                    });
                }
            }

            // Update rundown table
            if (result.rundown && result.rundown.length > 0) {
                const tbody = document.getElementById("rundown-tbody");
                if (tbody) {
                    tbody.innerHTML = "";
                    result.rundown.forEach(item => {
                        addRundownRow(item.start, item.end, parseInt(item.duration) || 0, item.activity, item.pj, item.desc, "");
                    });
                }
            }

            // Hide the autofix button after successful fix
            btnAutofix.classList.add("hidden");

            // Trigger autosave immediately so state persists
            saveFormState();

            // Programmatically trigger document generation with corrected data
            generateDocumentOnDrive();
        } catch (err) {
            console.error("Autofix failed:", err);
            alert("Gagal merapikan secara otomatis: " + err.message);
        } finally {
            btnAutofix.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Perbaiki & Rapi Otomatis dengan AI`;
            btnAutofix.disabled = false;
        }
    });
}

function saveFormState() {
    try {
        // Compile budget items
        const budget = [];
        document.querySelectorAll("#budget-input-tbody tr").forEach(row => {
            const name = (row.querySelector(".item-name")?.value || "").trim();
            const qty = row.querySelector(".item-qty")?.value || "";
            const price = row.querySelector(".item-price")?.value || "";
            if (name) budget.push({ name, qty, price });
        });

        // Compile rundown items
        const rundown = [];
        document.querySelectorAll("#rundown-tbody tr").forEach(row => {
            const start = (row.querySelector(".run-start")?.value || "").trim();
            const end = (row.querySelector(".run-end")?.value || "").trim();
            const duration = row.querySelector(".run-duration")?.value || "";
            const activity = (row.querySelector(".run-activity")?.value || "").trim();
            const pj = (row.querySelector(".run-pic")?.value || "").trim();
            const place = (row.querySelector(".run-place")?.value || "").trim();
            const dress = (row.querySelector(".run-dress")?.value || "").trim();
            if (start) rundown.push({ start, end, duration, activity, pj, place, dress });
        });

        // Compile mitigation items
        const mitigation = [];
        document.querySelectorAll("#mitigation-tbody tr").forEach(row => {
            const activity = (row.querySelector(".mit-activity")?.value || "").trim();
            const hazard = (row.querySelector(".mit-danger")?.value || "").trim();
            const prob = row.querySelector(".mit-prob")?.value || "";
            const sev = row.querySelector(".mit-sev")?.value || "";
            const control = (row.querySelector(".mit-control")?.value || "").trim();
            const pj = (row.querySelector(".mit-pic")?.value || "").trim();
            if (activity) mitigation.push({ activity, hazard, prob, sev, control, pj });
        });

        // Compile division cards
        const divisions = [];
        document.querySelectorAll("#division-container .division-card").forEach(card => {
            const name = (card.querySelector(".div-name")?.value || "").trim();
            const coorSelect = card.querySelector(".div-coor-select")?.value || "";
            const customCoorName = (card.querySelector(".div-coor-custom-name")?.value || "").trim();
            const coorNim = (card.querySelector(".div-coor-nim")?.value || "").trim();
            
            const staffs = [];
            card.querySelectorAll(".staff-row").forEach(row => {
                const select = row.querySelector(".staff-select")?.value || "";
                const customName = (row.querySelector(".staff-custom-name")?.value || "").trim();
                const nim = (row.querySelector(".staff-nim")?.value || "").trim();
                if (select) staffs.push({ select, customName, nim });
            });
            
            if (name) divisions.push({ name, coorSelect, customCoorName, coorNim, staffs });
        });

        const state = {
            docType: document.getElementById("doc-type")?.value || "",
            riskCategory: document.getElementById("risk-category")?.value || "",
            activitySelect: document.getElementById("activity-select")?.value || "",
            newActivityName: document.getElementById("new-activity-name")?.value || "",
            activityDate: document.getElementById("activity-date")?.value || "",
            activityLocation: document.getElementById("activity-location")?.value || "",
            chairpersonSelect: document.getElementById("chairperson-select")?.value || "",
            newChairpersonName: document.getElementById("new-chairperson-name")?.value || "",
            chairpersonNim: document.getElementById("chairperson-nim")?.value || "",
            deptName: document.getElementById("dept-name")?.value || "",
            activityTime: document.getElementById("activity-time")?.value || "",
            signDate: document.getElementById("sign-date")?.value || "",
            secretarySelect: document.getElementById("secretary-select")?.value || "",
            newSecretaryName: document.getElementById("new-secretary-name")?.value || "",
            secretaryNim: document.getElementById("secretary-nim")?.value || "",
            targetAudience: document.getElementById("target-audience")?.value || "",
            
            dosenName: document.getElementById("gen-dosen-name")?.value || "",
            dosenNidn: document.getElementById("gen-dosen-nidn")?.value || "",
            dosenPhone: document.getElementById("gen-dosen-phone")?.value || "",

            subChair: document.getElementById("gen-sub-chair")?.value || "",
            subChairNim: document.getElementById("gen-sub-chair-nim")?.value || "",
            treasurer1: document.getElementById("gen-treasurer-1")?.value || "",
            treasurer1Nim: document.getElementById("gen-treasurer-1-nim")?.value || "",
            treasurer2: document.getElementById("gen-treasurer-2")?.value || "",
            treasurer2Nim: document.getElementById("gen-treasurer-2-nim")?.value || "",

            cpp: Array.from(document.querySelectorAll(".cpp-checkbox")).map(cb => ({ value: cb.value, checked: cb.checked })),
            budget,
            rundown,
            mitigation,
            divisions
        };

        localStorage.setItem("web_secretary_autosave", JSON.stringify(state));
        console.log("Autosave state saved.");
    } catch (e) {
        console.warn("Autosave save failed:", e);
    }
}

function loadFormState() {
    const saved = localStorage.getItem("web_secretary_autosave");
    if (!saved) return;

    try {
        const state = JSON.parse(saved);
        
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el && val !== undefined) {
                el.value = val;
                el.dispatchEvent(new Event("change"));
            }
        };

        setVal("doc-type", state.docType);
        setVal("risk-category", state.riskCategory);
        setVal("activity-select", state.activitySelect);
        setVal("new-activity-name", state.newActivityName);
        setVal("activity-date", state.activityDate);
        setVal("activity-location", state.activityLocation);
        setVal("chairperson-select", state.chairpersonSelect);
        setVal("new-chairperson-name", state.newChairpersonName);
        setVal("chairperson-nim", state.chairpersonNim);
        setVal("dept-name", state.deptName);
        setVal("activity-time", state.activityTime);
        setVal("sign-date", state.signDate);
        setVal("secretary-select", state.secretarySelect);
        setVal("new-secretary-name", state.newSecretaryName);
        setVal("secretary-nim", state.secretaryNim);
        setVal("target-audience", state.targetAudience);

        setVal("gen-dosen-name", state.dosenName);
        setVal("gen-dosen-nidn", state.dosenNidn);
        setVal("gen-dosen-phone", state.dosenPhone);

        setVal("gen-sub-chair", state.subChair);
        setVal("gen-sub-chair-nim", state.subChairNim);
        setVal("gen-treasurer-1", state.treasurer1);
        setVal("gen-treasurer-1-nim", state.treasurer1Nim);
        setVal("gen-treasurer-2", state.treasurer2);
        setVal("gen-treasurer-2-nim", state.treasurer2Nim);

        if (state.cpp) {
            state.cpp.forEach(item => {
                const cbs = document.querySelectorAll(`.cpp-checkbox[value="${item.value}"]`);
                cbs.forEach(cb => {
                    cb.checked = item.checked;
                });
            });
        }

        if (state.budget && state.budget.length > 0) {
            const tbody = document.getElementById("budget-input-tbody");
            if (tbody) {
                tbody.innerHTML = "";
                state.budget.forEach(item => {
                    addBudgetRow(item.name, parseInt(item.qty) || 1, parseInt(item.price) || 0);
                });
            }
        }

        if (state.rundown && state.rundown.length > 0) {
            const tbody = document.getElementById("rundown-tbody");
            if (tbody) {
                tbody.innerHTML = "";
                state.rundown.forEach(item => {
                    addRundownRow(item.start, item.end, parseInt(item.duration) || 0, item.activity, item.pj, item.place, item.dress);
                });
            }
        }

        if (state.mitigation && state.mitigation.length > 0) {
            const tbody = document.getElementById("mitigation-tbody");
            if (tbody) {
                tbody.innerHTML = "";
                state.mitigation.forEach(item => {
                    addMitigationRow(item.activity, item.hazard, parseInt(item.prob) || 1, parseInt(item.sev) || 1, item.control, item.pj);
                });
            }
        }

        if (state.divisions && state.divisions.length > 0) {
            const container = document.getElementById("division-container");
            if (container) {
                container.innerHTML = "";
                state.divisions.forEach(div => {
                    addDivisionCard(div.name, div.coorSelect, div.coorNim, "");
                    const cards = container.querySelectorAll(".division-card");
                    const card = cards[cards.length - 1];
                    if (card) {
                        const customCoorEl = card.querySelector(".div-coor-custom-name");
                        if (customCoorEl && div.customCoorName) {
                            customCoorEl.value = div.customCoorName;
                            customCoorEl.dispatchEvent(new Event("change"));
                        }
                        
                        const staffContainer = card.querySelector(".staff-rows-container");
                        if (staffContainer && div.staffs && div.staffs.length > 0) {
                            staffContainer.innerHTML = "";
                            div.staffs.forEach(staff => {
                                addStaffRow(card, staff.select, staff.nim);
                                const rows = staffContainer.querySelectorAll(".staff-row");
                                const row = rows[rows.length - 1];
                                if (row) {
                                    const customNameEl = row.querySelector(".staff-custom-name");
                                    if (customNameEl && staff.customName) {
                                        customNameEl.value = staff.customName;
                                        customNameEl.dispatchEvent(new Event("change"));
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
        
        console.log("Autosave state successfully restored.");
    } catch (e) {
        console.error("Autosave restore failed:", e);
    }
}

function setupAutosaveListeners() {
    const form = document.getElementById("doc-generator-form");
    if (!form) return;
    
    let timeout = null;
    const handleInput = () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            saveFormState();
        }, 1000);
    };
    
    form.addEventListener("input", handleInput);
    form.addEventListener("change", handleInput);
    
    document.addEventListener("click", (e) => {
        if (e.target.closest(".btn-add-row") || 
            e.target.closest(".btn-remove-row") || 
            e.target.closest(".btn-delete-row") || 
            e.target.closest(".btn-add-staff") || 
            e.target.closest(".btn-remove-staff") ||
            e.target.closest("#btn-add-div")) {
            setTimeout(saveFormState, 200);
        }
    });
}


