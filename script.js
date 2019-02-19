let accessToken = '';

window.fbAsyncInit = function() {
FB.init({
    appId      : '{app-id}',
    cookie     : true,
    xfbml      : true,
    version    : 'v3.2'
});
    

FB.getLoginStatus(function(response) {
statusChangeCallback(response);
}); 
    
};

(function(d, s, id){
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) {return;}
js = d.createElement(s); js.id = id;
js.src = "https://connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        console.log('Logged in and authenticated');
        setElements(true);
        getUserInfo();
    } else {
        console.log('Not authenticated');
        setElements(false);
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

function getUserInfo() {
    FB.api('/me?fields=name,email,accounts', (response) => {
        if (response && !response.error) {
            // console.log(response);
            buildProfile(response);
            getPageAccessToken(response.accounts.data[0].access_token);
        }

        FB.api('/{page-id}/feed', (response) => {
        if (response && !response.error) {
            buildFeed(response);
        }
        })
    })
}

function getPageAccessToken(token) {
    FB.api('/{page-id}?fields=access_token&access_token=' + token, 
    (response) => {
        accessToken = response.access_token;
    })
}

function buildProfile(user) {
    let profile = `
    <h3>${user.name}</h3>
    <ul class="list-group">
    <li class="list-group-item">User ID: ${user.id}</li>
    </ul>
    `;
    
    document.getElementById('profile').innerHTML = profile;
}

function buildFeed(feed) {
    let output = `<h3>Latest Page's Posts</h3>`;
    for(let i in feed.data) {
        if (feed.data[i].message) {
            output += `
            <div class="card card-body bg-light">
            ${feed.data[i].message}
            </div>
            `;
        }
    }
    
    document.getElementById('feed').innerHTML = output;
}

function setElements(isLoggedIn) {
    if(isLoggedIn) {
        document.getElementById('profile').style.display = 'block';
        document.getElementById('fb-btn').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('heading').style.display = 'none';
        document.getElementById('feed').style.display = 'block';
        document.getElementById('photo-form').style.display = 'block';
    } else {
        document.getElementById('profile').style.display = 'none';
        document.getElementById('fb-btn').style.display = 'block';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('heading').style.display = 'block';
        document.getElementById('feed').style.display = 'none';
        document.getElementById('photo-form').style.display = 'none';
    }
}

function onFormSubmit() {
    const formMessageValue = document.getElementById('photo-message').value;
    const formUrlValue = document.getElementById('photo-url').value;
    uploadPic(formMessageValue, formUrlValue);
}

function uploadPic(message, url) {
    FB.api('/{page-id}/photos', 'POST', {
        message: message,
        url: url,
        access_token: accessToken}, 
        (response) => {
            if (response && !response.error) {
                alert('Photo uploaded succesfully!');
                document.getElementById("photo-form").reset();
            } else if(response.error) {
                alert(response.error.message);
            }
        console.log(response);
    })
}

function logout() {
    FB.logout((response) => {
        setElements();
    });
}
