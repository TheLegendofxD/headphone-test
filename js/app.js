var beepAudio = new Audio('assets/beep.ogg');

const beepContext = new AudioContext();
const source = beepContext.createMediaElementSource(beepAudio);
const beepPan = beepContext.createStereoPanner();

source.connect(beepPan);
beepPan.connect(beepContext.destination);

const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var bass_test_running = false;


/* Module: Stereo Test */
function play_beep(direction = 'both') {
    if      ( direction == 'both'  ) { beepPan.pan.value =  0; }
    else if ( direction == 'left'  ) { beepPan.pan.value = -1; }
    else if ( direction == 'right' ) { beepPan.pan.value =  1; }

    else { console.error('Inavlid Audio Direction: ' + direction); return; }

    beepAudio.play();
}

/* Module: Bass Test */
// https://stackoverflow.com/questions/39200994/how-to-play-a-specific-frequency-with-javascript
function playFreq(frequency, duration, counters) {
    var oscillator = audioCtx.createOscillator();
  
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
  
    setTimeout(
        function() {
            oscillator.stop();
            console.log(frequency);
            if (frequency > 0 && bass_test_running) {
                var new_freq = frequency - 5;

                for (var j = 0; j < counters.length; j++) {
                    counters[j].innerText = new_freq.toString() + ' Hz';
                }

                playFreq(new_freq, duration, counters);
            } else {
                bass_test_running = false;
            }
        }, duration
    );
}

function start_bass_test() {
    var start_btns = document.getElementsByClassName('freq_start');

    if (bass_test_running) {
        bass_test_running = false;

        for (var j = 0; j < start_btns.length; j++) {
            start_btns[j].innerText = 'Start Test';
        }

        return;
    }

    bass_test_running = true;

    for (var j = 0; j < start_btns.length; j++) {
        start_btns[j].innerText = 'Stop Test';
    }

    var counters = document.getElementsByClassName('freq_counter');
    const start_freq = 600;

    for (var j = 0; j < counters.length; j++) {
        counters[j].innerText = start_freq.toString() + ' Hz';
    }

    playFreq(start_freq, 500, counters);
}

/* ----- Creating Page ----- */
var modules = [
    document.getElementById('template_stereo_test'),
    document.getElementById('template_bass_test')
];

function get_module_order() {
    var _module_order = [0,1];


    /* Checking If Module Order is Valid */
    if (localStorage.getItem('module_order') != null) {
        let temp = localStorage.getItem('module_order').split(',');
        let new_array = [];
        let success = true;
        
        for (var i = 0; i < temp.length; i++) {
            if (temp[i] == '') {continue;}
            if (!(temp[i] > -1 && temp[i] < _module_order.length)) {
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
    localStorage.setItem('module_order', mo_string);
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

/* Register ServiveWorker */
/*
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}
*/