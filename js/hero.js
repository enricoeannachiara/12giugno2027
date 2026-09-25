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
         * inizia dopo circa 1600 ms.
         *
         * Facciamo partire il movimento della Hero
         * poco prima, così i due movimenti
         * si sovrappongono naturalmente.
         */
        heroRevealTimer =
            setTimeout(
                revealHero,
                1450
            );
    }
);


/* =======================================================
   SICUREZZA
======================================================= */

/*
 * Se per qualsiasi motivo la busta risulta
 * già aperta, mostriamo subito la Hero
 * nello stato finale.
 */
if (
    window.envelopeState &&
    window.envelopeState.opened
) {
    revealHero();
}
