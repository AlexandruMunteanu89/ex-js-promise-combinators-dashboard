// 🎯 Bonus 2 - Chiamate fallite
// Attualmente, se una delle chiamate fallisce, Promise.all() rigetta l'intera operazione.

// Modifica getDashboardData() per usare Promise.allSettled(), in modo che:
// Se una chiamata fallisce, i dati relativi a quella chiamata verranno settati a null.
// Stampa in console un messaggio di errore per ogni richiesta fallita.
// Testa la funzione con un link fittizio per il meteo (es. https://www.meteofittizio.it).

async function fetchJson(url){
    const res = await fetch(url);
    const obj = await response.json();
    return obj;
}

async function getDashboardData(query){

    try{
        console.log(`Caricando la dashboard per la query "${query}"`);
        
        const destinationsPromise = fetchJson(`http://localhost:3333/destinations?search=${query}`);
        const weathersPromise = fetchJson(`http://localhost:3333/weathers?search=${query}`);
        const airportsPromise = fetchJson(`http://localhost:3333/airports?search=${query}`);

        const promises = [destinationsPromise, weathersPromise, airportsPromise];
        const [destinationsResult, weathersResult, airportsResult] = await Promise.allSettled(promises);

        const data = {};

        // Controllo il risultato di destinations
        if(destinationsResult.status === 'rejected'){
            console.error(`Problema in destinations: `, destinationsResult.reason);
            data.city = null;
            data.country = null;
        }else{
            const destination = destinationsResult.value[0];
            data.city = destination ? destination.name : null;
            data.country = destination ? destination.country : null;
        }

        // Controllo il risultato di weathers
        if(weathersResult.status === 'rejected'){
            console.error(`Problema in weathers: `, weathersResult.reason);
            data.temperature = null;
            data.weather = null;
        }else{
            const weathers = weathersResult.value[0];
            data.temperature = weather ? weather.temperature : null;
            data.weather = weather ? weather.weather_description : null;
        }

        // Controllo il risultato di airports
        if(airportsResult.status === 'rejected'){
            console.error(`Problema in airports: `, airportsResult.reason);
            data.airport = null;
        }else{
            const airport = airporsResult.value[0];
            data.airport = airport ? airport.name : null;
        }

        
        const weather = weather[0];
        const airport = airport[0];
        

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

getDashboardData('london')
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