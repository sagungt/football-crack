import 'materialize-css'
import { createElementFromHTML, errorAlert, loadPage } from './utility.js'
import { getAll, getById, deleteById } from '../db.js'

function loadSaved() {
    getAll()
        .then(function (response) {
            response.forEach((type, index) => {
                const key = Object.keys(type)[0]
                const element = createElementFromHTML(`
                <div id="${key}">
                    <h4>${key === "match-detail" ? "Matches" : (key === "competition-detail" ? "Competition" : "Team")}</h4>
                </div>
                `)
                document.querySelector("#saved-content").appendChild(element);
                switch (key) {
                    case "match-detail":
                        type[key]
                            .then(response => {
                                if (response.length == 0) {
                                    const element = createElementFromHTML(`
                                    <div class="row">
                                        <h5>There's no data yet</h5>
                                    </div>
                                    `)
                                    document.querySelector(`#saved-content #${key}`).appendChild(element)
                                } else {
                                    response.forEach(item => {
                                        const element = createElementFromHTML(`
                                        <div class="row">
                                            <div class="col s12 m12">
                                            <div class="card z-depth-3">
                                                <div class="card-content">
                                                <span class="card-title">${item.competition.name}</span>
                                                <div class="row">
                                                    <div class="col s5 m5">${item.homeTeam.name}</div>
                                                    <div class="col s2 m2 center-align">VS</div>
                                                    <div class="col s5 m5 right-align">${item.awayTeam.name}</div>
                                                </div>
                                                </div>
                                                <div class="card-action">
                                                    <span class="saved-link link" id="${item.id}">See full detail</span>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        `)
                                        document.querySelector(`#saved-content #${key}`).appendChild(element)
                                    })
                                }
                                return true
                            })
                            .then(function () {
                                document.querySelectorAll(`#saved-content #${key} .saved-link`).forEach(item => {
                                    item.addEventListener("click", function (e) {
                                        const id = e.target.getAttribute("id")
                                        loadPage("match-detail", id, loadSavedMatchDetail, true)
                                    })
                                })
                            })
                        break;
                    case "competition-detail":
                        type[key]
                            .then(response => {
                                if (response.length == 0) {
                                    const element = createElementFromHTML(`
                                    <div class="row">
                                        <h5>There's no data yet</h5>
                                    </div>
                                    `)
                                    document.querySelector(`#saved-content #${key}`).appendChild(element)
                                } else {
                                    response.forEach(item => {
                                        const element = createElementFromHTML(`
                                        <div class="col s12 m12">
                                            <div class="card horizontal z-depth-3 rounded">
                                                <div class="card-image valign-wrapper">
                                                    <img src="${item.emblemUrl !== null ? item.emblemUrl.replace(/^http:\/\//i, 'https://') : "/img/icons/icon-512x512.png"}" width="100px" alt="competition logo ${item.name}">
                                                </div>
                                                <div class="card-stacked">
                                                    <div class="card-content">
                                                        <h4>${item.name}</h4>
                                                        <p>${item.area.name}</p>
                                                    </div>
                                                    <div class="card-action">
                                                        <span class="saved-link link" id="${item.id}">See full detail</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        `)
                                        document.querySelector(`#saved-content #${key}`).appendChild(element)
                                    })
                                }
                                return true
                            })
                            .then(function () {
                                document.querySelectorAll(`#saved-content #${key} .saved-link`).forEach(item => {
                                    item.addEventListener("click", function (e) {
                                        const id = e.target.getAttribute("id")
                                        loadPage("competition-detail", id, loadSavedCompetitionDetail, true)
                                    })
                                })
                            })
                        break;
                    case "team-detail":
                        type[key]
                            .then(response => {
                                if (response.length == 0) {
                                    const element = createElementFromHTML(`
                                    <div class="row">
                                        <h5>There's no data yet</h5>
                                    </div>
                                    `)
                                    document.querySelector(`#saved-content #${key}`).appendChild(element)
                                } else {
                                    response.forEach(item => {
                                        const element = createElementFromHTML(`
                                        <div class="col s12 m12">
                                            <div class="card horizontal rounded">
                                                <div class="card-image valign-wrapper">
                                                    <img src="${item.crestUrl.replace(/^http:\/\//i, 'https://') || "/img/icons/icon-512x512.png"}" width="50px" alt="competition logo ${item.name}">
                                                </div>
                                                <div class="card-stacked">
                                                    <div class="card-content">
                                                        <h4>${item.name}</h4>
                                                        <p>${item.area.name}</p>
                                                    </div>
                                                    <div class="card-action">
                                                        <span class="saved-link link" id="${item.id}">See full detail</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        `)
                                        document.querySelector(`#saved-content #${key}`).appendChild(element)
                                    })
                                }
                                return true;
                            })
                            .then(function () {
                                document.querySelectorAll(`#saved-content #${key} .saved-link`).forEach(item => {
                                    item.addEventListener("click", function (e) {
                                        const id = e.target.getAttribute("id")
                                        loadPage("team-detail", id, loadSavedTeamDetail, true)
                                    })
                                })
                            })
                        break;
                    default:
                        break;
                }
            })
        })
        .catch(errorAlert)
}

function loadSavedCompetitionDetail(id) {
    getById("competition-detail", id)
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
            // Delete
            const buttonStyle = document.querySelector(".fixed-action-btn a")
            buttonStyle.classList.remove("green")
            buttonStyle.classList.add("red")
            document.querySelector(".fixed-action-btn a i").innerHTML = "delete"
            const button = document.querySelector(".fixed-action-btn")
            M.FloatingActionButton.init(button)
            button.addEventListener("click", function () {
                deleteById("competition-detail", id)
                loadPage("saved", "", loadSaved)
            })
        })
}

function loadSavedMatchDetail(id) {
    getById("match-detail", id)
        .then(response => {
            const winnerBadge = `<button class="waves-effect waves-light btn rounded my-color">Winner</button>`
            const content = createElementFromHTML(`
                <div class="card z-depth-3 rounded">
                    <div class="card-content">
                        <div class="row flex">
                            <div class="col m5 s12 center-align">
                                <h4>Home Team</h4>
                                <h5>${response.homeTeam.name}</h5>
                                ${response.score.winner === "HOME_TEAM" ? winnerBadge : ""}
                            </div>
                            <div class="col m2 s12 center-align center-flex">VS</div>
                            <div class="col m5 s12 center-align">
                                <h4>Away Team</h4>
                                <h5>${response.awayTeam.name}</h5>
                                ${response.score.winner === "AWAY_TEAM" ? winnerBadge : ""}
                            </div>
                        </div>
                        <table>
                            <tbody>
                            <tr>
                                <th>Date</th>
                                <td>${new Date(response.utcDate)}</td>
                            </tr>
                            <tr>
                                <th>Competition</th>
                                <td>${response.competition.name}</td>
                            </tr>
                            <tr>
                                <th>Group</th>
                                <td>${response.group}</td>
                            </tr>
                            <tr>
                                <th>Stage</th>
                                <td>${response.stage}</td>
                            </tr>
                            <tr>
                                <th>Area</th>
                                <td>${response.competition.area.name}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>${response.status}</td>
                            </tr>
                            <tr>
                                <th>Venue</th>
                                <td>${response.venue}</td>
                            </tr>
                            </tbody>
                        </table>
                        <ul class="collection with-header">
                            <li class="collection-header"><h5>Referees</h5></li>
                        </ul>
                    </div>
                </div>
            `)
            document.querySelector(".content").appendChild(content);
            if (response.referees.length > 0) {
                response.referees.forEach(item => {
                    const elem = createElementFromHTML(`
                    <li class="collection-item"><div>${item.name}</div></li>
                    `)
                    document.querySelector(".content .card-content ul").appendChild(elem)
                })
            }
            // Delete
            const buttonStyle = document.querySelector(".fixed-action-btn a")
            buttonStyle.classList.remove("green")
            buttonStyle.classList.add("red")
            document.querySelector(".fixed-action-btn a i").innerHTML = "delete"
            const button = document.querySelector(".fixed-action-btn")
            M.FloatingActionButton.init(button)
            button.addEventListener("click", function () {
                deleteById("match-detail", id)
                loadPage("saved", "", loadSaved)
            })
        })
}

function loadSavedTeamDetail(id) {
    getById("team-detail", id)
        .then(response => {
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
            document.querySelector(".content").appendChild(element)
            // delete
            const buttonStyle = document.querySelector(".fixed-action-btn a")
            buttonStyle.classList.remove("green")
            buttonStyle.classList.add("red")
            document.querySelector(".fixed-action-btn a i").innerHTML = "delete"
            const button = document.querySelector(".fixed-action-btn")
            M.FloatingActionButton.init(button)
            button.addEventListener("click", function () {
                deleteById("team-detail", id)
                loadPage("saved", "", loadSaved)
            })
        })
}

export { loadSaved }