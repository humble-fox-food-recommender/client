
$(document).ready(function () {
    $('.user').click(function (event) {
        event.preventDefault()
        axios({
            method: "GET",
            url: `http://localhost:3000/repos/${$(this).text()}`,
            headers: { token: localStorage.getItem("token") }
        })
            .then(function ({ data }) {
                $('#card').empty()
                showCard('#card', data)
                $('#detail').empty()
                readDetail()
            })
            .catch(function (err) {
                console.log(err)
            })
    })

    $('#myGit').click(function (event) {
        event.preventDefault()
        $('#detail').empty()
        getData()
    })

    $('#filter').on('keyup', function () {
        const keyword = $(this).val().toLowerCase()

        $('#card .card').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(keyword) > -1)
        })
    })
})

function readDetail() {
    $('.fullname').click(function (event) {
        event.preventDefault()
        axios({
            method: "GET",
            url: `http://localhost:3000/repos/${$(this).text()}`,
            headers: { token: localStorage.getItem("token") }
        })
            .then(function ({ data }) {
                $('#detail').empty()
                showCard('#detail', [data])
            })
            .catch(function (err) {
                console.log(err)
            })
    })
}

function showCard(where, data) {
    $.each(data, function (index, value) {
        $(where).append(
            `<div class="card" style="width: auto;">
                <div class="card-body">
                    <a href="#" class="fullname"><h5 class="card-title">${value.full_name}</h5></a>
                    <p class="card-text">${value.description}</p>
                    <p>${value.stargazers_count} stars</p>
                    <a href="${value.html_url}" class="card-link">View on Github</a>
                </div>
            </div>`
        )
    })
}

function getData() {
    axios({
        method: "GET",
        url: "http://localhost:3000/repos/starred",
        headers: { token: localStorage.getItem("token") }
    })
        .then(({ data }) => {
            $('#card').empty()
            showCard('#card', data)
            readDetail()
        })
        .catch(function (err) {
            console.log(err)
        })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token
    console.log('============ Masuk ============ sign in')
    axios({
        url: `http://localhost:3000/users/login`,
        method: `post`,
        data: {
            id_token: id_token
        },
        headers: { token: localStorage.getItem("token") }
    })
        .then(({ data }) => {
            console.log(data);
            console.log('============ Masuk ============ token')
            localStorage.setItem("token", data)
            $('#login').hide()
            $('#dashboard').show()
        })
        .catch(err => {
            console.log(err)
        })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        localStorage.removeItem("token")
        $('#login').show()
        $('#dashboard').hide()
    });
}