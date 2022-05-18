const base_url = "https://api.football-data.org/v2/";
const api_key = "41a9265bb32d4df29aa41f865a8cbcf4";

function status(response) {
    if (response.status !== 200) {
        console.log(`Error: ${response.status}`);
        return Promise.reject(response);
    } else {
        return Promise.resolve(response);
    }
}

function json(response) { return response.json() }

function error(error) { console.log(`Error: ${error}`) }

function getUrl({
    type,
    id = undefined,
    competitionIds = undefined,
    startDate = undefined,
    endDate = undefined,
    teamIds = undefined,
    matchId = undefined,
    filters = {}
} = {}) {
    let url, filter = "";
    if (filters !== {}) {
        if (filters.status !== "") filter = `&status=${filters.status}`;
    }
    switch (type) {
        case "all":
            url = `${base_url}competitions?plan=TIER_ONE`;
            break;
        case "detail":
            url = `${base_url}competitions/${id}`;
            break;
        case "teams":
            url = `${base_url}competitions/${id}/teams`;
            break;
        case "standings":
            url = `${base_url}competitions/${id}/standings`;
            break;
        case "scorers":
            url = `${base_url}competitions/${id}/scorers`;
            break;
        case "team-detail":
            url = `${base_url}teams/${id}`;
            break;
        case "matches-all":
            url = `${base_url}matches?dateFrom=${startDate}&dateTo=${endDate}`;
            break;
        case "matches-list":
            url = `${base_url}matches?competitions=${competitionIds.length === 12 ? "" : competitionIds.join()}&dateFrom=${startDate}&dateTo=${endDate}${filter}`;
            break;
        case "matches-detail":
            url = `${base_url}matches/${matchId}`;
            break;
        case "matches-team":
            url = `${base_url}teams/${teamIds}/matches`;
            break;
        default:
            console.log("Wrong Input");
            break;
    }
    return url;
}

function getData(url) {
    return fetch(url, {
        method: "GET",
        headers: {
            "X-Auth-Token": api_key,
        },
    })
        .then(status)
        .then(json)
        .then(function (data) {
            return data;
        })
        .catch(error)
}

function getCompetitionData({ type, id = undefined } = {}) {
    let data;
    switch (type) {
        case "all":
            data = getData(`${base_url}competitions?plan=TIER_ONE`);
            break;
        case "detail":
            data = getData(`${base_url}competitions/${id}`);
            break;
        case "teams":
            data = getData(`${base_url}competitions/${id}/teams`);
            break;
        case "standings":
            data = getData(`${base_url}competitions/${id}/standings`);
            break;
        case "scorers":
            data = getData(`${base_url}competitions/${id}/scorers`);
            break;
        case "team-detail":
            data = getData(`${base_url}teams/${id}`);
            break;
        default:
            console.log("Wrong input");
            break;
    }
    return data;
}

function getMatches({
    type,
    competitionIds = undefined,
    startDate = undefined,
    endDate = undefined,
    teamIds = undefined,
    matchId = undefined,
    filters = {}
} = {}) {
    // console.log(type, competitionIds, startDate, endDate);
    let data, filter = '';
    if (filters !== {}) {
        if (filters.status !== "") filter = `&status=${filters.status}`;
    }
    switch (type) {
        case "all":
            data = getData(`${base_url}matches?dateFrom=${startDate}&dateTo=${endDate}`);
            break;
        case "list":
            data = getData(`${base_url}matches?competitions=${competitionIds.length === 12 ? "" : competitionIds.join()}&dateFrom=${startDate}&dateTo=${endDate}${filter}`);
            break;
        case "detail":
            data = getData(`${base_url}matches/${matchId}`);
            break;
        case "team":
            data = getData(`${base_url}teams/${teamIds}/matches`);
            break;
        default:
            console.log("Wrong input");
            break;
    }
    return data;
}

export { getCompetitionData, getMatches, getUrl }