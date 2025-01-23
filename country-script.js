document.addEventListener("DOMContentLoaded", () => {

    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    const params = new URLSearchParams(window.location.search);
    let countryCode = params.get("ccn3") !== null ? params.get("ccn3") : params.get("cca3");
    
    const countryContainer = document.querySelector("#country-page-container");
    const APIUrl = `https://restcountries.com/v3.1/alpha/`+countryCode;

    function fetchCountryPage() {
        console.log(APIUrl);
        fetch(APIUrl)
        .then((response) => response.json())
        .then((data) => {

            jsonCountry = data[0];
            const countryPage = document.createElement("div");
            countryPage.id = "country-page-div"; // Asignar un ID para referencia


            const firstNativeName = getNativeName(jsonCountry);
            const currency = getCurrencies(jsonCountry);
            const languages = getLanguages(jsonCountry);
            
            // Crear el contenedor para los botones de países fronterizos
            const bordersBtnContainer = document.createElement("div");
            bordersBtnContainer.id = "borders-btn-container"; // Asignar un ID para referencia
            
            countryPage.innerHTML = `
            <button class="back-btn"><ion-icon name="arrow-back-outline"></ion-icon>Back</button>
            <img class="country-flag" src="${jsonCountry.flags.svg}" alt="${jsonCountry.flags.alt}">
            <h1>${jsonCountry.name.common}</h1>
            <div class="first-section">
                <p><strong>Native Name:</strong> ${firstNativeName}</p>
                <p><strong>Population:</strong> ${jsonCountry.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                <p><strong>Region:</strong> ${jsonCountry.region}</p>
                <p><strong>Sub Region:</strong> ${jsonCountry.subregion}</p>
                <p><strong>Capital:</strong> ${jsonCountry.capital}</p>
            </div>
            <div class="second-section">
                <p><strong>Top Level Domain:</strong> ${jsonCountry.tld}</p>
                <p><strong>Currencies:</strong> ${currency}</p>
                <p><strong>Languages:</strong> ${languages}</p>
            </div>
            <div class="third-section">
                <h2>Border Countries:</h2>
            </div>`;
            
            // Obtener y mostrar los países fronterizos
            getBorderCountries(jsonCountry, bordersBtnContainer);
            // Añadir el contenedor de botones de países fronterizos al countryPage
            countryPage.appendChild(bordersBtnContainer);
            // Al tocar el botón de back, se vuelve a la página principal
            const backBtn = countryPage.querySelector(".back-btn");
            backBtn.addEventListener("click", () => window.location.assign("index.html"));

            // Añadir la card al contenedor
            countryContainer.appendChild(countryPage);
        });
    }
    
    function getNativeName(jsonCountry){
        // Obtener el objeto nativeName
        const nativeNames = jsonCountry.name.nativeName;
        // Obtener las claves del objeto
        let firstNativeName = "";
        // Si el objeto existe...
        if (nativeNames){
            const keys = Object.keys(nativeNames);
            // Acceder al valor correspondiente a la primer clave
            firstNativeName = nativeNames[keys[0]].common;
        }
        // Si el objeto no existe se toma el nombre común
        else{
            firstNativeName = jsonCountry.name.common;
        }
        return firstNativeName;
    }

    function getCurrencies(jsonCountry){
        // Obtener el objeto nativeName
        const currencies = jsonCountry.currencies;
        // Obtener las claves del objeto
        let currency = "";
        // Si el objeto existe...
        if (currencies){
            const keys = Object.keys(currencies);
            // Acceder al valor correspondiente a la primer clave
            currency = currencies[keys[0]].name + ` (${currencies[keys[0]].symbol})`;
        }
        // Si el objeto no existe se toma el nombre común
        else{
            currency= "Unknown";
        }
        return currency;
    }
    
    function getLanguages(jsonCountry){
        const languagesDict = jsonCountry.languages;
        let languages = "";
        if (languagesDict){
            keys = Object.keys(languagesDict);
            keys.forEach(key => {
                languages += languagesDict[key];
                if(languagesDict[key] != languagesDict[keys[keys.length-1]]){
                    languages += ", "
                }
            });
        }
        else{
            languages = "Unknown";
        }
        return languages;
    }

    function getBorderCountries(jsonCountry, bordersBtnContainer) {
        const bordersList = jsonCountry.borders;

        // Verificar si hay países fronterizos
        if (bordersList && bordersList.length > 0) {
            // Hacer una solicitud para cada país fronterizo
            bordersList.forEach(borderCode => {
                fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
                    .then(response => response.json())
                    .then(data => {
                        const borderCountry = data[0]; // Suponiendo que la respuesta es un array
                        const borderButton = document.createElement("button");
                        borderButton.textContent = borderCountry.name.common; // Nombre común del país
                        borderButton.addEventListener("click", () => {
                            // Al hacer clic en el botón se redirige a la página del país seleccionado
                            window.location.href = borderCountry.ccn3 
                            ? `country.html?ccn3=${borderCountry.ccn3}` 
                            : `country.html?cca3=${borderCountry.cca3}`;
                        });
                        bordersBtnContainer.appendChild(borderButton);
                    })
                    .catch(error => console.error("Error fetching border country:", error));
            });
        } else {
            const noBordersMessage = document.createElement("p");
            noBordersMessage.textContent = "No border countries.";
            bordersBtnContainer.appendChild(noBordersMessage);
        }
    
        // Añadir el contenedor de botones de países fronterizos al contenedor principal
        countryContainer.appendChild(bordersBtnContainer);
    }


    // Verifica si el modo oscuro está activado en el almacenamiento local
    if (localStorage.getItem('dark-mode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="sunny-outline"></ion-icon> Light Mode`;// Cambia el ícono al cargar
    }else {darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="moon-outline"></ion-icon> Dark Mode`;}
    
    
    // Cambia el modo al hacer clic en el botón
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    
        // Actualiza el ícono según el modo actual
        if (body.classList.contains('dark-mode')) {
            darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="sunny-outline"></ion-icon> Light Mode`; // Cambia el texto a "Light Mode"
            localStorage.setItem('dark-mode', 'enabled'); // Guarda la preferencia
        } else {
            darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="moon-outline"></ion-icon> Dark Mode`; // Cambia el texto a "Dark Mode"
            localStorage.setItem('dark-mode', 'disabled'); // Guarda la preferencia
        }
    });



        fetchCountryPage();
});