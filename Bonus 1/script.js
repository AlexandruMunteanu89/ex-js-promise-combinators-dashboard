// Bonus 1 - Risultato vuoto
// Se l’array di ricerca è vuoto, invece di far fallire l'intera funzione, semplicemente i dati relativi a 
// quella chiamata verranno settati a null e  la frase relativa non viene stampata. Testa la funzione con la query “vienna” (non trova il meteo).
// Risposta API
// {
//   city: "Vienna",
//   country: "Austria",
//   temperature: null,
//   weather: null,
//   airport: "Vienna International Airport"
// }

// Output in console
// Vienna is in Austria.
// The main airport is Vienna International Airport.

async function fetchJson(url){
    const res = await fetch(url);
    const obj = await res.json();
    return obj;
}

async function getDashboardData(query){

    try{
        console.log(`Caricando la dashboard per la query "${query}"`);
        
        const destPromise = fetchJson(`http://localhost:3333/destinations?search=${query}`);
        const weathersPromise = fetchJson(`http://localhost:3333/weathers?search=${query}`);
        const airportsPromise = fetchJson(`http://localhost:3333/airports?search=${query}`);

        const promises = [destPromise, weathersPromise, airportsPromise];
        const [destinations, weathers, airports] = await Promise.all(promises);

        const destination = destinations[0];
        const weather = weathers[0];
        const airport = airports[0];
        

        return {
            city: destination ? destination.name : null,
            country: destination ? destination.country : null,
            temperature: weather ? weather.temperature : null,
            weather: weather ? weather.weather_description : null,
            airport: airport ? airport.name : null
        }
    }catch(error){
        throw new Error(`Errore nel recupero dei dati`)
    }
}

getDashboardData('vienna')
    .then(data => {
        console.log('Dasboard data:', data);
        let frase = '';
        if(data.city !== null && data.country !== null){
            frase += `${data.city} is in ${data.country}.\n`;
        }
        if(data.temperature !== null && data.weather !== null){
            frase += `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`;
        }
        if(data.airport !== null){
            frase += `The main airport is ${data.airport}.\n`;
        }
        console.log(frase);
        
    })
    .catch(error => console.error(error));