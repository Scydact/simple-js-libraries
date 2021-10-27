/**
 * Linearly interpolates X from x0..x1 to y0..y1.
 * 
 * Similar to Arduino map() function, usually used 
 * to map values from 0-1024 to 0-5.
 * 
 * @param {Number} x Value to map.
 * @param {Number} x0 Minimum value of X.
 * @param {Number} x1 Maximum value of X.
 * @param {Number} y0 Mapped x0 point.
 * @param {Number} y1 Mapped x1 point.
 * @returns Mapped X from x0-x1 to y0-y1 system.
 */
export function numberMap(x, x0, x1, y0, y1) {
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
}

/** Logic implementation absolute value. */
export function abs(x) {
    if (x < 0) return -x;
    return x;
}

/** Logic implementation of sign(x) */
export function sign(x) {
    if (x > 0) return 1;
    if (x) return -1;
    return 0;
}

/**
 * Linear interpolation between v0 and v1, given a t in the interval [0,1].
 * @param {Number} v0 First value.
 * @param {Number} v1 Second value.
 * @param {Number} t Mixing parameter.
 * @returns 
 */
export function lerp(v0, v1, t) {
    return v0 + t * (v1 - v0);
}