const Input = document.getElementById("country");
const Button = document.getElementById("button");
const countryInfo = document.getElementById("country-info");
const borderingCountries = document.getElementById("bordering-countries");

Button.onclick = getCountryData;

async function getCountryData() {
    const name = Input.value.trim();
    const url = `https://restcountries.com/v3.1/name/${name}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        // Check if the response contains any country data
        if (!json || json.length === 0) {
            throw new Error('Country not found. Please enter a valid country name.');
        }

        const country = json[0];

        const capital = country.capital ? country.capital[0] : 'Not available';
        const population = country.population.toLocaleString();
        const region = country.region;
        const flag = country.flags.png;

        countryInfo.innerHTML = `
            <p>${country.name.common}</p>
            <p>Capital: ${capital}</p>
            <p>Population: ${population}</p>
            <p>Region: ${region}</p>
            <p>Flag: <img src="${flag}" alt="${country.name.common} flag" width="150"></p>
        `;

        if (country.borders) {
            borderingCountries.innerHTML = "<p>Bordering Countries:</p>";
            const borders = country.borders;

            for (let border of borders) {
                const borderCountry = await getBorderCountryInfo(border);
                let borderFlag = borderCountry.flags.png; 
                borderingCountries.innerHTML += `
                    <p>${borderCountry.name.common}: </p>
                    <p><img src="${borderFlag}" width="150"></p>
                `;
            }
        } else {
            borderingCountries.innerHTML = "<p>No bordering countries available.</p>";
        }

    } catch (error) {
        console.error(error.message);
        countryInfo.innerHTML = `<p">Error:Country invalid</p>`;
    }
}

async function getBorderCountryInfo(borderCode) {
    const url = `https://restcountries.com/v3.1/alpha/${borderCode}`;
    const response = await fetch(url);
    const json = await response.json();
    return json[0];
}
