var navItems = document.querySelectorAll('.navList li');

navItems.forEach( navItem => {
    navItem.addEventListener("click", function(){
        navItems.forEach(el => el.classList.remove("active"));
        navItem.classList.add('active');
    });
});