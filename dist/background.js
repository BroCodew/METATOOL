/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/background.ts":
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
/***/ (function() {

// /*global chrome*/
// class HW {
//     static async send( { url, method, body = null, headers = {} } ) {
//         return await (await fetch(url, { method, body, headers })).text().then(( responseText ) => responseText);
//     }
// }
//
// class FW {
//     static async generateToken() {
//         try {
//             let adAccountId = null;
//
//             let response = await HW.send({
//                 method : "GET",
//                 url : "https://adsmanager.facebook.com/adsmanager/onboarding"
//             });
//
//             if (response && response.indexOf('adAccountId: \\"') > 0) {
//                 adAccountId = response.split('adAccountId: \\"')[1].split('\\"')[0];
//             } else {
//                 response = await HW.send({
//                     method : "GET",
//                     url : "https://adsmanager.facebook.com/adsmanager/"
//                 });
//                 if (response && response.indexOf('adAccountId: \\"') > 0) {
//                     adAccountId = response.split('adAccountId: \\"')[1].split('\\"')[0];
//                 }
//             }
//             if (!adAccountId) {
//                 return {
//                     token : "ERR",
//                     adAccountId : null
//                 };
//             }
//             response = await HW.send({
//                 method : "GET",
//                 url : `https://adsmanager.facebook.com/adsmanager/onboarding?act=${adAccountId}&breakdown_regrouping=0`
//             });
//
//             let token = null;
//
//             if (response && response.indexOf("window.__accessToken") > 0) {
//                 token = response.split('window.__accessToken="')[1].split('"')[0];
//             } else {
//                 response = await HW.send({
//                     method : "GET",
//                     url : `https://adsmanager.facebook.com/adsmanager?act=${adAccountId}&breakdown_regrouping=1`
//                 });
//
//                 if (response && response.indexOf("window.__accessToken") > 0) {
//                     token = response.split('window.__accessToken="')[1].split('"')[0];
//                 }
//             }
//             if (!token) {
//                 token = "ERR";
//                 adAccountId = null;
//             }
//             return {
//                 token,
//                 adAccountId
//             };
//         } catch (error) {
//             return {
//                 token : "ERR",
//                 adAccountId : null
//             };
//         }
//     }
// }
//
//
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getDataServer = () => __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch("https://api.getadblockfree.com/account/list");
    const dataServer = yield response.json();
    return dataServer;
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "get_data_container") {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield getDataServer();
                sendResponse({ success: true, data: data });
            }
            catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        }))();
        return true;
    }
});
// chrome.runtime.onMessage.addListener(( request, sender, sendResponse ) => {
//     if (request.action === 'login_request') {
//         (async () => {
//             try {
//                 const key = 'myKey';
//                 chrome.storage.local.get([key], ( result ) => {
//                     const storedData = result[key];
//                     if (storedData) {
//                         sendResponse({ success : true, ...storedData });
//                     } else {
//                         try {
//                             (async () => {
//                                 const token = await FW.generateToken();
//                                 const accountId = await getAccountID(token.token);
//                                 const data = await getDataAccount(token.token);
//                                 const dataPage = await getDataPageSale(token.token);
//                                 const dataBM = await getDataBM(token.token);
//                                 const tokenFacebook = await processToken();
//                                 const value = { token, accountId, data, dataPage, dataBM, tokenFacebook };
//                                 chrome.storage.local.set({ [key] : value }, () => {
//                                     sendResponse({ success : true, ...value });
//                                 });
//                             })();
//                         } catch (error) {
//                             sendResponse({ success : false, error : error.message });
//                         }
//                     }
//                 })
//             } catch (error) {
//                 sendResponse({ success : false, error : error.message });
//             }
//         })();
//         return true;
//     }
// });
// chrome.runtime.onMessage.addListener(
//     function ( request, sender, sendResponse ) {
//         if (request.action === 'reload_storage') {
//             chrome.storage.local.clear(function () {
//                 console.log("Local storage cleared.");
//             });
//         }
//     }
// );
//
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.alarms.create('refreshToken', { periodInMinutes : 2 * 60 });
// });
// chrome.alarms.onAlarm.addListener(async ( alarm ) => {
//     if (alarm.name === 'refreshToken') {
//         const key = 'myKey';
//         const token = await FW.generateToken();
//         console.log('refreshToken', token);
//         const accountId = await getAccountID(token.token);
//         const data = await getDataAccount(token.token);
//         const dataPage = await getDataPageSale(token.token);
//         const dataBM = await getDataBM(token.token);
//
//         const value = { token, accountId, data, dataPage, dataBM };
//         console.log('valuerefreshToken', value);
//
//         chrome.storage.local.set({ [key] : value }, () => {
//             console.log('ValueAlarm:', value);
//         });
//     }
// });
chrome.action.onClicked.addListener(() => chrome.tabs.create({
    url: `chrome-extension://${chrome.runtime.id}/popup.html`,
    active: true
}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/background/background.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=background.js.map