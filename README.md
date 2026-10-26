# Personel Çizelgesi

Haftalık personel çizelgesi (bölge, okul, nokta), izin tablosu ve özet raporu. Veriler `personel-izin` ile aynı Supabase projesinde, sayfa GitHub Pages'te.

- `index.html` sayfanın kendisi (tek dosya)
- `manifest.webmanifest`, `sw.js`, `icon-*.png` ana ekrana eklenebilir uygulama için
- Sayfayı herkes görür; düzenlemek için sağ üstteki kilide dokunup `personel-izin` yönetici PIN'ini girmek gerekir
- Veri tabloları: `cizelge_doc` (güncel çizelge), `cizelge_yedek` (yedekler, en çok 20). Yazma yalnızca PIN'li fonksiyonlarla yapılır

Güncelleme: `index.html` dosyasını değiştirip kaydetmek yeterli, bir dakika içinde yayına girer.
