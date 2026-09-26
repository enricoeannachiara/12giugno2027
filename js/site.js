const scrollIndicator =
    document.getElementById("scrollIndicator");

const copyWedshootsCode =
    document.getElementById("copyWedshootsCode");

const wedshootsCode =
    document.getElementById("wedshootsCode");

const giftToggle =
    document.getElementById("giftToggle");

const giftDetails =
    document.getElementById("giftDetails");

const copyIban =
    document.getElementById("copyIban");

const ibanCode =
    document.getElementById("ibanCode");

let scrollFramePending = false;
let scrollIndicatorEnabled = false;

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
                document.createElement("textarea");

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
        !scrollIndicator ||
        !scrollIndicatorEnabled
    ) {
        return;
    }

    const documentHeight =
        document.documentElement.scrollHeight;

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
        window.scrollY > 25
    ) {
        scrollIndicator.classList.add(
            "compact"
        );
    } else {
        scrollIndicator.classList.remove(
            "compact"
        );
    }

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

function enableScrollIndicator() {
    scrollIndicatorEnabled = true;

    updateScrollIndicator();
}

window.addEventListener(
    "envelopeopening",
    () => {
        window.setTimeout(
            enableScrollIndicator,
            700
        );
    }
);

window.addEventListener(
    "envelopeopened",
    () => {
        scrollIndicatorEnabled = true;

        updateScrollIndicator();
    }
);

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
