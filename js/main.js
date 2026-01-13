// Función para importar el Footer
$(document).ready(function () {
    $("#footer").load("components/footer.html");
});

$(document).ready(function () {

    /* =====================================================
       UTILIDADES DE DATOS
    ===================================================== */

    function getUsers() {
        return JSON.parse(localStorage.getItem("users")) || [];
    }

    function saveUsers(users) {
        localStorage.setItem("users", JSON.stringify(users));
    }

    function getLoggedUser() {
        return JSON.parse(sessionStorage.getItem("loggedInUser"));
    }

    /* =====================================================
       AUTO-LOGIN SI YA HAY SESIÓN
    ===================================================== */

    if (
        getLoggedUser() &&
        $("#loginForm").length
    ) {
        redirectToDashboard();
    }


    /* =====================================================
       LOGIN
    ===================================================== */

    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        const email = $("#email").val().trim().toLowerCase();
        const password = $("#password").val().trim();
        const remember = $("#remember").is(":checked");

        const users = getUsers();

        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (!user) {
            showAlert("Credenciales incorrectas");
            return;
        }

        sessionStorage.setItem("loggedInUser", JSON.stringify(user));

        if (remember) {
            localStorage.setItem("rememberedUser", JSON.stringify(user));
        }

        redirectToDashboard();
    });

    /* =====================================================
       REGISTRO
    ===================================================== */

    $("#registerForm").on("submit", function (e) {
        e.preventDefault();

        let users = getUsers();
        let newUser = {};

        // Captura dinámica de inputs
        $("#registerForm input").each(function () {
            const id = $(this).attr("id");

            if ($(this).attr("type") === "checkbox") return;

            newUser[id] = $(this).val().trim();
        });

        newUser.email = newUser.email.toLowerCase();

        // Validaciones
        if (newUser.password !== newUser.confirmPassword) {
            showAlert("Las contraseñas no coinciden");
            return;
        }

        if (!$("#terms").is(":checked")) {
            showAlert("Debes aceptar los términos y condiciones");
            return;
        }

        const exists = users.some(u => u.email === newUser.email);
        if (exists) {
            showAlert("El correo ya está registrado");
            return;
        }

        delete newUser.confirmPassword;

        users.push(newUser);
        saveUsers(users);

        sessionStorage.setItem("loggedInUser", JSON.stringify(newUser));

        redirectToDashboard();
    });

    /* =====================================================
       DASHBOARD
    ===================================================== */

    function redirectToDashboard() {
        const user = getLoggedUser();

        if (!user) return;

        $("main").html(`
            <div class="text-center text-light">
                <h2 class="mb-3">Bienvenido a tu billetera digital</h2>
                <p>Sesión iniciada como <strong>${user.email}</strong></p>

                <button id="gotoMenu" class="btn btn-success mt-3">
                    Ir al menú principal
                </button>

                <button id="logoutBtn" class="btn btn-danger mt-3">
                    Cerrar sesión
                </button>
            </div>
        `);
    }

    /* =====================================================
       NAVEGACIÓN
    ===================================================== */

    $(document).on("click", "#gotoMenu", function () {
    window.location.replace("menu.html");
    });


    $(document).on("click", "#logoutBtn", function () {
        sessionStorage.removeItem("loggedInUser");
        window.location.replace("login.html"); // o index.html
    });

    function saveTransaction(type, amount) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    const newTransaction = {
        date: new Date().toLocaleDateString("es-CL"),
        type: type,
        amount: amount
    };

    transactions.unshift(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}
    $("#logoutBtn").on("click", function (e) {
        e.preventDefault();

        localStorage.clear();
        sessionStorage.clear();

        window.location.href = "login.html";
    });

function getBalance() {
    return parseFloat(localStorage.getItem("balance")) || 0;
}

function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

    /* =====================================================
       ALERTAS
    ===================================================== */

    function showAlert(message) {
        $(".alert").remove();

        const alertHTML = `
            <div class="alert alert-danger mt-3 text-center">
                ${message}
            </div>
        `;

        if ($("#loginForm").length) {
            $("#loginForm").prepend(alertHTML);
        } else if ($("#registerForm").length) {
            $("#registerForm").prepend(alertHTML);
        } else {
            alert(message);
        }
    }

});
