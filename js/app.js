var beepAudio = new Audio('assets/beep.ogg');

const beepContext = new AudioContext();
const source = beepContext.createMediaElementSource(beepAudio);
const beepPan = beepContext.createStereoPanner();

source.connect(beepPan);
beepPan.connect(beepContext.destination);


function play_beep(direction = 'both') {
    if      ( direction == 'both'  ) { beepPan.pan.value =  0; }
    else if ( direction == 'left'  ) { beepPan.pan.value = -1; }
    else if ( direction == 'right' ) { beepPan.pan.value =  1; }

    else { console.error('Inavlid Audio Direction: ' + direction); return; }

    beepAudio.play();
}

/* Creating Page */