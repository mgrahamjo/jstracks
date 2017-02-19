import decode from 'util/decode';
import uav from 'uav';

const pixelsPerSecond = document.body.offsetWidth / 30;

const model = {
    tracks: []
};

function player() {

    return uav.component(model, `
        <div class="player">
            <div class="tracks"></div>
        </div>`);
}

player.addTrack = file => {

    const track = document.createElement('div');

    track.classList.add('track');

    const canvas = document.createElement('canvas');

    track.appendChild(canvas);

    uav('.tracks').appendChild(track);

    const canvas2D = canvas.getContext('2d');

    decode(file, buffer => {

        canvas.width = buffer.duration * pixelsPerSecond;

        canvas.height = track.offsetHeight;

        buffer = buffer.getChannelData(0);

        const interval = parseInt(buffer.length / canvas.width);

        canvas2D.lineWidth = 2;
        
        canvas2D.strokeStyle = 'rgb(0, 0, 0)';

        canvas2D.beginPath();

        for (let x = 0; x < canvas.width; x++) {

            const amplitude = Math.abs(buffer[x * interval]);

            const y = canvas.height / 2 - amplitude * canvas.height / 2;

            canvas2D.moveTo(x, y);

            canvas2D.lineTo(x, y + amplitude * canvas.height);

        }
        
        canvas2D.stroke();

    });

};

export default player;
