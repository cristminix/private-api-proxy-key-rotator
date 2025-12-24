Proyek ini adalah sebuah API proxy dengan fitur key rotation. Berikut penjelasan lengkapnya:

**Nama Proyek**: private-api-proxy-key-rotator

**Fungsi Utama**:

- Bertindak sebagai proxy untuk API eksternal (dalam hal ini ollama.com)
- Memiliki fitur key rotation untuk mengatur penggunaan API keys secara bergiliran
- Meneruskan permintaan dari client ke API tujuan dengan menambahkan header Authorization menggunakan API key yang sedang aktif

**Cara Kerja**:

1. Menerima permintaan HTTP dari client
2. Memilih API key secara bergiliran (rotasi) dari daftar API keys yang tersedia
3. Meneruskan permintaan ke API tujuan (DST_HOST) dengan menambahkan header Authorization
4. Mengembalikan respons dari API tujuan ke client

**Konfigurasi**:

- SERVICE_PORT: Port tempat proxy berjalan (contoh: 2025)
- SERVICE_HOST: Host tempat proxy berjalan (contoh: 0.0.0.0)
- DST_HOST: Host API tujuan (contoh: ollama.com)
- API_KEYS: Daftar API keys yang dipisahkan dengan koma

Proyek ini berguna untuk mengelola penggunaan API keys secara efisien dan menghindari rate limiting dengan melakukan rotasi penggunaan key.
