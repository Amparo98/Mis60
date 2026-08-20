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

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        attendance: document.querySelector(
            'input[name="attendance"]:checked'
        )?.value || "",
        adults: document.getElementById("adults").value,
        children: document.getElementById("children").value,
        phone: document.getElementById("phone").value,
        song: document.getElementById("song").value
    };

    try {
        await fetch("https://script.google.com/macros/s/AKfycbw7OM3fgt8c5NwhOujExPf4oMhemEzeIf8aj5giGH1P_WztKC4usHaKQ0GpBDVhtbdd/exec", {
            method: "POST",
            body: JSON.stringify(formData)
        });

        formMessage.textContent =
            "¡Gracias! Tu asistencia ha sido registrada.";

        form.reset();

    } catch (error) {
        formMessage.textContent =
            "Ha ocurrido un error. Inténtalo de nuevo.";
    }
});