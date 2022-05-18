import idb from './idb.js'
import { customAlert } from './pages/utility.js'

const objectStoreList = ["match-detail", "competition-detail", "team-detail"]

const dbPromised = idb.open("football-crack", 1, function (upgradeDB) {
    const key = {
        keyPath: "id"
    }
    const matchDetailObjectStore = upgradeDB.createObjectStore("match-detail", key);
    const competitionDetailObjectStore = upgradeDB.createObjectStore("competition-detail", key);
    const teamDetailObjectStore = upgradeDB.createObjectStore("team-detail", key);
    matchDetailObjectStore.createIndex("match_id", "match_id", { unique: false })
    competitionDetailObjectStore.createIndex("competition_name", "competition_name", { unique: false })
    teamDetailObjectStore.createIndex("team_name", "team_name", { unique: false })
})

function saveForLater(type, data) {
    dbPromised
        .then(function (db) {
            const tx = db.transaction(type, "readwrite");
            const store = tx.objectStore(type);
            store.put(data);
            return tx.complete;
        })
        .then(function () {
            customAlert("Saved");
        })
}

function deleteById(type, id) {
    dbPromised
        .then(function (db) {
            const tx = db.transaction(type, "readwrite");
            const store = tx.objectStore(type);
            store.delete(parseInt(id));
            return tx.complete;
        })
        .then(function () {
            customAlert("Deleted");
        })
}

function getAll() {
    return Promise.all(objectStoreList.map(type => {
        return {
            [type]: new Promise(function (resolve, reject) {
                dbPromised
                    .then(function (db) {
                        const tx = db.transaction(type, "readonly");
                        const store = tx.objectStore(type);
                        return store.getAll();
                    })
                    .then(function (data) {
                        resolve(data)
                    })
            })
        }
    }))
}

function getById(type, id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                const tx = db.transaction(type, "readonly");
                const store = tx.objectStore(type);
                return store.get(parseInt(id));
            })
            .then(function (data) {
                console.log(data);
                resolve(data)
            })
    })
}

export { saveForLater, getAll, getById, objectStoreList, deleteById }