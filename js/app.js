/* =====================================================
   ANIMACIÓN DEL GLOBO
===================================================== */

const globo =
    document.querySelector(".animar-globo");


if (globo) {

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target
                            .classList
                            .add("visible");

                    }

                });

            },
            {
                threshold: 0.25
            }
        );


    observer.observe(globo);

}



/* =====================================================
   CUENTA ATRÁS

   12 septiembre 2026
   12:00 mediodía
   Hora de Perú (-05:00)
===================================================== */

const eventDate =
    new Date(
        "2026-09-12T12:00:00-05:00"
    );


function updateCountdown() {

    const now =
        new Date();


    const difference =
        eventDate - now;


    const daysElement =
        document.getElementById("days");

    const hoursElement =
        document.getElementById("hours");

    const minutesElement =
        document.getElementById("minutes");


    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement
    ) {
        return;
    }


    if (difference <= 0) {

        daysElement.textContent =
            "00";

        hoursElement.textContent =
            "00";

        minutesElement.textContent =
            "00";

        return;
    }


    const days =
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    const hours =
        Math.floor(
            (
                difference /
                (
                    1000 *
                    60 *
                    60
                )
            ) % 24
        );


    const minutes =
        Math.floor(
            (
                difference /
                (
                    1000 *
                    60
                )
            ) % 60
        );


    daysElement.textContent =
        String(days)
            .padStart(
                2,
                "0"
            );


    hoursElement.textContent =
        String(hours)
            .padStart(
                2,
                "0"
            );


    minutesElement.textContent =
        String(minutes)
            .padStart(
                2,
                "0"
            );

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);



/* =====================================================
   MOSTRAR / OCULTAR DETALLES SEGÚN ASISTENCIA
===================================================== */

const attendanceRadios =
    document.querySelectorAll(
        'input[name="attendance"]'
    );


const attendanceDetails =
    document.getElementById(
        "attendanceDetails"
    );


const adultsSelect =
    document.getElementById("adults");

const childrenSelect =
    document.getElementById("children");


function toggleAttendanceDetails() {

    const checked =
        document.querySelector(
            'input[name="attendance"]:checked'
        );


    if (!attendanceDetails) {
        return;
    }


    const isAttending =
        checked && checked.value === "si";


    attendanceDetails.hidden =
        !isAttending;


    /* Solo exigimos adultos si asiste */

    if (adultsSelect) {

        adultsSelect.required =
            isAttending;


        if (!isAttending) {

            adultsSelect.value = "";

        } else if (!adultsSelect.value) {

            /* Es obvio que al menos la persona
               que confirma asistirá */

            adultsSelect.value = "1";

        }

    }


    if (childrenSelect && !isAttending) {
        childrenSelect.value = "0";
    }

}


attendanceRadios.forEach((radio) => {

    radio.addEventListener(
        "change",
        toggleAttendanceDetails
    );

});


/* Estado inicial (por si el navegador recuerda una selección) */

toggleAttendanceDetails();



/* =====================================================
   FORMULARIO
===================================================== */

const form =
    document.getElementById(
        "confirmationForm"
    );


const formMessage =
    document.getElementById(
        "formMessage"
    );


const confirmationSummary =
    document.getElementById(
        "confirmationSummary"
    );


if (
    form &&
    formMessage &&
    confirmationSummary
) {

    const submitButton =
        form.querySelector(
            ".confirmation-button"
        );


    form.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            /* -----------------------------------------
               Evitar doble envío
            ----------------------------------------- */

            if (submitButton.disabled) {
                return;
            }



            /* -----------------------------------------
               Asistencia
            ----------------------------------------- */

            const attendanceInput =
                document.querySelector(
                    'input[name="attendance"]:checked'
                );


            if (!attendanceInput) {

                formMessage.textContent =
                    "Selecciona si asistirás a la celebración.";

                return;
            }



            /* -----------------------------------------
               Si asiste, el número de adultos
               no puede quedar vacío
            ----------------------------------------- */

            if (
                attendanceInput.value === "si" &&
                adultsSelect &&
                !adultsSelect.value
            ) {

                formMessage.textContent =
                    "Indica cuántos adultos asistirán.";

                adultsSelect.focus();

                return;
            }



            /* -----------------------------------------
               Datos
            ----------------------------------------- */

            const formData = {

                name:
                    document
                        .getElementById("name")
                        .value
                        .trim(),


                attendance:
                    attendanceInput.value,


                adults:
                    document
                        .getElementById("adults")
                        .value,


                children:
                    document
                        .getElementById("children")
                        .value || "0",


                phone:
                    document
                        .getElementById("phone")
                        ?.value
                        .trim() || "",


                song:
                    document
                        .getElementById("song")
                        .value
                        .trim()

            };



            /* -----------------------------------------
               Bloqueamos botón
            ----------------------------------------- */

            submitButton.disabled =
                true;


            submitButton.textContent =
                "ENVIANDO...";


            formMessage.textContent =
                "Registrando tu respuesta...";



            try {

                /* -------------------------------------
                   Enviar a Google Apps Script
                ------------------------------------- */

                await fetch(
                    "https://script.google.com/macros/s/AKfycbw7OM3fgt8c5NwhOujExPf4oMhemEzeIf8aj5giGH1P_WztKC4usHaKQ0GpBDVhtbdd/exec",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(
                                formData
                            )
                    }
                );



                /* -------------------------------------
                   Rellenamos resumen
                ------------------------------------- */

                document
                    .getElementById(
                        "summaryName"
                    )
                    .textContent =
                        formData.name;



                document
                    .getElementById(
                        "summaryAttendance"
                    )
                    .textContent =
                        formData.attendance === "si"
                            ? "Sí, asistiré"
                            : "No podré asistir";



                document
                    .getElementById(
                        "summaryAdults"
                    )
                    .textContent =
                        formData.adults || "0";



                document
                    .getElementById(
                        "summaryChildren"
                    )
                    .textContent =
                        formData.children || "0";



                document
                    .getElementById(
                        "summarySong"
                    )
                    .textContent =
                        formData.song ||
                        "Sin canción sugerida";



                /* -------------------------------------
                   Ocultamos formulario
                ------------------------------------- */

                form.hidden =
                    true;



                /* -------------------------------------
                   Mostramos resumen
                ------------------------------------- */

                confirmationSummary.hidden =
                    false;



                /* -------------------------------------
                   Limpiar mensaje anterior
                ------------------------------------- */

                formMessage.textContent =
                    "";



                /* -------------------------------------
                   Llevar suavemente al resumen
                ------------------------------------- */

                confirmationSummary
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

            }

            catch (error) {

                console.error(
                    "Error enviando confirmación:",
                    error
                );


                formMessage.textContent =
                    "Ha ocurrido un error. Inténtalo de nuevo.";


                submitButton.disabled =
                    false;


                submitButton.textContent =
                    "CONFIRMA AHORA";

            }

        }
    );

}

const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }

            });
        },
        {
            threshold: 0.15
        }
    );

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

const rules = document.querySelector(".rules");

if (rules) {
    const rulesObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.25
        }
    );

    rulesObserver.observe(rules);
}