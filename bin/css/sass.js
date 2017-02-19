const fs = require('fs'),
    spawn = require('child_process').spawn;

fs.watch('src', {

    recursive: true

}, (e, file) => {

    if (file.split('.').pop() === 'scss') {

        spawn('node-sass', ['src/css/main.scss', 'dist/main.css'], {
            stdio: 'inherit'
        }).on('close', code => {

            if (code === 1) {
                console.error('✖ "node-sass" failed.');
            }

        });

    }

});
