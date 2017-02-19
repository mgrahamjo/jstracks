import treaty from 'treaty';

function ajax(url, options = {}) {

    return treaty((resolve, reject) => {

        const xhr = new XMLHttpRequest();

        xhr.open(options.method || 'GET', url);

        xhr.onload = () => {

            if (xhr.status === 200) {

                let data;

                try {

                    data = JSON.parse(xhr.responseText);

                } catch (err) {

                    data = xhr.responseText;

                }

                resolve(data);

            } else {

                console.error(`${xhr.status}: ${xhr.statusText}`);
                reject(`${xhr.status}: ${xhr.statusText}`);

            }

        };

        xhr.send();

    });

}

export default ajax;
