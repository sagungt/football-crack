const webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BIWCllAI74dsvftj79UWoQ5jc6EhQWxvB_Vtk8s46GoDMr__R28FyPKSF8WPzm5p20_g_zxwc4WNb_h6gjD28_c",
    "privateKey": "n9zCUK0gi1dZOC_FTGlJPd3liQrQ7Mlgc9LFjisBJo0"
};

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
const pushSubscription = {
    "endpoint": "https://sg2p.notify.windows.com/w/?token=BQYAAAChYgh4Go2xehan4oi1SEsCvGjJZRt2xvrVCpI3ND7xFbCoW6aMcpURyuaOJQqZLvIKI%2bZbBGlh1o9Xtd0fQqmlfikTzZHShYwrp55Lm%2fcvYd7aj9j%2fL%2fRyel4MR37HbeGhLzGRiWSQuv1JgmnfrnXge2oMNC2SMjwLzQdrVYzLYG9MOJjAinuCSUHrb8dfBg76E360x5Wu05mGAF0GuPQqcwMpkqPBaOhV1WI7agEKupaoPsAEaIGA%2blNS5g4T2Ttlx9IykHiAVDqUwe1JAtj0Y0%2fA7UdlVO5m56amnq1kmfIXqzrYPbCopceuDEuU1wxAzfgMYqEHSDIflAVxc0wa",
    "keys": {
        "p256dh": "BL3bY6Jakt0eB5CxEo5MTB7pXCDrpHMf+4kqtdyMW02VFoaoH1JK3Q/SSsBbWuc0rJt2G50dIQG2o7RzVXPs7Ek=",
        "auth": "qN0Hp86aJxjcfXBnuIzg6Q=="
    }
};
const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi dari Football Crack!';

const options = {
    gcmAPIKey: "695506553780",
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);