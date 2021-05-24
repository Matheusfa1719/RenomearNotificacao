import api from '../services/apiMultas';
import { IMulta } from './Notificacao';

export function loginAPI(username: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        api.post('/login', { login: username, senha: password })
            .then((response) => {
                resolve(response.data.token);
            })
            .catch((err) => {
                reject('Request error: ' + err);
            });
    });
}

export function consultaMultas(placa: string, token: string): Promise<IMulta[]> {
    return new Promise((resolve, reject) => {
        api.get(`/multas/buscarMulta/${placa}`, { headers: { "Authorization": token } })
            .then((response) => {
                if (response.status === 204) {
                    console.log('Sem multas')
                } else {
                    resolve(response.data);
                }
            })
            .catch((error) => {
                reject('Erro na consulta: ' + error);
            });
    });
}