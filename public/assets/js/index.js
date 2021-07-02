var boolComt = false;
var boolLike = false;

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
