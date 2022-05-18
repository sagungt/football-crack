import { getCompetitionData } from '../api.js'
import { createElementFromHTML, errorAlert, loadPage } from './utility.js'
import 'materialize-css'
import { saveForLater } from '../db.js'

function loadCompetitions() {
    document.querySelector("#overlay").style.height = "100%";
    getCompetitionData({ type: "all" })
        .then(function (response) {
            response.competitions.forEach(function (competition) {
                const element = createElementFromHTML(`
                <div class="col s12 m12">
                    <div class="card horizontal z-depth-3 rounded">
                        <div class="card-image valign-wrapper">
                            <img src="${competition.emblemUrl !== null ? competition.emblemUrl.replace(/^http:\/\//i, 'https://') : "/img/icons/icon-512x512.png"}" width="100px" alt="competition logo ${competition.name}">
                        </div>
                        <div class="card-stacked">
                            <div class="card-content">
                                <h4>${competition.name}</h4>
                                <p>${competition.area.name}</p>
                            </div>
                            <div class="card-action">
                                <span class="link" id="${competition.id}">See full detail</span>
                            </div>
                        </div>
                    </div>
                </div>
                `)
                document.querySelector("#competitions").appendChild(element);
            })
            document.querySelectorAll("#competitions .card-action span").forEach(elem => {
                elem.addEventListener("click", function (event) {
                    const id = event.target.getAttribute("id")
                    // const urlParams = new URLSearchParams(window.location.search);
                    // const id = urlParams.get("id");
                    loadPage("competition-detail", id, loadCompetitionDetail)
                })
            })
            document.querySelector("#overlay").style.height = "0%";
        })
        .catch(errorAlert)
}

function loadCompetitionDetail(id) {
    const button = document.querySelector(".fixed-action-btn")
    M.FloatingActionButton.init(button)
    document.querySelector("#overlay").style.height = "100%";
    getCompetitionData({
        type: "detail",
        id: id
    })
        .then(function (response) {
            const card = createElementFromHTML(`
            <div class="card z-depth-3 rounded">
                <div class="card-content">
                    <h4>${response.name}</h4>
                    <span>Area: ${response.area.name}</span><br>
                    <span>Code: ${response.code}</span><br>
                    <ul class="collection with-header">
                        <li class="collection-header"><h5>Current Season</h5></li>
                        <li class="collection-item"><div>Current Matchday: ${response.currentSeason.currentMatchday}</div></li>
                        <li class="collection-item"><div>Start Date: ${new Date(response.currentSeason.startDate)}</div></li>
                        <li class="collection-item"><div>End Date: ${new Date(response.currentSeason.endDate)}</div></li>
                        <li class="collection-item"><div>Winner: ${response.currentSeason.winner}</div></li>
                    </ul>
                </div>
            </div>
            `)
            document.querySelector(".content").appendChild(card);
            // Save for later
            button.addEventListener("click", function () {
                saveForLater("competition-detail", response)
            })
            return true
        })
        .then(function (done) {
            if (done) {
                getCompetitionData({
                    type: "teams",
                    id: id
                })
                    .then(function (response) {
                        const card = createElementFromHTML(`
                        <div class="card z-depth-3 rounded" id="team-list">
                            <div class="card-content">
                                <h4>Team List</h4>
                                <div class="list"></div>
                            </div>
                        </div>
                        `)
                        document.querySelector(".content").appendChild(card);
                        response.teams.forEach(team => {
                            const elem = createElementFromHTML(`
                            <div class="col s12 m12">
                                <div class="card horizontal rounded">
                                    <div class="card-image valign-wrapper">
                                        <img src="${team.crestUrl.replace(/^http:\/\//i, 'https://') || "/img/icons/icon-512x512.png"}" width="50px" alt="competition logo ${team.name}">
                                    </div>
                                    <div class="card-stacked">
                                        <div class="card-content">
                                            <h4>${team.name}</h4>
                                            <p>${team.area.name}</p>
                                        </div>
                                        <div class="card-action">
                                            <span class="link" id="${team.id}">See full detail</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `)
                            document.querySelector(".content #team-list .list").appendChild(elem)
                        })
                        document.querySelectorAll(".content #team-list .list .card-action span").forEach(elem => {
                            elem.addEventListener("click", function (event) {
                                const id = event.target.getAttribute("id")
                                loadPage("team-detail", id, loadTeamDetail)
                            })
                        })
                    })
            }
            document.querySelector("#overlay").style.height = "0%";
        })
        .catch(errorAlert)
}

function loadTeamDetail(id) {
    const button = document.querySelector(".fixed-action-btn")
    M.FloatingActionButton.init(button)
    document.querySelector("#overlay").style.height = "100%";
    getCompetitionData({
        type: "team-detail",
        id: id
    })
        .then(function (response) {
            const element = createElementFromHTML(`
            <div class="card z-depth-3 rounded">
                <div class="card-content">
                    <h4>${response.name}</h4>
                    <img width="100px" class="responsive-img" src="${response.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="${response.shortName}-logo"><br>
                    <ul class="collection with-header">
                        <li class="collection-header"><h5>Info</h5></li>
                        <li class="collection-item"><div>Founded: ${response.founded}</div></li>
                        <li class="collection-item"><div>Email: ${response.email}</div></li>
                        <li class="collection-item"><div>Address: ${response.address}</div></li>
                        <li class="collection-item"><div>Area: ${response.area.name}</div></li>
                        <li class="collection-item"><div>Short Name: ${response.shortName}</div></li>
                        <li class="collection-item"><div>Venue: ${response.venue}</div></li>
                        <li class="collection-item"><div>Website: <a href="${response.website}" target="_blank">${response.website}</a></div></li>
                    </ul>
                </div>
            </div>
            `)
            document.querySelector(".content").appendChild(element);
            button.addEventListener("click", function () {
                saveForLater("team-detail", response)
            })
            return response.squad;
        })
        .then(function (squad) {
            const table = createElementFromHTML(`
            <table>
                <thead>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Role</th>
                </thead>
                <tbody>
                </tbody>
            </table>
            `);
            document.querySelector(".content .card-content").appendChild(table);
            squad.forEach(item => {
                const template = document.createElement("template");
                const element = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.position}</td>
                    <td>${item.role}</td>
                </tr>
                `
                template.innerHTML = element
                document.querySelector(".content .card-content table tbody").appendChild(template.content.firstElementChild);
            })
            document.querySelector("#overlay").style.height = "0%";
        })
        .catch(errorAlert)
}

export { loadCompetitions, loadCompetitionDetail, loadTeamDetail }