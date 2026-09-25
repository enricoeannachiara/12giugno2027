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
/* DIMENSIONI DEL MOTORE */
/* ========================================= */

function getFlipDimensions() {

    /*
     * Il viewer viene poi ruotato di 90° dal CSS.
     *
     * Quindi:
     *
     * larghezza logica  = metà altezza viewport
     * altezza logica    = larghezza viewport
     */

    const width =
        Math.round(window.innerHeight * 0.5);

    const height =
        Math.round(window.innerWidth);

    return {
        width,
        height
    };

}


/* ========================================= */
/* INIZIALIZZAZIONE PAGEFLIP */
/* ========================================= */

function initEnvelopeFlip() {

    if (!flapBook) {
        return;
    }


    if (
        typeof St === "undefined" ||
        typeof St.PageFlip === "undefined"
    ) {

        console.error(
            "StPageFlip non è stato caricato."
        );

        return;
    }


    const dimensions =
        getFlipDimensions();


    pageFlip = new St.PageFlip(
        flapBook,
        {

            /* dimensioni controllate da noi */

            width: dimensions.width,
            height: dimensions.height,


            /*
             * NIENTE STRETCH.
             *
             * La libreria non deve più
             * ridimensionare autonomamente
             * il lembo.
             */

            size: "fixed",


            /*
             * Non deve modificare le dimensioni
             * del contenitore HTML.
             */

            autoSize: false,


            /*
             * NIENTE PORTRAIT MODE.
             *
             * Questa modalità clona gli elementi
             * HTML e nel nostro caso può produrre
             * il lembo duplicato.
             */

            usePortrait: false,


            /*
             * Il lembo è carta morbida,
             * non una copertina rigida.
             */

            showCover: false,


            /*
             * Nessuna interazione nativa
             * della libreria.
             *
             * Il tap viene gestito esclusivamente
             * dal nostro codice.
             */

            useMouseEvents: false,

            mobileScrollSupport: false,

            disableFlipByClick: true,

            showPageCorners: false,


            /*
             * Durata dell'animazione.
             */

            flippingTime: 3400,


            /*
             * Per ora niente ombre automatiche.
             *
             * Così non vediamo la pagina
             * trasparente durante il flip.
             */

            drawShadow: false,

            maxShadowOpacity: 0,


            /*
             * Pagina iniziale.
             */

            startPage: 0
        }
    );


    /*
     * Carichiamo le pagine HTML.
     */

    pageFlip.loadFromHTML(
        document.querySelectorAll(".flap-page")
    );

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


    try {

        /*
         * IMPORTANTISSIMO:
         *
         * ora scegliamo esplicitamente
         * l'angolo di partenza.
         *
         * Dopo la rotazione CSS di 90°
         * questo dovrebbe corrispondere
         * all'apertura verso l'alto.
         */

        pageFlip.flipNext("top");

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


    /*
     * Ci interessa soprattutto sapere
     * quando il motore torna nello stato
     * "read", cioè quando l'animazione
     * è terminata.
     */

    pageFlip.on(
        "changeState",
        (event) => {

            if (
                event.data === "read" &&
                envelopeOpened
            ) {

                const currentPage =
                    pageFlip.getCurrentPageIndex();


                /*
                 * Se siamo arrivati alla
                 * seconda pagina, il flip
                 * è realmente terminato.
                 */

                if (currentPage === 1) {

                    finishEnvelopeOpening();

                }

            }

        }
    );

}


/* ========================================= */
/* FINE APERTURA */
/* ========================================= */

function finishEnvelopeOpening() {

    if (!envelopeScreen) {
        return;
    }


    /*
     * Piccolissima pausa per evitare
     * che l'overlay sparisca nello stesso
     * identico frame in cui PageFlip termina.
     */

    setTimeout(() => {

        envelopeScreen.classList.add(
            "opened"
        );

        envelopeScreen.setAttribute(
            "aria-hidden",
            "true"
        );

        updateScrollIndicator();

    }, 80);

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
/* EVENTI SCROLL */
/* ========================================= */

window.addEventListener(
    "scroll",
    updateScrollIndicator,
    { passive: true }
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
