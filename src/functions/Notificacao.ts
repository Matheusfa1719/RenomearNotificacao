export interface IMulta {
    dataInfracao: string,
    horaInfracao: string,
    codigo: string,
    ait: string,
    autoInfracao2: string,
    aiipmulta: string,
    placa: string,
    orgao: string,
    id: number,
    status: string
}

export function getPlaca(array: string[], regex: RegExp): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const qtdListResponse = array.length
        const arrayPlacas = []
        for (let i = 0; i < qtdListResponse; i++) {
            const itemList = array[i]
            let placa: Array<String> | any = itemList.match(regex)
            if (placa !== null) {
                const placaRes = placa[0]
                arrayPlacas.push(placaRes)
            }
        }
        return resolve(arrayPlacas)
    });
}

export function validacaoPlaca(placa: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (placa.includes(' ')) {
            const newPlaca = placa.replace(' ', '')
            return resolve(newPlaca)
        } else if (placa.includes('-')) {
            const newPlaca = placa.replace('-', '')
            return resolve(newPlaca)
        }
        return resolve(placa)
    })
}


export function comparacaoDocumento(array: IMulta[], respostaOcr: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const qtdObj = array.length
        for (let i = 0; i < qtdObj; i++) {
            const dataInfracao = new Date(array[i].dataInfracao).toLocaleDateString()
            const hora = array[i].horaInfracao
            const codInfracao = array[i].codigo
            const ait = array[i].ait
            const ait2 = array[i].autoInfracao2
            const aiipmulta = array[i].aiipmulta
            const placa = array[i].placa
            const orgao = array[i].orgao
            const idMulta = array[i].id
            const arrayReptidos: any = []
            array.filter((object: any) => {
                const dataObject = new Date(array[i].dataInfracao).toLocaleDateString()
                if (object.horaInfracao === hora && dataObject === dataInfracao) {

                    arrayReptidos.push(object)
                }
            });
            //Filter NIC RJ
            array.filter((object: any) => {
                if (object.orgao === '260010' && object.codigo === '500-20' && respostaOcr.includes('500-2-0')) {
                    const dataObject = new Date(array[i].dataInfracao).toLocaleDateString()
                    const resposta: any = [dataObject, object.horaInfracao, object.codigo, object.ait, object.autoInfracao2, object.aiipmulta, object.placa, object.orgao, object.id]
                    resolve(resposta)
                }
            })
            if (arrayReptidos.length > 1) {
                resolve(['falha na comparacao - duplicado'])
            }
            if (respostaOcr.includes(dataInfracao) && respostaOcr.includes(hora)) {
                const codRegex: any = codInfracao.match(/\d{5}|\d{3}\-\d{2}|\d{4}\-\d{1}/)
                if (codRegex !== null) {
                    const resposta: any = [placa, ait]
                    resolve(resposta)
                }

            }
        }
        resolve(['falha na comparacao'])
    })
}