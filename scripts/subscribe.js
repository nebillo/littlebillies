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
        const oldText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Un attimo…";

        try {
            // Esegui reCAPTCHA v3 e ottieni il token
            grecaptcha.ready(async function () {
                try {
                    const token = await grecaptcha.execute("6LcZP9MqAAAAAMIwTVwdwc16UoEBY2ZHPr64bheQ", { action: "subscribe" });

                    // Ottieni i dati dal form
                    const formData = {
                        name: form.querySelector("#firstname").value.trim(),
                        email: form.querySelector("#email").value.trim(),
                        recaptcha_token: token // Aggiungi il token al payload
                    };

                    // Invia i dati con Fetch API
                    const response = await fetch("https://nebilmattia.com/subscribe.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    });

                    let responseText = "";
                    try {
                        responseText = await response.text(); // Legge il contenuto della response
                    } catch (err) {
                        responseText = "Impossibile leggere il contenuto della risposta.";
                    }

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status} - Response: ${responseText}`);
                    }

                    const result = JSON.parse(responseText); // Parsing manuale del JSON

                    if (result.success) {
                        // ✅ Successo: svuota i campi e mostra il messaggio verde
                        heap.track(`view: newsletter_confirmation`, {
                            name: formData.name,
                            email: formData.email
                        });

                        form.querySelector("#firstname").value = "";
                        form.querySelector("#email").value = "";
                        showMessage(confirmationBox);
                    } else {
                        throw new Error(`API response was not successful: ${responseText}`);
                    }

                } catch (error) {
                    // ❌ Errore di rete o API fallita
                    console.error("Errore nella richiesta API:", error);

                    heap.track(`view: newsletter_error`, {
                        name: form.querySelector("#firstname").value.trim(),
                        email: form.querySelector("#email").value.trim()
                    });

                    showMessage(errorBox);
                }
            });

        } catch (error) {
            // ❌ Errore che avviene PRIMA di chiamare grecaptcha
            console.error("Errore nel blocco principale:", error);
        }

        // Riabilita il bottone
        submitButton.disabled = false;
        submitButton.textContent = oldText;
    });
});