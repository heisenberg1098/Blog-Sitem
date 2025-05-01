let menu = document.querySelector('#menu-btn');
let header = document.querySelector('.header');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    header.classList.toggle('active');

}
let themeToggler = document.querySelector('#theme-together');
let yapaytext = document.querySelector('#yapaytext');

themeToggler.onclick = () => {
    themeToggler.classList.toggle('fa-sun');
    themeToggler.classList.toggle('fa-moon'); // Bunu da ekledik

    if (themeToggler.classList.contains('fa-sun')) {
        document.body.classList.add('active');  // Örneğin: dark mode
    } else {
        document.body.classList.remove('active');  // light mode
    }
}


yapaytext.addEventListener('input', () => {
    const kontrol = yapaytext.value.toLowerCase().trim();
    switch (kontrol) {
        case "anasayfa":
        case "anasayfaya git":
            window.location.href = "#home";
            break;

        case "hakkımızda":
        case "hakkımızda sayfası":
            window.location.href = "#about";
            break;

        case "hizmetler":
        case "hizmetleri göster":
            window.location.href = "#services";
            break;

        case "portföy":
        case "projeler":
            window.location.href = "#projeler";
            break;

        case "iletişim":
        case "iletişim sayfası":
            window.location.href = "#contact";
            break;

        default:
            // başka komutlar eklenebilir
            break;
    }
});



