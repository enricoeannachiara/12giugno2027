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
     * Controlliamo che la libreria
     * PageFlip sia stata caricata.
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


    pageFlip = new St.PageFlip(
        flapBook,
        {

            /*
             * Dimensioni logiche del viewer.
             *
             * Il CSS ruota poi tutto di 90°.
             */

            width: 500,
            height: 900,

            size: "stretch",

            minWidth: 250,
            maxWidth: 1000,

            minHeight: 450,
            maxHeight: 1800,


            /*
             * La prima pagina NON deve
             * essere una copertina rigida.
             */

            showCover: false,


            /*
             * Manteniamo la modalità portrait
             * per evitare il comportamento
             * da libro aperto su desktop.
             */

            usePortrait: true,


            /*
             * Disattiviamo completamente
             * le gesture automatiche.
             *
             * L'utente apre il lembo
             * esclusivamente con il nostro tap.
             */

            useMouseEvents: false,

            mobileScrollSupport: false,

            disableFlipByClick: true,

            showPageCorners: false,


            /*
             * Durata lenta.
             */

            flippingTime: 3400,


            /*
             * TEST IMPORTANTE:
             *
             * disattiviamo completamente
             * le ombre generate da PageFlip.
             *
             * In questo modo la pagina
             * trasparente non dovrebbe più
             * diventare visibile attraverso
             * le sue ombreggiature.
             */

            drawShadow: false,

            maxShadowOpacity: 0
        }
    );


    /*
     * Carichiamo le due pagine
     * presenti nell'HTML.
     */

    pageFlip.loadFromHTML(
        document.querySelectorAll(".flap-page")
    );


    /*
     * Partenza dalla prima pagina.
     */

    try {

        pageFlip.turnToPage(0);

    } catch (error) {

        /*
         * Se la versione della libreria
         * non richiede questo comando,
         * ignoriamo semplicemente l'errore.
         */

    }

}


/* ========================================= */
/* APERTURA DEL LEMBO */
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
     * Avviamo lo sfoglio programmatico.
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

function connectPageFlipEvents() {

    if (!pageFlip) {
        return;
    }


    pageFlip.on(
        "flip",
        (event) => {

            /*
             * Quando PageFlip segnala
             * il passaggio alla pagina 1,
             * il lembo ha completato
             * lo sfoglio.
             */

            if (event.data === 1) {

                setTimeout(() => {

                    if (!envelopeScreen) {
                        return;
                    }


                    /*
                     * Nascondiamo l'overlay.
                     *
                     * A questo punto resta
                     * soltanto la Hero reale.
                     */

                    envelopeScreen.classList.add(
                        "opened"
                    );

                    envelopeScreen.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                    updateScrollIndicator();

                }, 120);

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


    /*
     * Finché la busta non è aperta,
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
