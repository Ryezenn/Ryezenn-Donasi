module.exports = function (api) {
  const isVercel = process.env.VERCEL === "1";

  if (isVercel) {
    // Pada Vercel, kembalikan objek kosong agar Next.js menggunakan compiler bawaan SWC/Turbopack
    return {};
  }

  // Pada komputer lokal, aktifkan Babel preset untuk menghindari crash SWC
  api.cache(true);
  return {
    presets: ["next/babel"],
  };
};
