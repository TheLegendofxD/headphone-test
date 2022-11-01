const ls_prefix = 'f384b3_';
const version = [15, '1.5-release', '07/10/22'];

const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
const audioPan = audioCtx.createStereoPanner();
audioPan.connect(audioCtx.destination);

var bass_test_running = false;

/* Languages */
var lang = localStorage.getItem(ls_prefix + 'lang');
var lang_source = 'ls';
const lang_codes = ['en','de','fr'];
/* https://www.microsoft.com/Language */
const langs = {
    'en':{
        'title_stereotest': 'Stereo Test',
        'title_basstest': 'Bass Test',
        'title_basstestadv': 'Bass Test (Advanced)',
        'title_basstestadv_short': 'Bass Test (Adv.)',
        'title_search': 'Search',
        'title_theme': 'Themes',
        'title_about': 'About',
        'title_langs': 'Languages',
        'title_addmdl': 'Add Module',
        'opt_moveup': 'Move Up',
        'opt_movedown': 'Move Down',
        'opt_remove': 'Remove',
        'opt_skip0': 'Skip to Stereo Test (Press Enter)',
        'opt_skip1': 'Skip to Bass Test (Press Enter)',
        'opt_install': 'Install PWA',
        'opt_addbgimg': 'Add Background Image',
        'opt_rmbgimg': 'Remove Background Image',
        'opt_close': 'Close',
        'opt_update': 'Check for Updates',
        'mdl_left': 'Left',
        'mdl_both': 'Both',
        'mdl_right': 'Right',
        'mdl_freq': 'Frequency',
        'mdl_startbt': 'Start Test',
        'mdl_stopbt': 'Stop Test',
        'upd_no': 'You\'re up to date!',
        'upd_new': 'There is an Update available. Do you want to install it?',
    },
    'de':{
        'title_stereotest': 'Stereo-Test',
        'title_basstest': 'Bass-Test',
        'title_basstestadv': 'Bass-Test (Experte)',
        'title_basstestadv_short': 'Bass-Test (Exp.)',
        'title_search': 'Suche',
        'title_theme': 'Farbschemata',
        'title_about': 'Über',
        'title_langs': 'Sprachen',
        'title_addmdl': 'Modul hinzufügen',
        'opt_moveup': 'Nach Oben',
        'opt_movedown': 'Nach Unten',
        'opt_remove': 'Entfernen',
        'opt_skip0': 'Springe zum Stereo-Test (Drücke Enter)',
        'opt_skip1': 'Springe zum Bass-Test (Drücke Enter)',
        'opt_install': 'PWA installieren',
        'opt_addbgimg': 'Hintergrundbild hinzufügen',
        'opt_rmbgimg': 'Hintergrundbild entfernen',
        'opt_close': 'Schließen',
        'opt_update': 'Auf Updates prüfen',
        'mdl_left': 'Links',
        'mdl_both': 'Beide',
        'mdl_right': 'Rechts',
        'mdl_freq': 'Frequenz',
        'mdl_startbt': 'Test starten',
        'mdl_stopbt': 'Test beenden',
        'upd_no': 'Du bist auf dem neusten Stand!',
        'upd_new': 'Es ist ein Update verfügbar. Möchtest du es installieren?',
    },
    'fr':{
        'title_stereotest': 'Test Stéréo',
        'title_basstest': 'Test de Basse',
        'title_basstestadv': 'Test de Basse (Avancé)',
        'title_basstestadv_short': 'Test de Basse (Ava.)',
        'title_search': 'Rechercher',
        'title_theme': 'Thèmes',
        'title_about': 'Informations',
        'title_langs': 'Langues',
        'title_addmdl': 'Ajouter un module',
        'opt_moveup': 'Monter',
        'opt_movedown': 'Descendre',
        'opt_remove': 'Supprimer',
        'opt_skip0': 'Passer au Test Stéréo (Appuyer sur Entrée)',
        'opt_skip1': 'Passer au Test des Basses (Appuyer sur Entrée)',
        'opt_install': 'Installer la PWA',
        'opt_addbgimg': 'Ajouter une image d\'arrière-plan',
        'opt_rmbgimg': 'Supprimer l\'image d\'arrière-plan',
        'opt_close': 'Fermer',
        'opt_update': 'Rechercher les mises à jour',
        'mdl_left': 'Gauche',
        'mdl_both': 'Les Deux',
        'mdl_right': 'Droite',
        'mdl_freq': 'Fréquence',
        'mdl_startbt': 'Démarrer le Test',
        'mdl_stopbt': 'Arrêter le Test',
        'upd_no': 'Vous êtes à jour !',
        'upd_new': 'Une mise à jour est disponible. Voulez-vous l\'installer ?'
    },
};

function get_string(key) {
    return langs[lang][key];
}

function get_lang_from_browser() {
    lang_source = 'nav';
    lang = navigator.language || navigator.userLanguage;
    if (lang != null && lang != undefined && lang != '') {
        if (lang_codes.indexOf(lang) < 0) {
            lang = 'en';
            lang_source = 'fallback';
        }
    } else {
        lang = 'en';
        lang_source = 'fallback';
    }
}

if (lang != null && lang != undefined && lang != '') {
    if (lang_codes.indexOf(lang) < 0) {
        get_lang_from_browser();
    }
} else {
    get_lang_from_browser();
}

function localize() {
    const objs = document.querySelectorAll('.localize');

    for (var i=0;i<objs.length;i++) {
        objs[i].innerText = get_string(objs[i].id);
    }
}
const select_langs_popup = document.getElementById('select_langs_popup');
function open_langs_selector() {
    select_langs_popup.classList.toggle('force-active');
    
    if (select_langs_popup.classList.contains('force-active')) {
        document.getElementById('popup-select-langs-x').focus();
    } else {
        document.getElementById('popup-select-langs-open').focus();
    }
}

function set_lang(code) {
    lang = code;
    localStorage.setItem(ls_prefix + 'lang', lang);
    localize();
}

/* Module: Stereo Test */
function play_beep(direction = 'both') {
    if      ( direction == 'both'  ) { playFreq(440, 1000, null,  0); }
    else if ( direction == 'left'  ) { playFreq(440, 1000, null, -1); }
    else if ( direction == 'right' ) { playFreq(440, 1000, null,  1); }

    else { console.error('Inavlid Audio Direction: ' + direction); return; }
}

/* Module: Bass Test */
function set_visible_for_query(query, value) {
    var elems = document.querySelectorAll(query);

    for (var i=0;i<elems.length;i++) {
        if (value) { elems[i].classList.add('hidden'); }
        else       { elems[i].classList.remove('hidden'); }
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
                set_visible_for_query('.freq_start', false);
                set_visible_for_query('.freq_start.stop', true);
                
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

        set_visible_for_query('.freq_start', false);
        set_visible_for_query('.freq_start.stop', true);
        return;
    }

    bass_test_running = true;

    set_visible_for_query('.freq_start', true);
    set_visible_for_query('.freq_start.stop', false);

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
    localize();
    
    /* Added Tabindex for Safari */
    const a_tags = document.getElementsByTagName('a');
    var ti = 1;
    for (elem of a_tags) {
        elem.tabIndex = ti;
        ti += 1;
    }
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
const theme_prevs = [['Default', '#2c3e50', '#8e44ad', false], ['Midnight', '#333a50', '#475ea9', false], ['Autumn', '#691825', '#E9724C', false], ['Lotus', '#824670', '#3acf9e', false], ['Watermelon', '#17694f', '#F79F79', false], ['Dawn', '#544f6b', '#AFA2FF', false], ['Ukraine', '#1a274c', '#d8a811', false], ['OLED', '#000', 'var(--light2)', true], ['Translucent', '#000000cc', 'var(--transparent-light2)', true]];
var theme = localStorage.getItem(ls_prefix + 'theme');
const select_theme_popup = document.getElementById('select_theme_popup');

function apply_theme(theme_name='', is_modifier=false) {
    if (is_modifier) {
        localStorage.setItem(ls_prefix + 'thme_mod', theme_name);
        // Removing old Modifiers
        var classes = document.body.className.split(" ").filter(function(c) {
            return c.lastIndexOf('th_mod_', 0) !== 0;
        });
        document.body.className = classes.join(" ").trim();
        document.body.classList.add('th_mod_' + theme_name);
    } else {
        localStorage.setItem(ls_prefix + 'theme', theme_name);
        document.body.className = `theme_${theme_name} th_mod_${localStorage.getItem(ls_prefix + 'thme_mod')}`;

        theme = theme_name;
    }
}

function select_theme(theme_name='', is_modifier=false) {
    if (!is_modifier) {
        localStorage.setItem(ls_prefix + 'thme_mod', '');
    }
    apply_theme(theme_name, is_modifier);
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
    theme_list.innerHTML += `<a class="theme_prev centered" href="javascript:select_theme('${themes[i]}', ${theme_prevs[i][3]});"><svg id="theme_prev-circle-${themes[i]}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92.04699" height="87.03743" viewBox="0,0,92.04699,87.03743" style="scale:60%; display: inline-block;"><g transform="translate(-193.9765,-136.48129)"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="var(--theme-prev-circle)" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M285.0235,180c0,23.48244 -20.15771,42.51871 -45.0235,42.51871c-24.86579,0 -45.02349,-19.03628 -45.02349,-42.51871c0,-23.48244 20.1577,-42.51871 45.0235,-42.51871c24.86579,0 45.0235,19.03628 45.0235,42.51871z" fill="${theme_prevs[i][1]}"/><path d="M284.84918,180c0,10.10826 -3.84035,19.37954 -10.23381,26.61263c-8.22593,9.30621 -73.83289,-49.86681 -64.85545,-57.51971c7.97423,-6.7977 18.58826,-10.944 30.24007,-10.944c24.76952,0 44.84918,18.73737 44.84918,41.85109z" fill="${theme_prevs[i][2]}"/></g></g></svg><br><br><span>${theme_prevs[i][0]}</span></a>`;
}
document.getElementById('theme_prev-circle-translucent').style.maskImage = "url(\"data:image/svg+xml;utf8,<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='92.04699' height='87.03743' viewBox='0,0,92.04699,87.03743' style='scale: 99%'><g transform='translate(-193.9765,-136.48129)'><g data-paper-data='{%26quot;isPaintingLayer%26quot;:true}' fill-rule='nonzero' stroke='black' stroke-width='2' stroke-linecap='butt' stroke-linejoin='miter' stroke-miterlimit='10' stroke-dasharray='' stroke-dashoffset='0' style='mix-blend-mode: normal'><path d='M285.0235,180c0,23.48244 -20.15771,42.51871 -45.0235,42.51871c-24.86579,0 -45.02349,-19.03628 -45.02349,-42.51871c0,-23.48244 20.1577,-42.51871 45.0235,-42.51871c24.86579,0 45.0235,19.03628 45.0235,42.51871z' fill='black'/><path d='M284.84918,180c0,10.10826 -3.84035,19.37954 -10.23381,26.61263c-8.22593,9.30621 -73.83289,-49.86681 -64.85545,-57.51971c7.97423,-6.7977 18.58826,-10.944 30.24007,-10.944c24.76952,0 44.84918,18.73737 44.84918,41.85109z' fill='black'/></g></g></svg>\")";
document.getElementById('theme_prev-circle-translucent').style.webkitMaskImage = document.getElementById('theme_prev-circle-translucent').style.maskImage;
theme_list.innerHTML += add_image_btn;

// Theme Background Image
const image_upload_theme_background = document.getElementById('image_upload_theme_background');

function set_background() {
    var image = localStorage.getItem(ls_prefix + 'background')
    document.body.style.backgroundImage = `url('${(image != null && image != undefined ? image : '')}')`;
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
function getUsedLocalStorageSpace() { 
    return Object.keys(window.localStorage).map(function(key) { return localStorage[key].length;}).reduce(function(a,b) { return a+b;}); 
};

const about_popup = document.getElementById('about_popup');
function open_about() {
    about_popup.classList.toggle('active');
    
    if (about_popup.classList.contains('active')) {
        document.getElementById('about_theme').innerText = (theme == '' ? 'default': theme);
        document.getElementById('about_theme_ext').innerText = (document.body.classList == '' ? 'None': document.body.classList);
        document.getElementById('about_lang').innerText = `${lang}; source:${lang_source}`;
        var used_ls = (getUsedLocalStorageSpace()/1024).toFixed();
        document.getElementById('about_lsusage').innerText = used_ls.toString() + ' KiB';
        document.getElementById('about_lsusage').className = used_ls < 1024 ? '' : used_ls < 1600 ? 'yellow' : used_ls < 1800 ? 'orange' : 'red';
        document.getElementById('about_viewport').innerText = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`;
        document.getElementById('popup-about-x').focus();
    } else {
        document.getElementById('popup-about-open').focus();
    }
}

document.getElementById('version_string').innerText = `${version[1]} (${version[0]})`;
document.getElementById('builddate_string').innerText = version[2];

/* Register ServiveWorker */
var registration;

function set_serviceworker(regis) {
    console.log("service worker registered")
    registration = regis;
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
        .register("https://thelegendofxd.github.io/headphone-test/serviceWorker.js")
        .then(res => set_serviceworker(res))
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

/* Updates */
function process_update_json(data) {
    if (data.version > version[0]) {
        var result = confirm(get_string('upd_new'));
        if (result) {
            registration.unregister();
            window.location.reload();
        }
    } else {
        alert(get_string('upd_no'));
    };
}

function check_updates() {
    fetch('update.json').then(function (response) {
        return response.json();
    }).then(function (myJson) {
        process_update_json(myJson);
    }).catch(function (error) {
        alert('Update Error: ' + error);
    });
}
