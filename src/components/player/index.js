import uav from 'uav';
import context from 'util/audiocontext';
import decode from 'util/decode';
import swap from 'util/swap';
import cursor from 'components/cursor';

const state = {
    buffers: [],
    duration: 0,
    time: 0,
    visibleDuration: 30,
    pixelsPerSecond: document.body.offsetWidth / 30
};

const model = uav.model({
    cursor: cursor(),
    times: [],
    setTime: e => {
        model.cursor.position = e.clientX;
        state.time = e.clientX / state.pixelsPerSecond;
    }
});

function player() {

    return uav.component(model, `
        <div class="player">
            <div class="timescale" loop="times" as="time" onclick={setTime}>
                <div class="time">
                    <div class="time-text">{time}</div>
                </div>
            </div>
            <cursor></cursor>
            <div class="tracks"></div>
        </div>`);
}

const timeCount = document.body.offsetWidth / 40;

for (let i = 0; i < timeCount; i++) {

    model.times.push((i * 40 / state.pixelsPerSecond).toFixed(2));

}

player.play = () => {

    state.playing = state.buffers.map(buffer => {

        const source = context.createBufferSource();

        source.buffer = buffer;

        source.connect(context.destination);

        let when = 0,
            offset = 0;

        if (buffer.startTime > state.time) {

            when = buffer.startTime - state.time;

        } else {

            offset = state.time - buffer.startTime;

        }

        source.start(when, offset);

        return source;

    });

    state.timeout = setTimeout(player.stop, (state.duration - state.time) * 1000);

    state.interval = setInterval(() => {

        state.time += 0.05;

        model.cursor.position = state.pixelsPerSecond * state.time;

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

    state.time = 0;

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

        buffer.startTime = state.time;

        if (buffer.duration > state.duration) {

            state.duration = buffer.duration;

        }

        /* Draw waveform */

        canvas.left = buffer.startTime * state.pixelsPerSecond + 'px';

        canvas.width = buffer.duration * state.pixelsPerSecond;

        canvas.height = track.offsetHeight;

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
