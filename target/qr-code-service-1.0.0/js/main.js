var options = {size : 300, text : 'content', quiet: 0, radius: 0, render: 'image',
                minVersion: 1, ecLevel: 'L', fill: '#000', background: '#fff', mode: 2,
                mSize: 0.1, mPosX: 0.5, mPosY: 0.5, label: 'qrcode', fontcolor: '#ff9818', 
                image: document.getElementById('img-buffer')};
var url = window.location.href;
var params = getParams(url);
var keys = Object.keys(options);

var vCard = ['N', 'FN', 'ORG', 'TITLE', 'ADR', 'TEL;WORK;VOICE', 'TEL;CELL', 'TEL;FAX', 'EMAIL;WORK;INTERNET', 'URL'];

// filter parameters and set them in main object
for(j=0; j<params.length; j++){
    for(k=0; k<keys.length; k++) {
        if (params[j].name == keys[k].toLowerCase()) {
            if (typeof (options[keys[k]]) == 'number') {
                options[keys[k]] = parseFloat(params[j].value);
            } else if (params[j].name == "background" && params[j].value == "null") {
                options[keys[k]] = null;
            } else if (params[j].name == "background" || params[j].name == "fill" || params[j].name == "fontcolor"){
                options[keys[k]] =  params[j].value.replace(/%23/g, "#")
            } else if (params[j].name == "text") {
                options[keys[k]] = params[j].value.replace(/%20/g, " ").replace(/%0A/g, "\n");
                for (i=0; i<vCard.length; i++) {
                    if (params[j].value.indexOf(vCard[i])>-1) {
                        options[keys[k]] = 'BEGIN:VCARD' + '\n' + 'VERSION:3.0'  + params[j].value.replace(/%20/g, " ").replace(/%0A/g, "\n") + '\n' + 'END:VCARD';
                    }
                }
            } else if ( params[j].name == "label") {
                options[keys[k]] = params[j].value.replace(/%20/g, " ");
            } else {
                options[keys[k]] = params[j].value;
            }
        }
    }
}

// get all parameters
function getParams(url) {
    var queryString = url.substring(url.indexOf('?') + 1);
    var paramsArr = queryString.split('&');
    var params = [];
    for (i = 0; i < paramsArr.length; i++) {
        var keyValuePair = paramsArr[i].split('=');
        params.push({
            name: keyValuePair[0],
            value: keyValuePair[1]
        });
    }
    return params;
}

//select type of content
$('input:radio[name="contentType"]').change(function () {
    if(this.checked && this.value == "vCard") {
        getCookie('qr');
        $('#vCard1').css({
            'display': 'flex',
            'flex-direction': 'column'
        });
        $('.url').css('display', 'none');
        $('#text').css('display', 'none');
        var vc ='BEGIN:VCARD' + '\n' +
                'VERSION:3.0'  + '\n' + 'N:' +
                $('#name1').val() + ';' +
                $('#name').val() + '\nFN:' +
                $('#name').val() + '' +
                $('#name1').val() + '\nORG:' +
                $('#company').val() + '\nTITLE:' +
                $('#company1').val() + '\nADR:' +
                $('#street').val() + ';' +
                $('#city').val() + ';' +
                $('#state').val() + ';' +
                $('#city1').val() + ';' +
                $('#country').val() + '\nTEL;WORK;VOICE:' +
                $('#work').val() + '\nTEL;CELL:' +
                $('#cell').val() + '\nTEL;FAX:' +
                $('#fax').val() + '\nEMAIL;WORK;INTERNET:' +
                $('#email').val() + '\nURL:' +
                $('#website').val() + '\nEND:VCARD';
        options.text  = vc;
        refresh();
    }
    else if (this.checked && this.value == "url") {
        getCookie('qr');
        $('.url').css('display', 'block');
        $('#text').css('display', 'none');
        $('#vCard1').css('display', 'none');
        if ($('#textUrl' === null)) {
            options.text = "url";
            refresh()
        } else {
            options.text = $('#textUrl').val();
            refresh();
        }
    }
    else if (this.checked && this.value == "content") {
        getCookie('qr');
        $('.url').css('display', 'none');
        $('#text').css('display', 'block');
        $('#vCard1').css('display', 'none');
        if ($('#text' === null)) {
            options.text = "content";
            refresh()
        } else {
            options.text = $('#text').val();
            refresh();
        }
    }
});

$('#name, #name1, #cell, #work, #fax, #email, #company, #company1, #street, #city, #city1, #state, #country, #website').on('change', function() {
    var vc = 'BEGIN:VCARD' + '\n' +
        'VERSION:3.0'  + '\n' + 'N:' +
        $('#name1').val() + ';' +
        $('#name').val() + '\nFN:' +
        $('#name').val() + '' +
        $('#name1').val() + '\nORG:' +
        $('#company').val() + '\nTITLE:' +
        $('#company1').val() + '\nADR:' +
        $('#street').val() + ';' +
        $('#city').val() + ';' +
        $('#state').val() + ';' +
        $('#city1').val() + ';' +
        $('#country').val() + '\nTEL;WORK;VOICE:' +
        $('#work').val() + '\nTEL;CELL:' +
        $('#cell').val() + '\nTEL;FAX:' +
        $('#fax').val() + '\nEMAIL;WORK;INTERNET:' +
        $('#email').val() + '\nURL:' +
        $('#website').val() + '\nEND:VCARD';
    options.text  = vc;
    refresh();
});

//opacity background
$(document).ready(function() {
    $("input").change(function() {
        var opacity = $("#alpha").val();
        var color = $("#background").val();

        var rgbaCol = 'rgba('
            + parseInt(color.slice(-6, -4), 16) + ','
            + parseInt(color.slice(-4, -2), 16) + ','
            + parseInt(color.slice(-2), 16) + ',' + opacity + ')';

        options.background = rgbaCol;
        refresh();
    })
})

//opacity fill - foreground
$(document).ready(function() {
    $("input").change(function() {
        var opacity = $("#alpha1").val();
        var color = $("#fill").val();

        var rgbaCol = 'rgba('
            + parseInt(color.slice(-6, -4), 16) + ','
            + parseInt(color.slice(-4, -2), 16) + ','
            + parseInt(color.slice(-2), 16) + ',' + opacity + ')';

        options.fill = rgbaCol;
        refresh();
    })
})

// generated qrcode
$('#qrcode').qrcode(options);

// set text in options
$('#text').on('input',function(e){
    options.text = $('#text').val();
    refresh();
});
// set textURL in options
$('#textUrl').on('input',function(e){
    options.text = $('#textUrl').val();
    refresh();
});

// set size - scale in options
$('#size').on('input',function(e){
    options.size = $("#size").val();
    refresh();
});

// set min version - minimum size in options
$('#minversion').on('input',function(e){
    var value = parseInt($('#minversion').val());
    options.minVersion = value;
    refresh();
    $('#mv').text(": " + value);
});

// set quiet - border in options
$('#quiet').on('input',function(e){
    var value =  parseInt($('#quiet').val());
    options.quiet = value;
    refresh();
    $('#qz').text(": " + value);
});

// set radius in options
$('#radius').on('input',function(e){
    var value = .01*parseInt($('#radius').val());
    options.radius = value;
    refresh();
    $('#rad').text(": " + value*100 + "%");
});

// set background in options
$('#background').on('input',function(e){
    options.background = $('#background').val();
    refresh();
});

// set fill - foreground in options
$('#fill').on('input',function(e){
    options.fill = $('#fill').val();
    refresh();
});

// set error correction in options
$('#eclevel').on('change',function(e){
    options.ecLevel = $('#eclevel').val();
    refresh();
});

// set mode in options
$('#mode').on('change',function(e){
    options.mode = parseInt($('#mode').val());
    refresh();
});

// set label in options
$('#label').on('input',function(e){
    options.label = $('#label').val();
    refresh();
});

// set size of label in options
$('#msize').on('input',function(e){
    var value = .01*parseInt($('#msize').val());
    options.mSize = value;
    refresh();
    $('#ms').text(": " + Math.round(value*100) + "%");
});

// set position of label in options
$('#mposx').on('input',function(e){
    var value = .01*parseInt($('#mposx').val());
    options.mPosX = value;
    refresh();
    $('#mpx').text(": " + Math.round(value*100) + "%");
});

// set position of label in options
$('#mposy').on('input',function(e){
    var value = .01*parseInt($('#mposy').val());
    options.mPosY = value;
    refresh();
    $('#mpy').text(": " + Math.round(value*100) + "%");
});

// set fontcolor in options
$('#fontcolor').on('input',function(e){
    options.fontcolor = $('#fontcolor').val();
    refresh();
});

// set image in options
$('#image').on('change',function(e){
    document.getElementById('img-buffer').src = window.URL.createObjectURL(this.files[0]);
    options.image = document.getElementById('img-buffer');
    document.getElementById('mode').options[3].disabled = false;
    document.getElementById('mode').options[4].disabled = false;
    refresh();
});

//generate new QR code
function refresh() {
    $('#qrcode').empty();
    $('#qrcode').qrcode(options);
    createCookie('qr',options.text,10);
}

// download buttons
$('#btnPNG').on('click', function() {
    options.render = 'image';
    refresh();
    forceDownload ($('#qrcode').find('img').focus().attr('src'), "QRCode.png");
});
$('#btnTIFF').on('click', function() {
    downloadTIFF("QRCode.tiff");
});

//parametars for download
for (i=0 ; i<params.length; i++) {
    if (params[i].name == "OutputFormat" && params[i].value == "PNG") {
        options.render = 'image';
        refresh();
        forceDownload ($('#qrcode').find('img').focus().attr('src'), "QRCode.png");
    } else if (params[i].name == "OutputFormat" && params[i].value == "TIFF") {
        downloadTIFF("QRCode.tiff");
    }
}

//download png function
function forceDownload(url, fileName){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    };
    xhr.send();
}

//download tiff function
function downloadTIFF(filename) {
    options.render = 'canvas';
    refresh();
    const canvas = document.getElementsByTagName('canvas')[0];
    CanvasToTIFF.toDataURL(canvas, function(uri) {
        forceDownload(uri, filename);
    });
}
//set cookie
function createCookie(name,value,minutes) {
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime()+(minutes*60*1000));
        var expires = "; expires="+date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
}
//get cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}








