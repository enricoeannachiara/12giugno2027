const scrollIndicator = document.getElementById("scrollIndicator");

const copyCodeButton = document.getElementById("copyCodeButton");
const copyMessage = document.getElementById("copyMessage");
const accessCode = document.getElementById("accessCode");

const giftToggle = document.getElementById("giftToggle");
const giftDetails = document.getElementById("giftDetails");

const copyIbanButton = document.getElementById("copyIbanButton");
const copyIbanMessage = document.getElementById("copyIbanMessage");
const ibanCode = document.getElementById("ibanCode");


/* -------------------------------- */
/* INDICATORE "SCORRI" */
/* -------------------------------- */

function updateScrollIndicator() {

    const scrollPosition =
        window.scrollY + window.innerHeight;

    const pageHeight =
        document.documentElement.scrollHeight;

    const distanceFromBottom =
        pageHeight - scrollPosition;

    if (distanceFromBottom < 90) {

        scrollIndicator.classList.add("hidden");

    } else {

        scrollIndicator.classList.remove("hidden");

    }

}


/* -------------------------------- */
/* COPIA CODICE WEDSHOOTS */
/* -------------------------------- */

async function copyAccessCode() {

    const code =
        accessCode.textContent.trim();

    try {

        await navigator.clipboard.writeText(code);

        copyMessage.textContent =
            "Codice copiato";

        copyCodeButton.textContent =
            "Copiato ✓";

        setTimeout(() => {

            copyMessage.textContent = "";

            copyCodeButton.textContent =
                "Copia codice";

        }, 1800);

    } catch (error) {

        copyMessage.textContent =
            "Tieni premuto sul codice per copiarlo";

    }

}


/* -------------------------------- */
/* APERTURA / CHIUSURA DATI BONIFICO */
/* -------------------------------- */

function toggleGiftDetails() {

    const isHidden =
        giftDetails.hasAttribute("hidden");

    if (isHidden) {

        giftDetails.removeAttribute("hidden");

        giftToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        giftToggle.textContent =
            "Nascondi";

    } else {

        giftDetails.setAttribute(
            "hidden",
            ""
        );

        giftToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        giftToggle.textContent =
            "Scopri di più";

    }

}


/* -------------------------------- */
/* COPIA IBAN */
/* -------------------------------- */

async function copyIban() {

    const iban =
        ibanCode.textContent.trim();

    try {

        await navigator.clipboard.writeText(iban);

        copyIbanMessage.textContent =
            "IBAN copiato";

        copyIbanButton.textContent =
            "Copiato ✓";

        setTimeout(() => {

            copyIbanMessage.textContent = "";

            copyIbanButton.textContent =
                "Copia IBAN";

        }, 1800);

    } catch (error) {

        copyIbanMessage.textContent =
            "Tieni premuto sull'IBAN per copiarlo";

    }

}


/* -------------------------------- */
/* EVENTI */
/* -------------------------------- */

window.addEventListener(
    "scroll",
    updateScrollIndicator
);

window.addEventListener(
    "resize",
    updateScrollIndicator
);

copyCodeButton.addEventListener(
    "click",
    copyAccessCode
);

giftToggle.addEventListener(
    "click",
    toggleGiftDetails
);

copyIbanButton.addEventListener(
    "click",
    copyIban
);


/* -------------------------------- */
/* AVVIO */
/* -------------------------------- */

updateScrollIndicator();
