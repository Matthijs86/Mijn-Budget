// ======================================
// MIJN BUDGET - JAVASCRIPT
// ======================================


// ======================================
// OPSLAG
// ======================================

const OPSLAG_INKOMSTEN =
    "mijnBudgetInkomsten";

const OPSLAG_UITGAVEN =
    "mijnBudgetUitgaven";


// ======================================
// ELEMENTEN
// ======================================

// Maand
const vorigeMaandKnop =
    document.getElementById("vorigeMaand");

const huidigeMaandKnop =
    document.getElementById("huidigeMaand");

const volgendeMaandKnop =
    document.getElementById("volgendeMaand");


// Overzicht
const totaalInkomsten =
    document.getElementById("totaalInkomsten");

const totaalUitgaven =
    document.getElementById("totaalUitgaven");

const beschikbaarBedrag =
    document.getElementById("beschikbaarBedrag");


// Inkomsten
const inkomstenLijst =
    document.getElementById("inkomstenLijst");

const geenInkomsten =
    document.getElementById("geenInkomsten");

const inkomstenFormulier =
    document.getElementById("inkomstenFormulier");

const inkomstOmschrijving =
    document.getElementById("inkomstOmschrijving");

const inkomstBedrag =
    document.getElementById("inkomstBedrag");

const inkomstCategorie =
    document.getElementById("inkomstCategorie");

const inkomstDatum =
    document.getElementById("inkomstDatum");

const inkomstHerhaling =
    document.getElementById("inkomstHerhaling");

const inkomstOpslaan =
    document.getElementById("inkomstOpslaan");


// Uitgaven
const uitgavenLijst =
    document.getElementById("uitgavenLijst");

const geenUitgaven =
    document.getElementById("geenUitgaven");

const uitgavenFormulier =
    document.getElementById("uitgavenFormulier");

const uitgaveOmschrijving =
    document.getElementById("uitgaveOmschrijving");

const uitgaveBedrag =
    document.getElementById("uitgaveBedrag");

const uitgaveCategorie =
    document.getElementById("uitgaveCategorie");

const uitgaveDatum =
    document.getElementById("uitgaveDatum");

const uitgaveHerhaling =
    document.getElementById("uitgaveHerhaling");

const uitgaveOpslaan =
    document.getElementById("uitgaveOpslaan");


// Resultaat
const resultaatInkomsten =
    document.getElementById("resultaatInkomsten");

const resultaatUitgaven =
    document.getElementById("resultaatUitgaven");

const resultaatOver =
    document.getElementById("resultaatOver");


// Alles wissen
const allesWissenKnop =
    document.getElementById("allesWissen");


// ======================================
// DATA LADEN
// ======================================

function gegevensLaden(sleutel) {

    try {

        const opgeslagen =
            localStorage.getItem(sleutel);

        if (!opgeslagen) {
            return [];
        }

        const gegevens =
            JSON.parse(opgeslagen);

        return Array.isArray(gegevens)
            ? gegevens
            : [];

    } catch (error) {

        console.error(
            "Fout bij laden:",
            error
        );

        return [];

    }

}


let inkomsten =
    gegevensLaden(
        OPSLAG_INKOMSTEN
    );


let uitgaven =
    gegevensLaden(
        OPSLAG_UITGAVEN
    );


// ======================================
// OPSLAAN
// ======================================

function inkomstenOpslaan() {

    localStorage.setItem(
        OPSLAG_INKOMSTEN,
        JSON.stringify(inkomsten)
    );

}


function uitgavenOpslaan() {

    localStorage.setItem(
        OPSLAG_UITGAVEN,
        JSON.stringify(uitgaven)
    );

}


// ======================================
// Geselecteerde maand
// ======================================

let geselecteerdeMaand =
    new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );


// ======================================
// MAANDNAAM
// ======================================

function maandNaam(datum) {

    const naam =
        datum.toLocaleDateString(
            "nl-NL",
            {
                month: "long",
                year: "numeric"
            }
        );

    return naam.charAt(0).toUpperCase()
        + naam.slice(1);

}


// ======================================
// MAAND WEERGEVEN
// ======================================

function maandWeergeven() {

    huidigeMaandKnop.textContent =
        maandNaam(
            geselecteerdeMaand
        );

}


// ======================================
// DATUM OMZETTEN
// ======================================

function veiligeDatum(datum) {

    if (!datum) {
        return null;
    }

    const delen =
        datum.split("-");

    if (delen.length !== 3) {
        return new Date(datum);
    }

    return new Date(
        Number(delen[0]),
        Number(delen[1]) - 1,
        Number(delen[2])
    );

}


// ======================================
// CONTROLE NORMALE DATUM
// ======================================

function valtInMaand(
    datum
) {

    const datumObject =
        veiligeDatum(datum);

    if (!datumObject) {
        return false;
    }

    return (
        datumObject.getFullYear() ===
            geselecteerdeMaand.getFullYear()

        &&

        datumObject.getMonth() ===
            geselecteerdeMaand.getMonth()
    );

}


// ======================================
// CONTROLE HERHALING
// ======================================

function hoortInMaand(
    item
) {

    const datum =
        veiligeDatum(item.datum);

    if (!datum) {
        return false;
    }


    const jaar =
        geselecteerdeMaand.getFullYear();

    const maand =
        geselecteerdeMaand.getMonth();


    const startJaar =
        datum.getFullYear();

    const startMaand =
        datum.getMonth();


    // ==============================
    // EENMALIG
    // ==============================

    if (
        !item.herhaling ||
        item.herhaling === "eenmalig" ||
        item.herhaling === "geen"
    ) {

        return (
            startJaar === jaar &&
            startMaand === maand
        );

    }


    // ==============================
    // MAANDELIJKS
    // ==============================

    if (
        item.herhaling ===
        "maandelijks"
    ) {

        return (
            jaar > startJaar

            ||

            (
                jaar === startJaar &&
                maand >= startMaand
            )
        );

    }


    // ==============================
    // PER KWARTAAL
    // ==============================

    if (
        item.herhaling ===
        "per_kwartaal"
    ) {

        const startTotaalMaanden =
            startJaar * 12 +
            startMaand;

        const huidigeTotaalMaanden =
            jaar * 12 +
            maand;

        const verschil =
            huidigeTotaalMaanden -
            startTotaalMaanden;


        return (
            verschil >= 0 &&
            verschil % 3 === 0
        );

    }


    return false;

}


// ======================================
// EURO
// ======================================

function euro(bedrag) {

    return new Intl.NumberFormat(
        "nl-NL",
        {
            style: "currency",
            currency: "EUR"
        }
    ).format(
        Number(bedrag) || 0
    );

}


// ======================================
// BEDRAG LEZEN
// ======================================

function bedragLezen(waarde) {

    if (
        typeof waarde !==
        "string"
    ) {

        return Number(waarde) || 0;

    }


    const schoon =
        waarde
            .replace(",", ".")
            .replace(/[^\d.-]/g, "");


    return Number(schoon) || 0;

}


// ======================================
// VANDAAG
// ======================================

function vandaagVoorInput() {

    const vandaag =
        new Date();


    return (

        vandaag.getFullYear()
        + "-"
        + String(
            vandaag.getMonth() + 1
        ).padStart(2, "0")
        + "-"
        + String(
            vandaag.getDate()
        ).padStart(2, "0")

    );

}


// ======================================
// ID
// ======================================

function nieuwId() {

    return (
        Date.now() +
        Math.random()
    );

}


// ======================================
// GESELECTEERDE INKOMSTEN
// ======================================

function geselecteerdeInkomsten() {

    return inkomsten.filter(
        inkomen =>
            hoortInMaand(inkomen)
    );

}


// ======================================
// GESELECTEERDE UITGAVEN
// ======================================

function geselecteerdeUitgaven() {

    return uitgaven.filter(
        uitgave =>
            hoortInMaand(uitgave)
    );

}


// ======================================
// TOTAAL
// ======================================

function totaalVan(lijst) {

    return lijst.reduce(
        (
            totaal,
            item
        ) => {

            return totaal +
                Number(item.bedrag);

        },
        0
    );

}


// ======================================
// OVERZICHT
// ======================================

function overzichtBijwerken() {

    const maandInkomsten =
        geselecteerdeInkomsten();

    const maandUitgaven =
        geselecteerdeUitgaven();


    const totaalInk =
        totaalVan(
            maandInkomsten
        );

    const totaalUit =
        totaalVan(
            maandUitgaven
        );


    const over =
        totaalInk -
        totaalUit;


    totaalInkomsten.textContent =
        euro(totaalInk);

    totaalUitgaven.textContent =
        euro(totaalUit);

    beschikbaarBedrag.textContent =
        euro(over);


    resultaatInkomsten.textContent =
        euro(totaalInk);

    resultaatUitgaven.textContent =
        euro(totaalUit);

    resultaatOver.textContent =
        euro(over);


    beschikbaarBedrag.classList.toggle(
        "negatief",
        over < 0
    );

}


// ======================================
// CATEGORIE NAMEN
// ======================================

function categorieNaam(categorie) {

    const namen = {

        loon:
            "💼 Inkomsten uit loon",

        overheid:
            "🏛️ Toeslagen overheid",

        gemeente:
            "🏢 Toeslagen gemeente",

        wonen:
            "🏠 Wonen",

        energie:
            "⚡ Energie & water",

        boodschappen:
            "🛒 Boodschappen",

        vervoer:
            "🚗 Vervoer",

        verzekeringen:
            "🛡️ Verzekeringen",

        abonnementen:
            "📱 Abonnementen",

        gezondheid:
            "❤️ Gezondheid",

        "vrije-tijd":
            "🎮 Vrije tijd",

        kleding:
            "👕 Kleding",

        overig:
            "📦 Overig"

    };


    return (
        namen[categorie] ||
        categorie ||
        "Overig"
    );

}


// ======================================
// HERHALING NAAM
// ======================================

function herhalingNaam(herhaling) {

    if (
        herhaling ===
        "maandelijks"
    ) {

        return "🔄 Maandelijks";

    }


    if (
        herhaling ===
        "per_kwartaal"
    ) {

        return "🔄 Per kwartaal";

    }


    return "";

}


// ======================================
// DATUM WEERGEVEN
// ======================================

function datumWeergeven(datum) {

    const datumObject =
        veiligeDatum(datum);

    if (!datumObject) {
        return "";
    }


    return datumObject.toLocaleDateString(
        "nl-NL",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


// ======================================
// TRANSACTIE KAART MAKEN
// ======================================

function transactieKaart(
    item,
    type
) {

    const kaart =
        document.createElement(
            "article"
        );


    kaart.className =
        "transactie " +
        (
            type === "inkomst"
                ? "transactie-inkomst"
                : "transactie-uitgave"
        );


    // ------------------------------
    // INFO
    // ------------------------------

    const informatie =
        document.createElement(
            "div"
        );

    informatie.className =
        "transactie-info";


    const omschrijving =
        document.createElement(
            "strong"
        );

    omschrijving.className =
        "transactie-omschrijving";

    omschrijving.textContent =
        item.omschrijving;


    const details =
        document.createElement(
            "span"
        );

    details.className =
        "transactie-details";

    details.textContent =
        categorieNaam(
            item.categorie
        )
        +
        " • "
        +
        datumWeergeven(
            item.datum
        );


    informatie.appendChild(
        omschrijving
    );

    informatie.appendChild(
        details
    );


    // ------------------------------
    // BEDRAG
    // ------------------------------

    const bedrag =
        document.createElement(
            "strong"
        );

    bedrag.className =
        "transactie-bedrag";


    bedrag.textContent =
        type === "inkomst"

            ? "+ " + euro(item.bedrag)

            : "− " + euro(item.bedrag);


    // ------------------------------
    // ACTIES
    // ------------------------------

    const acties =
        document.createElement(
            "div"
        );

    acties.className =
        "transactie-acties";


    const bewerkKnop =
        document.createElement(
            "button"
        );

    bewerkKnop.className =
        "bewerk-transactie";

    bewerkKnop.textContent =
        "✏️";

    bewerkKnop.title =
        type === "inkomst"
            ? "Inkomen bewerken"
            : "Uitgave bewerken";


    bewerkKnop.addEventListener(
        "click",
        () => {

            if (type === "inkomst") {

                inkomenBewerken(item);

            } else {

                uitgaveBewerken(item);

            }

        }
    );


    const verwijderKnop =
        document.createElement(
            "button"
        );

    verwijderKnop.className =
        "verwijder-transactie";

    verwijderKnop.textContent =
        "🗑️";

    verwijderKnop.title =
        type === "inkomst"
            ? "Inkomen verwijderen"
            : "Uitgave verwijderen";


    verwijderKnop.addEventListener(
        "click",
        () => {

            const bevestiging =
                confirm(
                    `Weet je zeker dat je "${item.omschrijving}" wilt verwijderen?`
                );


            if (!bevestiging) {
                return;
            }


            if (type === "inkomst") {

                inkomsten =
                    inkomsten.filter(
                        inkomen =>
                            inkomen.id !==
                            item.id
                    );

                inkomstenOpslaan();

            } else {

                uitgaven =
                    uitgaven.filter(
                        uitgave =>
                            uitgave.id !==
                            item.id
                    );

                uitgavenOpslaan();

            }


            budgetWeergeven();

        }
    );


    acties.appendChild(
        bewerkKnop
    );

    acties.appendChild(
        verwijderKnop
    );


    // ------------------------------
    // HERHALING
    // ------------------------------

    const herhaling =
        herhalingNaam(
            item.herhaling
        );


    if (herhaling) {

        const herhalingElement =
            document.createElement(
                "small"
            );

        herhalingElement.className =
            "herhaling";

        herhalingElement.textContent =
            herhaling;

        informatie.appendChild(
            herhalingElement
        );

    }


    kaart.appendChild(
        informatie
    );

    kaart.appendChild(
        bedrag
    );

    kaart.appendChild(
        acties
    );


    return kaart;

}


// ======================================
// INKOMSTEN WEERGEVEN
// ======================================

function inkomstenWeergeven() {

    inkomstenLijst.innerHTML =
        "";


    const lijst =
        geselecteerdeInkomsten();


    geenInkomsten.style.display =
        lijst.length === 0
            ? "block"
            : "none";


    lijst.forEach(
        inkomen => {

            inkomstenLijst.appendChild(
                transactieKaart(
                    inkomen,
                    "inkomst"
                )
            );

        }
    );

}


// ======================================
// UITGAVEN WEERGEVEN
// ======================================

function uitgavenWeergeven() {

    uitgavenLijst.innerHTML =
        "";


    const lijst =
        geselecteerdeUitgaven();


    geenUitgaven.style.display =
        lijst.length === 0
            ? "block"
            : "none";


    lijst.forEach(
        uitgave => {

            uitgavenLijst.appendChild(
                transactieKaart(
                    uitgave,
                    "uitgave"
                )
            );

        }
    );

}


// ======================================
// INKOMEN BEWERKEN
// ======================================

function inkomenBewerken(
    inkomen
) {

    inkomstOmschrijving.value =
        inkomen.omschrijving;

    inkomstBedrag.value =
        inkomen.bedrag;

    inkomstCategorie.value =
        inkomen.categorie;

    inkomstDatum.value =
        inkomen.datum;

    inkomstHerhaling.value =
        inkomen.herhaling ||
        "eenmalig";


    inkomstenFormulier.dataset.bewerkId =
        inkomen.id;


    inkomstenFormulier.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ======================================
// UITGAVE BEWERKEN
// ======================================

function uitgaveBewerken(
    uitgave
) {

    uitgaveOmschrijving.value =
        uitgave.omschrijving;

    uitgaveBedrag.value =
        uitgave.bedrag;

    uitgaveCategorie.value =
        uitgave.categorie;

    uitgaveDatum.value =
        uitgave.datum;

    uitgaveHerhaling.value =
        uitgave.herhaling ||
        "eenmalig";


    uitgavenFormulier.dataset.bewerkId =
        uitgave.id;


    uitgavenFormulier.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ======================================
// INKOMST OPSLAAN
// ======================================

inkomstOpslaan.addEventListener(
    "click",
    () => {

        const omschrijving =
            inkomstOmschrijving.value.trim();

        const bedrag =
            bedragLezen(
                inkomstBedrag.value
            );

        const categorie =
            inkomstCategorie.value;

        const datum =
            inkomstDatum.value;

        const herhaling =
            inkomstHerhaling.value;


        if (!omschrijving) {

            alert(
                "Vul een omschrijving in."
            );

            inkomstOmschrijving.focus();

            return;

        }


        if (bedrag <= 0) {

            alert(
                "Vul een geldig bedrag in."
            );

            inkomstBedrag.focus();

            return;

        }


        if (!categorie) {

            alert(
                "Kies een categorie."
            );

            inkomstCategorie.focus();

            return;

        }


        if (!datum) {

            alert(
                "Kies een datum."
            );

            inkomstDatum.focus();

            return;

        }


        const bewerkId =
            inkomstenFormulier.dataset.bewerkId;


        if (bewerkId) {

            const bestaand =
                inkomsten.find(
                    item =>
                        String(item.id) ===
                        String(bewerkId)
                );


            if (bestaand) {

                bestaand.omschrijving =
                    omschrijving;

                bestaand.bedrag =
                    bedrag;

                bestaand.categorie =
                    categorie;

                bestaand.datum =
                    datum;

                bestaand.herhaling =
                    herhaling;

            }


            delete
                inkomstenFormulier
                    .dataset
                    .bewerkId;

        }

        else {

            inkomsten.push({

                id:
                    nieuwId(),

                omschrijving:
                    omschrijving,

                bedrag:
                    bedrag,

                categorie:
                    categorie,

                datum:
                    datum,

                herhaling:
                    herhaling

            });

        }


        inkomstenOpslaan();


        inkomstenFormulier.reset();


        inkomstDatum.value =
            vandaagVoorInput();


        budgetWeergeven();

    }
);


// ======================================
// UITGAVE OPSLAAN
// ======================================

uitgaveOpslaan.addEventListener(
    "click",
    () => {

        const omschrijving =
            uitgaveOmschrijving.value.trim();

        const bedrag =
            bedragLezen(
                uitgaveBedrag.value
            );

        const categorie =
            uitgaveCategorie.value;

        const datum =
            uitgaveDatum.value;

        const herhaling =
            uitgaveHerhaling.value;


        if (!omschrijving) {

            alert(
                "Vul een omschrijving in."
            );

            uitgaveOmschrijving.focus();

            return;

        }


        if (bedrag <= 0) {

            alert(
                "Vul een geldig bedrag in."
            );

            uitgaveBedrag.focus();

            return;

        }


        if (!categorie) {

            alert(
                "Kies een categorie."
            );

            uitgaveCategorie.focus();

            return;

        }


        if (!datum) {

            alert(
                "Kies een datum."
            );

            uitgaveDatum.focus();

            return;

        }


        const bewerkId =
            uitgavenFormulier.dataset.bewerkId;


        if (bewerkId) {

            const bestaand =
                uitgaven.find(
                    item =>
                        String(item.id) ===
                        String(bewerkId)
                );


            if (bestaand) {

                bestaand.omschrijving =
                    omschrijving;

                bestaand.bedrag =
                    bedrag;

                bestaand.categorie =
                    categorie;

                bestaand.datum =
                    datum;

                bestaand.herhaling =
                    herhaling;

            }


            delete
                uitgavenFormulier
                    .dataset
                    .bewerkId;

        }

        else {

            uitgaven.push({

                id:
                    nieuwId(),

                omschrijving:
                    omschrijving,

                bedrag:
                    bedrag,

                categorie:
                    categorie,

                datum:
                    datum,

                herhaling:
                    herhaling

            });

        }


        uitgavenOpslaan();


        uitgavenFormulier.reset();


        uitgaveDatum.value =
            vandaagVoorInput();


        budgetWeergeven();

    }
);


// ======================================
// VORIGE MAAND
// ======================================

vorigeMaandKnop.addEventListener(
    "click",
    () => {

        geselecteerdeMaand =
            new Date(
                geselecteerdeMaand.getFullYear(),
                geselecteerdeMaand.getMonth() - 1,
                1
            );


        budgetWeergeven();

    }
);


// ======================================
// VOLGENDE MAAND
// ======================================

volgendeMaandKnop.addEventListener(
    "click",
    () => {

        geselecteerdeMaand =
            new Date(
                geselecteerdeMaand.getFullYear(),
                geselecteerdeMaand.getMonth() + 1,
                1
            );


        budgetWeergeven();

    }
);


// ======================================
// KLIK OP MAANDNAAM
// TERUG NAAR HUIDIGE MAAND
// ======================================

huidigeMaandKnop.addEventListener(
    "click",
    () => {

        geselecteerdeMaand =
            new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
            );


        budgetWeergeven();

    }
);


// ======================================
// ALLES WISSEN
// ======================================

allesWissenKnop.addEventListener(
    "click",
    () => {

        const aantal =
            inkomsten.length +
            uitgaven.length;


        if (aantal === 0) {

            alert(
                "Er staan nog geen gegevens in je budget."
            );

            return;

        }


        const bevestiging =
            confirm(
                "Weet je zeker dat je ALLE inkomsten en uitgaven wilt verwijderen?\n\nDeze actie kan niet automatisch worden teruggedraaid."
            );


        if (!bevestiging) {
            return;
        }


        inkomsten = [];

        uitgaven = [];


        inkomstenOpslaan();

        uitgavenOpslaan();


        budgetWeergeven();

    }
);


// ======================================
// DATUMS INSTELLEN
// ======================================

inkomstDatum.value =
    vandaagVoorInput();

uitgaveDatum.value =
    vandaagVoorInput();


// ======================================
// HOOFDFUNCTIE
// ======================================

function budgetWeergeven() {

    maandWeergeven();

    inkomstenWeergeven();

    uitgavenWeergeven();

    overzichtBijwerken();

}


// ======================================
// START
// ======================================

budgetWeergeven();