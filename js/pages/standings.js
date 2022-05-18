import { createElementFromHTML, errorAlert } from './utility.js'
import 'materialize-css'
import { getCompetitionData } from '../api.js'

function loadStandings() {
    // Show loading overlay
    document.querySelector("#overlay").style.height = "100%";
    // Gather all available competition list
    getCompetitionData({ type: "all" })
        .then(function (response) {
            // List seperated into 2 array because API server limitation
            const competitionChunk = response.competitions.slice(0, 5);
            const hiddenChunk = response.competitions.slice(5, response.count);
            // First chunk to be showed
            competitionChunk.forEach(function (competition) {
                const element = createElementFromHTML(`
                <div class="card rounded" id="standings-${competition.id}">
                    <div class="card-content">
                    <span class="card-title">${competition.name}</span>
                        <ul class="collapsible">
                        </ul>
                    </div>
                </div>
                `)
                document.querySelector("#standings").appendChild(element);
            })
            // Second chunk to be hidden
            hiddenChunk.forEach(function (competition) {
                const element = createElementFromHTML(`
                <div class="card rounded hidden" id="standings-${competition.id}">
                    <div class="card-content">
                    <span class="card-title">${competition.name}</span>
                        <ul class="collapsible">

                        </ul>
                    </div>
                </div>
                `)
                document.querySelector("#standings").appendChild(element);
            })
            // Button for show all available standings data in all available competitions
            const moreButton = createElementFromHTML(`
                <div class="center" style="margin-bottom: 20px">
                    <button class="waves-effect waves-light btn-large my-color disabled">
                        <i class="material-icons left">expand_more</i> 
                        Load All
                    </button>
                </div>
                `)
            document.querySelector("#standings").appendChild(moreButton);
            // Initialize collapsible widget
            document.querySelectorAll(".collapsible").forEach(element => {
                M.Collapsible.init(element)
            })
            return Promise.resolve(response.competitions.map(data => data.id))
        })
        .then(function (ids) {
            // Seperate list due to limitation
            const firstChunk = 5
            const secondChunk = 7
            // Load function for reusable list chunk data gathering
            function load(chunk) {
                Promise.all(chunk.map(id => getCompetitionData({ type: "standings", id: id })))
                    .then(function (response) {
                        response.forEach(data => {
                            data.standings.forEach((standing, index) => {
                                const element = createElementFromHTML(`
                                <li>
                                    <div class="collapsible-header transparent">${standing.stage} ${standing.group !== null ? standing.group + " " : " "}(${standing.type})</div>
                                    <div class="collapsible-body">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Team</th>
                                                    <th class="tooltipped" data-position="top" data-tooltip="Games Played">GP</th>
                                                    <th class="tooltipped" data-position="top" data-tooltip="Points">PTS</th>
                                                    <th class="tooltipped" data-position="top" data-tooltip="Won">W</th>
                                                    <th class="tooltipped" data-position="top" data-tooltip="Draw">D</th>
                                                    <th class="tooltipped" data-position="top" data-tooltip="Lost">L</th>
                                                    <th class="tooltipped" data-position="top" data-tooltip="Goals For">GF</th>
                                                    <th class="tooltipped" data-position="top" data-tooltip="Goals Against">GA</th>
                                                    <th class="tooltipped" data-position="top" data-tooltip="Goal Difference">GD</th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </li>
                                `)
                                document.querySelector(`#standings-${data.competition.id} ul`).appendChild(element);
                                standing.table.forEach(list => {
                                    const template = document.createElement("template");
                                    const standingTable = `
                                    <tr>
                                        <td>
                                            <img width="50px" src="${list.team.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="${list.team.name}" class="circle responsive-img tooltiped" data-position="top" data-tooltip="${list.team.name}">
                                            ${list.team.name}
                                        </td>
                                        <td>${list.playedGames}</td>
                                        <td>${list.points}</td>
                                        <td>${list.won}</td>
                                        <td>${list.draw}</td>
                                        <td>${list.lost}</td>
                                        <td>${list.goalsFor}</td>
                                        <td>${list.goalsAgainst}</td>
                                        <td>${list.goalDifference}</td>
                                    </tr>
                                    `;
                                    template.innerHTML = standingTable;
                                    document.querySelector(`#standings-${data.competition.id} li:nth-child(${index + 1}) tbody`).appendChild(template.content.firstElementChild)
                                })
                            })
                        })
                    })

            }
            load(firstChunk);
            // List all button disabled
            // API Cooldown counter to avoid error while fetch to API
            let timeLeft = 65;
            window.apiCooldown = setInterval(() => {
                if (timeLeft <= 0) {
                    document.querySelector("#standings button").classList.remove("disabled");
                    document.querySelector("#standings button").innerHTML = `
                        <i class="material-icons left">expand_more</i> 
                        Load All
                        `
                    clearInterval(window.apiCooldown);
                }
                document.querySelector("#standings button").innerHTML = `
                <i class="material-icons left">expand_more</i> 
                Load All (${timeLeft}s)
                `
                timeLeft -= 1;
            }, 1000);
            // Add listener to button to expand all list
            const button = document.querySelector("#standings button")
            button.addEventListener("click", function () {
                secondChunk.forEach(list => {
                    document.querySelector(`#standings-${list}`).classList.remove("hidden");
                })
                load(secondChunk);
                button.style.display = "none"
            })
            // Hidden loading overlay
            document.querySelector("#overlay").style.height = "0%";
        })
        .catch(errorAlert)
}

export { loadStandings }