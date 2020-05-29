import api from './api'

export default {
    test() {
        return api().get('/test')
    }
}