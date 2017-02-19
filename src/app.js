import uav from 'uav';
import menu from 'components/menu';
import player from 'components/player';

const model = uav.model({
    menu: menu(),
    player: player()
});

uav.component(model, `
    <div class="wrapper">
        <menu></menu>
        <player></player>
    </div>
`, '#app');
