import ajax from 'util/ajax';
import constants from 'util/constants';

const api = {

    getUsers() {
        
        return ajax(`${constants.apiURL}/users`);

    }

};

export default api;
