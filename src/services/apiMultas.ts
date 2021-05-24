import axios from 'axios';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const apiURL = process.env.APIMultasUrl

const api = axios.create({
    baseURL: apiURL
});

export default api;