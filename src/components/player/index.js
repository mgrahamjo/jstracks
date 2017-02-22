import uav from 'uav';
import context from 'util/audiocontext';
import swap from 'util/swap';
import formatTime from 'util/format-time';
import cursor from 'components/cursor';
import state from 'util/state';

state.init({
    buffers: [],
    duration: 0,
    visibleDuration: 30,
    pixelsPerSecond: document.body.offsetWidth / 30
});

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

let increment = 1;

while (increment * state.pixelsPerSecond / 40 < 1) {

    increment++;

}

for (let i = 0; i < state.visibleDuration; i += increment) {

    model.times.push(formatTime(i));

}

function player() {

    return uav.component(model, `
        <div class="player">
            <div class="timer">{format(time)}</div>
            <div class="timescale clear" loop="times" as="tick" onclick={setTime}>
                <div class="time" style="width:${state.pixelsPerSecond * increment}px">
                    <div class="time-text">{tick}</div>
                </div>
            </div>
            <cursor></cursor>
            <div class="tracks"></div>
        </div>`);
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

player.currentTime = () => model.time;

window.addEventListener('keydown', e => {

    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {

        swap(e.which, {
            32: player.toggle
        });

    }

});

export default player;
