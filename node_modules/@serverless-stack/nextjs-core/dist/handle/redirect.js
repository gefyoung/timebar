"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirect = void 0;
const headers_1 = require("./headers");
const redirect = (event, route) => {
    (0, headers_1.setHeadersFromRoute)(event, route);
    event.res.statusCode = route.status;
    event.res.statusMessage = route.statusDescription;
    event.res.end();
};
exports.redirect = redirect;
