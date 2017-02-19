window.AudioContext = window.AudioContext || 
    window.webkitAudioContext || 
    window.mozAudioContext || 
    window.oAudioContext || 
    window.msAudioContext;

if (!AudioContext) {

    alert('Your browser doesn\'t support web audio. Please use Chrome or Firefox.');

}

export default new AudioContext();
