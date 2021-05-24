import readlineSync from 'readline-sync';
import path from 'path'
import * as dotenv from 'dotenv';

import { consultaMultas, loginAPI } from './functions/MultasAPI';
import { pdfToJpg } from './functions/FilesManipulations';
import { getFilesInFolder, renameFile } from './functions/Files';
import { getTextFromImage } from './functions/OCR';
import { comparacaoDocumento, getPlaca, validacaoPlaca, IMulta } from './functions/Notificacao';

dotenv.config({ path: '.env' });

async function readNotificacao() {
    const loginAPIMultas = process.env.LOGIN_API || '';
    const senhaAPIMultas = process.env.SENHA_API || '';
    const token = await loginAPI(loginAPIMultas, senhaAPIMultas);
    //Questions
    const pathNotificacao = readlineSync.question('Informe o arquivo da notificacao: ');
    //gerando um JPG da notificação para a leitura no OCR
    const jpg = await pdfToJpg(pathNotificacao, path.dirname(pathNotificacao))
    if (jpg) {
        const listJPG = await getFilesInFolder(path.dirname(pathNotificacao), 'jpg');
        const descriptionOCR = await getTextFromImage(listJPG[0]);
        const listDescription = descriptionOCR.split(/\r?\n/);
        const regexPlaca = /[A-Z]{3}\d{4}|[A-Z]{3}\-\d{4}|[A-Z]{3}\-\d{1}[A-Z]{1}\d{2}|[A-Z]{3}\d{1}[A-Z]{1}\d{2}|[A-Z]{3}\ \d{4}/
        const matchPlacas = await getPlaca(listDescription, regexPlaca);
        let resposta: string[] = []
        for (let placa of matchPlacas) {
            const placaFormatoAPI = await validacaoPlaca(placa);
            const consultaPlacaAPI: IMulta[] = await consultaMultas(placaFormatoAPI, token);
            const resultadoAPI = await comparacaoDocumento(consultaPlacaAPI, descriptionOCR);
            if (!resultadoAPI.includes('Sem multas')) {
                resposta = resultadoAPI;
                break;
            }
        }
        const renamePDF = await renameFile(pathNotificacao, `${path.dirname(pathNotificacao)}/${resposta[0]} ${resposta[1]}.pdf`);
        console.log(renamePDF)

    } else {
        console.log('Falha ao comverter o PDF em jpg');
    }
}

readNotificacao();