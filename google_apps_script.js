/**
 * GOOGLE APPS SCRIPT - WEB_SECRETARY HMIF Google Drive Integration (Final Production Version)
 * 
 * ID FOLDER UTAMA: 1iqyMDGpr2xN7xN_h7_1RZNziYCZYqRhs
 */

const MAIN_FOLDER_ID = "1iqyMDGpr2xN7xN_h7_1RZNziYCZYqRhs";
const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") || "";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY;

function doGet(e) {
  // RUTE KHUSUS: Membaca isi teks dokumen Google Docs untuk AI QA Auditor
  if (e && e.parameter && e.parameter.action === "readDoc") {
    try {
      var docId = e.parameter.docId;
      var doc = DocumentApp.openById(docId);
      var text = doc.getBody().getText();
      return ContentService.createTextOutput(JSON.stringify({ status: "success", text: text }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // RUTE KHUSUS: Mengambil daftar file di folder utama (dan subfolder)
  if (e && e.parameter && e.parameter.action === "listFiles") {
    try {
      var folder = DriveApp.getFolderById(MAIN_FOLDER_ID);
      var list = [];

      // Ambil file dan folder di root
      var files = folder.getFiles();
      var subfolders = folder.getFolders();

      while (subfolders.hasNext()) {
        var sub = subfolders.next();
        list.push({
          name: sub.getName() + " (Folder)",
          id: sub.getId(),
          type: "folder"
        });

        // Baca file di dalam subfolder ini (level 1) untuk visibilitas data
        var subFiles = sub.getFiles();
        while (subFiles.hasNext()) {
          var sf = subFiles.next();
          list.push({
            name: " ↳ " + sf.getName(),
            id: sf.getId(),
            type: "file",
            parentFolder: sub.getName(),
            mimeType: sf.getMimeType()
          });
        }
      }

      while (files.hasNext()) {
        var file = files.next();
        list.push({
          name: file.getName(),
          id: file.getId(),
          type: "file",
          mimeType: file.getMimeType()
        });
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", files: list }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // RUTE KHUSUS: Mengambil seluruh file secara rekursif mendalam
  if (e && e.parameter && e.parameter.action === "listAllDeep") {
    try {
      var folder = DriveApp.getFolderById(MAIN_FOLDER_ID);
      var list = [];

      function walk(currentFolder, path) {
        var files = currentFolder.getFiles();
        while (files.hasNext()) {
          var f = files.next();
          list.push({
            name: f.getName(),
            path: path + " / " + f.getName(),
            id: f.getId(),
            mimeType: f.getMimeType()
          });
        }
        var subs = currentFolder.getFolders();
        while (subs.hasNext()) {
          var sub = subs.next();
          walk(sub, path + " / " + sub.getName());
        }
      }

      walk(folder, folder.getName());

      return ContentService.createTextOutput(JSON.stringify({ status: "success", files: list }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  // RUTE KHUSUS: Mengambil seluruh file di dalam folder TEMPLATE secara rekursif
  if (e && e.parameter && e.parameter.action === "listTemplateFolder") {
    try {
      var folder = DriveApp.getFolderById(MAIN_FOLDER_ID);
      var templates = folder.getFoldersByName("TEMPLATE");
      if (!templates.hasNext()) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Folder TEMPLATE tidak ditemukan" })).setMimeType(ContentService.MimeType.JSON);
      }
      var templateFolder = templates.next();
      var list = [];

      function walk(currentFolder, path) {
        var files = currentFolder.getFiles();
        while (files.hasNext()) {
          var f = files.next();
          list.push({
            name: f.getName(),
            path: path + " / " + f.getName(),
            id: f.getId(),
            mimeType: f.getMimeType()
          });
        }
        var subs = currentFolder.getFolders();
        while (subs.hasNext()) {
          var sub = subs.next();
          walk(sub, path + " / " + sub.getName());
        }
      }

      walk(templateFolder, "TEMPLATE");

      return ContentService.createTextOutput(JSON.stringify({ status: "success", files: list }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // RUTE KHUSUS: Mengambil data spreadsheet untuk analisa struktur
  if (e && e.parameter && e.parameter.action === "inspectSpreadsheet") {
    try {
      var id = e.parameter.id;
      var ss = SpreadsheetApp.openById(id);
      var sheets = ss.getSheets();
      var sheetsData = [];
      for (var s = 0; s < sheets.length; s++) {
        var sheet = sheets[s];
        var lastRow = sheet.getLastRow();
        var lastCol = sheet.getLastColumn();
        var values = [];
        if (lastRow > 0 && lastCol > 0) {
          values = sheet.getRange(1, 1, Math.min(lastRow, 100), Math.min(lastCol, 15)).getDisplayValues();
        }
        sheetsData.push({
          name: sheet.getName(),
          rows: lastRow,
          cols: lastCol,
          values: values
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", sheets: sheetsData }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // RUTE KHUSUS: Mengambil daftar template Bendahara secara dinamis
  if (e && e.parameter && e.parameter.action === "listTreasurerTemplates") {
    try {
      var mainFolder = DriveApp.getFolderById(MAIN_FOLDER_ID);
      var bendaharaFolder = null;
      var subs1 = mainFolder.getFoldersByName("BENDAHARA");
      if (subs1.hasNext()) {
        bendaharaFolder = subs1.next();
      } else {
        var templateFolders = mainFolder.getFoldersByName("TEMPLATE");
        if (templateFolders.hasNext()) {
          var tf = templateFolders.next();
          var subs2 = tf.getFoldersByName("BENDAHARA");
          if (subs2.hasNext()) {
            bendaharaFolder = subs2.next();
          }
        }
      }
      
      if (!bendaharaFolder) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Folder BENDAHARA tidak ditemukan" })).setMimeType(ContentService.MimeType.JSON);
      }
      
      var targetFolder = bendaharaFolder;
      var subs3 = bendaharaFolder.getFolders();
      while (subs3.hasNext()) {
        var sub3 = subs3.next();
        var subName = sub3.getName().trim().toUpperCase();
        if (subName.indexOf("TEMPLATE RAB") !== -1 || subName.indexOf("RAB DAN LPJ") !== -1) {
          targetFolder = sub3;
          break;
        }
      }
      
      var list = [];
      var files = targetFolder.getFiles();
      while (files.hasNext()) {
        var f = files.next();
        list.push({
          name: f.getName(),
          id: f.getId(),
          mimeType: f.getMimeType()
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", files: list }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // RUTE KHUSUS: Mencari file berdasarkan nama di Drive
  if (e && e.parameter && e.parameter.action === "searchFiles") {
    try {
      var query = e.parameter.query;
      var files = DriveApp.searchFiles("title contains '" + query + "' and trashed = false");
      var results = [];
      var count = 0;
      while (files.hasNext() && count < 5) {
        var file = files.next();
        results.push({ name: file.getName(), id: file.getId(), mimeType: file.getMimeType() });
        count++;
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", files: results }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // RUTE KHUSUS: Mengambil isi teks dokumen untuk analisa placeholder
  if (e && e.parameter && e.parameter.action === "getDocPreview") {
    try {
      var id = e.parameter.id;
      var doc = DocumentApp.openById(id);
      var text = doc.getBody().getText();
      return ContentService.createTextOutput(JSON.stringify({ status: "success", text: text.substring(0, 15000) }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  // ============================================================
  // RUTE: scanDriveForTraining — Baca semua proposal di Drive untuk training AI
  // ============================================================
  if (e && e.parameter && e.parameter.action === "scanDriveForTraining") {
    try {
      var mainFolder = DriveApp.getFolderById(MAIN_FOLDER_ID);
      var trainingDocs = [];
      var MAX_DOCS = 20;
      var MAX_CHARS = 8000;

      function scanFolderForDocs(folder, path, depth) {
        if (depth > 5) return;
        if (trainingDocs.length >= MAX_DOCS) return;
        var files = folder.getFiles();
        while (files.hasNext() && trainingDocs.length < MAX_DOCS) {
          var file = files.next();
          var name = file.getName();
          var mime = file.getMimeType();
          if (mime === MimeType.GOOGLE_DOCS) {
            var nameUpper = name.toUpperCase();
            var isProposal = nameUpper.indexOf("PROPOSAL") !== -1 || nameUpper.indexOf("[PROPOSAL]") !== -1 ||
                             nameUpper.indexOf("LPJ") !== -1 || nameUpper.indexOf("[LPJ]") !== -1;
            var isTemplate = nameUpper.indexOf("RESIKO TINGGI") !== -1 || nameUpper.indexOf("RESIKO RENDAH") !== -1;
            if (isProposal && !isTemplate) {
              try {
                var doc = DocumentApp.openById(file.getId());
                var bodyText = doc.getBody().getText();
                if (bodyText && bodyText.trim().length > 300) {
                  trainingDocs.push({
                    name: name,
                    path: path + " / " + name,
                    id: file.getId(),
                    url: "https://docs.google.com/open?id=" + file.getId(),
                    excerpt: bodyText.substring(0, MAX_CHARS),
                    charCount: bodyText.length
                  });
                }
              } catch (docErr) {}
            }
          }
        }
        var subs = folder.getFolders();
        while (subs.hasNext() && trainingDocs.length < MAX_DOCS) {
          var sub = subs.next();
          var subName = sub.getName();
          if (subName !== "WEB_SECRETARY_OUTPUT") {
            scanFolderForDocs(sub, path + " / " + subName, depth + 1);
          }
        }
      }

      scanFolderForDocs(mainFolder, mainFolder.getName(), 0);
      return ContentService.createTextOutput(JSON.stringify({
        status: "success", totalFound: trainingDocs.length, docs: trainingDocs
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // RUTE: readDocForTraining — Baca satu dokumen lengkap untuk training AI
  if (e && e.parameter && e.parameter.action === "readDocForTraining") {
    try {
      var docId = e.parameter.docId;
      var maxChars = parseInt(e.parameter.maxChars) || 12000;
      var doc = DocumentApp.openById(docId);
      var text = doc.getBody().getText();
      return ContentService.createTextOutput(JSON.stringify({
        status: "success", name: doc.getName(), url: doc.getUrl(),
        text: text.substring(0, maxChars), totalChars: text.length
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // RUTE KHUSUS: Memasukkan placeholder {{PLACEHOLDER}} ke berkas template secara otomatis
  if (e && e.parameter && e.parameter.action === "prepareTemplates") {
    try {
      var mainFolder = DriveApp.getFolderById(MAIN_FOLDER_ID);
      var templateFolder = mainFolder;
      var templateSubfolders = mainFolder.getFoldersByName("TEMPLATE");
      if (templateSubfolders.hasNext()) {
        templateFolder = templateSubfolders.next();
      }

      var foldersToScan = [
        ["SEKRETARIS", "PROPOSAL"],
        ["SEKRETARIS", "LPJ"]
      ];
      var fileNames = ["RESIKO TINGGI", "RESIKO RENDAH/SEDANG"];
      var logs = [];

      for (var f = 0; f < foldersToScan.length; f++) {
        var path = foldersToScan[f];
        var parent = getFolderByPath(templateFolder, path);
        if (!parent) {
          logs.push(path.join("/") + ": Folder tidak ditemukan");
          continue;
        }

        for (var n = 0; n < fileNames.length; n++) {
          var name = fileNames[n];
          var file = findFileRecursively(parent, name);

          if (!file) {
            // Coba dengan extension .docx
            file = findFileRecursively(parent, name + ".docx");
          }

          if (!file) {
            logs.push(path.join("/") + " / " + name + ": Berkas tidak ditemukan");
            continue;
          }

          if (file.getMimeType() !== MimeType.GOOGLE_DOCS) {
            logs.push(path.join("/") + " / " + name + ": Format berkas bukan Google Dokumen. Konversikan dahulu!");
            continue;
          }

          var doc = DocumentApp.openById(file.getId());
          var body = doc.getBody();

          // Lakukan pembersihan double-backslashes yang salah di template terlebih dahulu
          body.replaceText("\\\\\\\\{\\\\\\\\{", "{{");
          body.replaceText("\\\\\\\\}\\\\\\\\}", "}}");
          body.replaceText("\\\\{\\\\{", "{{");
          body.replaceText("\\\\}\\\\}", "}}");
          body.replaceText("Harap\\\\s+diisi", "Harap diisi");

          var fullText = body.getText();

          // Guard: skip jika semua placeholder utama sudah ada
          if (fullText.indexOf("NAMA_PROKER") !== -1 && fullText.indexOf("PUKUL") !== -1 && fullText.indexOf("TUJUAN") !== -1) {
            doc.saveAndClose();
            logs.push(path.join("/") + " / " + name + ": Sudah lengkap. Dilewati.");
            continue;
          }

          // 1. Cover: NAMA KEGIATAN → {{NAMA_PROKER}}
          body.replaceText("NAMA KEGIATAN", "{{NAMA_PROKER}}");

          // 2. Isi: "Nama kegiatan ini adalah." → tambahkan {{NAMA_PROKER}}
          body.replaceText("Nama kegiatan ini adalah\\.", "Nama kegiatan ini adalah {{NAMA_PROKER}}.");

          // 3. Tema: 'Tema kegiatan ini adalah "  "' → sisipkan {{TEMA}}
          body.replaceText('Tema kegiatan ini adalah [“"\\s]*[”"]', 'Tema kegiatan ini adalah “{{TEMA}}”');

          // 4. Waktu dan Tempat (Paragraf Walker)
          var paragraphs = body.getParagraphs();
          for (var p = 0; p < paragraphs.length; p++) {
            var para = paragraphs[p];
            var pText = para.getText().trim();
            if (pText === "Hari/Tanggal" && p + 1 < paragraphs.length) {
              var nextPara = paragraphs[p + 1];
              var nextText = nextPara.getText().trim();
              if (nextText === "" || nextText === ":" || nextText.indexOf(":") === 0) {
                nextPara.setText(": {{TANGGAL}}");
              }
            }
            if (pText === "Pukul" && p + 1 < paragraphs.length) {
              var nextPara = paragraphs[p + 1];
              var nextText = nextPara.getText().trim();
              if (nextText === "" || nextText === ":" || nextText.indexOf(":") === 0) {
                nextPara.setText(": {{PUKUL}}");
              }
            }
            if (pText === "Tempat" && p + 1 < paragraphs.length) {
              var nextPara = paragraphs[p + 1];
              var nextText = nextPara.getText().trim();
              if (nextText === "" || nextText === ":" || nextText.indexOf(":") === 0) {
                nextPara.setText(": {{TEMPAT}}");
              }
            }
          }

          // 5. Latar Belakang → {{DESKRIPSI}}
          if (fullText.indexOf("DESKRIPSI") === -1) {
            var searchBg = body.findText("Latar Belakang");
            if (searchBg) {
              var bgEl = searchBg.getElement().getParent();
              var bgParent = bgEl.getParent();
              var bgIdx = bgParent.getChildIndex(bgEl);
              bgParent.insertParagraph(bgIdx + 1, "{{DESKRIPSI}}");
            }
          }

          // 6. Tujuan Kegiatan → {{TUJUAN}}
          if (fullText.indexOf("TUJUAN") === -1) {
            var searchTujuan = body.findText("Tujuan dari kegiatan ini adalah:");
            if (searchTujuan) {
              var tEl = searchTujuan.getElement().getParent();
              var tParent = tEl.getParent();
              var tIdx = tParent.getChildIndex(tEl);
              tParent.insertParagraph(tIdx + 1, "{{TUJUAN}}");
            }
          }

          // 7. Manfaat Kegiatan → {{MANFAAT}}
          if (fullText.indexOf("MANFAAT") === -1) {
            var searchManfaat = body.findText("Manfaat dari kegiatan ini adalah");
            if (searchManfaat) {
              var mEl = searchManfaat.getElement().getParent();
              var mParent = mEl.getParent();
              var mIdx = mParent.getChildIndex(mEl);
              mParent.insertParagraph(mIdx + 1, "{{MANFAAT}}");
            }
          }

          // 8. Peserta → {{PESERTA}}
          if (fullText.indexOf("PESERTA") === -1) {
            var searchPeserta = body.findText("^Peserta$");
            if (searchPeserta) {
              var pEl = searchPeserta.getElement().getParent();
              var pParent = pEl.getParent();
              var pIdx = pParent.getChildIndex(pEl);
              pParent.insertParagraph(pIdx + 1, "{{PESERTA}}");
            }
          }

          // 9. Tabel Anggaran → {{TABEL_ANGGARAN}}
          if (fullText.indexOf("TABEL_ANGGARAN") === -1) {
            var searchBudget = body.findText("Rencana Anggaran Dana");
            if (searchBudget) {
              var bEl = searchBudget.getElement().getParent();
              var bParent = bEl.getParent();
              var bIdx = bParent.getChildIndex(bEl);
              bParent.insertParagraph(bIdx + 1, "Rincian Anggaran: {{TABEL_ANGGARAN}}");
            }
          }

          // 10. Penutup: "Harapdiisi" → {{PENUTUP}}
          body.replaceText("Harapdiisi", "{{PENUTUP}}");

          // 11. Halaman Pengesahan: tanggal, sekretaris
          body.replaceText("Purwokerto, \\.*", "Purwokerto, {{TGL_PENGESAHAN}}");
          body.replaceText("Nama Sekretaris", "{{NAMA_SEKRETARIS}}");

          // 12. Tabel Rundown → {{TABEL_RUNDOWN}}
          if (fullText.indexOf("TABEL_RUNDOWN") === -1) {
            var searchRundown = body.findText("SUSUNAN ACARA KEGIATAN");
            if (searchRundown) {
              var rEl = searchRundown.getElement().getParent();
              var rParent = rEl.getParent();
              var rIdx = rParent.getChildIndex(rEl);
              rParent.insertParagraph(rIdx + 1, "{{TABEL_RUNDOWN}}");
            }
          }

          // 13. Tabel Mitigasi → {{TABEL_MITIGASI}}
          if (fullText.indexOf("TABEL_MITIGASI") === -1) {
            var searchMitigasi = body.findText("Mitigasi Risiko");
            if (searchMitigasi) {
              var mEl = searchMitigasi.getElement().getParent();
              var mParent = mEl.getParent();
              var mIdx = mParent.getChildIndex(mEl);
              mParent.insertParagraph(mIdx + 1, "{{TABEL_MITIGASI}}");
            }
          }

          // 14. Ketua Pelaksana → {{KETUA_PELAKSANA}}
          if (fullText.indexOf("KETUA_PELAKSANA") === -1) {
            body.replaceText("Nama Ketua Pelaksana", "{{KETUA_PELAKSANA}}");
            body.replaceText("Ketua Pelaksana\\s*:", "Ketua Pelaksana : {{KETUA_PELAKSANA}}");
          }

          // 15. NIM Ketua → {{NIM_KETUA}}
          if (fullText.indexOf("NIM_KETUA") === -1) {
            body.replaceText("N I M\\s*Ketua", "NIM. {{NIM_KETUA}}");
            body.replaceText("^NIM\\.\\s*$", "NIM. {{NIM_KETUA}}");
          }

          // 16. Departemen → {{DEPARTEMEN}}
          if (fullText.indexOf("DEPARTEMEN") === -1) {
            body.replaceText("^Departemen\\s*:*\\s*$", "Departemen : {{DEPARTEMEN}}");
            body.replaceText("Departemen/Divisi\\s*:*\\s*$", "Departemen/Divisi : {{DEPARTEMEN}}");
          }

          // 17. NIM Sekretaris → {{NIM_SEKRETARIS}}
          if (fullText.indexOf("NIM_SEKRETARIS") === -1) {
            body.replaceText("N I M\\s*Sekretaris", "NIM. {{NIM_SEKRETARIS}}");
          }

          // 18. Total Anggaran → {{TOTAL_ANGGARAN}}
          if (fullText.indexOf("TOTAL_ANGGARAN") === -1) {
            body.replaceText("Total Anggaran\\s*:*\\s*$", "Total Anggaran : {{TOTAL_ANGGARAN}}");
            body.replaceText("Jumlah Anggaran\\s*:*\\s*$", "Jumlah Anggaran : {{TOTAL_ANGGARAN}}");
            body.replaceText("^Rp\\s*[\\d,\\.]+\\s*$", "{{TOTAL_ANGGARAN}}");
          }

          doc.saveAndClose();
          logs.push(path.join("/") + " / " + name + ": Sukses disisipi semua penanda!");
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", logs: logs }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  // RUTE KHUSUS: Mengambil placeholder dari file template untuk dipelajari
  if (e && e.parameter && e.parameter.action === "getTemplatePlaceholders") {
    try {
      var mainFolder = DriveApp.getFolderById(MAIN_FOLDER_ID);
      var templateName = e.parameter.templateName || "Template Proposal";
      var riskType = e.parameter.riskType || "Resiko Rendah/Sedang";

      var fallbackNames = [];
      if (templateName === "Template Proposal") {
        templateName = riskType;
        fallbackNames = [
          riskType + ".docx",
          riskType.toUpperCase(),
          riskType.toUpperCase() + ".docx",
          "RESIKO TINGGI",
          "RESIKO TINGGI.docx",
          "RESIKO RENDAH/SEDANG",
          "RESIKO RENDAH/SEDANG.docx",
          "Template Proposal",
          "Template Proposal.docx",
          "PROPOSAL",
          "PROPOSAL.docx"
        ];
      } else if (templateName === "Template LPJ") {
        templateName = riskType;
        fallbackNames = [
          riskType + ".docx",
          riskType.toUpperCase(),
          riskType.toUpperCase() + ".docx",
          "RESIKO TINGGI",
          "RESIKO TINGGI.docx",
          "RESIKO RENDAH/SEDANG",
          "RESIKO RENDAH/SEDANG.docx",
          "Template LPJ",
          "Template LPJ.docx",
          "LPJ",
          "LPJ.docx"
        ];
      } else if (templateName === "Template Laporan Keuangan") {
        fallbackNames = [
          "LPJ Keuangan update",
          "LPJ Keuangan update.docx",
          "LPJ Keuangan update.xlsx",
          "NEW LPJKeu",
          "NEW LPJKeu.docx",
          "Template Laporan Keuangan HMIF",
          "Laporan Keuangan",
          "Laporan Keuangan.docx"
        ];
      }

      // Cari folder TEMPLATE di dalam mainFolder agar pencarian rekursif cepat dan tidak timeout
      var templateFolder = mainFolder;
      var templateSubfolders = mainFolder.getFoldersByName("TEMPLATE");
      if (templateSubfolders.hasNext()) {
        templateFolder = templateSubfolders.next();
      }

      // Pilih subfolder spesifik untuk presisi pencarian agar tidak tercampur
      var subFolder = null;
      if (templateName === riskType) {
        if (e.parameter.templateName === "Template Proposal") {
          subFolder = getFolderByPath(templateFolder, ["SEKRETARIS", "PROPOSAL"]);
        } else {
          subFolder = getFolderByPath(templateFolder, ["SEKRETARIS", "LPJ"]);
        }
      } else {
        subFolder = getFolderByPath(templateFolder, ["BENDAHARA", "Template RAB dan LPJ"]);
        if (!subFolder) subFolder = getFolderByPath(templateFolder, ["BENDAHARA"]);
      }

      var templateFile = subFolder ? findFileRecursively(subFolder, templateName) : null;
      if (!templateFile && subFolder) {
        for (var f = 0; f < fallbackNames.length; f++) {
          templateFile = findFileRecursively(subFolder, fallbackNames[f]);
          if (templateFile) {
            break;
          }
        }
      }

      if (!templateFile) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Template '" + templateName + "' tidak ditemukan."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var doc = DocumentApp.openById(templateFile.getId());
      var body = doc.getBody();
      var text = body.getText();

      // Mengambil pola {{PLACEHOLDER}}
      var placeholders = [];
      var regex = /\{\{([^}]+)\}\}/g;
      var match;
      while ((match = regex.exec(text)) !== null) {
        var p = match[0]; // contoh: {{NAMA_PROKER}}
        if (placeholders.indexOf(p) === -1) {
          placeholders.push(p);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        templateName: templateName,
        placeholders: placeholders
      })).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // DEFAULT: Membaca database kegiatan & database pengurus
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var db = {};

  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var name = sheet.getName();
    if (name === "KODE SURAT") continue;

    var lastRow = sheet.getLastRow();
    var maxSequence = 0;
    var primaryAbbrev = name;
    var abbrevCounts = {};

    if (lastRow > 1) {
      var allData = sheet.getRange(2, 1, lastRow - 1, 4).getValues();

      for (var r = 0; r < allData.length; r++) {
        var nomorSurat = allData[r][1];
        if (nomorSurat) {
          var nomorStr = String(nomorSurat).trim();
          var parts = nomorStr.split('/');
          if (parts.length >= 3) {
            var firstPart = parts[0];
            var abbrev = parts[2];

            if (firstPart.indexOf('.') !== -1) {
              var seqPart = firstPart.split('.')[1];
              var seqNum = parseInt(seqPart);
              if (!isNaN(seqNum)) {
                maxSequence = Math.max(maxSequence, seqNum);
              }
            }
            abbrevCounts[abbrev] = (abbrevCounts[abbrev] || 0) + 1;
          }
        }
      }

      if (name === "HMIF") {
        primaryAbbrev = "HMIF";
      } else {
        var maxCount = 0;
        for (var abbr in abbrevCounts) {
          if (abbrevCounts[abbr] > maxCount) {
            maxCount = abbrevCounts[abbr];
            primaryAbbrev = abbr;
          }
        }
      }
    }

    db[name] = {
      abbrev: primaryAbbrev,
      max_sequence: maxSequence,
      next_sequence: maxSequence + 1
    };
  }

  // Baca Data Pengurus secara rekursif dari Google Drive
  var mainFolder = DriveApp.getFolderById(MAIN_FOLDER_ID);
  var committeeMembers = getCommitteeData(mainFolder);

  var responsePayload = {
    activities: db,
    committee: committeeMembers
  };

  return ContentService.createTextOutput(JSON.stringify(responsePayload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);

    // RUTE 1: Generate Konten dengan Gemini AI
    if (params.action === "generateWithAI") {
      return handleGenerateWithAI(params);
    }

    // RUTE 2: Pembuatan Dokumen Proposal/LPJ di Google Drive
    if (params.action === "createDoc") {
      return handleCreateDocument(params);
    }

    // RUTE 3: Pembuatan Dokumen Keuangan (Bendahara/Treasurer)
    if (params.action === "createTreasurerDocument") {
      return handleCreateTreasurerDocument(params);
    }

    // RUTE 4: Pencatatan Nomor Surat
    if (params.action === "logLetter") {
      return handleLogLetterNumber(params);
    }

    // RUTE 5: Menambah Kegiatan Baru ke Spreadsheet
    if (params.action === "addActivity") {
      return handleAddActivity(params);
    }

    // RUTE 6: Default fallback (untuk kompatibilitas mundur tanpa action)
    return handleLogLetterNumber(params);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// Gemini AI — Generate isi Proposal secara otomatis
// ============================================================
function handleGenerateWithAI(params) {
  var namaProker = params.namaProker || "";
  var departemen = params.departemen || "HMIF";
  var field = params.field || "all"; // "all" | "tema" | "latarBelakang" | "tujuan" | "manfaat" | "penutup"

  var contextInfo = "Nama kegiatan: \"" + namaProker + "\"\nOrganisasi: Himpunan Mahasiswa Teknik Informatika (HMIF) Telkom University Purwokerto\nDepartemen/Divisi: " + departemen;

  var prompts = {
    tema: "Buatkan SATU kalimat tema kegiatan yang singkat, inspiratif, dan sesuai untuk proposal organisasi mahasiswa. Hanya output kalimatnya saja, tanpa penjelasan tambahan.\n\n" + contextInfo,

    latarBelakang: "Tuliskan latar belakang kegiatan untuk proposal organisasi mahasiswa dalam 2-3 paragraf. Gunakan bahasa Indonesia yang formal dan baik. Jelaskan mengapa kegiatan ini perlu diadakan. Hanya output paragrafnya saja.\n\n" + contextInfo,

    tujuan: "Tuliskan 3-5 tujuan kegiatan dalam format poin bernomor (1. 2. 3. dst). Gunakan bahasa Indonesia formal. Hanya output poin-poinnya saja.\n\n" + contextInfo,

    manfaat: "Tuliskan 3-4 manfaat kegiatan dalam format poin bernomor (1. 2. 3. dst). Gunakan bahasa Indonesia formal. Hanya output poin-poinnya saja.\n\n" + contextInfo,

    penutup: "Tuliskan kalimat penutup proposal kegiatan organisasi mahasiswa dalam 1-2 kalimat yang formal dan sopan. Hanya output kalimatnya saja.\n\n" + contextInfo
  };

  var results = {};

  try {
    var fields = field === "all" ? ["tema", "latarBelakang", "tujuan", "manfaat", "penutup"] : [field];

    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      var prompt = prompts[f];
      if (!prompt) continue;

      var payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      };

      var options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      var response = UrlFetchApp.fetch(GEMINI_ENDPOINT, options);
      var responseCode = response.getResponseCode();
      var responseText = response.getContentText();

      if (responseCode === 200) {
        var responseJson = JSON.parse(responseText);
        var generatedText = responseJson.candidates[0].content.parts[0].text;
        results[f] = generatedText.trim();
      } else {
        results[f] = "";
        results["error_" + f] = "HTTP " + responseCode + ": " + responseText.substring(0, 200);
      }

      // Jeda 4.2 detik antar request agar aman dari limit 15 RPM (free tier)
      if (fields.length > 1 && i < fields.length - 1) {
        Utilities.sleep(4200);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", results: results }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// TEST FUNCTION — Jalankan ini dari editor untuk memberi izin
// ============================================================
function testGeminiAI() {
  var result = handleGenerateWithAI({
    namaProker: "Latihan Dasar Kepemimpinan",
    departemen: "HMIF",
    field: "tema"
  });
  Logger.log(result.getContent());
}

// JALANKAN INI UNTUK MEMAKSA POPUP IZIN MUNCUL
function triggerAuth() {
  var response = UrlFetchApp.fetch("https://generativelanguage.googleapis.com/", { muteHttpExceptions: true });
  Logger.log("Response Code: " + response.getResponseCode());
}

// Log nomor surat ke Google Sheet
function handleLogLetterNumber(params) {
  var sheetName = params.sheetName;
  var nomorSurat = params.nomorSurat;
  var seq = params.sequenceNumber;
  var perihal = params.perihal || "";

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["NO", "NOMOR SURAT", "TANGGAL KELUAR", "KEGIATAN", "ADA DI DRIVE?"]);
  }

  var today = new Date();
  var formattedDate = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd");

  sheet.appendRow([seq, nomorSurat, formattedDate, perihal, ""]);

  return ContentService.createTextOutput(JSON.stringify({ status: "success", nextSequence: seq + 1 }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// MENAMBAH KEGIATAN BARU ke Spreadsheet
// ============================================================
function handleAddActivity(params) {
  try {
    var activityName = params.activityName;
    var abbreviation = params.abbreviation;
    if (!activityName || !abbreviation) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Nama kegiatan dan singkatan harus diisi" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var existingSheet = ss.getSheetByName(activityName);
    if (existingSheet) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Kegiatan '" + activityName + "' sudah ada" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var newSheet = ss.insertSheet(activityName);
    newSheet.appendRow(["No", "Nomor Surat", "Tanggal", "Perihal", "Keterangan"]);
    var romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    var currentMonthRoman = romanMonths[new Date().getMonth()];
    var currentYear = new Date().getFullYear();
    newSheet.appendRow([1, "01.001/SK/" + abbreviation + "/HMIF/TUP/" + currentMonthRoman + "/" + currentYear, "", "", ""]);

    // Juga buat folder di Google Drive untuk kegiatan ini
    var mainFolder = DriveApp.getFolderById(MAIN_FOLDER_ID);
    var prokumFolders = mainFolder.getFolders();
    var docProgFolder = null;
    while (prokumFolders.hasNext()) {
      var pf = prokumFolders.next();
      if (pf.getName().toUpperCase().indexOf("DOKUMEN PROGRAM") !== -1) {
        docProgFolder = pf;
        break;
      }
    }
    if (!docProgFolder) {
      docProgFolder = mainFolder.createFolder("DOKUMEN PROGRAM KERJA");
    }

    // Buat folder kegiatan di KEGIATAN LAINNYA (default)
    var lainnyaFolders = docProgFolder.getFoldersByName("KEGIATAN LAINNYA");
    var lainnyaFolder;
    if (lainnyaFolders.hasNext()) {
      lainnyaFolder = lainnyaFolders.next();
    } else {
      lainnyaFolder = docProgFolder.createFolder("KEGIATAN LAINNYA");
    }

    // Cek dulu apakah folder proker sudah ada, jika ya jangan duplikasi
    var prokerFolder;
    var existingProker = lainnyaFolder.getFoldersByName(activityName.toUpperCase());
    if (existingProker.hasNext()) {
      prokerFolder = existingProker.next();
    } else {
      prokerFolder = lainnyaFolder.createFolder(activityName.toUpperCase());
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Kegiatan '" + activityName + "' berhasil ditambahkan",
      sheetName: activityName,
      folderUrl: prokerFolder.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Salin template Google Doc, isi placeholder, dan simpan di sub-folder SECRETARY / TREASURER
function handleCreateDocument(params) {
  var docType = params.docType; // "proposal", "lpj", atau "keuangan"
  var prokerName = params.prokerName;
  var tanggal = params.tanggal || "";
  var pukul = params.pukul || "";
  var tempat = params.tempat || "";
  var tema = params.tema || "";
  var ketua = params.ketua || "";
  var nim = params.nim || "";
  var deskripsi = params.deskripsi || "";
  var tujuan = params.tujuan || "";
  var manfaat = params.manfaat || "";
  var peserta = params.peserta || "";
  var sekretaris = params.sekretaris || "";
  var nimSekretaris = params.nimSekretaris || "";
  var penutup = params.penutup || "";
  var tanggalPengesahan = params.tanggalPengesahan || "";
  var budgetItems = params.budgetItems || [];
  var totalAnggaran = params.totalAnggaran || 0;

  // New Annexes Data
  var subChairName = params.subChairName || "";
  var subChairNim = params.subChairNim || "";
  var treasurer1Name = params.treasurer1Name || "";
  var treasurer1Nim = params.treasurer1Nim || "";
  var treasurer2Name = params.treasurer2Name || "";
  var treasurer2Nim = params.treasurer2Nim || "";
  var divisions = params.divisions || [];
  var rundownRows = params.rundownRows || [];
  var mitigationRows = params.mitigationRows || [];

  var mainFolder = DriveApp.getFolderById(MAIN_FOLDER_ID);

  // --- LOGIKA HALAMAN & FOLDER RUTING DRIVE ---
  var targetFolder; // Folder Departemen Akhir

  var deptName = params.departemen || "OTHER";

  if (deptName.indexOf("Executive Board") !== -1 || deptName.toLowerCase() === "eb") {
    // 1. Rute EB: Langsung ke folder "EB" di root utama
    var ebSubfolders = mainFolder.getFoldersByName("EB");
    if (ebSubfolders.hasNext()) {
      targetFolder = ebSubfolders.next();
    } else {
      targetFolder = mainFolder.createFolder("EB");
    }
  } else {
    // 2. Rute Departemen Lain: Masuk ke folder "DOKUMEN PROGRAM KERJA" di root
    var docProgFolder = null;
    var progFolders = mainFolder.getFolders();
    while (progFolders.hasNext()) {
      var pf = progFolders.next();
      var pfName = pf.getName().toUpperCase();
      if (pfName.indexOf("DOKUMEN PROGRAM") !== -1) {
        docProgFolder = pf;
        break;
      }
    }

    if (!docProgFolder) {
      docProgFolder = mainFolder.createFolder("DOKUMEN PROGRAM KERJA");
    }

    // Tentukan nama subfolder departemen yang cocok dengan struktur Drive Anda
    var subDeptFolderName = "KEGIATAN LAINNYA"; // Default fallback
    var deptUpper = deptName.toUpperCase();

    if (deptUpper.indexOf("TALENT DEVELOPMENT") !== -1) {
      subDeptFolderName = "TALENT DEVELOPMENT & INNOVATION";
    } else if (deptUpper.indexOf("HUMANITY IMPACT") !== -1) {
      subDeptFolderName = "HUMANITY IMPACT & DEVELOPMENT";
    } else if (deptUpper.indexOf("HUMAN CAPITAL") !== -1) {
      subDeptFolderName = "HUMAN CAPITAL & CHARACTER BUILDING";
    } else if (deptUpper.indexOf("FINANCE & ENTERPRISE") !== -1) {
      subDeptFolderName = "FINANCE & ENTERPRISE DEVELOPMENT";
    } else if (deptUpper.indexOf("EXTERNAL RELATION") !== -1) {
      subDeptFolderName = "EXTERNAL RELATIONS & ADVOCAY";
    } else if (deptUpper.indexOf("CREATIVE CONTENT") !== -1) {
      subDeptFolderName = "CREATIVE CONTENT & OUTREACH";
    } else if (deptUpper.indexOf("KEGIATAN LAINNYA") !== -1 || deptUpper.indexOf("KEGIATAN LAIN") !== -1) {
      subDeptFolderName = "KEGIATAN LAINNYA";
    }

    // Cari atau buat folder departemen tersebut di dalam DOKUMEN PROGRAM KERJA
    var subDeptFolders = docProgFolder.getFoldersByName(subDeptFolderName);
    if (subDeptFolders.hasNext()) {
      targetFolder = subDeptFolders.next();
    } else {
      targetFolder = docProgFolder.createFolder(subDeptFolderName);
    }
  }

  // 3. Rute Proker: Cari atau buat folder Proker di dalam folder departemen
  var prokerFolderName = prokerName.trim().toUpperCase();
  var finalTargetFolder;
  var prokerSubfolders = targetFolder.getFoldersByName(prokerFolderName);
  if (prokerSubfolders.hasNext()) {
    finalTargetFolder = prokerSubfolders.next();
  } else {
    finalTargetFolder = targetFolder.createFolder(prokerFolderName);
  }

  // Mencari file template secara rekursif (bisa masuk ke subfolder TEMPLATE)
  var templateName;
  var fallbackNames = [];

  var riskType = params.riskType || "Resiko Rendah/Sedang";

  if (docType === "proposal") {
    templateName = riskType;
    fallbackNames = [
      riskType + ".docx",
      riskType.toUpperCase(),
      riskType.toUpperCase() + ".docx",
      "RESIKO TINGGI",
      "RESIKO TINGGI.docx",
      "RESIKO RENDAH/SEDANG",
      "RESIKO RENDAH/SEDANG.docx",
      "Template Proposal",
      "Template Proposal.docx",
      "PROPOSAL",
      "PROPOSAL.docx"
    ];
  } else if (docType === "lpj") {
    templateName = riskType;
    fallbackNames = [
      riskType + ".docx",
      riskType.toUpperCase(),
      riskType.toUpperCase() + ".docx",
      "RESIKO TINGGI",
      "RESIKO TINGGI.docx",
      "RESIKO RENDAH/SEDANG",
      "RESIKO RENDAH/SEDANG.docx",
      "Template LPJ",
      "Template LPJ.docx",
      "LPJ",
      "LPJ.docx"
    ];
  } else {
    templateName = "Template Laporan Keuangan";
    fallbackNames = [
      "LPJ Keuangan update",
      "LPJ Keuangan update.docx",
      "LPJ Keuangan update.xlsx",
      "NEW LPJKeu",
      "NEW LPJKeu.docx",
      "Template Laporan Keuangan HMIF",
      "Laporan Keuangan",
      "Laporan Keuangan.docx"
    ];
  }

  // Cari folder TEMPLATE di dalam mainFolder agar pencarian rekursif cepat dan tidak timeout
  var templateFolder = mainFolder;
  var templateSubfolders = mainFolder.getFoldersByName("TEMPLATE");
  if (templateSubfolders.hasNext()) {
    templateFolder = templateSubfolders.next();
  }

  // Pilih subfolder spesifik untuk presisi pencarian agar tidak tercampur
  var subFolder = null;
  if (docType === "proposal") {
    subFolder = getFolderByPath(templateFolder, ["SEKRETARIS", "PROPOSAL"]);
  } else if (docType === "lpj") {
    subFolder = getFolderByPath(templateFolder, ["SEKRETARIS", "LPJ"]);
  } else {
    subFolder = getFolderByPath(templateFolder, ["BENDAHARA", "Template RAB dan LPJ"]);
    if (!subFolder) subFolder = getFolderByPath(templateFolder, ["BENDAHARA"]);
  }

  var templateFile = subFolder ? findFileRecursively(subFolder, templateName) : null;

  // Jika tidak ditemukan dengan nama awal, cari menggunakan nama-nama fallback alternatif
  if (!templateFile && subFolder) {
    for (var f = 0; f < fallbackNames.length; f++) {
      templateFile = findFileRecursively(subFolder, fallbackNames[f]);
      if (templateFile) {
        templateName = fallbackNames[f];
        break;
      }
    }
  }

  if (!templateFile) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "File template '" + templateName + "' tidak ditemukan di folder utama maupun subfoldernya. Pastikan file template tersebut ada."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Duplikasi template ke folder tujuan proker
  var today = new Date();
  var year = today.getFullYear();
  var docPrefix = "[DOKUMEN]";
  if (docType === "proposal") docPrefix = "[PROPOSAL]";
  else if (docType === "lpj") docPrefix = "[LPJ]";
  else if (docType === "keuangan") docPrefix = "[KEUANGAN]";

  var newFileName = docPrefix + " " + prokerName + " (" + year + ")";

  // Hapus file dengan nama yang sama terlebih dahulu untuk mencegah duplikasi
  var existingFiles = finalTargetFolder.getFilesByName(newFileName);
  while (existingFiles.hasNext()) {
    var ef = existingFiles.next();
    try {
      ef.setTrashed(true);
    } catch (e) {
      DriveApp.getFileById(ef.getId()).setTrashed(true);
    }
  }

  var copiedFile = templateFile.makeCopy(newFileName, finalTargetFolder);
  var docId = copiedFile.getId();

  // Edit isi Dokumen
  var doc = DocumentApp.openById(docId);

  // PREPEND LEMBAR SIRKULIR (LEMBAR KENDALI ADMINISTRASI) KE HALAMAN 1
  var isProposalOrLpj = (docType === "proposal" || docType === "lpj");
  if (isProposalOrLpj) {
    try {
      var sirkulirFolder = getFolderByPath(templateFolder, ["SEKRETARIS", "SIRKULIR PROPOSAL/LPJ"]);
      if (sirkulirFolder) {
        var sirkulirTemplateName = (riskType === "Resiko Tinggi") ? "Resiko Tinggi" : "Resiko Rendah dan Sedang";
        var sirkulirFile = findFileRecursively(sirkulirFolder, sirkulirTemplateName);
        if (sirkulirFile) {
          prependSirkulirToDoc(doc, sirkulirFile.getId());
        }
      }
    } catch (sirkulirErr) {
      Logger.log("Failed to prepend sirkulir: " + sirkulirErr.toString());
    }
  }

  var body = doc.getBody();

  // Custom replacements for Sirkulir placeholders
  if (isProposalOrLpj) {
    try {
      body.replaceText("Nomor Proposal", params.nomorSurat || "{{NOMOR_SURAT}}");
      body.replaceText("Proposal/LPJ Nama Kegiatan", (docType === "proposal" ? "Proposal " : "LPJ ") + prokerName);
      body.replaceText("tanggal bulan tahun", tanggalPengesahan);
      body.replaceText("Ketua Panitia\\s*\\n*\\n*\\(Nama\\)", "Ketua Panitia\n\n\n" + ketua);
      body.replaceText("Sekretaris\\s*\\n*\\n*\\(Nama\\)", "Sekretaris\n\n\n" + sekretaris);
    } catch(err) {}
  }

  // ============================================================
  // 1. Replace Placeholders in Headers and Footers
  // ============================================================
  var parent = body.getParent();
  for (var i = 0; i < parent.getNumChildren(); i++) {
    var child = parent.getChild(i);
    if (child.getType() === DocumentApp.ElementType.HEADER_SECTION) {
      var header = child.asHeaderSection();
      header.replaceText("\\\\?\\{\\\\?\\{NAMA_PROKER\\\\?\\}\\\\?\\}", prokerName);
      header.replaceText("NAMA KEGIATAN", prokerName);
      
      // Make header text black (removing red text highlights)
      var textObj = header.editAsText();
      if (textObj.getText().length > 0) {
        textObj.setForegroundColor("#000000");
      }
    }
    if (child.getType() === DocumentApp.ElementType.FOOTER_SECTION) {
      var footer = child.asFooterSection();
      footer.replaceText("\\\\?\\{\\\\?\\{NAMA_PROKER\\\\?\\}\\\\?\\}", prokerName);
    }
  }

  // ============================================================
  // 2. Main Replacement with Justified, Black, and Non-Bold styling
  // ============================================================
  body.replaceText("\\\\?\\{\\\\?\\{NAMA_PROKER\\\\?\\}\\\\?\\}", prokerName);
  body.replaceText("\\\\?\\{\\\\?\\{TANGGAL\\\\?\\}\\\\?\\}", tanggal);
  body.replaceText("\\\\?\\{\\\\?\\{TEMPAT\\\\?\\}\\\\?\\}", tempat);
  body.replaceText("\\\\?\\{\\\\?\\{TEMA\\\\?\\}\\\\?\\}", tema);
  body.replaceText("\\\\?\\{\\\\?\\{KETUA_PELAKSANA\\\\?\\}\\\\?\\}", ketua);
  body.replaceText("\\\\?\\{\\\\?\\{NIM_KETUA\\\\?\\}\\\\?\\}", nim);
  body.replaceText("\\\\?\\{\\\\?\\{DEPARTEMEN\\\\?\\}\\\\?\\}", params.departemen || "");
  body.replaceText("\\\\?\\{\\\\?\\{NAMA_SEKRETARIS\\\\?\\}\\\\?\\}", sekretaris);
  body.replaceText("\\\\?\\{\\\\?\\{NIM_SEKRETARIS\\\\?\\}\\\\?\\}", nimSekretaris);
  body.replaceText("\\\\?\\{\\\\?\\{TGL_PENGESAHAN\\\\?\\}\\\\?\\}", tanggalPengesahan);
  body.replaceText("\\\\?\\{\\\\?\\{TOTAL_ANGGARAN\\\\?\\}\\\\?\\}", formatRupiah(totalAnggaran));

  // Style dynamic descriptions
  replaceAndStyleParagraph(body, "\\\\?\\{\\\\?\\{DESKRIPSI\\\\?\\}\\\\?\\}", deskripsi);
  ensureAndReplaceSection(body, "Tujuan dari kegiatan ini adalah", "{{TUJUAN}}", "\\\\?\\{\\\\?\\{TUJUAN\\\\?\\}\\\\?\\}", tujuan);
  ensureAndReplaceSection(body, "Manfaat dari kegiatan ini adalah", "{{MANFAAT}}", "\\\\?\\{\\\\?\\{MANFAAT\\\\?\\}\\\\?\\}", manfaat);
  replaceAndStyleParagraph(body, "\\\\?\\{\\\\?\\{PESERTA\\\\?\\}\\\\?\\}", peserta);
  replacePenutup(body, penutup);

  // ============================================================
  // 3. Dynamic replacement for "Pukul" (handles different templates spacing)
  // ============================================================
  var paragraphs = body.getParagraphs();
  for (var p = 0; p < paragraphs.length; p++) {
    var para = paragraphs[p];
    var pText = para.getText().trim();
    if (pText.indexOf("Pukul") === 0) {
      para.setText("Pukul        : " + pukul);
      para.editAsText().setBold(false);
      para.editAsText().setForegroundColor("#000000");
    }
  }

  // Also replace any {{PUKUL}} placeholder that may have been inserted by prepareTemplates
  if (pukul) {
    body.replaceText("\\\\?\\{\\\\?\\{PUKUL\\\\?\\}\\\\?\\}", pukul);
  }

  // ============================================================
  // 4. Logika Pengisian Tabel Anggaran (Proposal)
  // ============================================================
  var budgetParaFound = false;
  var paragraphs = body.getParagraphs();
  for (var p = 0; p < paragraphs.length; p++) {
    var para = paragraphs[p];
    var paraText = para.getText();
    if (paraText.indexOf("TABEL_ANGGARAN") !== -1) {
      budgetParaFound = true;
      var fontName = para.getAttributes()[DocumentApp.Attribute.FONT_FAMILY] || "Arial";
      var fontSize = para.getAttributes()[DocumentApp.Attribute.FONT_SIZE] || 11;
      para.replaceText("\\\\?\\{\\\\?\\{TABEL_ANGGARAN\\\\?\\}\\\\?\\}", "");
      populateBudgetTable(para, params.budgetItems, fontName, fontSize);
      break;
    }
  }
  if (!budgetParaFound) {
    body.replaceText("\\\\?\\{\\\\?\\{TABEL_ANGGARAN\\\\?\\}\\\\?\\}", "");
  }

  // ============================================================
  // Logika Pengisian Dosen Pendamping (Resiko Tinggi)
  // ============================================================
  if (params.riskType === "Resiko Tinggi") {
    if (params.dosenName) {
      body.replaceText("Nama Pembina", params.dosenName);
      body.replaceText("Nama Dosen Pendamping", params.dosenName);
      body.replaceText("Nama Dosen Pembina", params.dosenName);
      body.replaceText("Nama PIC", params.dosenName);
    }
    if (params.dosenNidn) {
      body.replaceText("\\[NIDN/NIK\\]", params.dosenNidn);
      body.replaceText("NIK/NIDN\\.", "NIK/NIDN. " + params.dosenNidn);
    }
    if (params.dosenPhone) {
      body.replaceText("Nomor Telp Dosen Pendamping", params.dosenPhone);
    }
  }

  // ============================================================
  // Logika Pengisian Target CPP (Capaian Pelaksanaan Program)
  // ============================================================
  if (params.cppSelections && params.cppSelections.length > 0) {
    populateCPPChecks(body, params.cppSelections);
  }

  // ============================================================
  // Logika Pengisian Tabel Rundown (Lampiran III / IV)
  // ============================================================
  function populateRundownTable(insertAtPara, fontName, fontSize) {
    var dataRows = (rundownRows && rundownRows.length > 0) ? rundownRows : [];
    var numDataRows = dataRows.length > 0 ? dataRows.length : 5;
    var numRows = numDataRows + 1; // +1 for header

    var cells = [];
    for (var r = 0; r < numRows; r++) {
      var rowCells = [];
      for (var c = 0; c < 6; c++) {
        rowCells.push("");
      }
      cells.push(rowCells);
    }

    var paraParent = insertAtPara.getParent();
    var paraIdx = paraParent.getChildIndex(insertAtPara);
    var newTable = paraParent.insertTable(paraIdx + 1, cells);

    // Header Row
    var headerRow = newTable.getRow(0);
    var headers = ["No", "Waktu", "Kegiatan", "PIC", "Tempat", "Keterangan"];
    for (var h = 0; h < headers.length; h++) {
      headerRow.getCell(h).setText(headers[h]);
    }

    // Data Rows
    for (var i = 0; i < numDataRows; i++) {
      var row = newTable.getRow(i + 1);
      row.getCell(0).setText((i + 1).toString());
      row.getCell(0).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);

      if (dataRows.length > 0 && i < dataRows.length) {
        var d = dataRows[i];
        var waktu = (d.start || "") + " - " + (d.end || "");
        row.getCell(1).setText(waktu.trim());
        row.getCell(1).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        row.getCell(2).setText(d.activity || "");
        row.getCell(2).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
        row.getCell(3).setText(d.pic || "");
        row.getCell(3).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        row.getCell(4).setText(d.place || "");
        row.getCell(4).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        var keterangan = d.dress || "";
        if (d.duration) {
          keterangan = (keterangan ? keterangan + " | " : "") + d.duration + " menit";
        }
        row.getCell(5).setText(keterangan);
        row.getCell(5).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      } else {
        row.getCell(1).setText("");
        row.getCell(2).setText("");
        row.getCell(3).setText("");
        row.getCell(4).setText("");
        row.getCell(5).setText("");
      }
    }

    var widths = [30, 90, 150, 75, 75, 55];
    formatAndStyleTable(newTable, widths, fontName, fontSize);
  }

  var rundownParaFound = false;
  var paragraphs = body.getParagraphs();
  for (var p = 0; p < paragraphs.length; p++) {
    var para = paragraphs[p];
    var paraText = para.getText();
    if (paraText.indexOf("TABEL_RUNDOWN") !== -1) {
      rundownParaFound = true;
      var fontName = para.getAttributes()[DocumentApp.Attribute.FONT_FAMILY] || "Arial";
      var fontSize = para.getAttributes()[DocumentApp.Attribute.FONT_SIZE] || 11;
      para.replaceText("\\\\?\\{\\\\?\\{TABEL_RUNDOWN\\\\?\\}\\\\?\\}", "");
      populateRundownTable(para, fontName, fontSize);
      break;
    }
  }
  if (!rundownParaFound) {
    var searchRundown = body.findText("SUSUNAN ACARA KEGIATAN");
    if (searchRundown) {
      var rEl = searchRundown.getElement().getParent();
      var fontName = rEl.getAttributes()[DocumentApp.Attribute.FONT_FAMILY] || "Arial";
      var fontSize = rEl.getAttributes()[DocumentApp.Attribute.FONT_SIZE] || 11;
      populateRundownTable(rEl, fontName, fontSize);
    }
  }

  // ============================================================
  // Logika Pengisian Tabel Mitigasi Risiko (Bab XI)
  // ============================================================
  if (mitigationRows.length > 0) {
    var mitParaFound = false;
    var paragraphs = body.getParagraphs();
    for (var p = 0; p < paragraphs.length; p++) {
      var para = paragraphs[p];
      var paraText = para.getText();
      if (paraText.indexOf("TABEL_MITIGASI") !== -1) {
        mitParaFound = true;
        var paraParent = para.getParent();
        var paraIdx = paraParent.getChildIndex(para);

        para.replaceText("\\\\?\\{\\\\?\\{TABEL_MITIGASI\\\\?\\}\\\\?\\}", "");

        // Find and delete the existing physical table below paraIdx
        var nextIdx = paraIdx + 1;
        while (nextIdx < paraParent.getNumChildren()) {
          var child = paraParent.getChild(nextIdx);
          if (child.getType() === DocumentApp.ElementType.TABLE) {
            child.removeFromParent();
            break;
          } else if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
            var childText = child.asParagraph().getText().trim();
            if (childText !== "" && (childText.indexOf("Tabel Peluang") !== -1 || childText.indexOf("Keterangan") !== -1)) {
              break;
            }
          }
          nextIdx++;
        }

        var numRows = mitigationRows.length + 1; // header + rows
        var cells = [];
        for (var r = 0; r < numRows; r++) {
          var rowCells = [];
          for (var c = 0; c < 8; c++) {
            rowCells.push("");
          }
          cells.push(rowCells);
        }
        var newTable = paraParent.insertTable(paraIdx + 1, cells);

        // Header Row
        var headerRow = newTable.getRow(0);
        var headers = ["No", "Uraian Kegiatan", "Identifikasi Bahaya", "Peluang", "Akibat", "Tingkat", "Pengendalian Risiko", "Penanggung Jawab"];
        for (var h = 0; h < headers.length; h++) {
          headerRow.getCell(h).setText(headers[h]);
        }

        // Data Rows
        for (var i = 0; i < mitigationRows.length; i++) {
          var rowData = mitigationRows[i];
          var dataRow = newTable.getRow(i + 1);
          var level = (parseInt(rowData.prob) || 1) * (parseInt(rowData.sev) || 1);

          dataRow.getCell(0).setText((i + 1).toString());
          dataRow.getCell(0).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          dataRow.getCell(1).setText(rowData.activity);
          dataRow.getCell(1).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
          dataRow.getCell(2).setText(rowData.danger);
          dataRow.getCell(2).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
          dataRow.getCell(3).setText(rowData.prob.toString());
          dataRow.getCell(3).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          dataRow.getCell(4).setText(rowData.sev.toString());
          dataRow.getCell(4).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          dataRow.getCell(5).setText(level.toString());
          dataRow.getCell(5).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          dataRow.getCell(6).setText(rowData.control);
          dataRow.getCell(6).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
          dataRow.getCell(7).setText(rowData.pic);
          dataRow.getCell(7).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
        }

        // Style Table
        var fontName = para.getAttributes()[DocumentApp.Attribute.FONT_FAMILY] || "Arial";
        var fontSize = para.getAttributes()[DocumentApp.Attribute.FONT_SIZE] || 11;
        var widths = [25, 95, 95, 35, 35, 40, 90, 60];
        formatAndStyleTable(newTable, widths, fontName, fontSize);

        break;
      }
    }
      body.replaceText("\\\\?\\{\\\\?\\{TABEL_MITIGASI\\\\?\\}\\\\?\\}", "(tidak ada rincian mitigasi risiko)");
  } else {
    // Fallback: delete physical table if present
    var paragraphs = body.getParagraphs();
    for (var p = 0; p < paragraphs.length; p++) {
      var para = paragraphs[p];
      if (para.getText().indexOf("TABEL_MITIGASI") !== -1) {
        var paraParent = para.getParent();
        var paraIdx = paraParent.getChildIndex(para);
        para.replaceText("\\\\?\\{\\\\?\\{TABEL_MITIGASI\\\\?\\}\\\\?\\}", "(tidak ada rincian mitigasi risiko)");

        var nextIdx = paraIdx + 1;
        while (nextIdx < paraParent.getNumChildren()) {
          var child = paraParent.getChild(nextIdx);
          if (child.getType() === DocumentApp.ElementType.TABLE) {
            child.removeFromParent();
            break;
          } else if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
            var childText = child.asParagraph().getText().trim();
            if (childText !== "" && (childText.indexOf("Tabel Peluang") !== -1 || childText.indexOf("Keterangan") !== -1)) {
              break;
            }
          }
          nextIdx++;
        }
        break;
      }
    }
  }

  // ============================================================
  // Logika Pengisian Susunan Panitia (Lampiran I)
  // ============================================================
  replaceCommitteeMember(body, "Ketua Panitia", ketua, nim);
  replaceCommitteeMember(body, "Wakil", subChairName, subChairNim);
  replaceCommitteeMember(body, "Sekretaris", sekretaris, nimSekretaris);

  if (treasurer1Name) {
    replaceCommitteeMember(body, "Bendahara", treasurer1Name, treasurer1Nim);
  }

  replaceDivisions(body, divisions);

  // Lakukan penggantian tanda tangan Halaman Pengesahan (Ketua & Sekretaris) secara presisi
  replaceSignaturesInDoc(body, ketua, nim, sekretaris, nimSekretaris);

  // Bersihkan teks merah panduan dan hitamkan teks merah judul/header
  cleanupRedTextAndGuidelines(body);

  // Format all table fonts, margins, headers
  formatAllDocumentTables(body);

  // Insert page breaks before each Lampiran to keep them cleanly separated
  formatAnnexPageBreaks(body);

  // Simpan dan tutup dokumen
  doc.saveAndClose();

  // Kembalikan URL Google Doc baru yang siap diedit
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    docUrl: doc.getUrl(),
    fileName: newFileName
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// Helper untuk Pengisian Anggota Panitia (Lampiran I)
// ============================================================
function replaceCommitteeMember(body, roleLabel, name, nim) {
  if (!name) return;
  var paragraphs = body.getParagraphs();
  for (var p = 0; p < paragraphs.length; p++) {
    var para = paragraphs[p];
    var text = para.getText().trim();
    if (text.indexOf(roleLabel) === 0) {
      var foundName = false;
      var foundNim = false;
      for (var next = p + 1; next < p + 5 && next < paragraphs.length; next++) {
        var nextPara = paragraphs[next];
        var nextText = nextPara.getText().trim();
        if (nextText === "Mahasiswa" && !foundName) {
          nextPara.setText(name);
          foundName = true;
        } else if (nextText === "[NIM]" && !foundNim) {
          nextPara.setText("NIM. " + nim);
          foundNim = true;
        }
        if (foundName && foundNim) break;
      }
    }
  }
}

// Helper untuk Pengisian Divisi/Seksi Panitia (Lampiran I)
function replaceDivisions(body, divisions) {
  if (!divisions || divisions.length === 0) return;

  var tables = body.getTables();
  for (var t = 0; t < tables.length; t++) {
    var table = tables[t];
    var numRows = table.getNumRows();
    for (var r = 0; r < numRows; r++) {
      var row = table.getRow(r);
      if (row.getNumCells() >= 2) {
        var cell1Text = row.getCell(0).getText().trim();
        if (cell1Text === "Seksi-Seksi") {
          var cell2 = row.getCell(row.getNumCells() - 1);
          
          // Bersihkan isi Cell
          cell2.clear();
          
          var defaultFont = "Times New Roman";
          var defaultSize = 11;
          try {
            var firstCellPara = row.getCell(0).getChild(0).asParagraph();
            defaultFont = firstCellPara.getAttributes()[DocumentApp.Attribute.FONT_FAMILY] || "Times New Roman";
            defaultSize = firstCellPara.getAttributes()[DocumentApp.Attribute.FONT_SIZE] || 11;
          } catch (e) {}
          
          // Isi dengan daftar divisi
          for (var d = 0; d < divisions.length; d++) {
            var div = divisions[d];
            if (!div.name || !div.coor) continue;
            
            // Nama Koordinator Divisi (e.g. "Koor. Perlengkapan : Dasril Aldo")
            var pDiv = cell2.appendParagraph("Koor. " + div.name + " : " + div.coor);
            pDiv.editAsText().setFontFamily(defaultFont).setFontSize(defaultSize);
            var prefix = "Koor. " + div.name + " : ";
            pDiv.editAsText().setBold(0, prefix.length - 1, true);
            
            if (div.coorNim) {
              var pNim = cell2.appendParagraph("  NIM. " + div.coorNim);
              pNim.editAsText().setFontFamily(defaultFont).setFontSize(defaultSize);
            }
            
            // Daftar Staff
            if (div.staffs) {
              var pStaffHeader = cell2.appendParagraph("Staff. " + div.name + " :");
              pStaffHeader.editAsText().setFontFamily(defaultFont).setFontSize(defaultSize).setBold(true);
              
              var staffLines = div.staffs.split(/[\n,]+/).map(function (s) { return s.trim(); }).filter(Boolean);
              for (var s = 0; s < staffLines.length; s++) {
                var staffLine = staffLines[s];
                var nameOnly = staffLine;
                var nimOnly = "";
                
                // Parse Name (NIM. XXX) or Name (XXX) or Name - XXX
                var nimMatch = staffLine.match(/(.*?)\s*[\(\-\/]\s*NIM\.?\s*(\d+)\s*\)?/i) || 
                               staffLine.match(/(.*?)\s*[\(\-\/]\s*(\d+)\s*\)?/);
                if (nimMatch) {
                  nameOnly = nimMatch[1].trim();
                  nimOnly = nimMatch[2].trim();
                }
                
                var pStaff = cell2.appendParagraph("- " + nameOnly);
                pStaff.editAsText().setFontFamily(defaultFont).setFontSize(defaultSize);
                
                if (nimOnly) {
                  var pStaffNim = cell2.appendParagraph("  NIM. " + nimOnly);
                  pStaffNim.editAsText().setFontFamily(defaultFont).setFontSize(defaultSize);
                }
              }
            }
            
          }
          
          break; // Selesai
        }
      }
    }
  }
}

// ============================================================
// Helper untuk Penggantian Paragraph & Formatting (Rata Kanan-Kiri, Non-Bold, Hitam)
// ============================================================
function replaceAndStyleParagraph(body, placeholder, text) {
  if (!text) {
    body.replaceText(placeholder, "");
    return;
  }
  
  var rangeElement = body.findText(placeholder);
  if (rangeElement) {
    var element = rangeElement.getElement();
    var para = element.getParent().asParagraph();
    para.replaceText(placeholder, text);
    
    // Rata Kanan-Kiri (Justify)
    para.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
    
    // Set Font, Size, and Clear Bold/Italics
    para.editAsText().setFontFamily("Times New Roman")
                    .setFontSize(12)
                    .setBold(false)
                    .setItalic(false)
                    .setForegroundColor("#000000");
  }
}

// Menjamin section placeholder ada di dokumen sebelum diisi
function ensureAndReplaceSection(body, searchIntroText, literalPlaceholder, regexPlaceholder, text) {
  var fullText = body.getText();
  var baseKey = literalPlaceholder.replace(/[{}]/g, ""); // e.g. "TUJUAN"
  if (fullText.indexOf(baseKey) === -1) {
    var range = body.findText(searchIntroText);
    if (range) {
      var el = range.getElement();
      var para = el.getParent().asParagraph();
      var parent = para.getParent();
      var idx = parent.getChildIndex(para);
      
      // Bersihkan baris kosong, tab (\t), bullet, atau strip di bawah teks intro sebelum menyisipkan text baru
      while (idx + 1 < parent.getNumChildren()) {
        var nextChild = parent.getChild(idx + 1);
        if (nextChild.getType() === DocumentApp.ElementType.PARAGRAPH) {
          var nextParaText = nextChild.asParagraph().getText().trim();
          if (nextParaText === "" || nextParaText === "•" || nextParaText === "-" || nextParaText === "\t") {
            nextChild.removeFromParent();
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
      // Sisipkan paragraf placeholder tepat di bawah intro text
      var newPara = parent.insertParagraph(idx + 1, literalPlaceholder);
      var fontName = para.getAttributes()[DocumentApp.Attribute.FONT_FAMILY] || "Arial";
      var fontSize = para.getAttributes()[DocumentApp.Attribute.FONT_SIZE] || 11;
      newPara.editAsText().setFontFamily(fontName).setFontSize(fontSize);
    }
  }
  
  // Lakukan replacement & styling
  replaceAndStyleParagraph(body, regexPlaceholder, text);
}

// Menghapus teks panduan merah & menghitamkan teks merah judul
function cleanupRedTextAndGuidelines(body) {
  var paragraphs = body.getParagraphs();
  for (var p = paragraphs.length - 1; p >= 0; p--) {
    var para = paragraphs[p];
    var text = para.getText().trim();
    
    if (text.length === 0) continue;
    
    var textObj = para.editAsText();
    var isRed = false;
    try {
      var color = textObj.getForegroundColor(0);
      if (color === "#ff0000" || color === "#FF0000") {
        isRed = true;
      }
    } catch (e) {}
    
    if (isRed) {
      // Jika merupakan petunjuk panduan (dimulai dengan kurung, dst), hapus
      if (text.indexOf("(Pemasukan") === 0 || 
          text.indexOf("Untuk tarikan") === 0 ||
          text.indexOf("Antara pemasukan") === 0 ||
          text.indexOf("Harus ada") === 0 ||
          text.indexOf("Apabila terdapat") === 0 ||
          text.indexOf("Pemasukan") === 0 ||
          text.indexOf("Pengeluaran") === 0 ||
          text.indexOf("Keterangan") === 0) {
        para.removeFromParent();
      } else {
        // Jika judul/header, jadikan hitam
        textObj.setForegroundColor("#000000");
      }
    }
  }
}

// Menggantikan placeholder Penutup (Harapdiisi atau {{PENUTUP}}) dan memformatnya (Rata Kanan-Kiri, Non-Bold, Hitam)
function replacePenutup(body, penutupText) {
  var finalPenutup = penutupText ? penutupText.trim() : "Demikian proposal ini kami susun dengan harapan kegiatan ini dapat berjalan dengan baik dan memberikan manfaat bagi semua pihak. Atas perhatian dan kerjasamanya, kami mengucapkan terima kasih.";
  
  // Cari dan format paragraf berisi "Harap diisi" (mendukung spasi/tab banyak)
  var range1 = body.findText("Harap\\s+diisi");
  if (range1) {
    var el = range1.getElement();
    var para = el.getParent().asParagraph();
    para.replaceText("Harap\\s+diisi", finalPenutup);
    para.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
    para.editAsText().setFontFamily("Times New Roman").setFontSize(12).setBold(false).setItalic(false).setForegroundColor("#000000");
  }
  
  // Cari dan format paragraf berisi "{{PENUTUP}}" (mendukung optional backslash)
  var range2 = body.findText("\\\\?\\{\\\\?\\{PENUTUP\\\\?\\}\\\\?\\}");
  if (range2) {
    var el = range2.getElement();
    var para = el.getParent().asParagraph();
    para.replaceText("\\\\?\\{\\\\?\\{PENUTUP\\\\?\\}\\\\?\\}", finalPenutup);
    para.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
    para.editAsText().setFontFamily("Times New Roman").setFontSize(12).setBold(false).setItalic(false).setForegroundColor("#000000");
  }
}

// Menggantikan tanda tangan Halaman Pengesahan (Ketua & Sekretaris) secara presisi menggunakan pencarian NIM terdekat setelah nama
function replaceSignaturesInDoc(body, ketua, nim, sekretaris, nimSekretaris) {
  // Ganti teks "Nama Ketua" dan "Nama Sekretaris"
  body.replaceText("Nama Ketua", ketua);
  body.replaceText("Nama Sekretaris", sekretaris);
  
  // Cari NIM untuk Ketua Pelaksana (NIM pertama yang ditemui setelah teks nama Ketua)
  var searchKetua = body.findText(ketua);
  if (searchKetua) {
    var searchNimKetua = body.findText("NIM\\.", searchKetua);
    if (searchNimKetua) {
      var text1 = searchNimKetua.getElement().asText();
      var textStr = text1.getText();
      text1.setText(textStr.replace(/NIM\.\s*/, "NIM. " + nim));
      text1.setBold(true);
      text1.setForegroundColor("#000000");
    }
  }
  
  // Cari NIM untuk Sekretaris (NIM pertama yang ditemui setelah teks nama Sekretaris)
  var searchSekr = body.findText(sekretaris);
  if (searchSekr) {
    var searchNimSekr = body.findText("NIM\\.", searchSekr);
    if (searchNimSekr) {
      var text2 = searchNimSekr.getElement().asText();
      var textStr2 = text2.getText();
      text2.setText(textStr2.replace(/NIM\.\s*/, "NIM. " + nimSekretaris));
      text2.setBold(true);
      text2.setForegroundColor("#000000");
    }
  }
}


// Membaca spreadsheet data pengurus
function getCommitteeData(mainFolder) {
  // Cari berkas DATA PENGURUS HMIF 2026 secara rekursif
  var file = findFileRecursively(mainFolder, "DATA PENGURUS HMIF 2026");

  if (!file) {
    // Cari yang mengandung teks DATA PENGURUS
    var subfolders = mainFolder.getFolders();
    while (subfolders.hasNext()) {
      var sub = subfolders.next();
      var files = sub.getFiles();
      while (files.hasNext()) {
        var f = files.next();
        if (f.getName().indexOf("DATA PENGURUS") !== -1 && f.getMimeType() === MimeType.GOOGLE_SHEETS) {
          file = f;
          break;
        }
      }
      if (file) break;
    }
  }

  if (!file) return [];

  try {
    var ss = SpreadsheetApp.openById(file.getId());
    var sheet = ss.getSheets()[0];
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];

    // Baca baris header untuk mencari index kolom
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nameColIdx = -1;
    var nimColIdx = -1;
    var posColIdx = -1;

    for (var i = 0; i < headers.length; i++) {
      var h = String(headers[i]).toUpperCase().trim();
      if (h === "NAMA") nameColIdx = i;
      if (h === "NIM") nimColIdx = i;
      if (h === "JABATAN") posColIdx = i;
    }

    // Fallback jika header tidak cocok persis
    if (nameColIdx === -1) nameColIdx = 1;
    if (nimColIdx === -1) nimColIdx = 2;
    if (posColIdx === -1) posColIdx = 4;

    var dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    var members = [];

    for (var r = 0; r < dataRange.length; r++) {
      var row = dataRange[r];
      var name = String(row[nameColIdx]).trim();
      var nim = String(row[nimColIdx]).trim();
      var position = String(row[posColIdx]).trim();

      if (name) {
        members.push({
          name: name,
          nim: nim,
          position: position
        });
      }
    }
    return members;
  } catch (err) {
    console.warn("Gagal membaca spreadsheet pengurus:", err.toString());
    return [];
  }
}

// Utility untuk merapikan regex replacement
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Format Rupiah
function formatRupiah(amount) {
  if (amount === null || amount === undefined) return "Rp 0";
  var formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "Rp " + formatted;
}

// Helper: Membuat folder jika belum ada, atau mengembalikan folder yang sudah ada
function getOrCreateFolder(parentFolder, folderName) {
  var subs = parentFolder.getFoldersByName(folderName);
  if (subs.hasNext()) {
    return subs.next();
  }
  return parentFolder.createFolder(folderName);
}

// Mencari file secara rekursif dalam subfolder
function findFileRecursively(parentFolder, fileName) {
  var files = parentFolder.getFilesByName(fileName);
  if (files.hasNext()) {
    return files.next();
  }

  var subfolders = parentFolder.getFolders();
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    var file = findFileRecursively(subfolder, fileName);
    if (file) {
      return file;
    }
  }
  return null;
}

// Mengambil folder berjenjang berdasarkan array nama path folder
function getFolderByPath(parentFolder, pathArray) {
  var current = parentFolder;
  for (var i = 0; i < pathArray.length; i++) {
    var targetName = pathArray[i];
    var subs = current.getFoldersByName(targetName);
    if (subs.hasNext()) {
      current = subs.next();
    } else {
      // Fallback: cari dengan nama yang sudah di-trim
      var allSubs = current.getFolders();
      var found = false;
      while (allSubs.hasNext()) {
        var sub = allSubs.next();
        if (sub.getName().trim().toUpperCase() === targetName.toUpperCase()) {
          current = sub;
          found = true;
          break;
        }
      }
      if (!found) return null;
    }
  }
  return current;
}

// ============================================================
// Table Styling Helper (Font Matching, Widths, Header Bg)
// ============================================================
function formatAndStyleTable(table, columnWidths, fontName, fontSize) {
  var numRows = table.getNumRows();
  if (numRows === 0) return;
  var numCols = table.getRow(0).getNumCells();

  var finalFont = fontName || "Arial";
  var finalSize = fontSize || 11;

  // Set Column Widths
  if (columnWidths && columnWidths.length > 0) {
    for (var col = 0; col < numCols; col++) {
      if (col < columnWidths.length) {
        table.setColumnWidth(col, columnWidths[col]);
      }
    }
  }

  for (var r = 0; r < numRows; r++) {
    var row = table.getRow(r);
    var isHeader = (r === 0);

    if (isHeader) {
      row.setMinimumHeight(24);
    }

    for (var c = 0; c < numCols; c++) {
      var cell = row.getCell(c);
      cell.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);
      cell.setPaddingTop(5);
      cell.setPaddingBottom(5);
      cell.setPaddingLeft(6);
      cell.setPaddingRight(6);

      var numParas = cell.getNumChildren();
      for (var p = 0; p < numParas; p++) {
        var child = cell.getChild(p);
        if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
          var para = child.asParagraph();
          para.editAsText().setFontFamily(finalFont);
          para.editAsText().setFontSize(finalSize);

          if (isHeader) {
            para.editAsText().setBold(true);
            para.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
            cell.setBackgroundColor("#d9d9d9");
          } else {
            para.editAsText().setBold(false);
          }
        }
      }
    }
  }
}

// ============================================================
// Treasurer (Bendahara) Document Generation Actions
// ============================================================
function handleCreateTreasurerDocument(params) {
  var templateId = params.templateId;
  var prokerName = params.prokerName;
  var subsidi = parseFloat(params.subsidi) || 0;
  var items = params.items || [];
  
  var templateFile = DriveApp.getFileById(templateId);
  var baseName = templateFile.getName();
  if (baseName.toLowerCase().endsWith(".docx")) {
    baseName = baseName.substring(0, baseName.length - 5);
  } else if (baseName.toLowerCase().endsWith(".xlsx")) {
    baseName = baseName.substring(0, baseName.length - 5);
  }
  var newFileName = baseName + " " + prokerName;
  
  // Tentukan subfolder proker tujuan
  var mainFolder = DriveApp.getFolderById(MAIN_FOLDER_ID);
  var outputFolder = getOrCreateFolder(mainFolder, "WEB_SECRETARY_OUTPUT");
  
  var deptName = params.departemen || "EXECUTIVE BOARD";
  if (deptName.toUpperCase().indexOf("EXECUTIVE BOARD") !== -1 || deptName.toUpperCase() === "EB") {
    deptName = "EB";
  }
  var deptFolder = getOrCreateFolder(outputFolder, deptName);
  var prokerFolder = getOrCreateFolder(deptFolder, prokerName);
  
  // Hapus file dengan nama yang sama terlebih dahulu untuk mencegah duplikasi
  var existingFiles = prokerFolder.getFilesByName(newFileName);
  while (existingFiles.hasNext()) {
    var ef = existingFiles.next();
    try {
      ef.setTrashed(true);
    } catch (e) {
      DriveApp.getFileById(ef.getId()).setTrashed(true);
    }
  }

  // Copy template
  var copiedFile = templateFile.makeCopy(newFileName, prokerFolder);
  var docId = copiedFile.getId();
  
  // Jika file adalah Google Docs, edit isinya
  if (copiedFile.getMimeType() === MimeType.GOOGLE_DOCS) {
    var doc = DocumentApp.openById(docId);
    var body = doc.getBody();
    
    // Replace standard placeholders
    body.replaceText("Nama Kegiatan", prokerName);
    body.replaceText("\\{\\{NAMA_PROKER\\}\\}", prokerName);
    
    var isRAB = baseName.toUpperCase().indexOf("RAB") !== -1 || baseName.toUpperCase().indexOf("ANGGARAN") !== -1;
    
    if (isRAB) {
      populateRABTable(body, items);
    } else {
      populateLPJKeuanganTableAndSummary(body, items, subsidi);
    }
    
    // Clean up red highlights and color headers
    cleanupRedTextAndGuidelines(body);
    
    doc.saveAndClose();
  } 
  else if (copiedFile.getMimeType() === MimeType.GOOGLE_SHEETS) {
    var ss = SpreadsheetApp.openById(docId);
    var sheets = ss.getSheets();
    for (var s = 0; s < sheets.length; s++) {
      var sheet = sheets[s];
      var range = sheet.getDataRange();
      var values = range.getValues();
      for (var r = 0; r < values.length; r++) {
        for (var c = 0; c < values[r].length; c++) {
          var val = values[r][c].toString();
          if (val.indexOf("Nama Kegiatan") !== -1) {
            sheet.getRange(r+1, c+1).setValue(val.replace("Nama Kegiatan", prokerName));
          }
          if (val.indexOf("{{NAMA_PROKER}}") !== -1) {
            sheet.getRange(r+1, c+1).setValue(val.replace("{{NAMA_PROKER}}", prokerName));
          }
        }
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    docUrl: copiedFile.getUrl(),
    fileName: newFileName
  })).setMimeType(ContentService.MimeType.JSON);
}

// Mengisi tabel RAB secara dinamis untuk Pemasukan, Pengeluaran, & Selisih
function populateRABTable(body, items) {
  var tables = body.getTables();
  if (tables.length === 0) return;
  var targetTable = tables[0];
  
  var pemasukanItems = [];
  var pengeluaranItems = [];
  for (var i = 0; i < items.length; i++) {
    if (items[i].type === "pemasukan") {
      pemasukanItems.push(items[i]);
    } else {
      pengeluaranItems.push(items[i]);
    }
  }
  
  var pHeaderIdx = -1;
  var pTotalIdx = -1;
  var expHeaderIdx = -1;
  var expTotalIdx = -1;
  var diffIdx = -1;
  
  for (var r = 0; r < targetTable.getNumRows(); r++) {
    var text = targetTable.getRow(r).getText().toUpperCase().trim();
    if (text.indexOf("PEMASUKAN") !== -1 && text.indexOf("TOTAL") === -1 && text.indexOf("SELISIH") === -1) {
      pHeaderIdx = r;
    } else if (text.indexOf("TOTAL PEMASUKAN") !== -1) {
      pTotalIdx = r;
    } else if (text.indexOf("PENGELUARAN") !== -1 && text.indexOf("TOTAL") === -1 && text.indexOf("SELISIH") === -1) {
      expHeaderIdx = r;
    } else if (text.indexOf("TOTAL PENGELUARAN") !== -1) {
      expTotalIdx = r;
    } else if (text.indexOf("SELISIH") !== -1) {
      diffIdx = r;
    }
  }
  
  // 1. Isi Pengeluaran
  var totalPengeluaran = 0;
  if (expHeaderIdx !== -1 && expTotalIdx !== -1) {
    var removeCount = expTotalIdx - expHeaderIdx - 1;
    for (var k = 0; k < removeCount; k++) {
      targetTable.removeRow(expHeaderIdx + 1);
    }
    
    for (var i = 0; i < pengeluaranItems.length; i++) {
      var item = pengeluaranItems[i];
      var qty = parseFloat(item.qty) || 1;
      var price = parseFloat(item.price) || 0;
      var subtotal = qty * price;
      totalPengeluaran += subtotal;
      
      var newRow = targetTable.insertTableRow(expHeaderIdx + 1 + i);
      var cellNo = newRow.appendTableCell((i + 1).toString());
      var cellName = newRow.appendTableCell(item.name || "");
      var cellQty = newRow.appendTableCell(qty.toString());
      var cellUnit = newRow.appendTableCell(item.unit || "Paket");
      var cellPrice = newRow.appendTableCell(formatRupiah(price));
      var cellSub = newRow.appendTableCell(formatRupiah(subtotal));
      var cellDesc = newRow.appendTableCell(item.desc || "");
      
      cellNo.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      cellName.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      cellQty.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      cellUnit.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      cellPrice.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      cellSub.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      cellDesc.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
    }
    
    // Re-scan
    for (var r = 0; r < targetTable.getNumRows(); r++) {
      var text = targetTable.getRow(r).getText().toUpperCase().trim();
      if (text.indexOf("TOTAL PEMASUKAN") !== -1) pTotalIdx = r;
      else if (text.indexOf("PENGELUARAN") !== -1 && text.indexOf("TOTAL") === -1 && text.indexOf("SELISIH") === -1) expHeaderIdx = r;
      else if (text.indexOf("TOTAL PENGELUARAN") !== -1) expTotalIdx = r;
      else if (text.indexOf("SELISIH") !== -1) diffIdx = r;
    }
    
    var totalRow = targetTable.getRow(expTotalIdx);
    totalRow.getCell(5).setText(formatRupiah(totalPengeluaran));
    totalRow.getCell(5).getChild(0).asParagraph().setBold(true).setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  }
  
  // 2. Isi Pemasukan
  var totalPemasukan = 0;
  if (pHeaderIdx !== -1 && pTotalIdx !== -1) {
    var removeCount = pTotalIdx - pHeaderIdx - 1;
    for (var k = 0; k < removeCount; k++) {
      targetTable.removeRow(pHeaderIdx + 1);
    }
    
    for (var i = 0; i < pemasukanItems.length; i++) {
      var item = pemasukanItems[i];
      var qty = parseFloat(item.qty) || 1;
      var price = parseFloat(item.price) || 0;
      var subtotal = qty * price;
      totalPemasukan += subtotal;
      
      var newRow = targetTable.insertTableRow(pHeaderIdx + 1 + i);
      var cellNo = newRow.appendTableCell((i + 1).toString());
      var cellName = newRow.appendTableCell(item.name || "");
      var cellQty = newRow.appendTableCell(qty.toString());
      var cellUnit = newRow.appendTableCell(item.unit || "Paket");
      var cellPrice = newRow.appendTableCell(formatRupiah(price));
      var cellSub = newRow.appendTableCell(formatRupiah(subtotal));
      var cellDesc = newRow.appendTableCell(item.desc || "");
      
      cellNo.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      cellName.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      cellQty.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      cellUnit.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      cellPrice.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      cellSub.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      cellDesc.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
    }
    
    for (var r = 0; r < targetTable.getNumRows(); r++) {
      var text = targetTable.getRow(r).getText().toUpperCase().trim();
      if (text.indexOf("TOTAL PEMASUKAN") !== -1) pTotalIdx = r;
      else if (text.indexOf("TOTAL PENGELUARAN") !== -1) expTotalIdx = r;
      else if (text.indexOf("SELISIH") !== -1) diffIdx = r;
    }
    
    var totalRow = targetTable.getRow(pTotalIdx);
    totalRow.getCell(5).setText(formatRupiah(totalPemasukan));
    totalRow.getCell(5).getChild(0).asParagraph().setBold(true).setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  }
  
  // 3. Update Selisih
  if (diffIdx !== -1) {
    var diffRow = targetTable.getRow(diffIdx);
    var selisih = totalPemasukan - totalPengeluaran;
    diffRow.getCell(5).setText(formatRupiah(selisih));
    diffRow.getCell(5).getChild(0).asParagraph().setBold(true).setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  }
  
  var fontName = "Arial";
  var fontSize = 11;
  try {
    fontName = targetTable.getRow(0).getCell(0).getChild(0).asParagraph().getAttributes()[DocumentApp.Attribute.FONT_FAMILY] || "Arial";
    fontSize = targetTable.getRow(0).getCell(0).getChild(0).asParagraph().getAttributes()[DocumentApp.Attribute.FONT_SIZE] || 11;
  } catch (e) {}
  
  var widths = [30, 150, 30, 50, 80, 80, 100];
  formatAndStyleTable(targetTable, widths, fontName, fontSize);
}

// Mengisi tabel Rincian Pembelanjaan LPJ Keuangan & Summary Panjar
function populateLPJKeuanganTableAndSummary(body, items, subsidi) {
  var res = populateLPJKeuanganTable(body, items);
  var totalBeforePPh = res ? res.totalBeforePPh : 0;
  var totalPotonganPPh = res ? res.totalPotonganPPh : 0;
  var totalDibayar = res ? res.totalDibayar : 0;
  
  var paragraphs = body.getParagraphs();
  for (var p = 0; p < paragraphs.length; p++) {
    var para = paragraphs[p];
    var text = para.getText().trim();
    
    if (text.indexOf("Nominal subsidi institusi") !== -1) {
      para.setText(para.getText().replace("Nominal subsidi institusi", formatRupiah(subsidi)));
      para.editAsText().setBold(true).setForegroundColor("#000000");
    }
    
    if (text === "Jumlah Pertanggungan Beban (1)" && p + 2 < paragraphs.length) {
      if (paragraphs[p+1].getText().trim() === "Rp" && (paragraphs[p+2].getText().trim() === "-" || paragraphs[p+2].getText().trim() === "")) {
        paragraphs[p+2].setText(formatNumberDot(totalBeforePPh));
        paragraphs[p+2].editAsText().setBold(true).setForegroundColor("#000000");
      }
    }
    if (text === "Jumlah Pembelanjaan (3)" && p + 2 < paragraphs.length) {
      if (paragraphs[p+1].getText().trim() === "Rp" && (paragraphs[p+2].getText().trim() === "-" || paragraphs[p+2].getText().trim() === "")) {
        paragraphs[p+2].setText(formatNumberDot(totalDibayar));
        paragraphs[p+2].editAsText().setBold(true).setForegroundColor("#000000");
      }
    }
    if (text === "Pengembalian Panjar (panjar – 3)" && p + 2 < paragraphs.length) {
      if (paragraphs[p+1].getText().trim() === "Rp" && (paragraphs[p+2].getText().trim() === "-" || paragraphs[p+2].getText().trim() === "")) {
        var sisa = subsidi - totalDibayar;
        paragraphs[p+2].setText(formatNumberDot(sisa));
        paragraphs[p+2].editAsText().setBold(true).setForegroundColor("#000000");
      }
    }
  }
}

// Helper untuk mengisi tabel rincian transaksi pembelanjaan LPJ
function populateLPJKeuanganTable(body, items) {
  var tables = body.getTables();
  var targetTable = null;
  
  for (var t = 0; t < tables.length; t++) {
    var table = tables[t];
    if (table.getNumRows() > 0) {
      var row = table.getRow(0);
      var headerText = "";
      for (var c = 0; c < row.getNumCells(); c++) {
        headerText += row.getCell(c).getText() + " ";
      }
      if (headerText.indexOf("Harga Sebelum PPh") !== -1 || headerText.indexOf("Uraian") !== -1) {
        targetTable = table;
        break;
      }
    }
  }
  
  if (targetTable) {
    var totalRowIdx = -1;
    for (var r = 0; r < targetTable.getNumRows(); r++) {
      if (targetTable.getRow(r).getCell(0).getText().trim().toUpperCase() === "TOTAL") {
        totalRowIdx = r;
        break;
      }
    }
    
    if (totalRowIdx === -1) {
      for (var r = 0; r < targetTable.getNumRows(); r++) {
        var row = targetTable.getRow(r);
        for (var c = 0; c < row.getNumCells(); c++) {
          if (row.getCell(c).getText().trim().toUpperCase() === "TOTAL") {
            totalRowIdx = r;
            break;
          }
        }
        if (totalRowIdx !== -1) break;
      }
    }
    
    var startRemoveIdx = 1;
    var endRemoveIdx = totalRowIdx !== -1 ? totalRowIdx : targetTable.getNumRows();
    
    var numRowsToRemove = endRemoveIdx - startRemoveIdx;
    for (var k = 0; k < numRowsToRemove; k++) {
      targetTable.removeRow(startRemoveIdx);
    }
    
    var totalBeforePPh = 0;
    var totalPotonganPPh = 0;
    var totalDibayar = 0;
    
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var newRow = targetTable.insertTableRow(startRemoveIdx + i);
      
      var priceBefore = parseFloat(item.priceBeforePPh) || 0;
      var pphCut = parseFloat(item.pphCut) || 0;
      var paid = priceBefore - pphCut;
      
      totalBeforePPh += priceBefore;
      totalPotonganPPh += pphCut;
      totalDibayar += paid;
      
      var cellNo = newRow.appendTableCell((i + 1).toString());
      var cellTgl = newRow.appendTableCell(item.date || "");
      var cellUraian = newRow.appendTableCell(item.desc || "");
      var cellHarga = newRow.appendTableCell(formatRupiah(priceBefore));
      var cellPPh = newRow.appendTableCell(formatRupiah(pphCut));
      var cellDibayar = newRow.appendTableCell(formatRupiah(paid));
      
      cellNo.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      cellTgl.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      cellUraian.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      cellHarga.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      cellPPh.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      cellDibayar.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    }
    
    var totalRow = targetTable.insertTableRow(startRemoveIdx + items.length);
    var totalLabelCell = totalRow.appendTableCell("TOTAL");
    totalLabelCell.getChild(0).asParagraph().setBold(true);
    
    totalRow.appendTableCell("");
    totalRow.appendTableCell("");
    
    var totalHargaCell = totalRow.appendTableCell(formatRupiah(totalBeforePPh));
    totalHargaCell.getChild(0).asParagraph().setBold(true).setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    
    var totalPPhCell = totalRow.appendTableCell(formatRupiah(totalPotonganPPh));
    totalPPhCell.getChild(0).asParagraph().setBold(true).setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    
    var totalDibayarCell = totalRow.appendTableCell(formatRupiah(totalDibayar));
    totalDibayarCell.getChild(0).asParagraph().setBold(true).setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    
    var fontName = "Arial";
    var fontSize = 11;
    try {
      fontName = targetTable.getRow(0).getCell(0).getChild(0).asParagraph().getAttributes()[DocumentApp.Attribute.FONT_FAMILY] || "Arial";
      fontSize = targetTable.getRow(0).getCell(0).getChild(0).asParagraph().getAttributes()[DocumentApp.Attribute.FONT_SIZE] || 11;
    } catch (e) {}
    
    var widths = [30, 70, 150, 90, 80, 90];
    formatAndStyleTable(targetTable, widths, fontName, fontSize);
    
    return {
      totalBeforePPh: totalBeforePPh,
      totalPotonganPPh: totalPotonganPPh,
      totalDibayar: totalDibayar
    };
  }
  return null;
}

// Format number with dots separator (e.g. 375.000)
function formatNumberDot(amount) {
  if (amount === null || amount === undefined) return "0";
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Populate target budget table inside a proposal Google Doc
function populateBudgetTable(insertAtPara, budgetItems, fontName, fontSize) {
  var dataRows = (budgetItems && budgetItems.length > 0) ? budgetItems : [];
  var numDataRows = dataRows.length > 0 ? dataRows.length : 3;
  var numRows = numDataRows + 2; // header + data rows + total row

  var cells = [];
  for (var r = 0; r < numRows; r++) {
    var rowCells = [];
    for (var c = 0; c < 5; c++) {
      rowCells.push("");
    }
    cells.push(rowCells);
  }

  var paraParent = insertAtPara.getParent();
  var paraIdx = paraParent.getChildIndex(insertAtPara);
  var newTable = paraParent.insertTable(paraIdx + 1, cells);

  // Header Row
  var headerRow = newTable.getRow(0);
  var headers = ["No", "Rincian Kebutuhan Item", "Jumlah", "Harga Satuan (Rp)", "Total (Rp)"];
  for (var h = 0; h < headers.length; h++) {
    headerRow.getCell(h).setText(headers[h]);
  }

  var grandTotal = 0;
  // Data Rows
  for (var i = 0; i < numDataRows; i++) {
    var row = newTable.getRow(i + 1);
    row.getCell(0).setText((i + 1).toString());
    row.getCell(0).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    if (dataRows.length > 0 && i < dataRows.length) {
      var d = dataRows[i];
      var itemTotal = (d.qty || 1) * (d.price || 0);
      grandTotal += itemTotal;
      row.getCell(1).setText(d.name || "");
      row.getCell(1).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      row.getCell(2).setText((d.qty || 1).toString());
      row.getCell(2).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      row.getCell(3).setText(formatNumberDot(d.price || 0));
      row.getCell(3).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      row.getCell(4).setText(formatNumberDot(itemTotal));
      row.getCell(4).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    } else {
      row.getCell(1).setText("");
      row.getCell(2).setText("");
      row.getCell(3).setText("");
      row.getCell(4).setText("");
    }
  }

  // Total Row
  var totalRow = newTable.getRow(numRows - 1);
  totalRow.getCell(0).setText("");
  totalRow.getCell(1).setText("TOTAL");
  totalRow.getCell(1).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  totalRow.getCell(2).setText("");
  totalRow.getCell(3).setText("");
  totalRow.getCell(4).setText("Rp " + formatNumberDot(grandTotal));

  // Styling
  var widths = [30, 200, 50, 100, 100];
  formatAndStyleTable(newTable, widths, fontName, fontSize);
  
  // Bold total label and grand total cell
  totalRow.getCell(1).getChild(0).asParagraph().editAsText().setBold(true);
  totalRow.getCell(4).getChild(0).asParagraph().editAsText().setBold(true);
  totalRow.getCell(4).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
}

// Helper to populate CPP Target checkmarks inside the CPP checklist table
function populateCPPChecks(body, cppSelections) {
  if (!cppSelections || cppSelections.length === 0) return;
  
  var tables = body.getTables();
  for (var t = 0; t < tables.length; t++) {
    var table = tables[t];
    if (table.getNumRows() > 1 && table.getRow(1).getNumCells() >= 2) {
      // Check if it's the CPP table by scanning row cells
      var cellText = table.getRow(1).getCell(1).getText().trim();
      if (cellText === "Integritas" || cellText.indexOf("Integritas") === 0) {
        // Found the CPP table!
        for (var r = 1; r < table.getNumRows(); r++) {
          var row = table.getRow(r);
          if (row.getNumCells() >= 4) {
            var cppName = row.getCell(1).getText().trim();
            var isSelected = false;
            for (var s = 0; s < cppSelections.length; s++) {
              if (cppName.toLowerCase().indexOf(cppSelections[s].toLowerCase()) !== -1) {
                isSelected = true;
                break;
              }
            }
            if (isSelected) {
              row.getCell(3).setText("✔");
              row.getCell(3).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
            } else {
              row.getCell(3).setText("");
            }
          }
        }
        break; // Stop after processing the first matching CPP table
      }
    }
  }
}

// Format all tables in the document to look professional and compliant
function formatAllDocumentTables(body) {
  var tables = body.getTables();
  for (var t = 0; t < tables.length; t++) {
    var table = tables[t];
    var numRows = table.getNumRows();
    for (var r = 0; r < numRows; r++) {
      var row = table.getRow(r);
      var numCells = row.getNumCells();
      for (var c = 0; c < numCells; c++) {
        var cell = row.getCell(c);
        
        // Apply cell padding
        cell.setPaddingTop(4);
        cell.setPaddingBottom(4);
        cell.setPaddingLeft(6);
        cell.setPaddingRight(6);
        
        // Header styling
        if (r === 0) {
          cell.setBackgroundColor("#d9d9d9");
        }
        
        // Paragraph styling
        var numChildren = cell.getNumChildren();
        for (var i = 0; i < numChildren; i++) {
          var child = cell.getChild(i);
          if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
            var para = child.asParagraph();
            var text = para.getText().trim();
            var textObj = para.editAsText();
            
            // Default Font Times New Roman
            textObj.setFontFamily("Times New Roman");
            textObj.setFontSize(11);
            
            if (r === 0) {
              textObj.setBold(true);
              para.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
            } else {
              textObj.setBold(false);
              // Rata kanan untuk angka/harga
              if (text.indexOf("Rp") === 0 || /^[0-9.,\s]+$/.test(text) || text.indexOf("%") !== -1) {
                para.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
              } else if (text.length <= 3 && /^[0-9]+$/.test(text)) {
                // Rata tengah untuk nomor urut
                para.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
              } else {
                para.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
              }
            }
          }
        }
      }
    }
  }
}

// Insert page breaks before each Lampiran to keep them cleanly separated
function formatAnnexPageBreaks(body) {
  var paragraphs = body.getParagraphs();
  for (var p = 0; p < paragraphs.length; p++) {
    var para = paragraphs[p];
    var text = para.getText().trim().toUpperCase();
    
    // Cocokkan judul lampiran
    if (text.indexOf("LAMPIRAN I") === 0 || text.indexOf("LAMPIRAN II") === 0 || text.indexOf("LAMPIRAN III") === 0) {
      var parent = para.getParent();
      var idx = parent.getChildIndex(para);
      
      // Cek apakah elemen sebelumnya sudah merupakan PageBreak
      var alreadyHasPageBreak = false;
      if (idx > 0) {
        var prevSibling = parent.getChild(idx - 1);
        if (prevSibling.getType() === DocumentApp.ElementType.PAGE_BREAK) {
          alreadyHasPageBreak = true;
        } else if (prevSibling.getType() === DocumentApp.ElementType.PARAGRAPH) {
          var prevPara = prevSibling.asParagraph();
          if (prevPara.getNumChildren() > 0) {
            var lastChild = prevPara.getChild(prevPara.getNumChildren() - 1);
            if (lastChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
              alreadyHasPageBreak = true;
            }
          }
        }
      }
      
      if (!alreadyHasPageBreak) {
        // Sisipkan PageBreak sebelum paragraph Lampiran ini
        parent.insertPageBreak(idx);
        // Refresh index karena kita baru menyisipkan elemen baru
        p++;
      }
    }
  }
}

function prependSirkulirToDoc(targetDoc, sirkulirDocId) {
  var sirkulirDoc = DocumentApp.openById(sirkulirDocId);
  var sirkulirBody = sirkulirDoc.getBody();
  var targetBody = targetDoc.getBody();
  var numChildren = sirkulirBody.getNumChildren();
  
  for (var i = numChildren - 1; i >= 0; i--) {
    var child = sirkulirBody.getChild(i).copy();
    var type = child.getType();
    
    if (type === DocumentApp.ElementType.PARAGRAPH) {
      targetBody.insertParagraph(0, child.asParagraph());
    } else if (type === DocumentApp.ElementType.TABLE) {
      targetBody.insertTable(0, child.asTable());
    } else if (type === DocumentApp.ElementType.LIST_ITEM) {
      targetBody.insertListItem(0, child.asListItem());
    } else {
      try {
        if (child.asParagraph) targetBody.insertParagraph(0, child.asParagraph());
      } catch(e) {}
    }
  }
  
  targetBody.insertParagraph(numChildren, "").appendPageBreak();
}