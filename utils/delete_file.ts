import fs from 'fs';
import path from 'path';

interface DataObject {
    _doc: Record<string, any>;
}

/**
 * Verify if the data contains a list of files and delete them.
 * @param {DataObject | string} data - The data to check.
 * @returns {string | void} The result of the deletion or an error message.
 */
const verifyAndDeleteFiles = (data: DataObject | string): string | void => {
    if (data && typeof data === 'object' && '_doc' in data) {
        const dirSaved = 'uploads';
        const listResultData = Object.values(data._doc);
        const files = listResultData
            .filter((element): element is string => typeof element === 'string')
            .filter((element) => element.startsWith(dirSaved));

        return deleteFiles(files);
    } else {
        console.log('Files error: Invalid data type');
        return 'files error';
    }
};

/**
 * Deletes a file or an array of files.
 * @param {string | string[]} files - The file name or an array of file names to delete.
 */
const deleteFiles = (files: string | string[]): void => {
    const filesArray = Array.isArray(files) ? files : [files];

    filesArray.forEach((file) => {
        const filePath = path.join(__dirname, '../public/', file);

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${file}:`, err);
                } else {
                    console.log(`Successfully deleted file: ${file}`);
                }
            });
        } else {
            console.log(`File not found: ${file}`);
        }
    });
};

export { verifyAndDeleteFiles, deleteFiles };
