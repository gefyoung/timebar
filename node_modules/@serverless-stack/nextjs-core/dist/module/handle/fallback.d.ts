import { Event, PageManifest, Route, RoutesManifest, StaticRoute } from "../types";
declare type FallbackRoute = StaticRoute & {
    fallback: string | null;
    page: string;
};
declare type Fallback = {
    isStatic: false;
    route: FallbackRoute;
    html: string;
    renderOpts: any;
};
export declare const handleFallback: (event: Event, route: Route, manifest: PageManifest, routesManifest: RoutesManifest, getPage: (page: string) => any) => Promise<StaticRoute | Fallback | void>;
export {};
