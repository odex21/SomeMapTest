import { Route } from '../data/mapdata';
import { PFResArr } from '.';
import { SomeMap } from '../SomeMap';
declare const addRoutes: (route: Route, someMap: SomeMap) => PFResArr[];
export { addRoutes };
