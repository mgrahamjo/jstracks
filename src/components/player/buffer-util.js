import state from 'util/state';

function updateStateDuration() {

    state.duration = 0;

    state.buffers.forEach(buffer => {

        const bufferLength = buffer.duration + buffer.startTime;

        if (bufferLength > state.duration) {

            state.duration = bufferLength;

        }

    });

}

function setBufferStartTime(buffer, time) {

    buffer.startTime = time;

    updateStateDuration();

}

export default {
    setBufferStartTime
};
