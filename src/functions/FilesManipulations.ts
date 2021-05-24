import { Poppler } from 'node-poppler'

export function pdfToJpg(filePath: string, output: string) {
    return new Promise(async (resolve, reject) => {
        const poppler = new Poppler();
        const options = {
            firstPageToConvert: 1,
            lastPageToConvert: 2,
            jpegFile: true,
            resolutionXYAxis: 200
        }
        const ouputFile = `${output}/ocr`;
        await poppler.pdfToCairo(filePath, ouputFile, options)
            .then(response => {
                resolve(true)
            })
            .catch(error => {
                console.log(error)
                resolve(false)
            });
    });
}