document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".newsletter");
    const submitButton = form.querySelector("button");
    const confirmationBox = document.getElementById("confirmation");
    const errorBox = document.getElementById("error");

    // Funzione per mostrare il messaggio con fade-in e nasconderlo dopo 4 secondi
    function showMessage(element) {
        element.classList.remove("d-none");  // Rimuove il display: none
        element.classList.add("show");       // Aggiunge fade-in di Bootstrap

        // Dopo 4 secondi, avvia il fade-out
        setTimeout(() => {
            element.classList.remove("show"); // Fa partire il fade-out
            setTimeout(() => {
                element.classList.add("d-none"); // Nasconde l'elemento completamente
            }, 500); // Tempo del fade-out (match con Bootstrap)
        }, 4000);
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita il refresh della pagina

        // Disabilita il bottone e cambia il testo
        submitButton.disabled = true;
        submitButton.textContent = "Attendere...";

        // Ottieni i dati dal form
        const formData = {
            name: form.querySelector("#firstname").value.trim(),
            email: form.querySelector("#email").value.trim(),
        };

        try {
            const response = await fetch("https://nebilmattia.com/subscribe.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // ✅ Successo: svuota i campi e mostra il messaggio verde
                form.querySelector("#firstname").value = "";
                form.querySelector("#email").value = "";
                showMessage(confirmationBox);
            } else {
                // ❌ Errore: mostra il messaggio rosso senza svuotare i campi
                showMessage(errorBox);
            }
        } catch (error) {
            // ❌ Errore di rete
            showMessage(errorBox);
        }

        // Riabilita il bottone
        submitButton.disabled = false;
        submitButton.textContent = "Entra nel club";
    });
});
