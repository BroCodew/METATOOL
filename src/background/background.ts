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




const getDataServer = async () => {
    const response = await fetch("https://api.getadblockfree.com/account/list")
    const dataServer = await response.json();
    return dataServer;
}

chrome.runtime.onMessage.addListener(( request, sender, sendResponse)=>{
    if(request.action === "get_data_container"){
         (async()=>{
             try{
                const data = await getDataServer()
                 sendResponse({success: true, data: data})
             }catch (error) {
                 sendResponse({ success : false, error : error.message });
             }
        })();
         return true;
    }
})



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
    url : `chrome-extension://${chrome.runtime.id}/popup.html`,
    active : true
}));