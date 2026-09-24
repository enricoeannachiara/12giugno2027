/* ========================================= */
/* BUSTA INIZIALE */
/* ========================================= */

const envelopeScreen =
    document.getElementById("envelopeScreen");

const envelopeButton =
    document.getElementById("envelopeButton");

let envelopeOpened = false;


/* ========================================= */
/* APERTURA BUSTA */
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
     * Il tocco non provoca un movimento
     * immediato.
     *
     * Attendiamo 100 ms per rendere
     * l'apertura leggermente più naturale.
     *
     * Dopo 100 ms il lembo comincia
     * lentamente a ruotare.
     */

    setTimeout(() => {

        envelopeScreen.classList.add("opening");

    }, 100);


    /*
     * FASE 2
     * -----------------------------------------
     *
     * Il lembo ha già iniziato ad aprirsi.
     *
     * La Hero sottostante è visibile attraverso
     * l'apertura triangolare della tasca.
     *
     * Solo a questo punto iniziamo a far
     * scendere il corpo inferiore della busta.
     */

    setTimeout(() => {

        envelopeScreen.classList.add("reveal");

    }, 900);


    /*
     * FASE 3
     * -----------------------------------------
     *
     * Aspettiamo che:
     *
     * - il lembo abbia terminato la rotazione;
     * - il corpo della busta sia sceso;
     * - la Hero sia ormai completamente visibile.
     *
     * Solo ora togliamo l'overlay.
     */

    setTimeout(() => {

        envelopeScreen.classList.add("opened");

        envelopeScreen.setAttribute(
            "aria-hidden",
            "true"
        );

        updateScrollIndicator();

    }, 2400);

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
     * Accessibilità tastiera.
     *
     * La busta può essere aperta anche con:
     *
     * - INVIO
     * - BARRA SPAZIATRICE
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
     * Finché la busta è visibile,
     * l'indicatore "Scorri" deve
     * rimanere nascosto.
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
     * Nascondiamo l'indicatore quando
     * ci troviamo quasi alla fine
     * della pagina.
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

            copyMessage.textContent =
                "Codice copiato";

        }


        if (copyCodeButton) {

            copyCodeButton.textContent =
                "Copiato ✓";

        }


        setTimeout(() => {

            if (copyMessage) {

                copyMessage.textContent = "";

            }


            if (copyCodeButton) {

                copyCodeButton.textContent =
                    "Copia codice";

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

            copyIbanMessage.textContent =
                "IBAN copiato";

        }


        if (copyIbanButton) {

            copyIbanButton.textContent =
                "Copiato ✓";

        }


        setTimeout(() => {

            if (copyIbanMessage) {

                copyIbanMessage.textContent = "";

            }


            if (copyIbanButton) {

                copyIbanButton.textContent =
                    "Copia IBAN";

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

/*
 * Al caricamento della pagina:
 *
 * - la busta è chiusa;
 * - il sigillo è al centro;
 * - la Hero è già presente dietro;
 * - l'indicatore "Scorri" resta nascosto.
 */

updateScrollIndicator();
