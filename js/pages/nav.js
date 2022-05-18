import { loadPage } from './utility.js'
import { loadCompetitions } from './competitions.js'
import { loadHome } from './home.js'
import { loadStandings } from './standings.js'
import { loadMatches } from './matches.js'
import { loadSaved } from './saved.js'
import 'materialize-css'

function loadNav(type, file) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200) return;

            document.querySelectorAll(type).forEach(function (element) {
                element.innerHTML = xhttp.responseText;
            });

            document.querySelectorAll(`${type} a`).forEach(function (element) {
                element.addEventListener("click", function (event) {
                    const sidenav = document.querySelector(".sidenav");
                    M.Sidenav.getInstance(sidenav).close();

                    const page = event.target.getAttribute("href").substr(1);
                    if (page === "matches") loadPage(page, "", loadMatches)
                    else if (page === "home") loadPage(page, "", loadHome)
                    else if (page === "competitions") loadPage(page, "", loadCompetitions)
                    else if (page === "standings") loadPage(page, "", loadStandings)
                    else if (page === "saved") loadPage(page, "", loadSaved)
                })
            });
        }
    }
    xhttp.open("GET", file, true);
    xhttp.send();
}

export { loadNav }