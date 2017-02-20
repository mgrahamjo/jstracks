import uav from 'uav';
import player from 'components/player';

export default () => {

    const model = uav.model({
        clickImport: e => e.target.nextElementSibling.click(),
        newFile: e => {

            if (e.target.files.length) {

                player.addTrack(e.target.files[0]);

            }

        }
    });

    return uav.component(model, `
        <div class="menu clear">
            <div class="menu-btn left" onclick={clickImport}>IMPORT</div>
            <input class="hidden" type="file" accept="audio/*" onchange={newFile}/>
            <div class="menu-btn left">EXPORT</div>
        </div>`);

};
