let Form_Account_Submit_Check = false;
const Form_Account_Submit = async function () {
    const JSON_send = { username: $('.account_input')[0].value, password: $('.account_input')[1].value }
    let fetch_url = '/server/account/login';
    if ($('.account_input').length == 3) {
        fetch_url = '/server/account/signin';
        JSON_send.confirm_password = $('.account_input')[2].value;
    }
    if (!Form_Account_Submit_Check) {
        Form_Account_Submit_Check = true;
        const response = await fetch_post(fetch_url, JSON_send);
        if (response.message == 'ok') {
            localStorage.setItem('token', response.token);
            window.location.assign("/");
        }
        else {
            Form_Account_Submit_Check = false;
            $('#msg').text(response.message);
        }
    }
}