import uav from 'uav';

const model = uav.model({
    position: 0
});

export default () => {

    return uav.component(model, '<div class="cursor" style="left:{position}px"></div>');

};
