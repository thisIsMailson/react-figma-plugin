/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/messages.ts":
/*!*************************!*\
  !*** ./src/messages.ts ***!
  \*************************/
/*! exports provided: UPDATE_PLUGIN_DATA, SAVE_AUTH, FILL_RESULTS, FRAME_ASSETS_ZIP */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_PLUGIN_DATA", function() { return UPDATE_PLUGIN_DATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SAVE_AUTH", function() { return SAVE_AUTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FILL_RESULTS", function() { return FILL_RESULTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FRAME_ASSETS_ZIP", function() { return FRAME_ASSETS_ZIP; });
const UPDATE_PLUGIN_DATA = "UPDATE_PLUGIN_DATA";
const SAVE_AUTH = `SAVE_AUTH`;
const FILL_RESULTS = `FILL_RESULTS`;
const FRAME_ASSETS_ZIP = `FRAME_ASSETS_ZIP`;


/***/ }),

/***/ "./src/plugin.ts":
/*!***********************!*\
  !*** ./src/plugin.ts ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _messages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./messages */ "./src/messages.ts");

const { selection } = figma.currentPage;
console.log('selection', selection);
async function main() {
    figma.showUI(__html__, { width: 320, height: 250 });
    const allFrameNodes = await getNodes(selection);
    figma.ui.postMessage({
        type: _messages__WEBPACK_IMPORTED_MODULE_0__["FRAME_ASSETS_ZIP"],
        payload: allFrameNodes,
    });
    figma.ui.onmessage = (msg) => {
        console.log('msg', msg);
    };
}
function hasValidSelection(nodes) {
    return !(!nodes || nodes.length === 0);
}
const getNodes = async (nodes) => {
    if (!hasValidSelection(nodes))
        return Promise.resolve('Nothing selected for export');
    let exportableBytes = [];
    for (let parentNode of nodes) {
        // Use Promise.all() to parallelize export operations for each child node
        await Promise.all(parentNode.children.map(async (node) => {
            let { name: parentNodeName } = parentNode; // This will be used to name the folders accordingly
            let { name, exportSettings: nodeExportSettings } = node;
            console.log('node sett', name);
            if (nodeExportSettings.length === 0) {
                nodeExportSettings = [
                    {
                        format: 'PNG',
                        suffix: '',
                        constraint: { type: 'SCALE', value: 1 },
                        contentsOnly: true,
                    },
                ];
            }
            nodeExportSettings.forEach((setting) => {
                // Remove leading space and prefix
                const cleanedName = name.trim().replace(/^@\d+\s*/, '');
                // Check if "name" starts with "@1" or "@2"
                if (name.startsWith('@1')) {
                    setting.constraint.value = 0.5;
                }
                else if (name.startsWith('@2')) {
                    setting.constraint.value = 1;
                }
            });
            await Promise.all(nodeExportSettings.map(async (setting) => {
                let defaultSetting = setting;
                const bytes = await node.exportAsync(defaultSetting);
                exportableBytes.push({
                    parentNodeName,
                    name,
                    setting,
                    bytes,
                });
            }));
        }));
    }
    console.log('exportable nodes =>', exportableBytes);
    return exportableBytes;
};
main();


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lc3NhZ2VzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQU87QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNIUDtBQUFBO0FBQXVDO0FBQ3ZDLE9BQU8sWUFBWTtBQUNuQjtBQUNBO0FBQ0EsNEJBQTRCLDBCQUEwQjtBQUN0RDtBQUNBO0FBQ0EsY0FBYywwREFBeUI7QUFDdkM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQix1QkFBdUIsY0FBYztBQUN0RCxpQkFBaUIsMkNBQTJDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQywwQkFBMEI7QUFDL0Q7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi50c1wiKTtcbiIsImV4cG9ydCBjb25zdCBVUERBVEVfUExVR0lOX0RBVEEgPSBcIlVQREFURV9QTFVHSU5fREFUQVwiO1xuZXhwb3J0IGNvbnN0IFNBVkVfQVVUSCA9IGBTQVZFX0FVVEhgO1xuZXhwb3J0IGNvbnN0IEZJTExfUkVTVUxUUyA9IGBGSUxMX1JFU1VMVFNgO1xuZXhwb3J0IGNvbnN0IEZSQU1FX0FTU0VUU19aSVAgPSBgRlJBTUVfQVNTRVRTX1pJUGA7XG4iLCJpbXBvcnQgKiBhcyBtZXNzYWdlcyBmcm9tICcuL21lc3NhZ2VzJztcbmNvbnN0IHsgc2VsZWN0aW9uIH0gPSBmaWdtYS5jdXJyZW50UGFnZTtcbmNvbnNvbGUubG9nKCdzZWxlY3Rpb24nLCBzZWxlY3Rpb24pO1xuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgICBmaWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDMyMCwgaGVpZ2h0OiAyNTAgfSk7XG4gICAgY29uc3QgYWxsRnJhbWVOb2RlcyA9IGF3YWl0IGdldE5vZGVzKHNlbGVjdGlvbik7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiBtZXNzYWdlcy5GUkFNRV9BU1NFVFNfWklQLFxuICAgICAgICBwYXlsb2FkOiBhbGxGcmFtZU5vZGVzLFxuICAgIH0pO1xuICAgIGZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ21zZycsIG1zZyk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGhhc1ZhbGlkU2VsZWN0aW9uKG5vZGVzKSB7XG4gICAgcmV0dXJuICEoIW5vZGVzIHx8IG5vZGVzLmxlbmd0aCA9PT0gMCk7XG59XG5jb25zdCBnZXROb2RlcyA9IGFzeW5jIChub2RlcykgPT4ge1xuICAgIGlmICghaGFzVmFsaWRTZWxlY3Rpb24obm9kZXMpKVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCdOb3RoaW5nIHNlbGVjdGVkIGZvciBleHBvcnQnKTtcbiAgICBsZXQgZXhwb3J0YWJsZUJ5dGVzID0gW107XG4gICAgZm9yIChsZXQgcGFyZW50Tm9kZSBvZiBub2Rlcykge1xuICAgICAgICAvLyBVc2UgUHJvbWlzZS5hbGwoKSB0byBwYXJhbGxlbGl6ZSBleHBvcnQgb3BlcmF0aW9ucyBmb3IgZWFjaCBjaGlsZCBub2RlXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHBhcmVudE5vZGUuY2hpbGRyZW4ubWFwKGFzeW5jIChub2RlKSA9PiB7XG4gICAgICAgICAgICBsZXQgeyBuYW1lOiBwYXJlbnROb2RlTmFtZSB9ID0gcGFyZW50Tm9kZTsgLy8gVGhpcyB3aWxsIGJlIHVzZWQgdG8gbmFtZSB0aGUgZm9sZGVycyBhY2NvcmRpbmdseVxuICAgICAgICAgICAgbGV0IHsgbmFtZSwgZXhwb3J0U2V0dGluZ3M6IG5vZGVFeHBvcnRTZXR0aW5ncyB9ID0gbm9kZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub2RlIHNldHQnLCBuYW1lKTtcbiAgICAgICAgICAgIGlmIChub2RlRXhwb3J0U2V0dGluZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbm9kZUV4cG9ydFNldHRpbmdzID0gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6ICdQTkcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VmZml4OiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IHsgdHlwZTogJ1NDQUxFJywgdmFsdWU6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzT25seTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZUV4cG9ydFNldHRpbmdzLmZvckVhY2goKHNldHRpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgbGVhZGluZyBzcGFjZSBhbmQgcHJlZml4XG4gICAgICAgICAgICAgICAgY29uc3QgY2xlYW5lZE5hbWUgPSBuYW1lLnRyaW0oKS5yZXBsYWNlKC9eQFxcZCtcXHMqLywgJycpO1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIFwibmFtZVwiIHN0YXJ0cyB3aXRoIFwiQDFcIiBvciBcIkAyXCJcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdAMScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmcuY29uc3RyYWludC52YWx1ZSA9IDAuNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobmFtZS5zdGFydHNXaXRoKCdAMicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmcuY29uc3RyYWludC52YWx1ZSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChub2RlRXhwb3J0U2V0dGluZ3MubWFwKGFzeW5jIChzZXR0aW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRlZmF1bHRTZXR0aW5nID0gc2V0dGluZztcbiAgICAgICAgICAgICAgICBjb25zdCBieXRlcyA9IGF3YWl0IG5vZGUuZXhwb3J0QXN5bmMoZGVmYXVsdFNldHRpbmcpO1xuICAgICAgICAgICAgICAgIGV4cG9ydGFibGVCeXRlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmcsXG4gICAgICAgICAgICAgICAgICAgIGJ5dGVzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdleHBvcnRhYmxlIG5vZGVzID0+JywgZXhwb3J0YWJsZUJ5dGVzKTtcbiAgICByZXR1cm4gZXhwb3J0YWJsZUJ5dGVzO1xufTtcbm1haW4oKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=