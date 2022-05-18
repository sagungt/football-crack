import "materialize-css"
import "materialize-css/dist/css/materialize.min.css"
import "../css/style.css"
import { loadNav } from './pages/nav.js'
import { loadPage } from './pages/utility.js'
import { loadHome } from './pages/home.js'
import { loadCompetitions, loadCompetitionDetail, loadTeamDetail } from './pages/competitions.js'
import { loadStandings } from './pages/standings.js'
import { loadMatches, loadMatchDetail } from './pages/matches.js'
import { loadSaved } from "./pages/saved.js"

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(function () {
                console.log("ServiceWorker registered");
            })
            .catch(function (e) {
                console.log(e);
            });
    });
    requestPermission()
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector(".sidenav");
    M.Sidenav.init(nav);

    loadNav(".sidenav", "pages/components/sidenavbar.html");
    loadNav(".topnav", "pages/components/topnavbar.html");

    const path = window.location.pathname.substr(1);
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = parseInt(params.get("id"));
    let page = ""
    if (path.startsWith("#")) page = window.location.hash.substr(1);
    else if (page === "") page = "home";
    else page = path;
    switch (page) {
        case "home":
            loadPage(page, "", loadHome)
            break;
        case "matches":
            loadPage(page, "", loadMatches)
            break;
        case "competitions":
            loadPage(page, "", loadCompetitions)
            break;
        case "standings":
            loadPage(page, "", loadStandings)
            break;
        case "match-detail":
            loadPage(page, id, loadMatchDetail)
            break;
        case "competition-detail":
            loadPage(page, id, loadCompetitionDetail)
            break;
        case "team-detail":
            loadPage(page, id, loadTeamDetail)
            break;
        case "saved":
            loadPage(page, "", loadSaved)
            break;
        default:
            break;
    }
    document.querySelectorAll(".tooltipped").forEach(elem => {
        M.Tooltip.init(elem);
    })
})

function requestPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (result) {
            if (result === "denied") {
                console.log("Notification not allowed.");
                return;
            } else if (result === "default") {
                console.error("Notification dialog closed.");
                return;
            }

            if ('PushManager' in window) {
                navigator.serviceWorker.getRegistration().then(function (registration) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array("BIWCllAI74dsvftj79UWoQ5jc6EhQWxvB_Vtk8s46GoDMr__R28FyPKSF8WPzm5p20_g_zxwc4WNb_h6gjD28_c")
                    }).then(function (subscribe) {
                        console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                        console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                            null, new Uint8Array(subscribe.getKey('p256dh')))));
                        console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                            null, new Uint8Array(subscribe.getKey('auth')))));
                    }).catch(function (e) {
                        console.error('Tidak dapat melakukan subscribe ', e.message);
                    });
                });
            }
        });
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}