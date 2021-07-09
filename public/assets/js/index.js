let boolComt = false;
let boolLike = false;
let boolForm = false;

function toggleComments(obj) {
    let elem = document.getElementById('post-comments-container');
    if(boolComt) {
        elem.style.display = 'none';
        obj.style.color = '#444';
        boolComt = !boolComt;
    }
    else {
        elem.style.display = 'flex';
        obj.style.color = '#007bff';
        boolComt = !boolComt;
    }

    return boolComt;
}

function toggleLike(obj) {
    if(boolLike) {
        obj.style.color = '#444';
        boolLike = !boolLike;
    }
    else {
        obj.style.color = '#007bff';
        boolLike = !boolLike;
    }

    return boolLike;
}


function toggleform() {
    let elem = document.getElementById('form-container');
    
    if(boolForm) {
        elem.style.width = 0;
        elem.style.height = 0;
        setTimeout(() => {
            elem.style.display = 'none';
        }, 1000);
        
        boolForm = !boolForm;
    }
    else {

        elem.style.display = 'flex';
        setTimeout(() => {
            elem.style.width = 100 + '%';
            elem.style.height = 100 + 'vh';
        }, 500);
        
        
        boolForm = !boolForm;
    }

    return boolForm;
}





