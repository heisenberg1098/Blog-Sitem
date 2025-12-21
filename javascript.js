// 1. Firebase Yapılandırması (Global Kontrol ile)
if (typeof firebaseConfig === 'undefined') {
    var firebaseConfig = {
        apiKey: "AIzaSyBhTD31NWAq6DlnUQPwRcC4Q_-l-pNi1xs",
        authDomain: "okul-37a9d.firebaseapp.com",
        projectId: "okul-37a9d",
        storageBucket: "okul-37a9d.firebasestorage.app",
        messagingSenderId: "241414867800",
        appId: "1:241414867800:web:d32c7c7e88617e703e732d"
    };
}

// 2. Firebase'i Başlat (Çakışmayı önlemek için if kontrolü)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Zaten varsa mevcut olanı kullan
}

const db = firebase.firestore();

// --- FONKSİYONLAR ---

/**
 * Firestore'dan Web Sitelerini Çeker ve Listeler
 */
function webSiteleriniYukle() {
    const container = document.getElementById('websiteContainer');
    if (!container) return;

    db.collection("websiteler").onSnapshot((querySnapshot) => {
        container.innerHTML = '';
        
        if (querySnapshot.empty) {
            container.innerHTML = '<p style="font-size:1.5rem; text-align:center; width:100%;">Henüz web sitesi eklenmemiş.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const site = doc.data();
            const imgSource = site.resim ? site.resim : 'ME.png';
            const imgClass = site.resim ? '' : 'placeholder-img';
            
            container.innerHTML += `
                <div class="box" onclick="window.open('${site.link}', '_blank')">
                    <img src="${imgSource}" class="${imgClass}" alt="${site.isim}">
                    <div class="content">
                        <h3>${site.isim}</h3>
                    </div>
                </div>
            `;
        });
    }, (error) => {
        console.error("Firestore Veri Çekme Hatası (Websiteler): ", error);
    });
}

/**
 * İletişim Formunu Firestore'a Kaydeder
 */
function iletisimFormuHazirla() {
    const contactForm = document.getElementById('iletisimForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bildirim = document.getElementById('mesajBildirim');
        
        const mesajVerisi = {
            isim: document.getElementById('isim').value,
            email: document.getElementById('email').value,
            konu: document.getElementById('konu').value,
            mesaj: document.getElementById('mesaj').value,
            tarih: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection("mesajlar").add(mesajVerisi)
            .then(() => {
                if (bildirim) {
                    bildirim.textContent = "Mesajınız başarıyla iletildi!";
                    bildirim.style.color = "var(--green)";
                    bildirim.style.display = "block";
                    setTimeout(() => bildirim.style.display = "none", 3000);
                }
                contactForm.reset();
            })
            .catch((error) => {
                console.error("Mesaj Gönderme Hatası: ", error);
                alert("Mesaj iletilemedi. Lütfen Firestore kurallarını kontrol edin.");
            });
    });
}

/**
 * Admin Paneli Giriş Kontrolü
 */
function adminPaneliHazirla() {
    const ADMIN_SIFRE = "123456"; 
    const girisBtn = document.getElementById('girisBtn');
    const adminSifreInput = document.getElementById('adminSifre');

    if (girisBtn) {
        girisBtn.onclick = () => {
            const girilen = adminSifreInput.value;
            if (girilen === ADMIN_SIFRE) {
                // Form div'ini gizle, mesaj listesini göster
                document.getElementById('mesajForm').style.display = "none";
                document.getElementById('mesajListesi').style.display = "block";
                mesajlariListele();
            } else {
                alert("Hatalı Şifre!");
            }
        };
    }
}

/**
 * Admin Panelinde Mesajları Listeler
 */
function mesajlariListele() {
    const container = document.getElementById('mesajContainer');
    if (!container) return;

    db.collection("mesajlar").orderBy("tarih", "desc").onSnapshot((querySnapshot) => {
        container.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const m = doc.data();
            const tarih = m.tarih ? new Date(m.tarih.seconds * 1000).toLocaleString('tr-TR') : "İşleniyor...";
            
            container.innerHTML += `
                <div class="mesaj-kart">
                    <div class="mesaj-header">
                        <span class="mesaj-gonderen">${m.isim}</span>
                        <span class="mesaj-tarih">${tarih}</span>
                    </div>
                    <div class="mesaj-konu">Konu: ${m.konu}</div>
                    <div class="mesaj-icerik">
                        <strong>Email:</strong> ${m.email}<br><br>
                        ${m.mesaj}
                    </div>
                </div>
            `;
        });
    }, (error) => {
        console.error("Firestore Mesaj Çekme Hatası: ", error);
    });
}

// Sayfa yüklendiğinde tüm modülleri başlat
document.addEventListener('DOMContentLoaded', () => {
    webSiteleriniYukle();
    iletisimFormuHazirla();
    adminPaneliHazirla();
});

function webSiteleriniYukle() {
    const container = document.getElementById('websiteContainer');
    
    db.collection("websiteler").onSnapshot((querySnapshot) => {
        container.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const site = doc.data();
            
            // Eğer özel font varsa Google Fonts'tan yükle
            if (site.font) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${site.font.replace(' ', '+')}&display=swap`;
                document.head.appendChild(link);
            }

            const fontStyle = site.font ? `font-family: '${site.font}', sans-serif;` : '';
            const imgSource = site.resim ? site.resim : 'ME.png';

            container.innerHTML += `
                <div class="web-card">
                    <div class="img-box">
                        <img src="${imgSource}" alt="">
                    </div>
                    <h3 style="${fontStyle}">${site.isim}</h3>
                    <p>${site.aciklama || 'Açıklama eklenmedi.'}</p>
                    <a href="${site.link}" target="_blank" class="btn">Siteyi Görüntüle</a>
                </div>
            `;
        });
    });
}
// 1. Pop-up Açma/Kapama
function adminPopUpAc() { document.getElementById('adminModal').style.display = "block"; }
document.querySelector('.close-admin').onclick = () => document.getElementById('adminModal').style.display = "none";

// 2. Şifre Kontrolü (Veritabanından Çekerek)
async function adminGirisKontrol() {
    const girilen = document.getElementById('pSifre').value;
    const doc = await db.collection("ayarlar").doc("admin").get();
    
    if (doc.exists && doc.data().sifre === girilen) {
        document.getElementById('adminModal').style.display = "none";
        document.getElementById('adminPanel').style.display = "block";
        adminMesajlariYukle();
    } else {
        alert("Hatalı Şifre!");
    }
}

// 3. Yeni Web Sitesi Ekleme
document.getElementById('siteEkleForm').onsubmit = async (e) => {
    e.preventDefault();
    const yeniSite = {
        isim: document.getElementById('sAd').value,
        link: document.getElementById('sLink').value,
        font: document.getElementById('sFont').value,
        aciklama: document.getElementById('sAciklama').value,
        resim: "", // Varsayılan Ben.png kullanacak
        tarih: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection("websiteler").add(yeniSite);
    alert("Site başarıyla eklendi!");
    document.getElementById('siteEkleForm').reset();
};

// 4. Mesajları Listeleme ve Silme
function adminMesajlariYukle() {
    const liste = document.getElementById('adminMesajListesi');
    db.collection("mesajlar").orderBy("tarih", "desc").onSnapshot(snapshot => {
        liste.innerHTML = '';
        snapshot.forEach(doc => {
            const m = doc.data();
            liste.innerHTML += `
                <div class="admin-mesaj-kart">
                    <i class="fas fa-trash sil-btn" onclick="mesajSil('${doc.id}')"></i>
                    <strong>${m.isim}</strong> <small>${m.email}</small>
                    <p>Konu: ${m.konu}</p>
                    <p style="margin-top:.5rem;">${m.mesaj}</p>
                </div>`;
        });
    });
}

function mesajSil(id) {
    if(confirm("Bu mesajı silmek istediğine emin misin?")) {
        db.collection("mesajlar").doc(id).delete();
    }
}

function panelKapat() { document.getElementById('adminPanel').style.display = "none"; }
let menu = document.querySelector('#menu-btn');
let header = document.querySelector('.header');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    header.classList.toggle('active');
}
let themeToggler = document.querySelector('#theme-together');

themeToggler.onclick = () => {
    // İkon sınıfını kontrol et ve değiştir
    if (themeToggler.classList.contains('fa-moon')) {
        themeToggler.classList.replace('fa-moon', 'fa-sun'); // Ayı sil, güneş yap
        document.body.classList.add('active');
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggler.classList.replace('fa-sun', 'fa-moon'); // Güneşi sil, ay yap
        document.body.classList.remove('active');
        localStorage.setItem('theme', 'light');
    }
}

// Sayfa yenilendiğinde ikonun doğru gelmesini sağla
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('active');
        themeToggler.classList.replace('fa-moon', 'fa-sun');
    }
});

