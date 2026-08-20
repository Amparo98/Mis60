const globo = document.querySelector(".animar-globo");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }

    });
}, {
    threshold: 0.25
});

observer.observe(globo);


const eventDate = new Date("2026-09-12T12:00:00-05:00");

function updateCountdown() {

    const now = new Date();
    const difference = eventDate - now;

    if (difference <= 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");
}

updateCountdown();

setInterval(updateCountdown, 1000);

const form = document.getElementById("confirmationForm");
const formMessage = document.getElementById("formMessage");
const submitButton = form.querySelector(".confirmation-button");

const confirmationSummary =
    document.getElementById("confirmationSummary");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    // Evitar doble clic
    if (submitButton.disabled) {
        return;
    }

    const attendanceInput =
        document.querySelector(
            'input[name="attendance"]:checked'
        );

    const formData = {
        name: document.getElementById("name").value.trim(),

        attendance:
            attendanceInput?.value || "",

        adults:
            document.getElementById("adults").value,

        children:
            document.getElementById("children").value,

        phone:
            document.getElementById("phone")?.value.trim() || "",

        song:
            document.getElementById("song").value.trim()
    };


    // BLOQUEAMOS EL BOTÓN
    submitButton.disabled = true;
    submitButton.textContent = "ENVIANDO...";

    formMessage.textContent =
        "Registrando tu respuesta...";


    try {

        await fetch(
            "https://script.google.com/macros/s/AKfycbw7OM3fgt8c5NwhOujExPf4oMhemEzeIf8aj5giGH1P_WztKC4usHaKQ0GpBDVhtbdd/exec",
            {
                method: "POST",
                body: JSON.stringify(formData)
            }
        );


        // RELLENAMOS EL RESUMEN
        document.getElementById("summaryName").textContent =
            formData.name;

        document.getElementById("summaryAttendance").textContent =
            formData.attendance === "si"
                ? "Sí, asistiré"
                : "No podré asistir";

        document.getElementById("summaryAdults").textContent =
            formData.adults || "0";

        document.getElementById("summaryChildren").textContent =
            formData.children || "0";

        document.getElementById("summarySong").textContent =
            formData.song || "Sin canción sugerida";


        // OCULTAMOS FORMULARIO
        form.classList.add("hidden");


        // MOSTRAMOS RESUMEN
        confirmationSummary.classList.remove("hidden");


    } catch (error) {

        formMessage.textContent =
            "Ha ocurrido un error. Inténtalo de nuevo.";

        submitButton.disabled = false;
        submitButton.textContent = "CONFIRMA AHORA";
    }

});