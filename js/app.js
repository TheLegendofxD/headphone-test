const ls_prefix = 'f384b3_';

const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
const audioPan = audioCtx.createStereoPanner();
audioPan.connect(audioCtx.destination);

var bass_test_running = false;


/* Module: Stereo Test */
function play_beep(direction = 'both') {
    if      ( direction == 'both'  ) { playFreq(440, 1000, null,  0); }
    else if ( direction == 'left'  ) { playFreq(440, 1000, null, -1); }
    else if ( direction == 'right' ) { playFreq(440, 1000, null,  1); }

    else { console.error('Inavlid Audio Direction: ' + direction); return; }
}

/* Module: Bass Test */
function set_innerhtml_for_query(query, new_html) {
    var elems = document.querySelectorAll(query);

    for (var i=0;i<elems.length;i++) {
        elems[i].innerHTML = new_html;
    }
}

// https://stackoverflow.com/questions/39200994/how-to-play-a-specific-frequency-with-javascript
function playFreq(frequency, duration, counters=null, direction=0) {
    var oscillator = audioCtx.createOscillator();
    audioPan.pan.value = direction;
  
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(audioPan);
    oscillator.start();
  
    setTimeout(
        function() {
            oscillator.stop();
            
            if (counters == null) {return;}
            if (frequency > 0 && bass_test_running) {
                var new_freq = frequency - 5;

                for (var j = 0; j < counters[0].length; j++) {
                    if (counters[1]) {
                        counters[0][j].value = new_freq.toString();
                    } else {
                        counters[0][j].innerText = new_freq.toString() + ' Hz';
                    }
                }

                playFreq(new_freq, duration, counters);
            } else {
                bass_test_running = false;
                set_innerhtml_for_query('.freq_start', '<i data-feather="play" class="icon_up" aria-label="Start Icon"></i>&nbsp;Start Test');
                feather.replace();
                
                // Resetting Counter
                var new_freq = (counters[1] > 0 ? counters[1] : 600);
                for (var j = 0; j < counters[0].length; j++) {
                    if (counters[1]) {
                        counters[0][j].value = new_freq.toString();
                    } else {
                        counters[0][j].innerText = new_freq.toString() + ' Hz';
                    }
                }
            }
        }, duration
    );
}

function start_bass_test(advanced=false) {
    if (bass_test_running) {
        bass_test_running = false;

        set_innerhtml_for_query('.freq_start', '<i data-feather="play" class="icon_up" aria-label="Start Icon"></i>&nbsp;Start Test');
        feather.replace();
        return;
    }

    bass_test_running = true;

    set_innerhtml_for_query('.freq_start', '<i data-feather="square" class="icon_up" aria-label="Stop Icon"></i>&nbsp;Stop Test');
    feather.replace();

    var counters;
    if (advanced) { counters = [document.getElementsByClassName('freq_counter_num'), 1]; }
    else          { counters = [document.getElementsByClassName('freq_counter'), 0]; }
    

    var start_freq = 600;
    if (advanced) { start_freq = parseInt(counters[0][0].value); counters[1] = start_freq;  }

    for (var j = 0; j < counters[0].length; j++) {
        if (counters[1]) {
            counters[0][j].value = start_freq.toString();
        } else {
            counters[0][j].innerText = start_freq.toString() + ' Hz';
        }
    }

    playFreq(start_freq, 500, counters);
}

function enforceMinMax(el, selector){
    var new_val = -1;
    if(el.value != ""){
        if(parseInt(el.value) < parseInt(el.min)){
            new_val = el.min;
        }
        if(parseInt(el.value) > parseInt(el.max)){
            new_val = el.max;
        }
        if(el.value.startsWith('0') || el.value.includes('.') || el.value.includes(',')) {
            new_val = parseInt(el.value).toString();
        }

        if (new_val == -1) {
            new_val = el.value;
        }
        
    } else {new_val = el.min;}

    var other_elements = document.querySelectorAll(selector);

    for (var i=0; i<other_elements.length;i++) {
        other_elements[i].value = new_val;
    }
}
  

/* ----- Creating Page ----- */
var modules = [
    document.getElementById('template_stereo_test'),
    document.getElementById('template_bass_test'),
    document.getElementById('template_bass_test_adv'),
    document.getElementById('template_search')
];

function get_module_order() {
    var _module_order = [0,1];


    /* Checking If Module Order is Valid */
    if (localStorage.getItem(ls_prefix + 'module_order') != null) {
        let temp = localStorage.getItem(ls_prefix + 'module_order').split(',');
        let new_array = [];
        let success = true;
        
        for (var i = 0; i < temp.length; i++) {
            if (temp[i] == '') {continue;}
            if (!(temp[i] > -1 && temp[i] < modules.length)) {
                success = false;
                break;
            }
            new_array.push(temp[i]);
        }

        if (success) { _module_order = new_array; };
    }

    return _module_order;
}

function set_module_order(_module_order) {
    var mo_string = '';
    for (var i = 0; i < _module_order.length; i++) {
        mo_string += _module_order[i].toString() + ',';
    }
    localStorage.setItem(ls_prefix + 'module_order', mo_string);
}

function render_modules() {
    var module_order = get_module_order();
    const insert_pos = document.getElementById('insert');

    insert_pos.innerHTML = '';

    /* Appending modules */
    for (var i = 0; i < module_order.length; i++) {
        var mdl = insert_pos.appendChild(modules[module_order[i]].content.cloneNode(true));

        var mdls = insert_pos.querySelectorAll('.content');
        var mdl = mdls[mdls.length - 1];

        mdl.innerHTML = mdl.innerHTML.replace(/#i0/gi, i);
        mdl.innerHTML = mdl.innerHTML.replace(/#i1/gi, module_order[i]);
    }

    feather.replace();
}

function move_module(display_id, type_id, action) {
    var module_order = get_module_order();

    if (action == 'up' && display_id > 0) {
        let temp = module_order[display_id - 1];
        module_order[display_id - 1] = type_id;
        module_order[display_id] = temp;
    } else if (action == 'down' && display_id < module_order.length) {
        let temp = module_order[display_id + 1];
        module_order[display_id + 1] = type_id;
        module_order[display_id] = temp;
    } else if (action == 'away') {
        let temp = [];
        for (var i = 0; i < module_order.length; i++) {
            if (i == display_id) {
                continue;
            }
            temp.push(module_order[i]);
        }
        module_order = temp;
    } else if (action == 'add_front') {
        /* Ignores display id */
        module_order.unshift(type_id);
    }

    set_module_order(module_order);
    render_modules();
}

render_modules();

/* Theme */
const themes = ['', 'midnight', 'autumn', 'lotus', 'watermelon', 'dawn', 'ukraine', 'oled', 'translucent'];
const theme_prevs = [['Default', '#2c3e50', '#8e44ad'], ['Midnight', '#333a50', '#475ea9'], ['Autumn', '#691825', '#E9724C'], ['Lotus', '#824670', '#3acf9e'], ['Watermelon', '#17694f', '#F79F79'], ['Dawn', '#544f6b', '#AFA2FF'], ['Ukraine', '#1a274c', '#d8a811'], ['OLED', '#000', '#8e44ad'], ['Translucent', '#000000cc', '#8e44ad99']];
var theme = localStorage.getItem(ls_prefix + 'theme');
const select_theme_popup = document.getElementById('select_theme_popup');

function apply_theme(theme_name='') {
    localStorage.setItem(ls_prefix + 'theme', theme_name);
    document.body.className = 'theme_' + theme_name;
    theme = theme_name;
}

function open_theme_selector() {
    select_theme_popup.classList.toggle('active');
    
    if (select_theme_popup.classList.contains('active')) {
        document.getElementById('popup-select-theme-x').focus();
    } else {
        document.getElementById('popup-select-theme-open').focus();
    }
}

if (themes.indexOf(theme) < 0) {
    console.log('No valid theme: ', theme);
    theme = themes[0];
}
apply_theme(theme);

// Create Theme List
const theme_list = document.getElementById('theme_list');
const add_image_btn = theme_list.innerHTML;
theme_list.innerHTML = '';

for (var i=0;i<themes.length;i++) {
    theme_list.innerHTML += `<a class="theme_prev centered" href="javascript:apply_theme('${themes[i]}');"><svg id="theme_prev-circle-${themes[i]}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92.04699" height="87.03743" viewBox="0,0,92.04699,87.03743" style="scale:60%; display: inline-block;"><g transform="translate(-193.9765,-136.48129)"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="var(--theme-prev-circle)" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M285.0235,180c0,23.48244 -20.15771,42.51871 -45.0235,42.51871c-24.86579,0 -45.02349,-19.03628 -45.02349,-42.51871c0,-23.48244 20.1577,-42.51871 45.0235,-42.51871c24.86579,0 45.0235,19.03628 45.0235,42.51871z" fill="${theme_prevs[i][1]}"/><path d="M284.84918,180c0,10.10826 -3.84035,19.37954 -10.23381,26.61263c-8.22593,9.30621 -73.83289,-49.86681 -64.85545,-57.51971c7.97423,-6.7977 18.58826,-10.944 30.24007,-10.944c24.76952,0 44.84918,18.73737 44.84918,41.85109z" fill="${theme_prevs[i][2]}"/></g></g></svg><br><br><span>${theme_prevs[i][0]}</span></a>`;
}
document.getElementById('theme_prev-circle-translucent').style.maskImage = "url(\"data:image/svg+xml;utf8,<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='92.04699' height='87.03743' viewBox='0,0,92.04699,87.03743' style='scale: 99%'><g transform='translate(-193.9765,-136.48129)'><g data-paper-data='{%26quot;isPaintingLayer%26quot;:true}' fill-rule='nonzero' stroke='black' stroke-width='2' stroke-linecap='butt' stroke-linejoin='miter' stroke-miterlimit='10' stroke-dasharray='' stroke-dashoffset='0' style='mix-blend-mode: normal'><path d='M285.0235,180c0,23.48244 -20.15771,42.51871 -45.0235,42.51871c-24.86579,0 -45.02349,-19.03628 -45.02349,-42.51871c0,-23.48244 20.1577,-42.51871 45.0235,-42.51871c24.86579,0 45.0235,19.03628 45.0235,42.51871z' fill='black'/><path d='M284.84918,180c0,10.10826 -3.84035,19.37954 -10.23381,26.61263c-8.22593,9.30621 -73.83289,-49.86681 -64.85545,-57.51971c7.97423,-6.7977 18.58826,-10.944 30.24007,-10.944c24.76952,0 44.84918,18.73737 44.84918,41.85109z' fill='black'/></g></g></svg>\")";
theme_list.innerHTML += add_image_btn;

// Theme Background Image
const image_upload_theme_background = document.getElementById('image_upload_theme_background');

function set_background() {
    document.body.style.backgroundImage = `url('${localStorage.getItem(ls_prefix + 'background')}')`;
}

function remove_background() {
    localStorage.setItem(ls_prefix + 'background', '');
    set_background();
}

function compress_and_base64ify_image() {
    if (!this.files || !this.files[0]) return;

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        localStorage.setItem(ls_prefix + 'background', event.target.result);
        set_background();
    });
    reader.readAsDataURL(this.files[0]);
}

image_upload_theme_background.addEventListener('change', compress_and_base64ify_image);

set_background();

/* About Popup */
const about_popup = document.getElementById('about_popup');
function open_about() {
    about_popup.classList.toggle('active');
    
    if (about_popup.classList.contains('active')) {
        document.getElementById('about_theme').innerText = (theme == '' ? 'default': theme);
        document.getElementById('popup-about-x').focus();
    } else {
        document.getElementById('popup-about-open').focus();
    }
}

/* Register ServiveWorker */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
        .register("https://thelegendofxd.github.io/headphone-test/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}

document.getElementById('about_user_agent').innerText = window.navigator.userAgent;

/* PWA Installation Button */
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show button
    document.getElementById('pwa_install').classList.remove('hidden');
});

document.getElementById('pwa_install').addEventListener('click', async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    deferredPrompt = null;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt.');
    } else if (outcome === 'dismissed') {
      console.log('User dismissed the install prompt');
    }
});