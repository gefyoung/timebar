import { ApiManifest, ApiRoute, ExternalRoute, RoutesManifest, Request } from "../types";
export declare const handleApiReq: (req: Request, uri: string, manifest: ApiManifest, routesManifest: RoutesManifest, isRewrite?: boolean | undefined) => ExternalRoute | ApiRoute | undefined;
