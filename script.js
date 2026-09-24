/* ========================================= */
/* BUSTA INIZIALE */
/* ========================================= */

const envelopeScreen =
    document.getElementById("envelopeScreen");

const envelopeButton =
    document.getElementById("envelopeButton");

let envelopeOpened = false;


/* ========================================= */
/* APERTURA DELLA BUSTA */
/* ========================================= */

function openEnvelope() {

    if (!envelopeScreen || !envelopeButton) {
        return;
    }

    if (envelopeOpened) {
        return;
    }

    envelopeOpened = true;


    /*
     * FASE 1
     * -----------------------------------------
     *
     * L'apertura parte subito.
     *
     * Lo "scatto" iniziale del lembo
     * non viene gestito qui:
     * è già incorporato nei keyframe CSS.
     *
     * Durata totale rotazione lembo:
     * circa 1,8 secondi.
     */

    envelopeScreen.classList.add("opening");


    /*
     * FASE 2
     * -----------------------------------------
     *
     * Aspettiamo che il lembo sia già
     * abbondantemente sollevato.
     *
     * A questo punto la partecipazione
     * interna è ben visibile e iniziamo
     * a far scendere la struttura della busta.
     */

    setTimeout(() => {

        envelopeScreen.classList.add("reveal");

    }, 1050);


    /*
     * FASE 3
     * -----------------------------------------
     *
     * Attendiamo la conclusione sia:
     *
     * - della rotazione del lembo;
     * - della discesa della busta;
     * - del leggero movimento del cartoncino.
     *
     * Solo allora togliamo completamente
     * l'overlay.
     */

    setTimeout(() => {

        envelopeScreen.classList.add("opened");

        envelopeScreen.setAttribute(
            "aria-hidden",
            "true"
        );

        updateScrollIndicator();

    }, 2550);

}


/* ========================================= */
/* APERTURA CON TAP / CLICK */
/* ========================================= */

if (envelopeButton) {

    envelopeButton.addEventListener(
        "click",
        openEnvelope
    );


    /*
     * ACCESSIBILITÀ TASTIERA
     */

    envelopeButton.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openEnvelope();

            }

        }
    );

}


/* ========================================= */
/* INDICATORE "SCORRI" */
/* ========================================= */

const scrollIndicator =
    document.getElementById("scrollIndicator");


function updateScrollIndicator() {

    if (!scrollIndicator) {
        return;
    }


    /*
     * Finché la busta è ancora presente,
     * l'indicatore resta nascosto.
     */

    if (
        envelopeScreen &&
        !envelopeScreen.classList.contains("opened")
    ) {

        scrollIndicator.classList.add("hidden");

        return;
    }


    const scrollPosition =
        window.scrollY + window.innerHeight;

    const pageHeight =
        document.documentElement.scrollHeight;

    const distanceFromBottom =
        pageHeight - scrollPosition;


    /*
     * Nascondiamo "Scorri" quando
     * siamo quasi a fondo pagina.
     */

    if (distanceFromBottom < 90) {

        scrollIndicator.classList.add("hidden");

    } else {

        scrollIndicator.classList.remove("hidden");

    }

}


/* ========================================= */
/* EVENTI SCROLL / RESIZE */
/* ========================================= */

window.addEventListener(
    "scroll",
    updateScrollIndicator,
    { passive: true }
);

window.addEventListener(
    "resize",
    updateScrollIndicator
);


/* ========================================= */
/* COPIA CODICE WEDSHOOTS */
/* ========================================= */

const copyCodeButton =
    document.getElementById("copyCodeButton");

const copyMessage =
    document.getElementById("copyMessage");

const accessCode =
    document.getElementById("accessCode");


async function copyAccessCode() {

    if (!accessCode) {
        return;
    }

    const code =
        accessCode.textContent.trim();


    try {

        await navigator.clipboard.writeText(code);


        if (copyMessage) {
            copyMessage.textContent = "Codice copiato";
        }

        if (copyCodeButton) {
            copyCodeButton.textContent = "Copiato ✓";
        }


        setTimeout(() => {

            if (copyMessage) {
                copyMessage.textContent = "";
            }

            if (copyCodeButton) {
                copyCodeButton.textContent = "Copia codice";
            }

        }, 1800);


    } catch (error) {

        if (copyMessage) {

            copyMessage.textContent =
                "Tieni premuto sul codice per copiarlo";

        }

    }

}


if (copyCodeButton) {

    copyCodeButton.addEventListener(
        "click",
        copyAccessCode
    );

}


/* ========================================= */
/* IL NOSTRO SOGNO */
/* ========================================= */

const giftToggle =
    document.getElementById("giftToggle");

const giftDetails =
    document.getElementById("giftDetails");


function toggleGiftDetails() {

    if (!giftToggle || !giftDetails) {
        return;
    }


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


if (giftToggle) {

    giftToggle.addEventListener(
        "click",
        toggleGiftDetails
    );

}


/* ========================================= */
/* COPIA IBAN */
/* ========================================= */

const copyIbanButton =
    document.getElementById("copyIbanButton");

const copyIbanMessage =
    document.getElementById("copyIbanMessage");

const ibanCode =
    document.getElementById("ibanCode");


async function copyIban() {

    if (!ibanCode) {
        return;
    }

    const iban =
        ibanCode.textContent.trim();


    try {

        await navigator.clipboard.writeText(iban);


        if (copyIbanMessage) {
            copyIbanMessage.textContent = "IBAN copiato";
        }

        if (copyIbanButton) {
            copyIbanButton.textContent = "Copiato ✓";
        }


        setTimeout(() => {

            if (copyIbanMessage) {
                copyIbanMessage.textContent = "";
            }

            if (copyIbanButton) {
                copyIbanButton.textContent = "Copia IBAN";
            }

        }, 1800);


    } catch (error) {

        if (copyIbanMessage) {

            copyIbanMessage.textContent =
                "Tieni premuto sull'IBAN per copiarlo";

        }

    }

}


if (copyIbanButton) {

    copyIbanButton.addEventListener(
        "click",
        copyIban
    );

}


/* ========================================= */
/* AVVIO */
/* ========================================= */

updateScrollIndicator();
