/** 
 * Prompts download of a given Uri (also encodes it, just in case).
 * Can be used to download TXT/JSON/CSV files.
 * 
 * @param {string} data Data to encode and the download.
 * @param {string} fileName 
 */
export function downloadUri(data, fileName) {
    var encodedUri = encodeURI(data);
    downloadUrl(encodedUri, fileName);
}

/** 
 * Prompts download of a given blob.
 * 
 * @param {blob} blob Data to download.
 * @param {string} fileName 
 * 
 */
export function downloadBlob(blob, fileName) {
    let url = URL.createObjectURL(blob);
    downloadUrl(url, fileName);
    URL.revokeObjectURL(url);
}

/** 
 * Creates a link and clicks it automatically.
 * 
 * @param {string} url URL of the resource to download.
 * @param {string} fileName 
  */
export function downloadUrl(url, fileName) {
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.click();
}