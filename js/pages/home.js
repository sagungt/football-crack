import { getDate, createElementFromHTML, errorAlert } from './utility.js'
import { getMatches } from '../api.js'
import 'materialize-css'

function loadHome() {
    // Recent Matches
    const dates = getDate()
    let count = [];
    // Show loading overlay
    document.querySelector("#overlay").style.height = "100%";
    Promise.all(Object.keys(dates).map(day => getMatches({ type: "all", startDate: dates[day], endDate: dates[day] })))
        .then(function (response) {
            response.forEach(function (item, index) {
                let day;
                index === 0 ? day = "yesterday"
                    : index === 1 ? day = "today"
                        : day = "tomorrow";
                const badge = createElementFromHTML(`<span class="new badge blue" data-badge-caption="Match(s)">${item.count}</span>`)
                document.querySelector(`.tab a[href*=${day}]`).appendChild(badge)
                if (item.count == 0) {
                    const element = createElementFromHTML(`
                        <div class="row">
                            <h5>There's no match</h5>
                        </div>
                        `);
                    document.querySelector(`#${day}`).append(element)
                } else {
                    item.matches.forEach(function (item) {
                        const element = createElementFromHTML(`
                        <div class="row">
                            <h5>${item.competition.name}</h5>
                            <div class="col m5 s12 center-align">${item.homeTeam.name}</div>
                            <div class="col m2 s12 center-align">
                                <h5>VS</h5>
                            </div>
                            <div class="col m5 s12 center-align">${item.awayTeam.name}</div>
                        </div>
                        `);
                        document.querySelector(`#${day}`).append(element)
                    })
                }
                count.push(item.count)
            })
            const max = count.indexOf(Math.max(...count));
            let el;
            if (max === 0) el = "yesterday"
            else if (max === 1) el = "today"
            else if (max === 2) el = "tomorrow"
            const tab = document.querySelector("#recent-matches .tabs")
            M.Tabs.init(tab, { swipeable: true });
            const top = document.querySelector(`#${el}.carousel-item .row:first-child`)
            const bottom = document.querySelector(`#${el}.carousel-item .row:last-child`)
            const height = bottom.getBoundingClientRect().bottom - top.getBoundingClientRect().top + 25;
            document.querySelector(".tabs-content").style.height = `${parseInt(height)}px`;
            document.querySelector("#overlay").style.height = "0%";
        })
        .catch(errorAlert)
    // Top Competitions disabled during api limit
    // getCompetitionData({ type: "all" })
    //     .then(function (response) {
    //         let competitionIds = [];
    //         // Get All Available Competitions
    //         // response.competitions.forEach(function (competition, index) {
    //         //     const element = createElementFromHTML(`<li class="tab"><a class="black-text active" href="#${competition.code}">${competition.name}</a></li>`)
    //         //     document.querySelector("#highlight ul").appendChild(element);
    //         //     competitionIds.push(competition.id)
    //         // })
    //         // Get only 4 Competition
    //         for (let i = 0; i < 4; i++) {
    //             const element = createElementFromHTML(`<li class="tab"><a class="black-text active" href="#${response.competitions[i].code}">${response.competitions[i].name}</a></li>`)
    //             document.querySelector("#highlight ul").appendChild(element);
    //             competitionIds.push(response.competitions[i].id)
    //         }
    //         return Promise.resolve(competitionIds)
    //     })
    //     .then(function (ids) {
    //         // Fetch all competitions information
    //         Promise.all(ids.map(id => getCompetitionData({ type: "standings", id: id })))
    //             .then(function (response) {
    //                 let list = []
    //                 response.forEach(function (standings, index) {
    //                     const standingCollapsible = createElementFromHTML(`
    //                     <div class="content" id="${standings.competition.code}">
    //                         <h5>Standings</h5>
    //                         <ul class="collapsible"></ul>
    //                         <h5>Scorers</h5>
    //                         <table class="scorers">
    //                             <thead>
    //                                 <tr>
    //                                     <th>Player</th>
    //                                     <th>Team</th>
    //                                     <th>Goals</th>
    //                                 </tr>
    //                             </thead>
    //                             <tbody></tbody>
    //                         </table>
    //                     </div>
    //                     `);
    //                     document.querySelector("#highlightContent").appendChild(standingCollapsible);
    //                     document.querySelectorAll(".collapsible").forEach(function (element) {
    //                         M.Collapsible.init(element);
    //                     })
    //                     list.push({ id: standings.competition.id, code: standings.competition.code, standings: [] });
    //                     // Show only 3 list of stage (1 stage: TOTAL, HOME, AWAY)
    //                     for (let i = 0; i < 3; i++) {
    //                         const standingContent = createElementFromHTML(`
    //                         <li>
    //                             <div class="collapsible-header transparent">${standings.standings[i].stage}-${standings.standings[i].type}</div>
    //                             <div class="collapsible-body">
    //                                 <table>
    //                                     <thead>
    //                                         <tr>
    //                                             <th>Team</th>
    //                                             <th class="tooltipped" data-position="top" data-tooltip="Games Played">GP</th>
    //                                             <th class="tooltipped" data-position="top" data-tooltip="Points">PTS</th>
    //                                             <th class="tooltipped" data-position="top" data-tooltip="Won">W</th>
    //                                             <th class="tooltipped" data-position="top" data-tooltip="Draw">D</th>
    //                                             <th class="tooltipped" data-position="top" data-tooltip="Lost">L</th>
    //                                             <th class="tooltipped" data-position="top" data-tooltip="Goals For">GF</th>
    //                                             <th class="tooltipped" data-position="top" data-tooltip="Goals Against">GA</th>
    //                                             <th class="tooltipped" data-position="top" data-tooltip="Goal Difference">GD</th>
    //                                         </tr>
    //                                     </thead>
    //                                     <tbody></tbody>
    //                                 </table>
    //                             </div>
    //                         </li>
    //                         `);
    //                         document.querySelector(`#highlightContent #${standings.competition.code} ul`).appendChild(standingContent);
    //                         list[index].standings.push(standings.standings[i].table);
    //                     }
    //                 });
    //                 const tab = document.querySelector("#highlight .tabs");
    //                 M.Tabs.init(tab, { swipeable: true })
    //                 return Promise.resolve(list);
    //             })
    //             .then(function (list) {
    //                 let ids = [];
    //                 list.forEach(function (standings) {
    //                     standings.standings.forEach(function (tables) {
    //                         // Show only top 3 standings
    //                         for (let i = 0; i < 3; i++) {
    //                             const template = document.createElement("template");
    //                             const standingTable = `
    //                                 <tr>
    //                                     <td>
    //                                         <img width="50px" src="${tables[i].team.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="${tables[i].team.name}" class="circle responsive-img tooltiped" data-position="top" data-tooltip="${tables[i].team.name}">
    //                                         ${tables[i].team.name}
    //                                     </td>
    //                                     <td>${tables[i].playedGames}</td>
    //                                     <td>${tables[i].points}</td>
    //                                     <td>${tables[i].won}</td>
    //                                     <td>${tables[i].draw}</td>
    //                                     <td>${tables[i].lost}</td>
    //                                     <td>${tables[i].goalsFor}</td>
    //                                     <td>${tables[i].goalsAgainst}</td>
    //                                     <td>${tables[i].goalDifference}</td>
    //                                 </tr>
    //                                 `;
    //                             template.innerHTML = standingTable;
    //                             document.querySelector(`#${standings.code} li:nth-child(${i + 1}) tbody`).appendChild(template.content.firstElementChild);
    //                         }
    //                     });
    //                     ids.push({ id: standings.id, code: standings.code });
    //                 });
    //                 return Promise.resolve(ids);
    //             })
    //             .then(function (ids) {
    //                 // Show scorers
    //                 Promise.all(ids.map(id => getCompetitionData({ type: "scorers", id: id.id })))
    //                     .then(function (response) {
    //                         response.forEach(function (competition) {
    //                             if (competition.count <= 0) {
    //                                 const element = createElementFromHTML(`
    //                                 <h6>No Data</h6>
    //                                 `);
    //                                 document.querySelector(`#${competition.competition.code} .scorers tbody`).appendChild(element)
    //                             } else {
    //                                 // Show only top 3 scorers each competition
    //                                 for (let i = 0; i < 3; i++) {
    //                                     const template = document.createElement("template");
    //                                     const scorersTable = `
    //                                         <tr>
    //                                             <td>${competition.scorers[i].player.name}</td>
    //                                             <td>${competition.scorers[i].team.name}</td>
    //                                             <td>${competition.scorers[i].numberOfGoals}</td>
    //                                         </tr>
    //                                         `;
    //                                     template.innerHTML = scorersTable;
    //                                     document.querySelector(`#${competition.competition.code} .scorers tbody`).appendChild(template.content.firstElementChild)
    //                                 }
    //                             }
    //                         })
    //                         document.querySelector("#highlightContent .tabs-content").style.height = `600px`;
    //                     })
    //             })
    //         // Hide loading overlay
    //         document.querySelector("#overlay").style.height = "0%";
    //     })
    //     .catch(errorAlert)
}

export { loadHome }