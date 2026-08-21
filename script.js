// ======================================
// MIJN BUDGET - JAVASCRIPT
// ======================================


// ======================================
// OPSLAG
// ======================================

const OPSLAG_INKOMSTEN = "mijnBudgetInkomsten";
const OPSLAG_UITGAVEN = "mijnBudgetUitgaven";


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


// Categorie filter
const categorieOverzicht =
    document.getElementById("categorieOverzicht");

const actieveCategorie =
    document.getElementById("actieveCategorie");

const categorieTotaal =
    document.getElementById("categorieTotaal");

const alleUitgavenKnop =
    document.getElementById("alleUitgaven");


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
// MAAND
// ======================================

let geselecteerdeMaand =
    new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );


// ======================================
// ACTIEVE CATEGORIE
// ======================================

let actieveUitgavenCategorie = null;


// ======================================
// CATEGORIE NAMEN
// ======================================

const categorieNamen = {

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


// ======================================
// INKOMST CATEGORIE NAMEN
// ======================================

const inkomstenCategorieNamen = {

    loon:
        "💼 Inkomsten uit loon",

    overheid:
        "🏛️ Toeslagen overheid",

    gemeente:
        "🏢 Toeslagen gemeente"

};


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

    return naam.charAt(0).toUpperCase() +
        naam.slice(1);

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
// DATUM CONTROLEREN
// ======================================

function valtInGeselecteerdeMaand(
    datum
) {

    if (!datum) {
        return false;
    }

    const datumObject =
        new Date(
            datum + "T00:00:00"
        );

    return (

        datumObject.getFullYear() ===
            geselecteerdeMaand.getFullYear()

        &&

        datumObject.getMonth() ===
            geselecteerdeMaand.getMonth()

    );

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

    const jaar =
        vandaag.getFullYear();

    const maand =
        String(
            vandaag.getMonth() + 1
        ).padStart(2, "0");

    const dag =
        String(
            vandaag.getDate()
        ).padStart(2, "0");

    return `${jaar}-${maand}-${dag}`;

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
// INKOMSTEN MAAND
// ======================================

function geselecteerdeInkomsten() {

    return inkomsten.filter(
        inkomen =>
            valtInGeselecteerdeMaand(
                inkomen.datum
            )
    );

}


// ======================================
// UITGAVEN MAAND
// ======================================

function geselecteerdeUitgaven() {

    return uitgaven.filter(
        uitgave =>
            valtInGeselecteerdeMaand(
                uitgave.datum
            )
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
                Number(item.bedrag || 0);

        },
        0
    );

}


// ======================================
// HERHALING WEERGEVEN
// ======================================

function herhalingNaam(waarde) {

    if (waarde === "maandelijks") {
        return "Maandelijks";
    }

    if (waarde === "per kwartaal") {
        return "Per kwartaal";
    }

    return "Eenmalig";

}


// ======================================
// DATUM WEERGEVEN
// ======================================

function datumWeergeven(datum) {

    if (!datum) {
        return "";
    }

    const datumObject =
        new Date(
            datum + "T00:00:00"
        );

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
// OVERZICHT BIJWERKEN
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
// INKOMSTEN WEERGEVEN
// ======================================

function inkomstenWeergeven() {

    inkomstenLijst.innerHTML = "";

    const maandInkomsten =
        geselecteerdeInkomsten();


    geenInkomsten.style.display =
        maandInkomsten.length === 0
            ? "block"
            : "none";


    maandInkomsten.forEach(
        inkomen => {

            const kaart =
                document.createElement(
                    "article"
                );

            kaart.className =
                "transactie transactie-inkomst";


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
                inkomen.omschrijving;


            const details =
                document.createElement(
                    "span"
                );

            details.className =
                "transactie-details";

            details.textContent =
                `${inkomstenCategorieNamen[
                    inkomen.categorie
                ] || inkomen.categorie}
                 •
                 ${datumWeergeven(
                     inkomen.datum
                 )}`;


            informatie.appendChild(
                omschrijving
            );

            informatie.appendChild(
                details
            );


            const rechts =
                document.createElement(
                    "div"
                );

            rechts.className =
                "transactie-rechts";


            const bedrag =
                document.createElement(
                    "strong"
                );

            bedrag.className =
                "transactie-bedrag";

            bedrag.textContent =
                `+ ${euro(
                    inkomen.bedrag
                )}`;


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
                "Inkomen bewerken";


            bewerkKnop.addEventListener(
                "click",
                () => {

                    inkomenBewerken(
                        inkomen
                    );

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
                "Inkomen verwijderen";


            verwijderKnop.addEventListener(
                "click",
                () => {

                    if (
                        !confirm(
                            `Weet je zeker dat je "${inkomen.omschrijving}" wilt verwijderen?`
                        )
                    ) {
                        return;
                    }


                    inkomsten =
                        inkomsten.filter(
                            item =>
                                item.id !==
                                inkomen.id
                        );


                    inkomstenOpslaan();

                    budgetWeergeven();

                }
            );


            acties.appendChild(
                bewerkKnop
            );

            acties.appendChild(
                verwijderKnop
            );


            rechts.appendChild(
                bedrag
            );

            rechts.appendChild(
                acties
            );


            kaart.appendChild(
                informatie
            );

            kaart.appendChild(
                rechts
            );


            inkomstenLijst.appendChild(
                kaart
            );

        }
    );

}


// ======================================
// UITGAVEN WEERGEVEN
// ======================================

function uitgavenWeergeven() {

    uitgavenLijst.innerHTML = "";


    let maandUitgaven =
        geselecteerdeUitgaven();


    // FILTER ACTIEVE CATEGORIE

    if (actieveUitgavenCategorie) {

        maandUitgaven =
            maandUitgaven.filter(
                uitgave =>
                    uitgave.categorie ===
                    actieveUitgavenCategorie
            );

    }


    geenUitgaven.style.display =
        maandUitgaven.length === 0
            ? "block"
            : "none";


    // TEKST AANPASSEN ALS FILTER ACTIEF IS

    if (
        actieveUitgavenCategorie &&
        maandUitgaven.length === 0
    ) {

        geenUitgaven.textContent =
            "Geen uitgaven in deze categorie deze maand.";

    }
    else {

        geenUitgaven.textContent =
            "Nog geen uitgaven toegevoegd.";

    }


    // TRANSACTIES MAKEN

    maandUitgaven.forEach(
        uitgave => {

            const kaart =
                document.createElement(
                    "article"
                );

            kaart.className =
                "transactie transactie-uitgave";


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
                uitgave.omschrijving;


            const details =
                document.createElement(
                    "span"
                );

            details.className =
                "transactie-details";

            details.textContent =
                `${categorieNamen[
                    uitgave.categorie
                ] || uitgave.categorie}
                 •
                 ${datumWeergeven(
                     uitgave.datum
                 )}`;


            informatie.appendChild(
                omschrijving
            );

            informatie.appendChild(
                details
            );


            const rechts =
                document.createElement(
                    "div"
                );

            rechts.className =
                "transactie-rechts";


            const bedrag =
                document.createElement(
                    "strong"
                );

            bedrag.className =
                "transactie-bedrag";

            bedrag.textContent =
                `− ${euro(
                    uitgave.bedrag
                )}`;


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
                "Uitgave bewerken";


            bewerkKnop.addEventListener(
                "click",
                () => {

                    uitgaveBewerken(
                        uitgave
                    );

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
                "Uitgave verwijderen";


            verwijderKnop.addEventListener(
                "click",
                () => {

                    if (
                        !confirm(
                            `Weet je zeker dat je "${uitgave.omschrijving}" wilt verwijderen?`
                        )
                    ) {
                        return;
                    }


                    uitgaven =
                        uitgaven.filter(
                            item =>
                                item.id !==
                                uitgave.id
                        );


                    uitgavenOpslaan();

                    budgetWeergeven();

                }
            );


            acties.appendChild(
                bewerkKnop
            );

            acties.appendChild(
                verwijderKnop
            );


            rechts.appendChild(
                bedrag
            );

            rechts.appendChild(
                acties
            );


            kaart.appendChild(
                informatie
            );

            kaart.appendChild(
                rechts
            );


            uitgavenLijst.appendChild(
                kaart
            );

        }
    );


    categorieOverzichtBijwerken();

}


// ======================================
// CATEGORIE OVERZICHT
// ======================================

function categorieOverzichtBijwerken() {

    if (!actieveUitgavenCategorie) {

        categorieOverzicht.classList.add(
            "verborgen"
        );

        return;

    }


    const maandUitgaven =
        geselecteerdeUitgaven();


    const categorieUitgaven =
        maandUitgaven.filter(
            uitgave =>
                uitgave.categorie ===
                actieveUitgavenCategorie
        );


    const totaal =
        totaalVan(
            categorieUitgaven
        );


    categorieOverzicht.classList.remove(
        "verborgen"
    );


    actieveCategorie.textContent =
        categorieNamen[
            actieveUitgavenCategorie
        ] ||
        actieveUitgavenCategorie;


    categorieTotaal.textContent =
        euro(totaal);

}


// ======================================
// CATEGORIE FILTER ACTIVEREN
// ======================================

function categorieFilterInstellen(
    categorie
) {

    actieveUitgavenCategorie =
        categorie;


    document
        .querySelectorAll(
            ".categorie-uitgave"
        )
        .forEach(
            knop => {

                knop.classList.toggle(
                    "actief",
                    knop.dataset.categorie ===
                    categorie
                );

            }
        );


    uitgavenWeergeven();

}


// ======================================
// ALLE UITGAVEN TONEN
// ======================================

function alleUitgavenTonen() {

    actieveUitgavenCategorie =
        null;


    document
        .querySelectorAll(
            ".categorie-uitgave"
        )
        .forEach(
            knop => {

                knop.classList.remove(
                    "actief"
                );

            }
        );


    uitgavenWeergeven();

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


            delete inkomstenFormulier.dataset.bewerkId;

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


            delete uitgavenFormulier.dataset.bewerkId;

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
// CATEGORIE KNOPPEN
// ======================================

document
    .querySelectorAll(
        ".categorie-uitgave"
    )
    .forEach(
        knop => {

            knop.addEventListener(
                "click",
                () => {

                    categorieFilterInstellen(
                        knop.dataset.categorie
                    );

                }
            );

        }
    );


// ======================================
// ALLE UITGAVEN
// ======================================

alleUitgavenKnop.addEventListener(
    "click",
    alleUitgavenTonen
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
// HUIDIGE MAAND
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


        actieveUitgavenCategorie =
            null;


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
