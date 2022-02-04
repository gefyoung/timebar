"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/id";
exports.ids = ["pages/id"];
exports.modules = {

/***/ "./pages/id.tsx":
/*!**********************!*\
  !*** ./pages/id.tsx ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Id),\n/* harmony export */   \"getStaticProps\": () => (/* binding */ getStaticProps)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var node_ical__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node-ical */ \"node-ical\");\n/* harmony import */ var node_ical__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_ical__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nfunction Id({ data  }) {\n    const { 0: selectedEventState , 1: setSelectedEventState  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)({\n        summary: \"\",\n        className: \"\",\n        startDate: 0\n    });\n    const selectFlip = (e)=>{\n        const startDate = new Date(e.dayBegins);\n        console.log(e.dayBegins);\n        setSelectedEventState({\n            className: e.className,\n            summary: e.summary,\n            startDate: e.dayBegins\n        });\n    };\n    const FlipComponent = ({ flipEvent  })=>{\n        return(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            onClick: ()=>selectFlip(flipEvent)\n            ,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: flipEvent.className\n            }, void 0, false, {\n                fileName: \"/home/gty/Documents/timebar/tfront/pages/id.tsx\",\n                lineNumber: 31,\n                columnNumber: 7\n            }, this)\n        }, flipEvent.starTime, false, {\n            fileName: \"/home/gty/Documents/timebar/tfront/pages/id.tsx\",\n            lineNumber: 30,\n            columnNumber: 12\n        }, this));\n    };\n    const DayComponent = ({ day  })=>{\n        return(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex my-20 overflow-hidden\",\n                children: day.map((flipEvent)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(FlipComponent, {\n                        flipEvent: flipEvent\n                    }, flipEvent.start, false, {\n                        fileName: \"/home/gty/Documents/timebar/tfront/pages/id.tsx\",\n                        lineNumber: 38,\n                        columnNumber: 9\n                    }, this)\n                )\n            }, void 0, false, {\n                fileName: \"/home/gty/Documents/timebar/tfront/pages/id.tsx\",\n                lineNumber: 36,\n                columnNumber: 14\n            }, this)\n        }, void 0, false));\n    };\n    return(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"mx-10\",\n        children: Object.entries(data).map(([key, day])=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"flex \",\n                        children: [\n                            new Date(parseInt(key)).toLocaleDateString() + ' ',\n                            new Date(parseInt(key)).toLocaleString('en-us', {\n                                weekday: 'long'\n                            })\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/gty/Documents/timebar/tfront/pages/id.tsx\",\n                        lineNumber: 47,\n                        columnNumber: 9\n                    }, this),\n                    selectedEventState.startDate === parseInt(key) && selectedEventState.summary + \" \" + selectedEventState.className,\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(DayComponent, {\n                        day: day\n                    }, day, false, {\n                        fileName: \"/home/gty/Documents/timebar/tfront/pages/id.tsx\",\n                        lineNumber: 54,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true)\n        )\n    }, void 0, false, {\n        fileName: \"/home/gty/Documents/timebar/tfront/pages/id.tsx\",\n        lineNumber: 43,\n        columnNumber: 5\n    }, this));\n};\nconst userTZ = 'America/Denver';\nfunction returnColor(summary) {\n    switch(summary){\n        case \"Jerkin\":\n            return \"bg-red-600\";\n        case \"Learning\":\n            return \"bg-yellow-600\";\n        case \"Eating\":\n            return \"bg-orange-600\";\n        case \"Sleeping\":\n            return \"bg-purple-600\";\n        case \"Weed\":\n            return \"bg-amber-600\";\n        case \"Socializing\":\n            return \"bg-lime-600\";\n        case \"Beer\":\n            return \"bg-teal-600\";\n        case \"Working out\":\n            return \"bg-blue-600\";\n        case \"Insta/tv/youtub\":\n            return \"bg-pink-600\";\n        case \"Shop/Chores\":\n            return \"bg-rose-600\";\n        case \"Skiing\":\n            return \"bg-cyan-600\";\n        case \"Norski\":\n            return \"bg-black\";\n        default:\n            \"bg-white\";\n    }\n}\nfunction returnWidth(duration) {\n    let minutes = duration / 60000;\n    let part180 = minutes / 8 * 10;\n    let rounded5 = Math.round(part180 / 5) * 5 / 10;\n    const not0 = rounded5 === 0 ? rounded5 + 0.5 : rounded5;\n    return `w-${not0}ch h-8`;\n}\nfunction groupByDays(objectArray) {\n    return objectArray.reduce(function(acc, obj) {\n        let key = obj.dayBegins;\n        if (!acc[key]) {\n            acc[key] = [];\n        }\n        acc[key].push(obj);\n        return acc;\n    }, {});\n}\nfunction durate(sorted) {\n    for(let i = 0; i < sorted.length - 1; i++){\n        sorted[i].duration = sorted[i + 1].start - sorted[i].start;\n        sorted[i].className = returnWidth(sorted[i].duration) + \" \" + returnColor(sorted[i].summary);\n    }\n    return sorted;\n}\nfunction sortFlips(arr) {\n    return arr.sort((a, b)=>{\n        if (a.start < b.start) {\n            return -1;\n        } else if (b.start < a.start) {\n            return 1;\n        } else {\n            return 0;\n        }\n    });\n}\nasync function getStaticProps() {\n    try {\n        const parsedICAL = await node_ical__WEBPACK_IMPORTED_MODULE_1___default().async.fromURL('https://newapi.timeflip.io/api/ics/ab7a3206-de2f-8cae-838b-45bd387aacff');\n        const eventArray = [];\n        for (const calEvent of Object.values(parsedICAL)){\n            if (calEvent.start instanceof Date) {\n                const utcDate = new Date(calEvent.start);\n                const convertedTZ = utcDate.toLocaleString(\"en-US\", {\n                    timeZone: userTZ\n                });\n                console.log(convertedTZ);\n                const convertedDate = new Date(convertedTZ);\n                const startTime = convertedDate.getTime();\n                const dayBegins = Date.parse(convertedDate.toDateString());\n                let newShit = {\n                    dayBegins: dayBegins,\n                    dayEnds: dayBegins + 8640000,\n                    start: startTime,\n                    duration: null,\n                    summary: calEvent.summary,\n                    className: null\n                };\n                eventArray.push(newShit);\n            }\n        }\n        const sorted = sortFlips(eventArray);\n        const withDuration = durate(sorted);\n        const groupedDays = groupByDays(withDuration);\n        return {\n            props: {\n                data: groupedDays\n            },\n            revalidate: 1\n        };\n    } catch (err) {\n        return {\n            props: {\n                data: null\n            },\n            revalidate: 1\n        };\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUN5QixPQUFPO1lBQ3pCLENBQUM7UUFDSCxDQUFDO1FBQ0QsS0FBSyxDQUFDdkIsTUFBTSxHQUFHRyxTQUFTLENBQUNTLFVBQVU7UUFDbkMsS0FBSyxDQUFDYSxZQUFZLEdBQUcxQixNQUFNLENBQUNDLE1BQU07UUFDbEMsS0FBSyxDQUFDMEIsV0FBVyxHQUFHakMsV0FBVyxDQUFDZ0MsWUFBWTtRQUU1QyxNQUFNLENBQUMsQ0FBQztZQUFDRSxLQUFLLEVBQUUsQ0FBQztnQkFBQ3hFLElBQUksRUFBRXVFLFdBQVc7WUFBQyxDQUFDO1lBQUVFLFVBQVUsRUFBRSxDQUFDO1FBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUMsS0FBSyxFQUFFQyxHQUFHLEVBQUUsQ0FBQztRQUNiLE1BQU0sQ0FBQyxDQUFDO1lBQUNGLEtBQUssRUFBRSxDQUFDO2dCQUFDeEUsSUFBSSxFQUFFLElBQUk7WUFBQyxDQUFDO1lBQUV5RSxVQUFVLEVBQUUsQ0FBQztRQUFDLENBQUM7SUFDakQsQ0FBQztBQUVILENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aW1lYmFyLy4vcGFnZXMvaWQudHN4Pzg0YWMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGljYWwgZnJvbSAnbm9kZS1pY2FsJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50J1xuXG5pbnRlcmZhY2UgRmxpcEV2ZW50IHtcbiAgZGF5QmVnaW5zOiBudW1iZXJcbiAgZGF5RW5kczogbnVtYmVyXG4gIHN0YXJ0OiBudW1iZXJcbiAgZHVyYXRpb246IG51bWJlclxuICBzdW1tYXJ5OiBzdHJpbmcsXG4gIGNsYXNzTmFtZTogc3RyaW5nXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSWQoeyBkYXRhIH06IGFueSkge1xuXG4gIGNvbnN0IFtzZWxlY3RlZEV2ZW50U3RhdGUsIHNldFNlbGVjdGVkRXZlbnRTdGF0ZV0gPSB1c2VTdGF0ZSh7XG4gICAgc3VtbWFyeTogXCJcIixcbiAgICBjbGFzc05hbWU6IFwiXCIsXG4gICAgc3RhcnREYXRlOiAwXG4gIH0pXG5cbiAgY29uc3Qgc2VsZWN0RmxpcCA9IChlOiBGbGlwRXZlbnQpID0+IHtcbiAgICBjb25zdCBzdGFydERhdGUgPSBuZXcgRGF0ZShlLmRheUJlZ2lucylcbiAgICBjb25zb2xlLmxvZyhlLmRheUJlZ2lucylcbiAgICBzZXRTZWxlY3RlZEV2ZW50U3RhdGUoeyBjbGFzc05hbWU6IGUuY2xhc3NOYW1lLCBzdW1tYXJ5OiBlLnN1bW1hcnksIHN0YXJ0RGF0ZTogZS5kYXlCZWdpbnMgfSlcbiAgfVxuXG4gIGNvbnN0IEZsaXBDb21wb25lbnQgPSAoeyBmbGlwRXZlbnQgfTogYW55KSA9PiB7XG4gICAgcmV0dXJuIDxkaXYga2V5PXtmbGlwRXZlbnQuc3RhclRpbWV9IG9uQ2xpY2s9eygpID0+IHNlbGVjdEZsaXAoZmxpcEV2ZW50KX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17ZmxpcEV2ZW50LmNsYXNzTmFtZX0+XG4gICAgPC9kaXY+PC9kaXY+XG4gIH1cblxuICBjb25zdCBEYXlDb21wb25lbnQgPSAoeyBkYXkgfTogYW55KSA9PiB7XG4gICAgcmV0dXJuIDw+PGRpdiBjbGFzc05hbWU9XCJmbGV4IG15LTIwIG92ZXJmbG93LWhpZGRlblwiPntcbiAgICAgIGRheS5tYXAoKGZsaXBFdmVudDogRmxpcEV2ZW50KSA9PlxuICAgICAgICA8RmxpcENvbXBvbmVudCBrZXk9e2ZsaXBFdmVudC5zdGFydH0gIGZsaXBFdmVudD17ZmxpcEV2ZW50fSAvPlxuICAgICAgKX08L2Rpdj48Lz5cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJteC0xMFwiPlxuICAgICAge1xuICAgICAgT2JqZWN0LmVudHJpZXMoZGF0YSkubWFwKChba2V5LCBkYXldKSA9PiBcbiAgICAgIDw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmbGV4ICc+XG4gICAgICAgICAge25ldyBEYXRlKHBhcnNlSW50KGtleSkpLnRvTG9jYWxlRGF0ZVN0cmluZygpICsgJyAnfSBcbiAgICAgICAgICB7bmV3IERhdGUocGFyc2VJbnQoa2V5KSkudG9Mb2NhbGVTdHJpbmcoJ2VuLXVzJywgeyAgd2Vla2RheTogJ2xvbmcnIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgeyBzZWxlY3RlZEV2ZW50U3RhdGUuc3RhcnREYXRlID09PSBwYXJzZUludChrZXkpIFxuICAgICAgICAgICYmIHNlbGVjdGVkRXZlbnRTdGF0ZS5zdW1tYXJ5ICsgXCIgXCIgKyBzZWxlY3RlZEV2ZW50U3RhdGUuY2xhc3NOYW1lIFxuICAgICAgICB9XG4gICAgICAgIDxEYXlDb21wb25lbnQga2V5PXtkYXl9IGRheT17ZGF5fSAvPlxuICAgICAgPC8+KVxuICAgICAgfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IHVzZXJUWiA9ICdBbWVyaWNhL0RlbnZlcidcblxuZnVuY3Rpb24gcmV0dXJuQ29sb3Ioc3VtbWFyeTogc3RyaW5nKXtcbiAgc3dpdGNoIChzdW1tYXJ5KSB7XG4gICAgY2FzZSBcIkplcmtpblwiOiByZXR1cm4gXCJiZy1yZWQtNjAwXCJcbiAgICBjYXNlIFwiTGVhcm5pbmdcIjogcmV0dXJuIFwiYmcteWVsbG93LTYwMFwiXG4gICAgY2FzZSBcIkVhdGluZ1wiOiByZXR1cm4gXCJiZy1vcmFuZ2UtNjAwXCJcbiAgICBjYXNlIFwiU2xlZXBpbmdcIjogcmV0dXJuIFwiYmctcHVycGxlLTYwMFwiXG4gICAgY2FzZSBcIldlZWRcIjogcmV0dXJuIFwiYmctYW1iZXItNjAwXCJcbiAgICBjYXNlIFwiU29jaWFsaXppbmdcIjogcmV0dXJuIFwiYmctbGltZS02MDBcIlxuICAgIGNhc2UgXCJCZWVyXCI6IHJldHVybiBcImJnLXRlYWwtNjAwXCJcbiAgICBjYXNlIFwiV29ya2luZyBvdXRcIjogcmV0dXJuIFwiYmctYmx1ZS02MDBcIlxuICAgIGNhc2UgXCJJbnN0YS90di95b3V0dWJcIjogcmV0dXJuIFwiYmctcGluay02MDBcIlxuICAgIGNhc2UgXCJTaG9wL0Nob3Jlc1wiOiByZXR1cm4gXCJiZy1yb3NlLTYwMFwiXG4gICAgY2FzZSBcIlNraWluZ1wiOiByZXR1cm4gXCJiZy1jeWFuLTYwMFwiXG4gICAgY2FzZSBcIk5vcnNraVwiOiByZXR1cm4gXCJiZy1ibGFja1wiXG4gICAgZGVmYXVsdDpcbiAgICAgIFwiYmctd2hpdGVcIlxuICB9XG59XG5cbmZ1bmN0aW9uIHJldHVybldpZHRoKGR1cmF0aW9uOiBudW1iZXIpIHtcbiAgbGV0IG1pbnV0ZXMgPSBkdXJhdGlvbiAvIDYwMDAwXG4gIGxldCBwYXJ0MTgwID0gKG1pbnV0ZXMgLyA4KSAqIDEwXG4gIGxldCByb3VuZGVkNSA9IChNYXRoLnJvdW5kKHBhcnQxODAvNSkqNSkgLyAxMFxuICBjb25zdCBub3QwID0gcm91bmRlZDUgPT09IDAgPyByb3VuZGVkNSArIDAuNSA6IHJvdW5kZWQ1XG4gIHJldHVybiBgdy0ke25vdDB9Y2ggaC04YFxufVxuXG5mdW5jdGlvbiBncm91cEJ5RGF5cyhvYmplY3RBcnJheTogYW55KSB7XG4gIHJldHVybiBvYmplY3RBcnJheS5yZWR1Y2UoZnVuY3Rpb24gKGFjYzogYW55LCBvYmo6IGFueSkge1xuICAgIGxldCBrZXkgPSBvYmouZGF5QmVnaW5zXG4gICAgaWYgKCFhY2Nba2V5XSkge1xuICAgICAgYWNjW2tleV0gPSBbXVxuICAgIH1cbiAgICBhY2Nba2V5XS5wdXNoKG9iailcbiAgICByZXR1cm4gYWNjXG4gIH0sIHt9KVxufVxuXG5mdW5jdGlvbiBkdXJhdGUoc29ydGVkOiBhbnkpe1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNvcnRlZC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBzb3J0ZWRbaV0uZHVyYXRpb24gPSBzb3J0ZWRbaSArIDFdLnN0YXJ0IC0gc29ydGVkW2ldLnN0YXJ0XG4gICAgc29ydGVkW2ldLmNsYXNzTmFtZSA9IHJldHVybldpZHRoKHNvcnRlZFtpXS5kdXJhdGlvbikgKyBcIiBcIiArIHJldHVybkNvbG9yKHNvcnRlZFtpXS5zdW1tYXJ5KVxuICB9XG4gIHJldHVybiBzb3J0ZWRcbn1cblxuZnVuY3Rpb24gc29ydEZsaXBzKGFycjogYW55KXtcbiAgcmV0dXJuIGFyci5zb3J0KChhOiBGbGlwRXZlbnQsIGI6IEZsaXBFdmVudCkgPT4ge1xuICAgIGlmIChhLnN0YXJ0IDwgYi5zdGFydCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfSBlbHNlIGlmIChiLnN0YXJ0IDwgYS5zdGFydCkge1xuICAgICAgcmV0dXJuIDFcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gIH0pXG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFN0YXRpY1Byb3BzKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHBhcnNlZElDQUwgPSBhd2FpdCBpY2FsLmFzeW5jLmZyb21VUkwoJ2h0dHBzOi8vbmV3YXBpLnRpbWVmbGlwLmlvL2FwaS9pY3MvYWI3YTMyMDYtZGUyZi04Y2FlLTgzOGItNDViZDM4N2FhY2ZmJylcblxuICAgIGNvbnN0IGV2ZW50QXJyYXk6IGFueVtdID0gW11cblxuICAgIGZvciAoY29uc3QgY2FsRXZlbnQgb2YgT2JqZWN0LnZhbHVlcyhwYXJzZWRJQ0FMKSkge1xuXG4gICAgICBpZiAoY2FsRXZlbnQuc3RhcnQgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGNvbnN0IHV0Y0RhdGUgPSBuZXcgRGF0ZShjYWxFdmVudC5zdGFydClcbiAgICAgICAgY29uc3QgY29udmVydGVkVFogPSB1dGNEYXRlLnRvTG9jYWxlU3RyaW5nKFwiZW4tVVNcIiwgeyB0aW1lWm9uZTogdXNlclRaIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbnZlcnRlZFRaKVxuICAgICAgICBjb25zdCBjb252ZXJ0ZWREYXRlID0gbmV3IERhdGUoY29udmVydGVkVFopXG4gICAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IGNvbnZlcnRlZERhdGUuZ2V0VGltZSgpXG5cbiAgICAgICAgY29uc3QgZGF5QmVnaW5zID0gRGF0ZS5wYXJzZShjb252ZXJ0ZWREYXRlLnRvRGF0ZVN0cmluZygpKVxuXG5cbiAgICAgICAgbGV0IG5ld1NoaXQgPSB7XG4gICAgICAgICAgZGF5QmVnaW5zOiBkYXlCZWdpbnMsXG4gICAgICAgICAgZGF5RW5kczogZGF5QmVnaW5zICsgODY0MDAwMCxcbiAgICAgICAgICBzdGFydDogc3RhcnRUaW1lLFxuICAgICAgICAgIGR1cmF0aW9uOiBudWxsLFxuICAgICAgICAgIHN1bW1hcnk6IGNhbEV2ZW50LnN1bW1hcnksXG4gICAgICAgICAgY2xhc3NOYW1lOiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgZXZlbnRBcnJheS5wdXNoKG5ld1NoaXQpXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHNvcnRlZCA9IHNvcnRGbGlwcyhldmVudEFycmF5KVxuICAgIGNvbnN0IHdpdGhEdXJhdGlvbiA9IGR1cmF0ZShzb3J0ZWQpXG4gICAgY29uc3QgZ3JvdXBlZERheXMgPSBncm91cEJ5RGF5cyh3aXRoRHVyYXRpb24pXG5cbiAgICByZXR1cm4geyBwcm9wczogeyBkYXRhOiBncm91cGVkRGF5cyB9LCByZXZhbGlkYXRlOiAxIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIHsgcHJvcHM6IHsgZGF0YTogbnVsbCB9LCByZXZhbGlkYXRlOiAxIH1cbiAgfVxuXG59Il0sIm5hbWVzIjpbImljYWwiLCJ1c2VTdGF0ZSIsIklkIiwiZGF0YSIsInNlbGVjdGVkRXZlbnRTdGF0ZSIsInNldFNlbGVjdGVkRXZlbnRTdGF0ZSIsInN1bW1hcnkiLCJjbGFzc05hbWUiLCJzdGFydERhdGUiLCJzZWxlY3RGbGlwIiwiZSIsIkRhdGUiLCJkYXlCZWdpbnMiLCJjb25zb2xlIiwibG9nIiwiRmxpcENvbXBvbmVudCIsImZsaXBFdmVudCIsImRpdiIsIm9uQ2xpY2siLCJzdGFyVGltZSIsIkRheUNvbXBvbmVudCIsImRheSIsIm1hcCIsInN0YXJ0IiwiT2JqZWN0IiwiZW50cmllcyIsImtleSIsInBhcnNlSW50IiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwidG9Mb2NhbGVTdHJpbmciLCJ3ZWVrZGF5IiwidXNlclRaIiwicmV0dXJuQ29sb3IiLCJyZXR1cm5XaWR0aCIsImR1cmF0aW9uIiwibWludXRlcyIsInBhcnQxODAiLCJyb3VuZGVkNSIsIk1hdGgiLCJyb3VuZCIsIm5vdDAiLCJncm91cEJ5RGF5cyIsIm9iamVjdEFycmF5IiwicmVkdWNlIiwiYWNjIiwib2JqIiwicHVzaCIsImR1cmF0ZSIsInNvcnRlZCIsImkiLCJsZW5ndGgiLCJzb3J0RmxpcHMiLCJhcnIiLCJzb3J0IiwiYSIsImIiLCJnZXRTdGF0aWNQcm9wcyIsInBhcnNlZElDQUwiLCJhc3luYyIsImZyb21VUkwiLCJldmVudEFycmF5IiwiY2FsRXZlbnQiLCJ2YWx1ZXMiLCJ1dGNEYXRlIiwiY29udmVydGVkVFoiLCJ0aW1lWm9uZSIsImNvbnZlcnRlZERhdGUiLCJzdGFydFRpbWUiLCJnZXRUaW1lIiwicGFyc2UiLCJ0b0RhdGVTdHJpbmciLCJuZXdTaGl0IiwiZGF5RW5kcyIsIndpdGhEdXJhdGlvbiIsImdyb3VwZWREYXlzIiwicHJvcHMiLCJyZXZhbGlkYXRlIiwiZXJyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/id.tsx\n");

/***/ }),

/***/ "node-ical":
/*!****************************!*\
  !*** external "node-ical" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node-ical");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/id.tsx"));
module.exports = __webpack_exports__;

})();