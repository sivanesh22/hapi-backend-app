function toggle(event) {
    var element = event.target;
    document.querySelector('li.active').classList.remove('active');
    element.classList.add("active")
    if (element.id =='login') {
        document.getElementById('login_container').style.display = 'block';
        document.getElementById('signup_container').style.display = 'none';
    } else {
        document.getElementById('login_container').style.display = 'none';
        document.getElementById('signup_container').style.display = 'block';
    }

}