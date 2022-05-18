import 'materialize-css'

function zeroDate(date) {
    return date < 10 ? date = `0${date}` : date = date;
}

function customAlert(message) {
    const content = document.getElementById("body-content");
    content.appendChild(modalWidgetElement(message, false));
    const element = document.querySelector(".modal");
    const modal = M.Modal.init(element, {
        onCloseEnd: function () {
            this.destroy();
        }
    });
    modal.open();
}

function errorAlert(error) {
    console.log(error);
    document.querySelector("#overlay").style.height = "0%";
    const content = document.getElementById("body-content");
    content.appendChild(modalWidgetElement("Wait a minute, then reload the page.", true));
    const element = document.querySelector(".modal");
    const modal = M.Modal.init(element, {
        onCloseEnd: function () {
            this.destroy();
        }
    });
    modal.open();
}

function getDate(date = undefined) {
    let today;
    if (date) {
        today = new Date(date);
        const month = zeroDate(today.getMonth() + 1);
        const now = zeroDate(today.getDate());
        return `${today.getFullYear()}-${month}-${now}`;
    } else {
        today = new Date();
        const month = zeroDate(today.getMonth() + 1);
        const now = zeroDate(today.getDate());
        const yesterday = zeroDate(today.getDate() - 1);
        const tomorrow = zeroDate(today.getDate() + 1);
        return {
            yesterday: `${today.getFullYear()}-${month}-${yesterday}`,
            today: `${today.getFullYear()}-${month}-${now}`,
            tomorrow: `${today.getFullYear()}-${month}-${tomorrow}`
        };
    }
}

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function isIterable(obj) {
    if (obj == null) return false;
    return typeof obj[Symbol.iterator] === 'function';
}

function cacheOrNetwork(data) {
    if (!isIterable(data)) {
        if ("caches" in window) {
            caches.match(data.url)
                .then(function (response) {
                    console.log("cache first");
                    return response;
                })
        }
        return data.promise
    } else {
        let cacheList = [];
        if ("caches" in window) {
            data.forEach(item => {
                caches.match(item.url)
                    .then(function (response) {
                        cacheList.push(response);
                    })
            })
            console.log("cache first");
            return cacheList;
        } else {
            return Promise.all(data.map(item => item.promise))
        }
    }
}

function modalWidgetElement(message, reload = false) {
    return createElementFromHTML(`<div class="modal bottom-sheet">
                <div class="modal-content">
                    <h4>${message}</h4>
                </div>
                <div class="modal-footer">
                    ${reload === true ? '<a onclick="window.location.reload()" href="#" class="modal-close waves-effect waves-green btn-flat">Reload</a>' : ""}
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>`);
}

function loadPage(page, id = "", callback = undefined, saved = false) {
    if (window.apiCooldown != undefined && window.apiCooldown != 'undefined') {
        window.clearInterval(window.apiCooldown);
    }
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            const content = document.getElementById("body-content");
            content.innerHTML = "";
            if (this.status === 200) {
                content.innerHTML = xhttp.responseText;
                let url = id === "" ? `#${page}` : `#${page}?id=${id}`;
                url = saved ? `${url}&saved=true` : url;
                window.history.pushState({ "html": xhttp.responseText }, "", url);
                if (page === "matches" || page === "home" || page === "competitions" || page === "standings" || page === "saved") callback()
                else if (page === "match-detail" || page === "competition-detail" || page === "team-detail") callback(id)
            } else if (this.status == 404) {
                content.innerHTML = modalWidgetElement("Page not found.");
                const element = document.querySelector(".modal");
                const modal = M.Modal.init(element, {
                    onCloseEnd: function () {
                        this.destroy();
                    }
                });
                modal.open();
            } else {
                content.innerHTML = modalWidgetElement("Something wrong.");
                const element = document.querySelector(".modal");
                const modal = M.Modal.init(element, {
                    onCloseEnd: function () {
                        this.destroy();
                    }
                });
                modal.open();
            }
        }
    };
    xhttp.open("GET", `pages/${page}.html`, true);
    xhttp.send();
}

export { getDate, errorAlert, createElementFromHTML, isIterable, cacheOrNetwork, loadPage, modalWidgetElement, customAlert }