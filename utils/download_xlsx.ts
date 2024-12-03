import { Response } from 'express';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import config from '../config/variables';

interface CustomHeader {
    label: string;
    key: string;
}

/**
 * Downloads a file in XLSX format to the user.
 *
 * @param {Response} res - The response object to send the file.
 * @param {string} fileName - The name of the file to download, including the extension.
 * @param {string[]} fields - The fields to include in the spreadsheet.
 * @param {any[]} data - The data to include in the spreadsheet.
 * @param {CustomHeader[]} customHeader - An array of objects with label and key properties, to customize the header of the spreadsheet.
 * @param {string} [sheetName=''] - The name of the sheet in the spreadsheet.
 *
 * @returns {Promise<any>} A promise that resolves when the file has been sent.
 */
export default async function download_xlsx(
    res: Response,
    fileName: string,
    fields: string[],
    data: any[],
    customHeader: CustomHeader[],
    sheetName = ''
): Promise<any> {

    const workbook = new ExcelJS.Workbook();

    if (sheetName === '') {
        sheetName = fileName.replace('.xlsx', '');
    }

    const worksheet = workbook.addWorksheet(sheetName);


    const columns = fields.map(field => {
        const label = customHeader.find(el => el.key === field);
        return {
            header: label?.label || field,
            key: field,
        };
    });
    worksheet.columns = columns;


    const rows = data.map(item => {
        const row: { [key: string]: any } = {};
        for (const field of fields) {
            row[field] = item[field] || '';
        }
        return row;
    });
    worksheet.addRows(rows);

    const filePath = path.join(__dirname, '../public/uploads/', fileName);
    await workbook.xlsx.writeFile(filePath);

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);  
    
      res.header('fileName', fileName);

      let host_file_path = config.host_url + "uploads/"+fileName;
  
      res.download(filePath, fileName, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Error sending file.");
        } else {
            console.log("File sent successfully");
        }
    });
}
