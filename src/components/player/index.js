import uav from 'uav';
import context from 'util/audiocontext';
import decode from 'util/decode';
import swap from 'util/swap';
import formatTime from 'util/format-time';
import cursor from 'components/cursor';

const state = {
    buffers: [],
    duration: 0,
    visibleDuration: 30,
    pixelsPerSecond: document.body.offsetWidth / 30
};

const model = uav.model({
    time: 0,
    cursor: cursor(),
    times: [],
    setTime: e => {
        model.cursor.position = e.clientX;
        model.time = e.clientX / state.pixelsPerSecond;
    },
    format: formatTime
});

function player() {

    return uav.component(model, `
        <div class="player">
            <div class="timer">{format(time)}</div>
            <div class="timescale clear" loop="times" as="tick" onclick={setTime}>
                <div class="time" style="width:${state.pixelsPerSecond}px">
                    <div class="time-text">{tick}</div>
                </div>
            </div>
            <cursor></cursor>
            <div class="tracks"></div>
        </div>`);
}

for (let i = 0; i < state.visibleDuration; i++) {

    model.times.push(i + ':00');

}

player.play = () => {

    state.playing = state.buffers.map(buffer => {

        const source = context.createBufferSource();

        source.buffer = buffer;

        source.connect(context.destination);

        let when = 0,
            offset = 0;

        if (buffer.startTime > model.time) {

            when = buffer.startTime - model.time;

        } else {

            offset = model.time - buffer.startTime;

        }

        source.start(context.currentTime + when, offset);

        return source;

    });

    state.timeout = setTimeout(player.stop, (state.duration - model.time) * 1000);

    state.interval = setInterval(() => {

        model.time += 0.05;

        model.cursor.position = state.pixelsPerSecond * model.time;

    }, 50);

};

player.pause = () => {

    clearTimeout(state.timeout);

    clearInterval(state.interval);

    if (state.playing) {

        state.playing.forEach(source => source.stop());

        delete state.playing;

    }

};

player.stop = () => {

    player.pause();

    model.time = 0;

    model.cursor.position = 0;

};

player.toggle = () => {

    if (state.playing) {

        player.pause();

    } else {

        player.play();

    }

};

player.addTrack = file => {

    /* Create elements for track */

    const track = document.createElement('div');

    track.classList.add('track');

    const canvas = document.createElement('canvas');

    track.appendChild(canvas);

    uav('.tracks').appendChild(track);

    const canvas2D = canvas.getContext('2d');

    decode(file, buffer => {

        buffer.startTime = model.time;

        if (buffer.duration + buffer.startTime > state.duration) {

            state.duration = buffer.duration + buffer.startTime;

        }

        /* Draw waveform */

        canvas.style.left = model.time * state.pixelsPerSecond + 'px';

        canvas.width = buffer.duration * state.pixelsPerSecond;

        canvas.height = 100;

        canvas.classList.add('visible');

        canvas2D.lineWidth = 2;
        
        canvas2D.strokeStyle = 'rgb(0, 0, 0)';

        canvas2D.beginPath();

        function renderChannel(channel, height, offset = 0) {

            const interval = parseInt(channel.length / canvas.width);

            for (let x = 0; x < canvas.width; x++) {

                const amplitude = Math.abs(channel[x * interval]);

                const y = height / 2 - amplitude * height / 2 + offset;

                canvas2D.moveTo(x, y);

                canvas2D.lineTo(x, y + amplitude * height);

            }

        }

        if (buffer.numberOfChannels === 1) {

            renderChannel(buffer.getChannelData(0), canvas.height);

        } else {

            const halfHeight = canvas.height / 2;

            renderChannel(buffer.getChannelData(0), halfHeight);

            renderChannel(buffer.getChannelData(1), halfHeight, halfHeight);

        }

        canvas2D.stroke();

        state.buffers.push(buffer);

    });

};

window.addEventListener('keyup', e => {

    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {

        swap(e.which, {
            32: player.toggle
        });

    }

});

export default player;
