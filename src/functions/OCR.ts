import vision from '@google-cloud/vision';

export function getTextFromImage(pathFile: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const client = new vision.ImageAnnotatorClient({
            keyFilename: 'Credentials.json'
        });

        const [result] = await client.textDetection(pathFile);
        const detections: any = result.textAnnotations
        if (detections[0] !== undefined) {
            return resolve(detections[0].description)
        } else {
            resolve('')
        }
    });
}