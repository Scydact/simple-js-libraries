/**
 * Extracts a value (or undefined) from a given target.path...
 * @param {any} target Object to get the value from
 * @param {string | string[] | number} path Path of the value
 * @returns {any} Value of target.path[0].path[1]...path[n]
 */
export function ObjectGetPath(target, path) {
    if (target === undefined || target === null) return undefined;
    if (typeof path === 'number') return target[path];
    const paths = (Array.isArray(path)) ? path : path.split('.');

    let x = target;

    for (const path of paths) {
        x = x[path];
        if (x === undefined) return undefined;
    }
    return x;
}

/**
 * 
 * @param {any} target Object to set tohe value from
 * @param {any} value Value to set, if possible
 * @param {string | string[] | number} path Path to set the value at
 * @returns Last object before the value if set was successful. Undefined if could not set the value.
 */
export function ObjectSetPath(target, path, value, separator = '.') {
    if (typeof target === undefined || target === null) return undefined;

    if (typeof path === 'number') {
        target[path] = value;
        return target;
    }

    const paths = (Array.isArray(path)) ? path : path.split(separator);
    let x = target;

    for (const path of paths.slice(0, -1)) {
        if (x[path] === undefined) x[path] = {};
        if (typeof x[path] !== 'object') return undefined;
        x = x[path];
    }

    x[paths[paths.length - 1]] = value;
    return x;
}

/**
 * 
 * @param  {string[]} strs Strings to join in a path.
 * @param {string} separator Separator string to join the paths with.
 * @returns {string} Returns the joined path.
 */
function joinPath(strs, separator = '.') {
    if (strs.length === 1) return strs[0];
    return strs.filter(x => x).join(separator); // filter removes duplicate dots... hopefully.
}

/**
 * Flatten the keys into a key-value format. Similar to array.flat().
 * Keys will be in dot-separated paths.
 * 
 * @param {any} target Object to flatten. Must be an object object (constructor Object)
 * @param {string} path 
 * @returns {any} The flattened object.
 */
export function ObjectFlatten(target, path = '', separator = '.') {
    const flattened = {};
    Object.keys(target).forEach((key) => {
        if (target[key].constructor === Object)
            Object.assign(
                flattened,
                ObjectFlatten(target[key], joinPath(path, key)));
        else {
            flattened[joinPath([path, key], separator)] = target[key];
        }
    })
    return flattened;
}

/** 
 * Inverse of ObjectFlatten function.
 * "Unflattens" the object from the dot-separated paths.
 */
export function ObjectUnflatten(target, separator = '.') {
    const unflat = {};
    Object.entries(target).forEach(([key, value]) => {
        ObjectSetPath(unflat, key, value, separator);
    })
    return unflat;
}

/**
 * Converts An String To Title Case.
 * @param {string} string String to convert to title case
 * @returns Returns the title case string.
 */
export function titleCase(string) {
    var sentence = string.toLowerCase().split(' ');
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }

    return sentence.join(' ');
}