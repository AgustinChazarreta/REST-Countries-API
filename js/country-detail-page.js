document.addEventListener("DOMContentLoaded", () => {

    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    const params = new URLSearchParams(window.location.search);
    let countryCode = params.get("ccn3") !== null ? params.get("ccn3") : params.get("cca3");
    
    const countryContainer = document.querySelector("#country-page-container");
    const APIUrl = `https://restcountries.com/v3.1/alpha/` + countryCode;

    function fetchCountryPage() {
    // Fetches the country data from the API and displays it on the page
        console.log(APIUrl);
        fetch(APIUrl)
            .then((response) => response.json())
            .then((data) => {

                jsonCountry = data[0];
                const countryPage = document.createElement("div");
                countryPage.id = "country-page-div"; // Assign an ID for reference

                const firstNativeName = getNativeName(jsonCountry);
                const currency = getCurrencies(jsonCountry);
                const languages = getLanguages(jsonCountry);
                
                // Create the container for the border countries buttons
                const bordersBtnContainer = document.createElement("div");
                bordersBtnContainer.id = "borders-btn-container"; // Assign an ID for reference
                
                countryPage.innerHTML = `
                <button class="back-btn"><ion-icon name="arrow-back-outline"></ion-icon>Back</button>
                <div class="country-details-container">
                    <img class="country-flag" src="${jsonCountry.flags.svg}" alt="${jsonCountry.flags.alt}">
                    <div class="country-title-details">
                        <h1>${jsonCountry.name.common}</h1>
                        <div class="country-details">
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
                        </div>
                        <div class="third-section">
                            <h2>Border Countries:</h2>
                        </div>
                    </div>
                </div>`;
                
                // Get and display the border countries
                getBorderCountries(jsonCountry, bordersBtnContainer);
                
                // When the back button is clicked, return to the main page
                const backBtn = countryPage.querySelector(".back-btn");
                backBtn.addEventListener("click", () => window.location.assign("/index.html"));
                
                // Add the card to the container
                countryContainer.appendChild(countryPage);
                const countryTitleDetails = countryContainer.querySelector(".country-title-details");
                countryTitleDetails.appendChild(bordersBtnContainer);
            });
    }
    
    function getNativeName(jsonCountry) {
    // Retrieves the native name of the country from the country data
        const nativeNames = jsonCountry.name.nativeName;
        let firstNativeName = "";
        if (nativeNames) {
            const keys = Object.keys(nativeNames);
            firstNativeName = nativeNames[keys[0]].common;
        } else {
            firstNativeName = jsonCountry.name.common;
        }
        return firstNativeName;
    }

    function getCurrencies(jsonCountry) {
    // Retrieves the currency information of the country from the country data
        const currencies = jsonCountry.currencies;
        let currency = "";
        if (currencies) {
            const keys = Object.keys(currencies);
            currency = currencies[keys[0]].name + ` (${currencies[keys[0]].symbol})`;
        } else {
            currency = "Unknown";
        }
        return currency;
    }
    
    function getLanguages(jsonCountry) {
    // Retrieves the languages spoken in the country from the country data
        const languagesDict = jsonCountry.languages;
        let languages = "";
        if (languagesDict) {
            keys = Object.keys(languagesDict);
            keys.forEach(key => {
                languages += languagesDict[key];
                if (languagesDict[key] != languagesDict[keys[keys.length - 1]]) {
                    languages += ", "
                }
            });
        } else {
            languages = "Unknown";
        }
        return languages;
    }

    function getBorderCountries(jsonCountry, bordersBtnContainer) {
    // Fetches and displays the border countries of the selected country
        const bordersList = jsonCountry.borders;

        if (bordersList && bordersList.length > 0) {
            bordersList.forEach(borderCode => {
                fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
                    .then(response => response.json())
                    .then(data => {
                        const borderCountry = data[0];
                        const borderButton = document.createElement("button");
                        borderButton.textContent = borderCountry.name.common;
                        borderButton.addEventListener("click", () => {
                            window.location.href = borderCountry.ccn3 
                                ? `/html/country-detail-page.html?ccn3=${borderCountry.ccn3}` 
                                : `/html/country-detail-page.html?cca3=${borderCountry.cca3}`;
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

        countryContainer.appendChild(bordersBtnContainer);
    }

    function changeDarkMode() {
    // Toggles dark mode on and off based on user preference
        if (localStorage.getItem('dark-mode') === 'enabled') {
            body.classList.add('dark-mode');
            darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="moon-outline"></ion-icon> Dark Mode`;
        } else {
            darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="sunny-outline"></ion-icon> Light Mode`;
        }
        
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="moon"></ion-icon> Dark Mode`;
                localStorage.setItem('dark-mode', 'enabled');
            } else {
                darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="sunny-outline"></ion-icon> Light Mode`;
                localStorage.setItem('dark-mode', 'disabled');
            }
        });
    }

    // Initial fetch of countries and setup of dark mode
    fetchCountryPage();
    changeDarkMode();
});