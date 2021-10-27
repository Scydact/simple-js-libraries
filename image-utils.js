/**
 * Converts SVG data into a PNG URL blob.
 * 
 * @param {string} svg Svd data to convert to URL.
 * @param {function} callback Function to call. Parameter will be the PNG URL.
 */
export function svgToPng(svg, callback) {
    const url = getSvgUrl(svg);
    svgUrlToPng(url, (imgData) => {
        callback(imgData);
        URL.revokeObjectURL(url);
    });
}
/** 
 * Creates an URL from an SVG. 
 * 
 * Remember to do URL.revokeObjectURL() after using it. 
 * 
 * @param {string} svg SVG data to convert to a blob.
 */
export function getSvgUrl(svg) {
    return URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
}


/** 
 * Renders the given URL into a canvas, and runs the output URL 
 * through callback(data) 
 * @param {string} svgUrl URL of the SVG file.
 * @param {function} callback Function to call with the image data loaded (URL format).
 * @param {Number} OutputWidth Width of the rendered SVG.
 */
export function svgUrlToPng(svgUrl, callback, OutputWidth = 2000) {
    const svgImage = document.createElement('img');
    svgImage.style.position = 'absolute';
    svgImage.style.top = '-9999px';
    document.body.appendChild(svgImage);

    svgImage.onload = function () {
        const canvas = document.createElement('canvas');
        let w = OutputWidth;
        let h = w * svgImage.height / svgImage.width;

        canvas.width = w;
        canvas.height = h;

        const canvasCtx = canvas.getContext('2d');
        canvasCtx.drawImage(svgImage, 0, 0, w, h);

        const imgData = canvas.toDataURL('image/png');
        callback(imgData);
        document.body.removeChild(svgImage);
    };

    svgImage.src = svgUrl;
}