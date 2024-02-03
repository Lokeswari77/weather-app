import { useState, useEffect } from 'react'
import search from './assets/icons/search.svg'
import { useStateContext } from './context'
import { BackgroundLayout, WeatherCard, MiniCard } from './components'

function App() {
  const [input, setInput] = useState('')
  const { weather, thisLocation, values, place, setPlace } = useStateContext()

  const submitCity = () => {
    setPlace(input)
    setInput('')
  }

  const getCurrentLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
  
      // Update the place with the coordinates (latitude and longitude)
      setPlace(`${position.coords.latitude},${position.coords.longitude}`);
  
      // Use reverse geocoding API to get the city from coordinates
      const reverseGeocodeResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
      );
  
      const reverseGeocodeData = await reverseGeocodeResponse.json();
  
      // Extract the city from the reverse geocoding response
      const cityName = reverseGeocodeData.locality;
  
      // Set the location to display in the UI
      setPlace(cityName);
    } catch (error) {
      console.error('Error getting current location:', error);
      // Handle error, show user a message or fallback to a default location
    }
  };
  
  useEffect(() => {
    getCurrentLocation();
  }, []);  

  return (
    <div className='w-full h-screen text-white px-8'>
      <nav className='w-full p-3 flex justify-between items-center'>
        <h1 className='font-bold tracking-wide text-3xl'>Weather App</h1>
        <div className='bg-white w-[15rem] overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2'>
          <img src={search} alt="search" className='w-[1.5rem] h-[1.5rem]' />
          <input onKeyUp={(e) => {
            if (e.key === 'Enter') {
              // sumit the form
              submitCity()
            }
          }} type="text" placeholder='Search city' className='focus:outline-none w-full text-[#212121] text-lg' value={input} onChange={e => setInput(e.target.value)} />
        </div>
      </nav>
      <BackgroundLayout></BackgroundLayout>
      <main className='w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center'>
        <WeatherCard
          place={thisLocation}
          windspeed={weather.wspd}
          humidity={weather.humidity}
          temperature={weather.temp}
          heatIndex={weather.heatindex}
          iconString={weather.conditions}
          conditions={weather.conditions}
        />

        <div className='flex justify-center gap-8 flex-wrap w-[60%]'>
          {
            values?.slice(1, 7).map(curr => {
              return (
                <MiniCard
                  key={curr.datetime}
                  time={curr.datetime}
                  temp={curr.temp}
                  iconString={curr.conditions}
                />
              )
            })
          }
        </div>
      </main>
    </div>
  )
}

export default App
