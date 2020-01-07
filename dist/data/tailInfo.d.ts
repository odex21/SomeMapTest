import { Color } from 'SomeMap/Sharp/Cube';
export interface TileInfo {
    name: string;
    description: string;
    color: string | Color;
}
export interface TilesInfo {
    [index: string]: TileInfo;
}
declare const tileInfo: TilesInfo;
export { tileInfo };
