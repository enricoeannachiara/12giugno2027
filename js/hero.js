const hero =
    document.querySelector(".hero");

let heroRevealTimer =
    null;


/* =======================================================
   REVEAL HERO
======================================================= */

function revealHero() {

    if (!hero) {
        return;
    }

    hero.classList.add(
        "is-revealed"
    );
}


/* =======================================================
   SINCRONIZZAZIONE CON LA BUSTA
======================================================= */

window.addEventListener(
    "envelopeopening",
    () => {

        if (heroRevealTimer) {
            clearTimeout(
                heroRevealTimer
            );
        }

        /*
         * La discesa del corpo della busta
         * inizia a circa 1600 ms.
         *
         * Il reveal parte 350 ms prima,
         * così il movimento comincia mentre
         * il lembo superiore sta ancora
         * completando l'apertura.
         */
        heroRevealTimer =
            setTimeout(
                revealHero,
                1250
            );
    }
);


/* =======================================================
   SICUREZZA
======================================================= */

if (
    window.envelopeState &&
    window.envelopeState.opened
) {
    revealHero();
}
