document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = loginForm.username.value;
        const password = loginForm.password.value;

        try {
            // Validación de datos
            const errors = validateLoginForm(username, password);
            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            const tokenResponse = await fetch('/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!tokenResponse.ok) {
                const errorData = await tokenResponse.json();
                throw new Error(errorData.message);
            }

            const { token } = await tokenResponse.json();

            const employeesResponse = await fetch('/api/employees', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!employeesResponse.ok) {
                const errorData = await employeesResponse.json();
                throw new Error(errorData.message);
            }

            successMessage.textContent = 'Inicio de sesión exitoso';
            errorMessage.textContent = '';
        } catch (error) {
            errorMessage.textContent = error.message;
            successMessage.textContent = '';
        }
    });
});

function validateLoginForm(username, password) {
    const errors = [];

    if (!username) {
        errors.push('El nombre de usuario es requerido');
    }

    if (!password) {
        errors.push('La contraseña es requerida');
    }

    return errors;
}
