const fetch_post = async function (url, obj) {
    let data_to_send;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    })
        .then(function (res) {
            if (res.ok) { return res.json() }
            else { console.log(res.json()) }
        })
        .then(function (data) { data_to_send = data })
        .catch(function (err) { console.log(err) });
    return data_to_send;
}
const XML_post = function ( url, f) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function () {
        if (xmlhttp.readyState === xmlhttp.DONE && xmlhttp.status === 200) {
            return f(xmlhttp.responseText);
        }
    }
    xmlhttp.open('post', url, true);
    xmlhttp.send();
}
const TEST_TIME = function (F, args) {
    const n = 10;
    let sum_total = 0;
    for (let i = 0; i < n; i++) {
        sum_total += window.performance.now();
        F(...args);
        sum_total -= window.performance.now();
    }
    console.log("T:" + sum_total + "|t:" + sum_total / n);
}