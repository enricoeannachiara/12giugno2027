/* ========================================= */
/* ELEMENTI PRINCIPALI */
/* ========================================= */

const envelopeScreen =
    document.getElementById("envelopeScreen");

const envelopeButton =
    document.getElementById("envelopeButton");

const flapBook =
    document.getElementById("flapBook");

const scrollIndicator =
    document.getElementById("scrollIndicator");

let pageFlip = null;
let envelopeOpened = false;


/* ========================================= */
/* INIZIALIZZAZIONE PAGEFLIP */
/* ========================================= */

function initEnvelopeFlip() {

    if (!flapBook) {
        return;
    }

    /*
     * Verifica che la libreria sia stata
     * caricata correttamente.
     */

    if (
        typeof St === "undefined" ||
        typeof St.PageFlip === "undefined"
    ) {

        console.error(
            "StPageFlip non è stato caricato."
        );

        return;
    }


    /*
     * Dimensioni logiche del viewer.
     *
     * Il CSS ruota il viewer di 90°,
     * quindi queste dimensioni non
     * corrispondono direttamente a quelle
     * visibili sullo schermo.
     */

    pageFlip = new St.PageFlip(
        flapBook,
        {
            width: 500,
            height: 900,

            size: "stretch",

            minWidth: 250,
            maxWidth: 1000,

            minHeight: 450,
            maxHeight: 1800,

            /*
             * IMPORTANTISSIMO:
             *
             * niente copertina rigida.
             * La prima pagina deve comportarsi
             * come un vero foglio morbido.
             */

            showCover: false,


            /*
             * Evitiamo il comportamento
             * automatico da libro su desktop.
             */

            usePortrait: true,


            /*
             * L'utente NON deve sfogliare
             * manualmente.
             *
             * Lo sfoglio viene avviato
             * esclusivamente dal nostro click.
             */

            useMouseEvents: false,

            mobileScrollSupport: false,


            /*
             * Nessun angolino che suggerisca
             * la presenza di un libro.
             */

            showPageCorners: false,


            /*
             * Durata del movimento.
             *
             * StPageFlip usa millisecondi.
             */

            flippingTime: 3400,


            /*
             * Ombre generate dal motore.
             *
             * Le teniamo attive perché sono
             * una parte importante dell'effetto
             * di pagina che si incurva.
             */

            drawShadow: true,


            /*
             * Ombra piuttosto delicata.
             */

            maxShadowOpacity: 0.22,


            /*
             * Nessuna modalità rigida.
             */

            disableFlipByClick: true
        }
    );


    /*
     * Carichiamo le due pagine HTML
     * presenti nell'index.
     */

    pageFlip.loadFromHTML(
        document.querySelectorAll(".flap-page")
    );


    /*
     * Per sicurezza partiamo dalla
     * prima pagina.
     */

    try {

        pageFlip.turnToPage(0);

    } catch (error) {

        /*
         * Alcune versioni della libreria
         * non richiedono questo passaggio.
         */

    }

}


/* ========================================= */
/* APERTURA DELLA BUSTA */
/* ========================================= */

function openEnvelope() {

    if (envelopeOpened) {
        return;
    }

    if (!pageFlip) {
        return;
    }

    envelopeOpened = true;


    /*
     * Avviamo programmaticamente
     * lo sfoglio.
     */

    try {

        pageFlip.flipNext();

    } catch (error) {

        console.error(
            "Errore durante l'apertura del lembo:",
            error
        );

        envelopeOpened = false;

    }

}


/* ========================================= */
/* CLICK / TAP */
/* ========================================= */

if (envelopeButton) {

    envelopeButton.addEventListener(
        "click",
        openEnvelope
    );


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
/* EVENTI PAGEFLIP */
/* ========================================= */

/*
 * StPageFlip emette l'evento "flip"
 * quando cambia pagina.
 *
 * Per ora NON nascondiamo immediatamente
 * l'overlay.
 *
 * Aspettiamo che finisca l'animazione.
 */

function connectPageFlipEvents() {

    if (!pageFlip) {
        return;
    }


    pageFlip.on(
        "flip",
        (event) => {

            /*
             * Quando siamo arrivati alla
             * seconda pagina, significa
             * che il lembo si è aperto.
             */

            if (event.data === 1) {

                setTimeout(() => {

                    if (!envelopeScreen) {
                        return;
                    }


                    /*
                     * Per ora rimuoviamo
                     * semplicemente l'overlay
                     * dopo la fine dello sfoglio.
                     */

                    envelopeScreen.classList.add(
                        "opened"
                    );

                    envelopeScreen.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                    updateScrollIndicator();

                }, 150);

            }

        }
    );

}


/* ========================================= */
/* INDICATORE "SCORRI" */
/* ========================================= */

function updateScrollIndicator() {

    if (!scrollIndicator) {
        return;
    }


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

initEnvelopeFlip();

connectPageFlipEvents();

updateScrollIndicator();
