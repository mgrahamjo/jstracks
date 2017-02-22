import uav from 'uav';
import bufferUtil from './buffer-util';
import draggable from 'util/draggable';
import state from 'util/state';
import player from 'components/player';
import context from 'util/audiocontext';

const fileReader = new FileReader();

function decode(file, callback) {

    fileReader.onload = e => {

        context.decodeAudioData(e.target.result, callback);

    };

    fileReader.readAsArrayBuffer(file);

}

export default file => {

    decode(file, buffer => {

        const track = document.createElement('div'),
            canvas = document.createElement('canvas'),
            canvas2D = canvas.getContext('2d');

        track.classList.add('track');

        track.appendChild(canvas);

        uav('.tracks').appendChild(track);

        bufferUtil.setBufferStartTime(buffer, player.currentTime());

        draggable({
            el: canvas,
            direction: 'X',
            onmove: px => {
                bufferUtil.setBufferStartTime(buffer, px / state.pixelsPerSecond);
            }
        });

        canvas.style.left = player.currentTime() * state.pixelsPerSecond + 'px';

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
