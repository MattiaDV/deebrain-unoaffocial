window.addEventListener('click', function(ev) {
    if (ev.target !== this.document.getElementById('men')) {
        document.getElementById('men').open = false;
    }
})