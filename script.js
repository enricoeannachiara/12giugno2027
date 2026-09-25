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

const scrollIndicator = $("scrollIndicator");

const copyWedshootsCode = $("copyWedshootsCode");
const wedshootsCode = $("wedshootsCode");

const giftToggle = $("giftToggle");
const giftDetails = $("giftDetails");

const copyIban = $("copyIban");
const ibanCode = $("ibanCode");

const countdown = $("countdown");
const countdownDays = $("countdownDays");
const countdownHours = $("countdownHours");
const countdownMinutes = $("countdownMinutes");
const countdownSeconds = $("countdownSeconds");

const FLAP_DURATION = 3400;
const BODY_START = 1600;
const BODY_DURATION = 1450;
const FLAP_FADE_DURATION = 280;

const WEDDING_DATE = new Date("2027-06-12T11:00:00+02:00");

let flapFrameId = null;
let bodyFrameId = null;
let fadeFrameId = null;

let opening = false;
let opened = false;

let countdownTimer = null;
let scrollFramePending = false;

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

function getFlapGeometry(t) {
    const bend = bendCurve(t);

    const tipX = 500;
    const tipY = 1000 - 190 * bend;

    const shoulderY = 420 + 35 * bend;

    const leftShoulderX = 12 * bend;
    const rightShoulderX = 1000 - 12 * bend;

    const rightControl1X = 835 - 18 * bend;
    const rightControl1Y = 590 + 15 * bend;

    const rightControl2X = 625 - 10 * bend;
    const rightControl2Y = 860 - 50 * bend;

    const leftControl1X = 165 + 18 * bend;
    const leftControl1Y = rightControl1Y;

    const leftControl2X = 375 + 10 * bend;
    const leftControl2Y = rightControl2Y;

    const d = `
        M 0 0

        L 1000 0

        L
        1000
        ${shoulderY - 30}

        Q
        1000
        ${shoulderY}

        ${rightShoulderX}
        ${shoulderY}

        C
        ${rightControl1X}
        ${rightControl1Y},

        ${rightControl2X}
        ${rightControl2Y},

        ${tipX}
        ${tipY}

        C
        ${leftControl2X}
        ${leftControl2Y},

        ${leftControl1X}
        ${leftControl1Y},

        ${leftShoulderX}
        ${shoulderY}

        Q
        0
        ${shoulderY}

        0
        ${shoulderY - 30}

        L
        0
        0

        Z
    `;

    return {
        d,
        tipY,
        bend
    };
}

function drawEnvelopeBody() {
    const sideStartY = 192.5;
    const sideMeetY = 500;

    const leftMeetX = 492;
    const rightMeetX = 508;

    bodyLeftPath.setAttribute(
        "d",
        `
            M 0 ${sideStartY}

            L
            ${leftMeetX}
            ${sideMeetY}

            L 0 1000

            Z
        `
    );

    bodyLeftFold.setAttribute(
        "d",
        `
            M 0 ${sideStartY}

            L
            ${leftMeetX}
            ${sideMeetY}
        `
    );

    bodyRightPath.setAttribute(
        "d",
        `
            M 1000 ${sideStartY}

            L 1000 1000

            L
            ${rightMeetX}
            ${sideMeetY}

            Z
        `
    );

    bodyRightFold.setAttribute(
        "d",
        `
            M 1000 ${sideStartY}

            L
            ${rightMeetX}
            ${sideMeetY}
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

            L
            0
            ${verticalStartY}

            L
            ${tipLeftX}
            ${tipSideY}

            Q
            500
            ${tipY}

            ${tipRightX}
            ${tipSideY}

            L
            1000
            ${verticalStartY}

            L
            1000
            1000

            Z
        `
    );

    bodyBottomFold.setAttribute(
        "d",
        `
            M
            0
            ${verticalStartY}

            L
            ${tipLeftX}
            ${tipSideY}

            Q
            500
            ${tipY}

            ${tipRightX}
            ${tipSideY}

            L
            1000
            ${verticalStartY}
        `
    );
}

function drawFlapFrame(progress) {
    const t = clamp(
        progress,
        0,
        1
    );

    const geometry = getFlapGeometry(t);
    const bend = geometry.bend;

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

    flapShadow.style.transform =
        `
            translate(
                -50%,
                ${-50 + 17 * t}%
            )

            scaleX(
                ${0.93 - 0.15 * bend}
            )

            scaleY(
                ${0.08 + 0.74 * bend}
            )
        `;

    const shade =
        Math.round(
            8 * bend
        );

    frontStop1.setAttribute(
        "stop-color",
        `rgb(
            ${234 - shade},
            ${220 - shade},
            ${200 - shade}
        )`
    );

    frontStop2.setAttribute(
        "stop-color",
        `rgb(
            ${234 - shade / 2},
            ${220 - shade / 2},
            ${200 - shade / 2}
        )`
    );

    frontStop3.setAttribute(
        "stop-color",
        `rgb(
            ${222 - shade},
            ${200 - shade},
            ${173 - shade}
        )`
    );
}

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

function animateFlap() {
    return animate(
        FLAP_DURATION,
        drawFlapFrame,
        id => {
            flapFrameId = id;
        }
    );
}

function animateEnvelopeDown() {
    return animate(
        BODY_DURATION,

        progress => {
            const e =
                easeInOutCubic(
                    progress
                );

            envelopeBody.style.transform =
                `translateY(
                    ${112 * e}vh
                )`;
        },

        id => {
            bodyFrameId = id;
        }
    );
}

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

async function openEnvelope() {
    if (
        opening ||
        opened
    ) {
        return;
    }

    opening = true;

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

    opening = false;
    opened = true;

    envelopeScreen.classList.add(
        "opened"
    );

    envelopeScreen.setAttribute(
        "aria-hidden",
        "true"
    );

    envelopeScreen.hidden =
        true;

    document.body.classList.remove(
        "envelope-locked"
    );

    updateScrollIndicator();
}

function initialiseEnvelope() {
    document.body.classList.add(
        "envelope-locked"
    );

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
        "100%";
}

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
        countdown.innerHTML =
            `
                <div class="countdown-paper-content">
                    <p class="countdown-title">
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
            totalSeconds /
            86400
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
        totalSeconds %
        60;

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

async function copyText(
    text,
    button,
    successLabel
) {
    const originalLabel =
        button.innerHTML;

    try {
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(
                text
            );
        } else {
            const textarea =
                document.createElement(
                    "textarea"
                );

            textarea.value =
                text;

            textarea.style.position =
                "fixed";

            textarea.style.opacity =
                "0";

            textarea.style.pointerEvents =
                "none";

            document.body.appendChild(
                textarea
            );

            textarea.focus();
            textarea.select();

            document.execCommand(
                "copy"
            );

            textarea.remove();
        }

        button.textContent =
            successLabel;

    } catch {
        button.textContent =
            "Seleziona e copia";
    }

    window.setTimeout(
        () => {
            button.innerHTML =
                originalLabel;
        },
        1600
    );
}

function updateScrollIndicator() {
    if (
        !opened ||
        !scrollIndicator
    ) {
        return;
    }

    const documentHeight =
        document.documentElement
            .scrollHeight;

    const viewportBottom =
        window.scrollY +
        window.innerHeight;

    const distanceFromBottom =
        documentHeight -
        viewportBottom;

    const canScroll =
        documentHeight >
        window.innerHeight + 40;

    if (
        canScroll &&
        distanceFromBottom > 100
    ) {
        scrollIndicator.classList.add(
            "visible"
        );
    } else {
        scrollIndicator.classList.remove(
            "visible"
        );
    }
}

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

if (
    copyWedshootsCode &&
    wedshootsCode
) {
    copyWedshootsCode.addEventListener(
        "click",
        () => {
            copyText(
                wedshootsCode.textContent.trim(),
                copyWedshootsCode,
                "Copiato!"
            );
        }
    );
}

if (
    copyIban &&
    ibanCode
) {
    copyIban.addEventListener(
        "click",
        () => {
            copyText(
                ibanCode.textContent
                    .replace(/\s/g, "")
                    .trim(),

                copyIban,

                "Copiato!"
            );
        }
    );
}

if (
    giftToggle &&
    giftDetails
) {
    giftToggle.addEventListener(
        "click",
        () => {
            const isOpen =
                giftToggle.getAttribute(
                    "aria-expanded"
                ) === "true";

            giftToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            giftDetails.hidden =
                isOpen;

            giftToggle.innerHTML =
                isOpen
                    ? `
                        <span aria-hidden="true">
                            💝
                        </span>
                        Scopri di più
                    `
                    : `
                        <span aria-hidden="true">
                            💝
                        </span>
                        Nascondi
                    `;
        }
    );
}

window.addEventListener(
    "scroll",
    () => {
        if (
            scrollFramePending
        ) {
            return;
        }

        scrollFramePending =
            true;

        requestAnimationFrame(
            () => {
                updateScrollIndicator();

                scrollFramePending =
                    false;
            }
        );
    },
    {
        passive: true
    }
);

window.addEventListener(
    "resize",
    updateScrollIndicator
);

initialiseEnvelope();
startCountdown();
