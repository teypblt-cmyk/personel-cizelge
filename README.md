# Personel Çizelgesi

Haftalık personel çizelgesi (bölge, okul, nokta), izin tablosu ve özet raporu. Veriler `personel-izin` ile aynı Supabase projesinde, sayfa GitHub Pages'te.

- `index.html` sayfanın kendisi (tek dosya)
- `manifest.webmanifest`, `sw.js`, `icon-*.png` ana ekrana eklenebilir uygulama için
- Sayfa açılışta yalnızca şifre ister. Şifre değiştirme de aynı giriş ekranında ("Şifreyi değiştir"); sağ üstteki 🔒 düğmesi kilitleyip giriş ekranına döner
- Veri tabloları: `cizelge_doc` (güncel çizelge), `cizelge_yedek` (yedekler, en çok 20), `cizelge_secret` (şifrenin hash'i). Tablolara doğrudan erişim kapalı; okuma ve yazma yalnızca şifre kontrollü fonksiyonlarla yapılır. Deneme sayısı sınırlı değildir

Güncelleme: `index.html` dosyasını değiştirip kaydetmek yeterli, bir dakika içinde yayına girer.
