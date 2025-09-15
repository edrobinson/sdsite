
    const form = document. getElementById('form');
    form. addEventListener('submit', function (e) {
    e. preventDefault () ;
    const payload = new FormData(form);
    console. log([ ... payload]);
    fetch('http://httpbin.org/post', {
    method: "POST",
    body: payload,
    . then(res => res.json())
    . then(data => console. log(data))
    .catch(err => console. log(err) ) ;|
    })
 