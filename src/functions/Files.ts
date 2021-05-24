import fs from 'fs';
import path from 'path'
import fs_extra from 'fs-extra'

export function getFilesInFolder(pathFolder: string, fileFilter: string): Promise<string[] | string> {
    return new Promise((resolve, reject) => {
        const directoryPath = pathFolder.replace('\\', '/');
        const array: string[] = [];
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject('Erro ao localizar os arquivos')
            }
            files.forEach((file) => {
                if (file.includes(fileFilter)) {
                    array.push(`${directoryPath}/${file}`);
                }
            });
            resolve(array)
        });
    });
}

export function moveFile(oldPath: string, newPath: string) {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                resolve('Falha ao mover o arquivo')
            }
            resolve('Arquivo movido com sucesso')
        })
    });
}

export function renameFile(file: string, newPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs_extra.move(file, newPath, { overwrite: true }, err => {
            if (err) {
                resolve('Arquivo não renomeado');
            } else {
                resolve('Arquivo movido');
            }
        });
    });
}