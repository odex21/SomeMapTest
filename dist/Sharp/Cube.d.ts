import Base, { BaseOption, Perspective, BaseTodo, Pos } from './Base';
export interface CubeOption extends BaseOption {
    x: number;
    y: number;
    z: number;
    pos: Pos;
    theta?: number;
    radius?: number;
    cubeWidth?: number;
    cubeHeight?: number;
    cubeLength?: number;
    faceColor?: Color;
    text?: string;
}
export interface CubeSetOption {
    theta?: number;
    perspective?: Perspective;
    faceColor?: FaceColor;
    clicked?: boolean;
}
export interface CubeBackState {
    attr: CubeSetOption;
    state: {
        [index: string]: any;
    };
}
export interface CubeAnimationOption extends CubeSetOption {
    x?: number;
    y?: number;
    z?: number;
}
export interface FaceColor {
    [index: number]: Color;
}
declare enum rgba {
    red = 0,
    green = 1,
    blue = 2,
    alpha = 3
}
export interface RGBA extends Array<number | undefined> {
    [rgba.red]: number;
    [rgba.green]: number;
    [rgba.blue]: number;
    [rgba.alpha]?: number;
}
declare enum hlsa {
    hue = 0,
    saturation = 1,
    lightness = 2,
    alpha = 3
}
export interface HSLA extends Array<number | string | undefined> {
    [hlsa.hue]: number;
    [hlsa.saturation]: string;
    [hlsa.lightness]: string;
    [hlsa.alpha]?: number;
}
export declare type Color = HSLA | RGBA;
export declare type ColorValue = number | string;
export declare const toColor: (c: string | HSLA | RGBA) => string;
export declare const CUBE_LINES: number[][];
export declare const CUBE_FACE: number[][];
export declare const CUBE_VERTICES: number[][];
declare class Cube extends Base {
    width: number;
    length: number;
    height: number;
    faces: Path2D[];
    faceColor: FaceColor;
    todo: BaseTodo;
    pos: Pos;
    strokeStyle: string;
    backUpAttr: CubeBackState;
    text: string;
    constructor(cubeOption: CubeOption);
    restore(): void;
    set(opt: CubeSetOption): void;
    pointInPath(evt: {
        x: number;
        y: number;
        type: string;
    }): boolean;
    on(type: keyof GlobalEventHandlersEventMap, todo: Function): void;
    animate(opt: CubeAnimationOption): void;
    viToXy([x, y, z]: number[]): {
        size: number;
        x: number;
        y: number;
    };
    drawFace(index?: number): void;
    draw(): void;
}
export default Cube;
