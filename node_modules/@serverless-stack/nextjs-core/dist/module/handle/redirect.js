import { setHeadersFromRoute } from "./headers";
export const redirect = (event, route) => {
    setHeadersFromRoute(event, route);
    event.res.statusCode = route.status;
    event.res.statusMessage = route.statusDescription;
    event.res.end();
};
