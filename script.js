/* ========================================= */
/* BUSTA INIZIALE */
/* ========================================= */

const envelopeScreen = document.getElementById("envelopeScreen");
const envelopeButton = document.getElementById("envelopeButton");

if (envelopeButton && envelopeScreen) {

    envelopeButton.addEventListener("click", () => {

        envelopeButton.disabled = true;

        envelopeScreen.classList.add("opening");

        setTimeout(() => {

            envelopeScreen.classList.add("opened");

        }, 900);

    });

}


/* ========================================= */
/* SCORRI */
/* ========================================= */

const scrollIndicator = document.getElementById("scrollIndicator");

function updateScrollIndicator() {

    if (!scrollIndicator) return;

    const scrollBottom =
        window.innerHeight + window.scrollY;

    const pageHeight =
        document.documentElement.scrollHeight;

    if (window.scrollY > 40 || scrollBottom >= pageHeight - 20) {

        scrollIndicator.classList.add("hidden");

    } else {

        scrollIndicator.classList.remove("hidden");

    }

}

window.addEventListener("scroll", updateScrollIndicator);

updateScrollIndicator();


/* ========================================= */
/* WEDSHOOTS */
/* ========================================= */

const copyCodeButton = document.getElementById("copyCodeButton");
const accessCode = document.getElementById("accessCode");
const copyMessage = document.getElementById("copyMessage");

if (copyCodeButton && accessCode) {

    copyCodeButton.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(accessCode.textContent.trim());

            if (copyMessage) {

                copyMessage.textContent = "Codice copiato!";

                setTimeout(() => {

                    copyMessage.textContent = "";

                }, 2000);

            }

        } catch {

            if (copyMessage) {

                copyMessage.textContent = "Impossibile copiare.";

            }

        }

    });

}


/* ========================================= */
/* IL NOSTRO SOGNO */
/* ========================================= */

const giftToggle = document.getElementById("giftToggle");
const giftDetails = document.getElementById("giftDetails");

if (giftToggle && giftDetails) {

    giftToggle.addEventListener("click", () => {

        const hidden = giftDetails.hasAttribute("hidden");

        if (hidden) {

            giftDetails.removeAttribute("hidden");

            giftToggle.textContent = "Nascondi";

            giftToggle.setAttribute("aria-expanded", "true");

        } else {

            giftDetails.setAttribute("hidden", "");

            giftToggle.textContent = "Scopri di più";

            giftToggle.setAttribute("aria-expanded", "false");

        }

    });

}


/* ========================================= */
/* COPIA IBAN */
/* ========================================= */

const copyIbanButton = document.getElementById("copyIbanButton");
const ibanCode = document.getElementById("ibanCode");
const copyIbanMessage = document.getElementById("copyIbanMessage");

if (copyIbanButton && ibanCode) {

    copyIbanButton.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(ibanCode.textContent.trim());

            if (copyIbanMessage) {

                copyIbanMessage.textContent = "IBAN copiato!";

                setTimeout(() => {

                    copyIbanMessage.textContent = "";

                }, 2000);

            }

        } catch {

            if (copyIbanMessage) {

                copyIbanMessage.textContent = "Impossibile copiare.";

            }

        }

    });

}
