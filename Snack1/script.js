// In questo esercizio, utilizzerai Promise.all() per creare la funzione getDashboardData(query), che accetta una città come input e recupera simultaneamente:
// Nome completo della città e paese da  /destinations?search=[query]
// (result.name, result.country, nelle nuove proprietà city e country).
// Il meteo attuale da /weathers?search={query}
// (result.temperature e result.weather_description nella nuove proprietà temperature e weather).
// Il nome dell’aeroporto principale da /airports?search={query}
// (result.name nella nuova proprietà airport).
// Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati.

async function fetchJson(url){
    const res = await fetch(url);
    const obj = await res.json();
    return obj;
}

async function getDashboardData(query){

    try{
        const destPromise = fetchJson(`http://localhost:3333/destinations?search=${query}`);
        const weathersPromise = fetchJson(`http://localhost:3333/weathers?search=${query}`);
        const airportsPromise = fetchJson(`http://localhost:3333/airports?search=${query}`);

        const promises = [destPromise, weathersPromise, airportsPromise];
        const [destinations, weathers, airports] = await Promise.all(promises);

        return {
            city: destinations[0].name,
            country: destinations[0].country,
            temperature: weathers[0].temperature,
            weather: weathers[0].weather_description,
            airport: airports[0].name
        }
    }catch(error){
        throw new Error(`Errore nel recupero dei dati`)
    }
}

getDashboardData('london')
    .then(data => {
        console.log('Dasboard data:', data);
        console.log(
            `${data.city} is in ${data.country}.\n` +
            `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`+
            `The main airport is ${data.airport}.\n`
        );
    })
    .catch(error => console.error(error));