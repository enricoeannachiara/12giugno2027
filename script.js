const scrollIndicator = document.getElementById("scrollIndicator");

const copyCodeButton = document.getElementById("copyCodeButton");

const copyMessage = document.getElementById("copyMessage");

const accessCode = document.getElementById("accessCode");


function updateScrollIndicator() {

    const scrollPosition =
        window.scrollY + window.innerHeight;

    const pageHeight =
        document.documentElement.scrollHeight;

    const distanceFromBottom =
        pageHeight - scrollPosition;

    if (distanceFromBottom < 80) {

        scrollIndicator.classList.add("hidden");

    } else {

        scrollIndicator.classList.remove("hidden");

    }

}


async function copyAccessCode() {

    const code = accessCode.textContent.trim();

    try {

        await navigator.clipboard.writeText(code);

        copyMessage.textContent = "Codice copiato";

        copyCodeButton.textContent = "Copiato ✓";

        setTimeout(() => {

            copyMessage.textContent = "";

            copyCodeButton.textContent = "Copia codice";

        }, 1800);

    } catch (error) {

        copyMessage.textContent =
            "Tieni premuto sul codice per copiarlo";

    }

}


window.addEventListener("scroll", updateScrollIndicator);

window.addEventListener("resize", updateScrollIndicator);

copyCodeButton.addEventListener("click", copyAccessCode);

updateScrollIndicator();
