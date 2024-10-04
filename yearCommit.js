const jsonfile = require("jsonfile");
const moment = require("moment");
const simpleGit = require("simple-git");
const fs = require("fs");

const randomThoughtsFile = "./randomThoughts.json"; // Path untuk file random thoughts
const FILE_PATH = "./README.md"; // Path untuk file README.md

// Fungsi untuk menghasilkan bilangan bulat acak antara min dan max
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Fungsi untuk menghasilkan tanggal acak dalam setahun terakhir
const getRandomDateInLastYear = () => {
  const today = moment();
  const lastYear = today.clone().subtract(1, "years"); // Tanggal satu tahun yang lalu
  const randomTimestamp = getRandomInt(lastYear.valueOf(), today.valueOf());
  return moment(randomTimestamp); // Mengembalikan tanggal acak
};

// Fungsi untuk melakukan commit dengan jumlah tertentu
const commitRandomThoughts = async (commitCount) => {
  const git = simpleGit(); // Inisialisasi simple-git

  for (let i = 0; i < commitCount; i++) {
    try {
      // Mendapatkan tanggal acak dalam setahun terakhir untuk setiap commit
      const randomDate = getRandomDateInLastYear();
      const formattedDate = randomDate
        .utc()
        .format("ddd, DD MMM YYYY HH:mm:ss [GMT]");

      // Membaca pikiran acak dari file JSON
      const { thoughts } = await jsonfile.readFile(randomThoughtsFile);
      const randomThought = thoughts[getRandomInt(0, thoughts.length - 1)];

      // Membuat baris yang diperbarui untuk README.md
      const updatedLine = `# A Mood Story

⏰ Updated on ${formattedDate}

💭 Thought: ${randomThought}

`; // Memperbarui dengan newline setelah thought untuk pemformatan yang lebih baik.

      // Memperbarui file README.md dengan timestamp dan pikiran saat ini
      await fs.promises.writeFile(FILE_PATH, updatedLine); // Menggunakan promises untuk fs.writeFile
      console.log(`README.md updated with:\n${updatedLine}`);

      // Melakukan operasi Git: menambahkan file dan commit
      await git.add([FILE_PATH]); // Menambahkan file README.md ke staging
      await git.commit("Updated README.md", { "--date": formattedDate }); // Melakukan commit dengan pesan yang diinginkan dan tanggal yang ditentukan
      console.log("Commit successful!");
    } catch (err) {
      console.error("Failed to commit changes:", err); // Menangani kesalahan
    }
  }

  // Melakukan push setelah semua commit selesai
  try {
    await git.push(); // Melakukan push setelah semua commit
    console.log("All changes pushed to Git successfully!");
  } catch (err) {
    console.error("Failed to push changes to Git:", err); // Menangani kesalahan
  }
};

// Memanggil fungsi dengan jumlah commit yang diinginkan
commitRandomThoughts(721); // Ubah angka ini untuk menentukan jumlah commit
