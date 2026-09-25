const countdown = document.getElementById("countdown");
const countdownDays = document.getElementById("countdownDays");
const countdownHours = document.getElementById("countdownHours");
const countdownMinutes = document.getElementById("countdownMinutes");
const countdownSeconds = document.getElementById("countdownSeconds");

const WEDDING_DATE =
    new Date("2027-06-12T11:00:00+02:00");

let countdownTimer = null;

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
            clearInterval(countdownTimer);
            countdownTimer = null;
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
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    countdownDays.textContent =
        String(days);

    countdownHours.textContent =
        String(hours).padStart(
            2,
            "0"
        );

    countdownMinutes.textContent =
        String(minutes).padStart(
            2,
            "0"
        );

    countdownSeconds.textContent =
        String(seconds).padStart(
            2,
            "0"
        );
}

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
