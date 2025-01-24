document.addEventListener("DOMContentLoaded", () => {
    // Select the container for displaying countries
    const countriesContainer = document.querySelector("#countries-container");
    const baseAPIUrl = `https://restcountries.com/v3.1/all`;    
    let currentAPIUrl = baseAPIUrl;  
    
    // Select elements for dark mode toggle and pagination buttons
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");
    
    // Initialize pagination variables
    let currentPage = 1;
    let skip = 0;
    const limit = 8;
    let totalCountries = 0;
    
    // Initialize region filter
    let selectedRegion = "All countries";
    const filterCountry = document.querySelector(".filter-country");
    const searchInput = document.querySelector('.search-country'); 
    let allCountries = []; 
    let filteredCountries = [];
    
    // Event listener for region filter change
    filterCountry.addEventListener("change", () => {
        const newRegion = filterCountry.value;
        if (newRegion !== selectedRegion) { 
            selectedRegion = newRegion;
            // Update API URL based on selected region
            currentAPIUrl = (selectedRegion && selectedRegion !== "All countries")
                ? `https://restcountries.com/v3.1/region/${selectedRegion.toLowerCase()}`
                : baseAPIUrl;
            currentPage = 1; 
            fetchCountries(currentPage); 
        }
    });

    // Event listener for search input
    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        currentPage = 1; 
        
        // Filter countries based on search term
        filteredCountries = allCountries.filter(country => 
            country.name.common.toLowerCase().includes(searchTerm)
        );
        totalCountries = filteredCountries.length; 
        
        skip = (currentPage - 1) * limit;
        displayCountries(filteredCountries.slice(skip, skip + limit));
        actualizarInfoPaginacion(); 
    });
    
    // Function to fetch countries from the API
    function fetchCountries(page) {
        skip = (page - 1) * limit;
    
        fetch(currentAPIUrl)
            .then((response) => response.json())
            .then((data) => {
                allCountries = data; 
                totalCountries = data.length; 
                let countries = "";

                // Check if search input is not empty
                if (!isSearchInputEmpty()) {
                    filteredCountries = allCountries.filter(country => 
                        country.name.common.toLowerCase().includes(searchInput.value.toLowerCase())
                    );
                    totalCountries = filteredCountries.length; 
                    countries = ordenarPorClave(filteredCountries, "name.common");
                } else {
                    countries = ordenarPorClave(allCountries, "name.common");
                } 
                
                const paginatedData = countries.slice(skip, skip + limit);
                countriesContainer.innerHTML = "";
                displayCountries(paginatedData);
                actualizarInfoPaginacion();
            })
            .catch((error) => console.error("Error fetching products:", error));
    }
    
    // Function to display countries in the container
    function displayCountries(countries) {
        countriesContainer.innerHTML = "";
    
        countries.forEach((country) => {
            const countryCard = document.createElement("div");
            
            countryCard.innerHTML = `
            <div class="country-card">
                <img class="country-flag" src="${country.flags.svg}" alt="${country.flags.alt}">
                <div class="card-body">
                    <h3 class="country-name">${country.name.common}</h3>
                    <p><span>Population:</span> ${country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    <p><span>Region:</span> ${country.region}</p>
                    <p><span>Capital:</span> ${country.capital}</p>
                </div>  
            </div>
            `;

            // Event listener for country card click
            countryCard.addEventListener("click", () => {
                if(country.ccn3 !== undefined){
                    window.location.href = `country-detail-page.html?ccn3=${encodeURIComponent(country.ccn3)}`;
                } else {
                    window.location.href = `country-detail-page.html?cca3=${encodeURIComponent(country.cca3)}`;
                }
            });
    
            countriesContainer.appendChild(countryCard);
        });
    }

    // Function to check if the search input is empty
    function isSearchInputEmpty() {
        return searchInput.value.trim() === ""; 
    }

    // Function to update pagination information
    function actualizarInfoPaginacion() {
        pageInfo.textContent = `Página ${currentPage}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = (currentPage * limit) >= totalCountries;
    }

    // Function to sort an array by a specified key
    function ordenarPorClave(array, clave) {
        return array.sort((a, b) => {
        const keys = clave.split(".");
        const obtenerValor = (obj, keys) => keys.reduce((acc, key) => acc?.[key], obj);
        const valorA = obtenerValor(a, keys)?.toString().toLowerCase() || "";
        const valorB = obtenerValor(b, keys)?.toString().toLowerCase() || "";
        return valorA.localeCompare(valorB);
    });
    }

    // Function to handle dark mode toggle
    function changeDarkMode(){
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
    
    // Event listeners for pagination buttons
    prevBtn.addEventListener("click", () => {
        currentPage--;
        fetchCountries(currentPage);
    });

    nextBtn.addEventListener("click", () => {
        currentPage++;
        fetchCountries(currentPage);
    });

    // Initial fetch of countries and setup of dark mode
    fetchCountries(currentPage);
    changeDarkMode();
});