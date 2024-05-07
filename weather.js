let searchButton = document.getElementById("search");

// Add an event listener to the search button
searchButton.addEventListener("click", function() {
    let codePostal = document.getElementById("codePostal").value;

    // Check if the postal code is valid (5 digits)
    if (codePostal.length === 5 && /^\d+$/.test(codePostal)) {
        // Call the function to search for cities with the provided postal code
        rechercherVilles(codePostal);
    } else {
        console.error("Invalid postal code. Please enter a 5-digit numerical value.");
    }
});

function rechercherVilles() {
    var codePostal = document.getElementById("codePostal").value;
    var url = "https://geo.api.gouv.fr/communes?codePostal=" + codePostal;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var menuVilles = document.getElementById("menuVilles");
            menuVilles.innerHTML = ""; // Efface les options précédentes
            document.getElementById("meteo").innerHTML = ""; 
            
            // Ajouter l'option par défaut "Votre ville"
            var optionDefault = document.createElement("option");
            optionDefault.value = ""; // Valeur vide
            optionDefault.textContent = "Votre ville";
            menuVilles.appendChild(optionDefault);

            if (data.length === 0) {
                // Ajouter une option pour afficher un message d'erreur si aucune ville n'est trouvée
                var optionErreur = document.createElement("option");
                optionErreur.disabled = true;
                optionErreur.textContent = "Aucune ville trouvée pour ce code postal";
                menuVilles.appendChild(optionErreur);
            } else {
                // Ajouter les options pour chaque ville trouvée
                data.forEach(ville => {
                    var option = document.createElement("option");
                    option.value = ville.code; // Utiliser le code de la ville comme valeur
                    option.textContent = ville.nom; 
                    menuVilles.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error("Une erreur s'est produite lors de la récupération des données :", error);
        });
}

function afficherMeteo() {
    var codeVille = document.getElementById("menuVilles").value;
    if (codeVille === "") {
        // Ne rien faire si "Votre ville" est sélectionné
        return;
    }

    var url = "https://api.meteo-concept.com/api/forecast/daily?token=74a10e07323356e9173cce49fea51b1872b9bd15c9da24311aa30fb7b501543c&insee=" + codeVille;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var meteo = document.getElementById("meteo");
            meteo.innerHTML = ""; 
            
            var item = data.forecast[0]; // Obtenir les informations pour le premier jour seulement

            var li = document.createElement("li");
            li.textContent = "Température minimale : " + item.tmin + " °C, Température maximale : " + item.tmax + " °C, Probabilité de pluie : " + item.probarain + "%, Heures d'ensoleillement : " + item.sun_hours + " heures";
            meteo.appendChild(li);
        })
        .catch(error => {
            console.error("Une erreur s'est produite lors de la récupération des données météo :", error);
        });
}