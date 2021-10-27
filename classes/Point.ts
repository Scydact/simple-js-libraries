/**
 * Generic point (x, y). Use vector2.js instead!.
 */

/**
 * Functions that require two numbers (operation, and output another number)
 */
export type BinaryOperator = (a: number, b: number) => number;

/**
 * Functions that require one numbers (operation, and output another number)
 */
export type UnaryOperator = (a: number) => number;

export type Point_t = { x: number, y: number }

/** 
 * Generic point class.
 * 
 * Implements a bunch of helper functions:
 * ### Constructors:
 *  - `Point(x,y)`
 *  - `Point.fromTuple([x,y])`
 *  - `Point.fromObject({x,y})`
 *  - `Point.ZERO()` -> `P(0, 0)`
 *  - `Point.CENTER()` -> `P(screen_dimensions/2)`
 *  - Cloning: `p.c()`
 *  - Assign from object: `p.assign({x,y})`
 * 
 * ### Point conversions:
 *  - `p.toString()` -> `P(0, 0)`
 *  - `p.toTuple()` -> `[0, 0]`
 *  
 * ### Operations:
 * __Note:__
 *  _Instance methods will usually modify the current point._
 *  _Static methods will create a new point._
 * #### Scalar:
 *  - prodScal
 *  - divScal
 * #### Element-wise:
 *  - prodElem
 *  - divElem
 *  - neg (negate)
 *  - reciprocal (1/x, 1/y)
 *  - minus
 *  - plus
 * #### Vector
 *  - dot
 *  - normalize
 *  - abs
 *  - absSquared
 *  - distance
 *  - vectorProjection + vectorProject
 * #### Complex
 *  - conjugate (a+bi -> a-bi)
 *  - reciprocalComplex (1/z)
 *  - prodComplex
 *  - divComplex
 * #### Cartesian points
 *  - translate
 *  - midPoint
 *  - rectangleOverlap
 *  - pointInRectangle
 * 
 * */
export class Point implements Point_t {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `P(${this.x}, ${this.y})`
    }

    /** Returns the array [x, y]. */
    toTuple() {
        return [this.x, this.y]
    }

    /** Creates a new point from an array of 2 numbers. */
    static fromTuple(arr: number[]) {
        return new Point(arr[0], arr[1])
    }

    /** Creates an instance of a Point from an object containing 'x' and 'y'. */
    static fromObject(o) {
        return new Point(o.x, o.y);
    }

    /**
     * Clone: Creates a new instance of this object
     */
    c() {
        return new Point(this.x, this.y);
    }

    /** Assigns values 'x' and 'y' from an object. */
    assign(o) {
        if (o.x !== undefined && o.y !== undefined) {
            this.x = o.x;
            this.y = o.y;
            return true;
        }

        return false;
    }

    /** Point initialized at (0, 0). */
    static ZERO() { return new Point(0, 0) }

    /** Point initialized at half the screen's dimensions. */
    static CENTER() { return new Point(0.5 * window.innerWidth, 0.5 * window.innerHeight) }


    //#region Vector operations
    /** Gives the dot product (x1*x2+y1*y2) of a point. */
    static dot(p1: Point_t, p2: Point_t) {
        return p1.x * p2.x + p1.y * p2.y;
    }

    /**
     * Performs a function (operation) on both 'x' and 'y' axis of a given point.
     * @param p Point to operate.
     * @param operation Binary operation to perform.
     */
    static unaryOperation(p: Point_t, operation: UnaryOperator) {
        return new Point(
            operation(p.x),
            operation(p.y)
        )
    }

    /**
     * Performs a function (operation) on both 'x' and 'y' axis of the given points.
     * @param p1 First point.
     * @param p2 Second point.
     * @param operation Binary operation to perform.
     */
    static binaryOperation(p1: Point_t, p2: Point_t, operation: BinaryOperator) {
        return new Point(
            operation(p1.x, p2.x),
            operation(p1.y, p2.y)
        )
    }

    /** Returns the element-wise product of two points. */
    static prodElem(p1: Point_t, p2: Point_t) {
        return new Point(p1.x * p1.x, p1.y * p2.y);
    }

    /** Element-wise product. */
    prodElem(p: Point_t) {
        this.x *= p.x;
        this.y *= p.y;
        return this;
    }

    /** 
     * Returns the element-wise division (x1/x2),
     * @param p1 Numerator
     * @param p2 Denominator
     */
    static divElem(p1: Point_t, p2: Point_t) {
        return new Point(p1.x / p2.x, p1.y / p2.y);
    }

    /** Element-wise division by the given point. */
    divElem(p: Point_t) {
        this.x /= p.x;
        this.y /= p.y;
        return this;
    }

    /** Returns a new point with reciprocal elements. (x, y) => (1/x, 1/y) */
    static reciprocal(p: Point_t) {
        return new Point(1 / p.x, 1 / p.y);
    }

    /** Returns a new point with reciprocal elements. (x, y) => (1/x, 1/y) */
    reciprocal() {
        this.x = 1 / this.x;
        this.y = 1 / this.y;
        return this;
    }

    /** Returns a new point rotated 180 degrees */
    static neg(p: Point_t) {
        return new Point(-p.x, -p.y)
    }

    /** Returns a new point rotated 180 degrees */
    neg() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /** Returns the vector subtraction. */
    static minus(p1: Point_t, p2: Point_t) {
        return new Point(p1.x - p2.x, p1.y - p2.y)
    }

    /** Returns the vector subtraction. */
    minus(p: Point_t) {
        this.x -= p.x;
        this.y -= p.y;
        return this;
    }

    /** Returns the vector sum. */
    static plus(p1: Point_t, p2: Point_t) {
        return new Point(p1.x + p2.x, p1.y + p2.y)
    }

    /** Returns the vector sum. */
    plus(p: Point_t) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }

    /** Multiplies x & y by an scalar */
    static prodScal(p1: Point_t, mult: number) {
        return new Point(p1.x * mult, p1.y * mult);
    }

    /** Multiplies x & y by an scalar */
    prodScal(mult: number) {
        this.x *= mult;
        this.y *= mult;
        return this;
    }

    /** Returns x^2 + y^2; */
    static absSquared(z: Point_t) {
        return z.x * z.x + z.y * z.y;
    }

    /** Returns x^2 + y^2; Same as dot product with itself. */
    absSquared() {
        return this.x * this.x + this.y * this.y;
    }

    /** Returns the absolute value of the vector. */
    static abs(z: Point_t) {
        return Math.sqrt(z.x * z.x + z.y * z.y);
    }

    /** Returns the absolute value of the vector. */
    abs() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /** Returns the scalar projection of A on B */
    static scalarProjection(a: Point_t, b: Point_t) {
        //return Point.dot(a, b) / Point.abs(b);
        return (a.x * b.x + a.y * b.y) / Math.sqrt(b.x * b.x + b.y * b.y);
    }

    /** Returns the scalar projection of this vector on B */
    scalarProject(b: Point_t) {
        return (this.x * b.x + this.y * b.y) / Math.sqrt(b.x * b.x + b.y * b.y);
    }

    /** Normalizes the vector */
    static normalize(a) {
        //return Point.prodScal(a, 1 / Point.abs(a));
        const c = 1 / Math.sqrt(a.x * a.x + a.y * a.y); // abs
        return new Point(a.x * c, a.y * c);
    }

    /** Normalizes the vector */
    normalize() {
        const c = 1 / Math.sqrt(this.x * this.x + this.y * this.y); // abs
        this.x *= c;
        this.y *= c;
        return this;
    }

    /** Returns the scalar projection of A on B */
    static vectorProjection(a: Point_t, b: Point_t) {
        let scale = Point.dot(a, b) / Point.abs(b);
        return Point.prodScal(b, scale);
    }

    /** Projects this vector on vector B */
    vectorProject(b: Point_t) {
        const scale = (this.x * b.x + this.y * b.y) / Math.sqrt(b.x * b.x + b.y * b.y);
        this.x = b.x * scale;
        this.y = b.y * scale;
        return this;
    }

    /** Applies the given offset to a point. */
    static translate(p: Point_t, x: number, y: number) {
        return new Point(p.x + x, p.y + y);
    }

    /** Applies the given offset to a point. */
    translate(x: number, y: number) {
        this.x += x;
        this.y += y;
        return this;
    }

    //#endregion

    //#region Misc Operations

    /** Returns the distance between two points. */
    static distance(p1: Point_t, p2: Point_t) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    }

    /** Returns the midpoint between two points. */
    static midPoint(p1: Point_t, p2: Point_t) {
        //return Point.BinaryOperation(p1, p2, (a, b) => (a + b) / 2);
        return new Point(
            0.5 * (p1.x + p2.x),
            0.5 * (p1.y + p2.y),
        )
    }

    /** Checks if two rectangles, defined by l1-r1 and l2-r2, overlap.  */
    static rectangleOverlap(l1: Point_t, r1: Point_t, l2: Point_t, r2: Point_t) {
        if (l1.x === r1.x || l1.y === r1.y
            || l2.x === r2.x || l2.y === r2.y) {
            // the line cannot have positive overlap
            return false;
        }

        // If one rectangle is on left side of other
        if (l1.x >= r2.x || l2.x >= r1.x)
            return false;

        // If one rectangle is above other
        if (l1.y >= r2.y || l2.y >= r1.y)
            return false;

        return true;
    }

    /** Checks if the point is inside the given rectangle. */
    static pointInRectangle({ x, y }: Point_t, { x: x1, y: y1 }: Point_t, { x: x2, y: y2 }: Point_t) {
        return (x >= x1 && x <= x2) && (y >= y1 && y <= y2);
    }

    //#endregion

    //#region Complex operations

    /**
     * Returns z1 * z2 where z are treated as complex numbers.
     * @param z1 First complex number.
     * @param z2 Second complex number.
     */
    static prodComplex(z1: Point_t, z2: Point_t) {
        // src: https://www2.clarku.edu/faculty/djoyce/complex/mult.html
        return new Point(
            z1.x * z2.x - z1.y * z2.y,
            z1.x * z2.y + z1.y * z2.x
        );
    }

    prodComplex(z: Point_t) {
        this.x = this.x * z.x - this.y * z.y;
        this.y = this.x * z.y + this.y * z.x;
        return this;
    }

    /** Returns the complex conjugate of Z=a+bi, Z*=a-bi */
    static conjugate(z: Point_t) {
        return new Point(z.x, -z.y);
    }

    /** Conjugates this complex point. 
     * 
     * `a+bi -> a-bi`*/
    conjugate() {
        this.y = -this.y;
        return this;
    }

    /**
     * Returns a / b where z are treated as complex numbers.
     * @param a Numerator
     * @param b Denominator
     */
    static divComplex(a: Point_t, b: Point_t) {
        // src: https://www2.clarku.edu/faculty/djoyce/complex/div.html
        const scale = 1 / (b.x * b.x + b.y + b.y);
        return new Point(
            (a.x * b.x + a.y * b.y) * scale,
            (-a.x * b.y + a.y * b.x) * scale,
        );
        // return Point.prodComplex(
        //     a,
        //     Point.conjugate(b)
        // );
    }

    /** Divides this complex number by the given complex B. */
    divComplex(b: Point_t) {
        const scale = 1 / (b.x * b.x + b.y + b.y);
        this.x = (this.x * b.x + this.y * b.y) * scale;
        this.y = (-this.x * b.y + this.y * b.x) * scale;
        return this;
    }

    /** Returns the complex reciprocal, 1/z */
    static reciprocalComplex(z: Point_t) {
        // src: https://www2.clarku.edu/faculty/djoyce/complex/div.html
        // 1/z = conj(z) / absSquare(z)
        const scale = 1 / (z.x * z.x + z.y + z.y);
        return new Point(
            z.x * scale,
            -z.y * scale,
        );
    }
    
    /** Returns the complex reciprocal, 1/z */
    reciprocalComplex() {
        const scale = 1 / (this.x * this.x + this.y + this.y);
        this.x *= scale;
        this.y *= -scale;
        return this;
    }

    //#endregion
}

export default Point;