const $ = id => document.getElementById(id);

const envelopeScreen = $("envelopeScreen");
const envelopeStage = $("envelopeStage");
const envelopeBody = $("envelopeBody");

const flap = $("flap");
const flapPath = $("flapPath");
const flapEdgePath = $("flapEdgePath");
const flapShadow = $("flapShadow");
const waxSeal = $("waxSeal");

const frontStop1 = $("frontStop1");
const frontStop2 = $("frontStop2");
const frontStop3 = $("frontStop3");

const bodyLeftPath = $("bodyLeftPath");
const bodyRightPath = $("bodyRightPath");
const bodyBottomPath = $("bodyBottomPath");

const bodyLeftFold = $("bodyLeftFold");
const bodyRightFold = $("bodyRightFold");
const bodyBottomFold = $("bodyBottomFold");


const FLAP_DURATION = 3400;
const BODY_START = 1600;
const BODY_DURATION = 1450;
const FLAP_FADE_DURATION = 280;


/*
 * Variazioni inferiori a questa soglia vengono considerate
 * variazioni del viewport dovute all'interfaccia del browser
 * e non un vero ridimensionamento della finestra.
 */
const REAL_RESIZE_THRESHOLD = 20;


/*
 * Piccolo ritardo per lasciare terminare il ridimensionamento
 * della finestra o la rotazione dello smartphone prima di
 * rileggere le dimensioni.
 */
const REAL_RESIZE_DELAY = 180;


let flapFrameId = null;
let bodyFrameId = null;
let fadeFrameId = null;

let opening = false;
let opened = false;


/*
 * Dimensioni attualmente utilizzate dalla busta.
 */
let envelopeWidth = 0;
let envelopeHeight = 0;


/*
 * Larghezza usata per distinguere:
 *
 * - variazione verticale delle barre di Safari
 * - vero resize / rotazione
 */
let lastWindowWidth = 0;


/*
 * Timer per il debounce del resize.
 */
let resizeTimer = null;


/*
 * Se avviene un vero resize mentre la busta si sta aprendo,
 * lo memorizziamo e lo applichiamo al termine dell'animazione.
 */
let resizePending = false;


window.envelopeState = {
    opened: false
};


/* =======================================================
   FUNZIONI DI SUPPORTO
======================================================= */

function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );

}


function easeInOutCubic(t) {

    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

}


function easeOutCubic(t) {

    return 1 - Math.pow(1 - t, 3);

}


function bendCurve(t) {

    return Math.pow(
        Math.max(
            0,
            Math.sin(Math.PI * t)
        ),
        0.72
    );

}


function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(
            resolve,
            milliseconds
        );

    });

}


/* =======================================================
   DIMENSIONI DELLA BUSTA
======================================================= */

function freezeEnvelopeSize() {

    envelopeWidth =
        window.innerWidth;


    envelopeHeight =
        window.innerHeight;


    document.documentElement.style.setProperty(
        "--envelope-width",
        `${envelopeWidth}px`
    );


    document.documentElement.style.setProperty(
        "--envelope-height",
        `${envelopeHeight}px`
    );

}


/*
 * Aggiorna le dimensioni dopo un vero resize.
 *
 * IMPORTANTE:
 * non viene richiamata quando cambia soltanto l'altezza
 * disponibile a causa delle barre dinamiche di Safari.
 */
function updateEnvelopeSize() {

    if (opened) {
        return;
    }


    freezeEnvelopeSize();


    lastWindowWidth =
        window.innerWidth;

}


/* =======================================================
   GESTIONE RESIZE / ROTAZIONE
======================================================= */

function handleViewportResize() {

    if (opened) {
        return;
    }


    const currentWidth =
        window.innerWidth;


    const widthDifference =
        Math.abs(
            currentWidth -
            lastWindowWidth
        );


    /*
     * Se cambia soltanto l'altezza, oppure la variazione
     * della larghezza è minima, ignoriamo l'evento.
     *
     * Questo è il caso tipico delle barre dinamiche
     * di Safari su iPhone.
     */
    if (
        widthDifference <=
        REAL_RESIZE_THRESHOLD
    ) {

        return;

    }


    /*
     * Abbiamo rilevato un vero ridimensionamento.
     *
     * Se la busta si sta aprendo, non tocchiamo la sua
     * geometria a metà animazione.
     */
    if (opening) {

        resizePending = true;

        return;

    }


    clearTimeout(
        resizeTimer
    );


    resizeTimer =
        setTimeout(() => {

            updateEnvelopeSize();

        }, REAL_RESIZE_DELAY);

}


/* =======================================================
   GEOMETRIA LEMBO SUPERIORE
======================================================= */

function getFlapGeometry(t) {

    const bend =
        bendCurve(t);


    const tipY =
        1000 -
        190 * bend;


    const tipLeftX =
        468;


    const tipRightX =
        532;


    const tipSideY =
        tipY - 15;


    const shoulderY =
        420 +
        35 * bend;


    const leftShoulderX =
        12 * bend;


    const rightShoulderX =
        1000 -
        12 * bend;


    const rightControl1X =
        835 -
        18 * bend;


    const rightControl1Y =
        590 +
        15 * bend;


    const rightControl2X =
        625 -
        10 * bend;


    const rightControl2Y =
        860 -
        50 * bend;


    const leftControl1X =
        165 +
        18 * bend;


    const leftControl1Y =
        rightControl1Y;


    const leftControl2X =
        375 +
        10 * bend;


    const leftControl2Y =
        rightControl2Y;


    const d = `
        M 0 0
        L 1000 0
        L 1000 ${shoulderY - 30}
        Q 1000 ${shoulderY} ${rightShoulderX} ${shoulderY}
        C ${rightControl1X} ${rightControl1Y},
          ${rightControl2X} ${rightControl2Y},
          ${tipRightX} ${tipSideY}
        Q 500 ${tipY} ${tipLeftX} ${tipSideY}
        C ${leftControl2X} ${leftControl2Y},
          ${leftControl1X} ${leftControl1Y},
          ${leftShoulderX} ${shoulderY}
        Q 0 ${shoulderY} 0 ${shoulderY - 30}
        L 0 0
        Z
    `;


    return {
        d,
        tipY,
        bend
    };

}


/* =======================================================
   CORPO DELLA BUSTA
======================================================= */

function drawEnvelopeBody() {

    const sideStartY = 192.5;
    const sideMeetY = 500;
    const leftMeetX = 492;
    const rightMeetX = 508;


    bodyLeftPath.setAttribute(
        "d",
        `
            M 0 ${sideStartY}
            L ${leftMeetX} ${sideMeetY}
            L 0 1000
            Z
        `
    );


    bodyLeftFold.setAttribute(
        "d",
        `
            M 0 ${sideStartY}
            L ${leftMeetX} ${sideMeetY}
        `
    );


    bodyRightPath.setAttribute(
        "d",
        `
            M 1000 ${sideStartY}
            L 1000 1000
            L ${rightMeetX} ${sideMeetY}
            Z
        `
    );


    bodyRightFold.setAttribute(
        "d",
        `
            M 1000 ${sideStartY}
            L ${rightMeetX} ${sideMeetY}
        `
    );


    const tipY = 490;
    const tipLeftX = 468;
    const tipRightX = 532;
    const tipSideY = 505;
    const verticalStartY = 750;


    bodyBottomPath.setAttribute(
        "d",
        `
            M 0 1000
            L 0 ${verticalStartY}
            L ${tipLeftX} ${tipSideY}
            Q 500 ${tipY} ${tipRightX} ${tipSideY}
            L 1000 ${verticalStartY}
            L 1000 1000
            Z
        `
    );


    bodyBottomFold.setAttribute(
        "d",
        `
            M 0 ${verticalStartY}
            L ${tipLeftX} ${tipSideY}
            Q 500 ${tipY} ${tipRightX} ${tipSideY}
            L 1000 ${verticalStartY}
        `
    );

}


/* =======================================================
   DISEGNO DEL LEMBO DURANTE L'ANIMAZIONE
======================================================= */

function drawFlapFrame(progress) {

    const t =
        clamp(
            progress,
            0,
            1
        );


    const geometry =
        getFlapGeometry(t);


    const bend =
        geometry.bend;


    let rotation;


    if (t < 0.94) {

        rotation =
            181.5 *
            easeInOutCubic(
                t / 0.94
            );

    } else {

        const settle =
            (t - 0.94) /
            0.06;


        rotation =
            181.5 -
            1.5 *
            easeOutCubic(
                settle
            );

    }


    const depth =
        20 * bend;


    flap.style.transform =
        `rotateX(${rotation}deg)
         translateZ(${depth}px)`;


    flapPath.setAttribute(
        "d",
        geometry.d
    );


    flapEdgePath.setAttribute(
        "d",
        geometry.d
    );


    flapPath.setAttribute(
        "fill",
        rotation < 90
            ? "url(#paperFront)"
            : "url(#paperBack)"
    );


    waxSeal.style.left =
        "50%";


    waxSeal.style.top =
        `${geometry.tipY / 10}%`;


    waxSeal.style.visibility =
        rotation < 90
            ? "visible"
            : "hidden";


    flapShadow.style.opacity =
        `${0.23 * bend}`;


    flapShadow.style.transform = `
        translate(-50%, ${-50 + 17 * t}%)
        scaleX(${0.93 - 0.15 * bend})
        scaleY(${0.08 + 0.74 * bend})
    `;


    const shade =
        Math.round(
            8 * bend
        );


    frontStop1.setAttribute(
        "stop-color",
        `rgb(${234 - shade}, ${220 - shade}, ${200 - shade})`
    );


    frontStop2.setAttribute(
        "stop-color",
        `rgb(${234 - shade / 2}, ${220 - shade / 2}, ${200 - shade / 2})`
    );


    frontStop3.setAttribute(
        "stop-color",
        `rgb(${222 - shade}, ${200 - shade}, ${173 - shade})`
    );

}


/* =======================================================
   MOTORE ANIMAZIONE
======================================================= */

function animate(
    duration,
    draw,
    setFrameId
) {

    return new Promise(resolve => {

        const start =
            performance.now();


        function frame(now) {

            const progress =
                clamp(
                    (now - start) /
                    duration,
                    0,
                    1
                );


            draw(progress);


            if (progress < 1) {

                setFrameId(
                    requestAnimationFrame(
                        frame
                    )
                );

            } else {

                setFrameId(null);

                resolve();

            }

        }


        setFrameId(
            requestAnimationFrame(
                frame
            )
        );

    });

}


/* =======================================================
   ANIMAZIONE LEMBO
======================================================= */

function animateFlap() {

    return animate(
        FLAP_DURATION,

        drawFlapFrame,

        id => {
            flapFrameId = id;
        }
    );

}


/* =======================================================
   DISCESA DEL CORPO DELLA BUSTA
======================================================= */

function animateEnvelopeDown() {

    return animate(
        BODY_DURATION,

        progress => {

            const e =
                easeInOutCubic(
                    progress
                );


            const distance =
                envelopeHeight *
                1.12 *
                e;


            envelopeBody.style.transform =
                `translateY(${distance}px)`;

        },

        id => {
            bodyFrameId = id;
        }
    );

}


/* =======================================================
   DISSOLVENZA DEL LEMBO
======================================================= */

function fadeOutFlap() {

    return animate(
        FLAP_FADE_DURATION,

        progress => {

            const e =
                easeOutCubic(
                    progress
                );


            flap.style.opacity =
                `${1 - e}`;


            flapShadow.style.opacity =
                `${0.06 * (1 - e)}`;

        },

        id => {
            fadeFrameId = id;
        }

    ).then(() => {

        flap.style.opacity =
            "0";


        flapShadow.style.opacity =
            "0";

    });

}


/* =======================================================
   APERTURA DELLA BUSTA
======================================================= */

async function openEnvelope() {

    if (
        opening ||
        opened
    ) {
        return;
    }


    opening =
        true;


    window.dispatchEvent(
        new CustomEvent(
            "envelopeopening"
        )
    );


    const flapPromise =
        animateFlap();


    await wait(
        BODY_START
    );


    const bodyPromise =
        animateEnvelopeDown();


    await flapPromise;


    const fadePromise =
        fadeOutFlap();


    await Promise.all([
        bodyPromise,
        fadePromise
    ]);


    opening =
        false;


    opened =
        true;


    window.envelopeState.opened =
        true;


    /*
     * A questo punto la busta sta per essere nascosta,
     * quindi un eventuale resize rimasto in sospeso
     * non ha più bisogno di essere applicato.
     */
    resizePending =
        false;


    envelopeScreen.classList.add(
        "opened"
    );


    envelopeScreen.setAttribute(
        "aria-hidden",
        "true"
    );


    envelopeScreen.hidden =
        true;


    window.scrollTo(
        0,
        0
    );


    window.dispatchEvent(
        new CustomEvent(
            "envelopeopened"
        )
    );

}


/* =======================================================
   INIZIALIZZAZIONE
======================================================= */

function initialiseEnvelope() {

    window.scrollTo(
        0,
        0
    );


    /*
     * Al caricamento rileviamo le dimensioni reali.
     *
     * Da questo momento le variazioni della sola altezza
     * causate dalle barre di Safari vengono ignorate.
     */
    freezeEnvelopeSize();


    lastWindowWidth =
        window.innerWidth;


    drawEnvelopeBody();


    const initialGeometry =
        getFlapGeometry(0);


    flapPath.setAttribute(
        "d",
        initialGeometry.d
    );


    flapEdgePath.setAttribute(
        "d",
        initialGeometry.d
    );


    flapPath.setAttribute(
        "fill",
        "url(#paperFront)"
    );


    waxSeal.style.left =
        "50%";


    waxSeal.style.top =
        `${initialGeometry.tipY / 10}%`;


    waxSeal.style.visibility =
        "visible";

}


/* =======================================================
   EVENTI BUSTA
======================================================= */

envelopeStage.addEventListener(
    "click",
    openEnvelope
);


envelopeStage.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            openEnvelope();

        }

    }
);


/* =======================================================
   EVENTI RESIZE
======================================================= */

/*
 * Desktop:
 * ridimensionamento della finestra.
 *
 * iPhone:
 * anche le barre di Safari generano resize, ma vengono
 * ignorate perché non modificano significativamente
 * window.innerWidth.
 */
window.addEventListener(
    "resize",
    handleViewportResize
);


/*
 * orientationchange ci dà un secondo segnale esplicito
 * sui dispositivi mobili.
 *
 * Non aggiorniamo immediatamente perché Safari impiega
 * un breve intervallo per stabilizzare le nuove dimensioni.
 */
window.addEventListener(
    "orientationchange",
    () => {

        if (
            opened ||
            opening
        ) {
            return;
        }


        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(() => {

                updateEnvelopeSize();

            }, REAL_RESIZE_DELAY);

    }
);


/* =======================================================
   AVVIO
======================================================= */

initialiseEnvelope();
