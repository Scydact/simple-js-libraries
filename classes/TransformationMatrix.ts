import Vector2 from "./vector2";

/** Simple transformation matrix with translation. */
class TransformationMatrix {
    m = [1, 0, 0, 1, 0, 0];
    /** Accepts:
     * - array of 6 numbers
     * - another TransformationMatrix
     * - object with properties {a,b,c,d,e,f}
     */
    constructor(x?: number[] | TransformationMatrix | any) {
        if (x) {
            if (Array.isArray(x)
                && x.length === 6
                && x.every(y => typeof y === 'number')) {
                this.m = x.slice(0, 6);
            } else if (x instanceof TransformationMatrix) {
                this.m = [...x.m];
            } else if (typeof x === 'object') {
                const { a, b, c, d, e, f } = x;
                var m = [a, b, c, d, e, f];
                if (m.every(y => typeof y === 'number'))
                    this.m = m;
            }
            else throw Error('Invalid matrix type!');
        }
        return this;
    }

    /** Sets this TM to Identity */
    reset() {
        this.m = [1, 0, 0, 1, 0, 0];
        return this;
    }

    /** Multiplies by another matrix */
    multiply(mat: number[]) {
        var m = this.m;
        var m0 = m[0] * mat[0] + m[2] * mat[1];
        var m1 = m[1] * mat[0] + m[3] * mat[1];
        var m2 = m[0] * mat[2] + m[2] * mat[3];
        var m3 = m[1] * mat[2] + m[3] * mat[3];
        var m4 = m[0] * mat[4] + m[2] * mat[5] + m[4];
        var m5 = m[1] * mat[4] + m[3] * mat[5] + m[5];
        this.m = [m0, m1, m2, m3, m4, m5];
        //console.log(m, mat, this.m)
        return this;
    }

    /** Applies the transformation to a point. */
    screenPoint({ x, y }: Vector2) {
        // invert
        var m = this.m;
        var d = 1 / (m[0] * m[3] - m[1] * m[2]);
        var im = [m[3] * d, -m[1] * d, -m[2] * d, m[0] * d, d * (m[2] * m[5] - m[3] * m[4]), d * (m[1] * m[4] - m[0] * m[5])];
        // point
        return new Vector2(
            x * im[0] + y * im[2] + im[4],
            x * im[1] + y * im[3] + im[5]);
    }

    /** Applies the inverse transformation to a point */
    transformedPoint({ x: screenX, y: screenY }: Vector2) {
        var m = this.m;
        return new Vector2(
            screenX * m[0] + screenY * m[2] + m[4],
            screenX * m[1] + screenY * m[3] + m[5]
        );
    }

    /** Translate this matrix by {x, y} */
    translate({ x, y }: Vector2) {
        var mat = [1, 0, 0, 1, x, y];
        this.multiply(mat);
        return this;
    };

    /** Rotates this matrix by an angle, in radians. */
    rotate(rAngle: number) {
        var c = Math.cos(rAngle);
        var s = Math.sin(rAngle);
        var mat = [c, s, -s, c, 0, 0];
        this.multiply(mat);
        return this;
    };

    /** Scales this matrix in the x/y axis. */
    scale(x: number, y?: number) {
        if (y === undefined) y = x;
        var mat = [x, 0, 0, y, 0, 0];
        this.multiply(mat);
        return this;
    };

    /** Skews this matrix by x/y radians. */
    skew(radianX: number, radianY: number) {
        var mat = [1, Math.tan(radianY), Math.tan(radianX), 1, 0, 0];
        this.multiply(mat);
        return this;
    };

    /** Applies this matrix to the given canvas 2D context. */
    setContextTransform(ctx: CanvasRenderingContext2D) {
        var m = this.m;
        ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
        return this;
    }

    /** Resets the given canvas context. */
    resetContextTransform(ctx: CanvasRenderingContext2D) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        return this;
    }

    /** Returns the matrix array of this TransformationMatrix */
    getMatrix() {
        var clone = [...this.m];
        return (clone);
    }

    /** Clones this TM. */
    clone() {
        return new TransformationMatrix(this.m);
    }

    /** Console logs this matrix. For debug purposes. */
    log() {
        const trans = this.getTranslation(),
            scale = this.getScale(),
            rot = this.getRotation()
        console.log(`t: ${trans}\ns: ${scale}\nr: ${rot}`);
        return this
    }

    /** Creates simple "hash" number from the current transform matrix */
    hash() {
        const prime = 17;
        let r = 1;
        for (const i of this.m)
            r = prime * r + i
        return r
    }

    /** Returns the inverse transformation matrix (TM^-1) */
    inverse() {
        var m = this.m;
        var d = 1 / (m[0] * m[3] - m[1] * m[2]);
        this.m = [m[3] * d, -m[1] * d, -m[2] * d, m[0] * d, d * (m[2] * m[5] - m[3] * m[4]), d * (m[1] * m[4] - m[0] * m[5])];
        return this;
    }

    /** Gets the translation component of the matrix */
    getTranslation() {
        return new Vector2(this.m[4], this.m[5]);
    }

    /** Gets the scaling component of the matrix */
    getScale() {
        var m = this.m;
        var x = Math.sqrt(m[0] * m[0] + m[2] * m[2]);
        var y = Math.sqrt(m[1] * m[1] + m[3] * m[3]);
        return new Vector2(x, y);
    }

    /** Gets the rotation element of the matrix, for each axis */
    getRotation() {
        var m = this.m;
        var x = Math.atan2(-m[2], m[0]);
        var y = Math.atan2(m[1], m[3]);
        return new Vector2(x, y);
    }

    /** Gets the skew element of the matrix, for each axis */
    getSkew() {
        var m = this.m;
        var x = Math.atan2(m[2], m[0]);
        var y = Math.atan2(m[1], m[3]);
        return new Vector2(x, y)
    }
}

export default TransformationMatrix;

function isPoint(x: any) {
    return (
        typeof x === 'object'
        && x !== null
        && typeof x.x === 'number'
        && typeof x.y === 'number'
    )
}

/* No clue why this is here. */
function PointArgs() {
    return function (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const childFunction = descriptor.value;
        descriptor.value = function (this: any, ...args: any[]) {
            if (args.length > 0 && isPoint(args[0]))
                return childFunction.apply(this, [args[0].x, args[0].y, ...args.slice(1)])
            return childFunction.apply(this, args);
        };
        return descriptor;
    };
}