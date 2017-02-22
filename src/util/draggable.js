const DRAG_START_THRESHOLD = 10;

export default (opts) => {

    let firstTouch,
        dragging,
        distance,
        startingDistance = 0;

    function mousePosition(e) {

        return e['client' + opts.direction];

    }

    function touchPosition(e) {

        return e.touches[0]['client' + opts.direction];

    }

    function move(delta) {

        if (Math.abs(delta) >= DRAG_START_THRESHOLD) {

            if (!dragging) {

                dragging = true;

                document.body.style['user-select'] = 'none';

            }

            distance = delta;

            opts.el.style.transform = `translate${opts.direction}(${Math.max(startingDistance + distance, 0)}px)`;

        }

    }

    function mousemove(e) {

        e.preventDefault();

        move(mousePosition(e) - firstTouch);

    }

    function touchmove(e) {

        e.preventDefault();

        move(touchPosition(e) - firstTouch);

    }

    function finish() {

        document.body.removeEventListener('mousemove', mousemove);
        document.body.removeEventListener('touchmove', touchmove);
        document.body.removeEventListener('mouseup', finish);
        document.body.removeEventListener('touchend', finish);

        document.body.style['user-select'] = '';

        dragging = false;

        startingDistance = Math.max(distance + startingDistance, 0);

        opts.onmove(startingDistance);

    }

    function mousedown(e) {

        firstTouch = e.touches ? touchPosition(e) : mousePosition(e);

        document.body.addEventListener('mousemove', mousemove);
        document.body.addEventListener('touchmove', touchmove);
        document.body.addEventListener('mouseup', finish);
        document.body.addEventListener('touchend', finish);
        
    }

    opts.el.addEventListener('mousedown', mousedown);
    opts.el.addEventListener('touchstart', mousedown);

    return opts.el;

};
