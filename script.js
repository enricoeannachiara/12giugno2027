const scrollIndicator = document.getElementById("scrollIndicator");

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

window.addEventListener("scroll", updateScrollIndicator);

window.addEventListener("resize", updateScrollIndicator);

updateScrollIndicator();
