// Generated by dts-bundle v0.7.2

export class Matrix {
    data: number[][];
    constructor(data: number[][]);
    constructor(rows: number, columns: number);
    static rowVector(...components: number[]): Matrix;
    static columnVector(...components: number[]): Matrix;
    static rand(rows: number, columns: number): Matrix;
    static ones(rows: number, columns: number): Matrix;
    static eye(size: number): Matrix;
    static join(m1: Matrix, m2: Matrix, pos?: 'top' | 'bottom' | 'left' | 'right'): Matrix;
    size(): number[];
    getNumberOfRows(): number;
    getNumberOfColumns(): number;
    getDimensions(): number[];
    set(row: number, column: number, val: number): void;
    get(row: number, column: number): number;
    getRowAsRowVector(row: number): Matrix;
    getColumnAsRowVector(column: number): Matrix;
    getAsScalar(): number;
    getArray(): number[][];
    copy(): Matrix;
    slice(startRow: number, endRow: number, startColumn: number, endColumn: number): Matrix;
    map(func: (val: number, row?: number, column?: number) => number): this;
    forEach(func: (val: number, row?: number, column?: number) => void): this;
    fill(newVal: number): this;
    scale(scl: number): this;
    add(m: Matrix): this;
    subtract(m: Matrix): this;
    multiply(m: Matrix): this;
    divide(m: Matrix): this;
    dot(m: Matrix): this;
    transpose(): this;
    min(): Matrix;
    max(): Matrix;
    show(): this;
    getAsString(markup?: boolean, joinChar?: string, lineSpaceChar?: string, end?: string, fixed?: number): string;
}

export interface ANNOptions {
        learningRate: number;
        layers: number[];
        activationFunction: ActivationFunction;
        errorFunction: ErrorFunction;
        momentum: number;
}
export class FeedForwardNeuralNetwork {
        constructor(options: ANNOptions);
        /**
            * Creates new network with specified weights
            * @param weightData previously saved weights (using Network.exportWeights)
            * @param options network options
            */
        static restore(weightData: number[][][], options: ANNOptions): FeedForwardNeuralNetwork;
        /**
            * Fits given inputs to given target values by training the network
            * @param inputs inputs to the network
            * @param targetValues expected outputs for given input
            */
        fit(inputs: number[], targetValues: number[]): this;
        /**
            * Predict output values for given inputs
            * @param inputs input values
            */
        predict(inputs: number[]): number[];
        /**
            * Calculate the error for current outputs (not forward pass)
            * @param targetValues target values
            */
        getCurrentError(targetValues: number[]): number;
        /**
            * Calculates the error for given inputs
            * @param inputs inputs to network
            * @param targetValues expected output for given inputs
            */
        error(inputs: number[], targetValues: number[]): number;
        /**
            * Export the current weights of the network
            */
        exportWeights(): number[][][];
}

export interface ActivationFunction {
    output: (input: number) => number;
    der: (input: number) => number;
}
export class Activations {
    static TANH: ActivationFunction;
    static SIGMOID: ActivationFunction;
    static RELU: ActivationFunction;
    static LINEAR: ActivationFunction;
}

export interface ErrorFunction {
    error: (output: number, target: number) => number;
    der: (output: number, target: number) => number;
}
export class Errors {
    static SQUARE: ErrorFunction;
    static CROSS_ENTROPY: ErrorFunction;
}

export namespace Utilities {
    function repeat(func: (iterations?: number) => any, iterations: number): void;
    function csvStringToJSON(csv: string, tryObjectParseIfPossible?: boolean, columnSeparator?: string, rowSeparator?: string): {}[] | (string | number)[][];
    function pickRandomFromArray(array: any[]): any;
}

export class ClassToValue {
    toValue(className: string): number;
    toClass(value: number): string;
}

export interface NumericDistanceFunction {
    (a: number[], b: number[]): number;
}
export class Distances {
    static EUCLIDEAN: NumericDistanceFunction;
    static TAXI: NumericDistanceFunction;
    static LEVENSHTEIN: (a: string, b: string) => any;
}

export namespace Normalization {
    class MinMaxNormalizer {
        constructor(data: number[][]);
        normalizeExampleData(): number[][];
        normalizeNewDataRow(row: number[]): number[];
        denormalize(row: number[]): number[];
    }
}

export namespace Maths {
    function randomInt(min: number, max: number): number;
    function random(min: number, max: number): number;
    function argmax(args: number[]): number;
    function randomBool(): boolean;
    function round(value: number, decimals?: number): number;
    function sum(c: number[] | Matrix): number;
}

export namespace Generators {
    function clouds(clouds: number, dataPointsForCloud?: number, dimensions?: number, min?: number, max?: number, spread?: number): {
        center: number[];
        points: number[][];
    }[];
}

export class KNNClassifier {
    constructor(k?: number, distanceFunction?: NumericDistanceFunction);
    addData(classes: number[], data: number[][]): this;
    predict(input: number[], c2v?: ClassToValue): string | number;
}

export class KMeans {
    constructor(data: number[][], numberOfClusters: any);
    fitClusters(distanceFunction?: NumericDistanceFunction): number[][];
}

