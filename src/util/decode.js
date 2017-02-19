import context from 'util/audiocontext';

const fileReader = new FileReader();

export default (file, callback) => {

    fileReader.onload = e => {

        context.decodeAudioData(e.target.result, callback);

    };

    fileReader.readAsArrayBuffer(file);

};
