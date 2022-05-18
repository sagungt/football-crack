import 'materialize-css'
import { createElementFromHTML, errorAlert, loadPage } from './utility.js'
import { getMatches } from '../api.js'
import { saveForLater } from '../db.js'

function loadMatches() {
    document.querySelector("#overlay").style.height = "100%";
    const selectId = document.querySelector("#competitionsSelect");
    M.FormSelect.init(selectId);
    const selectStatus = document.querySelector("#statusSelect");
    M.FormSelect.init(selectStatus);
    const options = {
        "showClearBtn": true,
        "format": "yyyy-mm-dd",
        "defaultDate": new Date(),
        "setDefaultDate": true
    }
    const startDatePicker = document.getElementById("startDate");
    M.Datepicker.init(startDatePicker, options);
    const endDatePicker = document.getElementById("endDate");
    M.Datepicker.init(endDatePicker, options);
    const selectIdM = M.FormSelect.getInstance(selectId)
    const selectStatusM = M.FormSelect.getInstance(selectStatus)
    const startDatePickerM = M.Datepicker.getInstance(startDatePicker)
    const endDatePickerM = M.Datepicker.getInstance(endDatePicker)
    document.getElementById("search").addEventListener("click", function (event) {
        search()
    });
    const content = createElementFromHTML(`
        <div class="card z-depth-3 rounded">
            <div class="card-content">
                <h4>Today Matches</h4>
                <div class="list"></div>
            </div>
        </div>
    `)
    document.querySelector(".content").appendChild(content);
    getMatches({
        type: "all",
        startDate: startDatePickerM.toString(),
        endDate: endDatePickerM.toString()
    })
        .then(function (response) {
            renderMatchList(response)
            document.querySelector("#overlay").style.height = "0%";
        })
        .catch(errorAlert)
    function search() {
        document.querySelector("#overlay").style.height = "100%";
        const header = document.querySelector(".content .card-content h4")
        header.innerHTML = "Custom Search"

        document.querySelector(".content .card-content .list").innerHTML = ""
        getMatches({
            type: "list",
            startDate: startDatePickerM.toString(),
            endDate: endDatePickerM.toString(),
            competitionIds: selectIdM.getSelectedValues(),
            filters: {
                status: selectStatusM.getSelectedValues()
            }
        })
            .then(function (response) {
                const filterDetail = createElementFromHTML(`
                <p>
                    Competitions: ${selectIdM.getSelectedValues().join()};<br>
                    Status: ${selectStatusM.getSelectedValues()};<br>
                    Start Date: ${startDatePickerM.toString()};<br>
                    End Date: ${endDatePickerM.toString()};<br>
                </p>
                `)
                document.querySelector(".content .card-content .list").appendChild(filterDetail)
                renderMatchList(response)
                header.appendChild(createElementFromHTML(`<span class="new badge blue" data-badge-caption="Match(s)">${response.count}</span>`))
                document.querySelector("#overlay").style.height = "0%";
            })
            .catch(errorAlert)
    }
    function renderMatchList(list) {
        if (list.count < 1) {
            const element = createElementFromHTML(`
                <h5>There's no Match.</h5>
            `)
            document.querySelector(".content .card-content .list").appendChild(element);
        } else {
            list.matches.forEach(match => {
                const element = createElementFromHTML(`
                    <div class="row list-item" id=${match.id}>
                        <div class="col s5 m5">${match.homeTeam.name}</div>
                        <div class="col s2 m2 center-align">VS</div>
                        <div class="col s5 m5 right-align">${match.awayTeam.name}</div>
                    </div>
                `)
                document.querySelector(".content .card-content .list").appendChild(element);
            })
            document.querySelectorAll(".content .card-content .row").forEach(elem => {
                elem.addEventListener("click", function (event) {
                    let id;
                    if (event.target !== elem) {
                        id = event.target.parentNode.getAttribute("id");
                    } else {
                        id = event.target.getAttribute("id");
                    }
                    loadPage("match-detail", id, loadMatchDetail)
                })
            })
        }
    }
}

function loadMatchDetail(id) {
    document.querySelector("#overlay").style.height = "100%";
    getMatches({
        type: "detail",
        matchId: id
    })
        .then(function (response) {
            const winnerBadge = `<button class="waves-effect waves-light btn rounded my-color">Winner</button>`
            const content = createElementFromHTML(`
                <div class="card z-depth-3 rounded">
                    <div class="card-content">
                        <div class="row flex">
                            <div class="col m5 s12 center-align">
                                <h4>Home Team</h4>
                                <h5>${response.match.homeTeam.name}</h5>
                                ${response.match.score.winner === "HOME_TEAM" ? winnerBadge : ""}
                            </div>
                            <div class="col m2 s12 center-align center-flex">VS</div>
                            <div class="col m5 s12 center-align">
                                <h4>Away Team</h4>
                                <h5>${response.match.awayTeam.name}</h5>
                                ${response.match.score.winner === "AWAY_TEAM" ? winnerBadge : ""}
                            </div>
                        </div>
                        <table>
                            <tbody>
                            <tr>
                                <th>Date</th>
                                <td>${new Date(response.match.utcDate)}</td>
                            </tr>
                            <tr>
                                <th>Competition</th>
                                <td>${response.match.competition.name}</td>
                            </tr>
                            <tr>
                                <th>Group</th>
                                <td>${response.match.group}</td>
                            </tr>
                            <tr>
                                <th>Stage</th>
                                <td>${response.match.stage}</td>
                            </tr>
                            <tr>
                                <th>Area</th>
                                <td>${response.match.competition.area.name}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>${response.match.status}</td>
                            </tr>
                            <tr>
                                <th>Venue</th>
                                <td>${response.match.venue}</td>
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
            if (response.match.referees.length > 0) {
                response.match.referees.forEach(item => {
                    const elem = createElementFromHTML(`
                    <li class="collection-item"><div>${item.name}</div></li>
                    `)
                    document.querySelector(".content .card-content ul").appendChild(elem)
                })
            }
            const button = document.querySelector(".fixed-action-btn")
            M.FloatingActionButton.init(button)
            // Save for later
            button.addEventListener("click", function () {
                saveForLater("match-detail", response.match)
            })
            document.querySelector("#overlay").style.height = "0%";
        })
        .catch(errorAlert)
}

export { loadMatches, loadMatchDetail }