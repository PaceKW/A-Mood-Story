const jsonfile = require("jsonfile"); // Mengimpor modul jsonfile untuk membaca dan menulis file JSON
const moment = require("moment"); // Mengimpor modul moment untuk manipulasi dan format tanggal
const simpleGit = require("simple-git"); // Mengimpor modul simple-git untuk melakukan operasi Git
const fs = require("fs"); // Mengimpor modul fs untuk berinteraksi dengan sistem file

const randomThoughtsFile = "./randomThoughts.json"; // Path untuk file random thoughts
const FILE_PATH = "./README.md"; // Path untuk file README.md

// Fungsi untuk menghasilkan bilangan bulat acak antara min dan max
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min; // Menghasilkan bilangan bulat acak
};

const commitToday = async () => {
  try {
    // Mendapatkan tanggal dan waktu sekarang
    const now = moment(); // Tanggal dan waktu saat ini
    const formattedDate = now.format("ddd, DD MMM YYYY HH:mm:ss [GMT]"); // Memformat tanggal dan waktu

    // Membaca pikiran acak dari file JSON
    const { thoughts } = await jsonfile.readFile(randomThoughtsFile);
    const randomThought = thoughts[getRandomInt(0, thoughts.length - 1)]; // Memilih pikiran acak

    // Membuat baris yang diperbarui untuk README.md
    const updatedLine = `# A Mood Story

⏰ Updated on ${formattedDate}

💭 Thought: ${randomThought}

`; // Menggunakan newline setelah thought untuk pemformatan yang lebih baik.

    // Memperbarui file README.md dengan timestamp dan pikiran saat ini
    await fs.promises.writeFile(FILE_PATH, updatedLine); // Menggunakan promises untuk fs.writeFile
    console.log(`README.md updated with:\n${updatedLine}`);

    // Melakukan operasi Git: menambahkan file, commit, dan push
    await simpleGit().add([FILE_PATH]); // Menambahkan file README.md ke staging
    await simpleGit().commit(`Updated README.md`); // Melakukan commit
    await simpleGit().push(); // Melakukan push setelah commit
    console.log("Changes pushed to Git successfully!");
  } catch (err) {
    console.error("Failed to commit or push changes to Git:", err); // Menangani kesalahan
  }
};

commitToday(); // Memulai dengan melakukan commit untuk hari ini
