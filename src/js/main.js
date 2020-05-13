var laptopDots = document.getElementById('header__laptop-dots-container');
var children = laptopDots.children;
laptopDots.addEventListener('click', function (e) {
    if (e.target.classList.contains('header__laptop-dot')) {
        for (item of children) {
            item.classList.remove('active');
        }
        e.target.classList.add('active')
    }
})