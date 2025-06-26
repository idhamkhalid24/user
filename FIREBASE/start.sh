#!/bin/bash
# ---------------------------------------------------------
# START.SH - Menjalankan Server HTTP untuk Aplikasi Unix
# ---------------------------------------------------------
# Digunakan untuk memulai server dengan Python3
# Secara default berjalan di http://localhost:8080
# ---------------------------------------------------------

# Tentukan port
PORT=8080

# Tampilkan pesan
echo "==========================================="
echo "🔥 Memulai Aplikasi Unix di http://localhost:$PORT"
echo "📁 Lokasi proyek: $(pwd)"
echo "==========================================="
echo

# Cek apakah Python3 tersedia
if ! command -v python3 &> /dev/null
then
    echo "❌ Python3 tidak ditemukan."
    echo "👉 Install dulu Python3 sebelum memulai."
    exit 1
fi

# Jalankan server
python3 -m http.server $PORT
