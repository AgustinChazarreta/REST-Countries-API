document.addEventListener("DOMContentLoaded", () => {
    const countriesContainer = document.querySelector("#countries-container");

    // Capturo los elementos HTML (botones y página actual)
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");

    // Variables de control
    let currentPage = 1;
    const limit = 8;
    let totalProductos = 0;

    function fetchCountries(page) {
        const skip = (page - 1) * limit;

        fetch(`https://restcountries.com/v3.1/all`)
            .then((response) => response.json())
            .then((data) => {
                totalProductos = data.length; // Actualiza el total de países
                const countries = ordenarPorClave(data, "name.common");
                const paginatedData = countries.slice(skip, skip + limit);

                // Limpia el contenedor de cards
                countriesContainer.innerHTML = "";

                // Genera las cards de países
                paginatedData.forEach((country) => {
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

                    // Añadir la card al contenedor
                    countriesContainer.appendChild(countryCard);
                });

                actualizarInfoPaginacion();

            })
            .catch((error) => console.error("Error fetching products:", error));
    }

    // Función para actualizar la información de paginación
    function actualizarInfoPaginacion() {
        pageInfo.textContent = `Página ${currentPage}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = (currentPage * limit) >= totalProductos;
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
    });
    
