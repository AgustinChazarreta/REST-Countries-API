document.addEventListener("DOMContentLoaded", () => {
    const countriesContainer = document.querySelector("#countries-container");
    const baseAPIUrl = `https://restcountries.com/v3.1/all`;    
    let currentAPIUrl = baseAPIUrl;  
    
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");
    
    let currentPage = 1;
    let skip = 0;
    const limit = 8;
    let totalCountries = 0;
    
    let selectedRegion = "All countries";
    const filterCountry = document.querySelector(".filter-country");
    const searchInput = document.querySelector('.search-country'); // Captura el input de búsqueda
    let allCountries = []; // Almacena todos los países para filtrar
    let filteredCountries = "";
    
    filterCountry.addEventListener("change", () => {
        const newRegion = filterCountry.value;
        if (newRegion !== selectedRegion) { 
            selectedRegion = newRegion;
            currentAPIUrl = (selectedRegion && selectedRegion !== "All countries")
                ? `https://restcountries.com/v3.1/region/${selectedRegion.toLowerCase()}`
                : baseAPIUrl;
            currentPage = 1; 
            fetchCountries(currentPage); 
        }
    });

    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        currentPage = 1; // Reinicia la página a 1 al buscar
    
        // Filtra los países según el término de búsqueda
        filteredCountries = allCountries.filter(country => 
            country.name.common.toLowerCase().includes(searchTerm)
        );
        totalCountries = filteredCountries.length; // Actualiza el total de países filtrados
        
        skip = (currentPage - 1) * limit;
        // Actualiza la visualización de países filtrados
        displayCountries(filteredCountries.slice(skip, skip + limit));
        actualizarInfoPaginacion(); // Actualiza la información de paginación
    });
    
    function fetchCountries(page) {
        skip = (page - 1) * limit;
    
        fetch(currentAPIUrl)
            .then((response) => response.json())
            .then((data) => {
                allCountries = data; // Almacena todos los países aquí
                totalCountries = data.length; 
                let countries = "";

                // Si hay un término de búsqueda, filtra los países
                if (!isSearchInputEmpty()) {
                    filteredCountries = allCountries.filter(country => 
                        country.name.common.toLowerCase().includes(searchInput.value.toLowerCase())
                    );
                    totalCountries = filteredCountries.length; // Actualiza el total de países filtrados
                    countries = ordenarPorClave(filteredCountries, "name.common");
                }else {
                    countries = ordenarPorClave(allCountries, "name.common");
                } 
                
                const paginatedData = countries.slice(skip, skip + limit);
    
                // Limpia el contenedor de cards
                countriesContainer.innerHTML = "";
    
                // Genera las cards de países
                displayCountries(paginatedData);
                actualizarInfoPaginacion();
            })
            .catch((error) => console.error("Error fetching products:", error));
    }
    
    function displayCountries(countries) {
        // Limpia el contenedor de cards
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
    
            countryCard.addEventListener("click", () => {
                if(country.ccn3 !== undefined){
                    window.location.href = `country.html?ccn3=${encodeURIComponent(country.ccn3)}`;
                } else {
                    window.location.href = `country.html?cca3=${encodeURIComponent(country.cca3)}`;
                }
            });
    
            countriesContainer.appendChild(countryCard);
        });
    }

    function isSearchInputEmpty() {
        return searchInput.value.trim() === ""; // Verifica si el campo de búsqueda está vacío
    }

    // Función para actualizar la información de paginación
    function actualizarInfoPaginacion() {
        pageInfo.textContent = `Página ${currentPage}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = (currentPage * limit) >= totalCountries;
    }

    function ordenarPorClave(array, clave) {
        return array.sort((a, b) => {
          // Dividimos la clave anidada en partes (por ejemplo, "name.common" -> ["name", "common"])
        const keys = clave.split(".");
        // Función para acceder al valor de una clave anidada
        const obtenerValor = (obj, keys) => keys.reduce((acc, key) => acc?.[key], obj);
        const valorA = obtenerValor(a, keys)?.toString().toLowerCase() || "";
        const valorB = obtenerValor(b, keys)?.toString().toLowerCase() || "";
        return valorA.localeCompare(valorB);
    });
    }

    function changeDarkMode(){
        // Verifica si el modo oscuro está activado en el almacenamiento local
        if (localStorage.getItem('dark-mode') === 'enabled') {
            body.classList.add('dark-mode');
            darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="moon-outline"></ion-icon> Dark Mode`;// Cambia el ícono al cargar
        }else {darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="sunny-outline"></ion-icon> Light Mode`;}
        
        
        // Cambia el modo al hacer clic en el botón
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
        
            // Actualiza el ícono según el modo actual
            if (body.classList.contains('dark-mode')) {
                darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="moon"></ion-icon> Dark Mode`; // Cambia el texto a "Dark Mode"
                localStorage.setItem('dark-mode', 'enabled'); // Guarda la preferencia
            } else {
                darkModeToggle.innerHTML = `<ion-icon class="toggle-icon" name="sunny-outline"></ion-icon> Light Mode`; // Cambia el texto a "Light Mode"
                localStorage.setItem('dark-mode', 'disabled'); // Guarda la preferencia
            }
        });
    }
    
    // Eventos de los botones de paginación
    prevBtn.addEventListener("click", () => {
        currentPage--;
        fetchCountries(currentPage);
    });

    nextBtn.addEventListener("click", () => {
        currentPage++;
        fetchCountries(currentPage);
    });


    fetchCountries(currentPage);
    changeDarkMode();
    });
    

