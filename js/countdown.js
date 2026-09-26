const countdown =
    document.getElementById("countdown");

const countdownDays =
    document.getElementById("countdownDays");

const countdownHours =
    document.getElementById("countdownHours");

const countdownMinutes =
    document.getElementById("countdownMinutes");

const countdownSeconds =
    document.getElementById("countdownSeconds");


const WEDDING_DATE =
    new Date("2027-06-12T11:00:00+02:00");


let countdownTimer =
    null;


/* =======================================================
   DURATA ANIMAZIONE
======================================================= */

const NUMBER_ANIMATION_DURATION =
    320;


/* =======================================================
   ANIMAZIONE NUMERO
======================================================= */

function animateNumberChange(
    element,
    newValue
) {

    if (!element) {
        return;
    }


    const currentValue =
        element.textContent.trim();


    /*
     * Se il valore è già corretto,
     * non facciamo partire nessuna animazione.
     */
    if (currentValue === newValue) {
        return;
    }


    /*
     * Se l'utente ha chiesto di ridurre
     * le animazioni, aggiorniamo subito.
     */
    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        element.textContent =
            newValue;

        return;
    }


    element.classList.remove(
        "countdown-number-enter"
    );

    element.classList.add(
        "countdown-number-exit"
    );


    setTimeout(
        () => {

            element.textContent =
                newValue;


            element.classList.remove(
                "countdown-number-exit"
            );


            /*
             * Forziamo il browser a registrare
             * lo stato iniziale della nuova animazione.
             */
            void element.offsetWidth;


            element.classList.add(
                "countdown-number-enter"
            );


            setTimeout(
                () => {

                    element.classList.remove(
                        "countdown-number-enter"
                    );

                },
                NUMBER_ANIMATION_DURATION
            );

        },
        NUMBER_ANIMATION_DURATION / 2
    );

}


/* =======================================================
   AGGIORNAMENTO COUNTDOWN
======================================================= */

function updateCountdown() {

    if (
        !countdown ||
        !countdownDays ||
        !countdownHours ||
        !countdownMinutes ||
        !countdownSeconds
    ) {
        return;
    }


    const remaining =
        WEDDING_DATE.getTime() -
        Date.now();


    if (remaining <= 0) {

        countdown.innerHTML = `
            <img
                class="countdown-paper-image"
                src="images/cartoncino.png"
                alt=""
            >

            <div class="countdown-paper-content">
                <p class="countdown-finished">
                    È arrivato il nostro giorno ❤️
                </p>
            </div>
        `;


        if (countdownTimer) {

            clearInterval(
                countdownTimer
            );

            countdownTimer =
                null;
        }


        return;
    }


    const totalSeconds =
        Math.floor(
            remaining / 1000
        );


    const days =
        Math.floor(
            totalSeconds / 86400
        );


    const hours =
        Math.floor(
            (totalSeconds % 86400) /
            3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) /
            60
        );


    const seconds =
        totalSeconds % 60;


    const daysValue =
        String(days);


    const hoursValue =
        String(hours).padStart(
            2,
            "0"
        );


    const minutesValue =
        String(minutes).padStart(
            2,
            "0"
        );


    const secondsValue =
        String(seconds).padStart(
            2,
            "0"
        );


    animateNumberChange(
        countdownDays,
        daysValue
    );


    animateNumberChange(
        countdownHours,
        hoursValue
    );


    animateNumberChange(
        countdownMinutes,
        minutesValue
    );


    animateNumberChange(
        countdownSeconds,
        secondsValue
    );

}


/* =======================================================
   AVVIO
======================================================= */

function startCountdown() {

    updateCountdown();


    if (
        WEDDING_DATE.getTime() >
        Date.now()
    ) {

        countdownTimer =
            setInterval(
                updateCountdown,
                1000
            );
    }

}


startCountdown();
