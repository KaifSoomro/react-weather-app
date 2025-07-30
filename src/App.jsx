import React, { useEffect, useState } from 'react'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import { MdLocationOn } from "react-icons/md";
import { WiStrongWind } from "react-icons/wi";
import { MdOutlineWater } from "react-icons/md";
import { CiTempHigh } from "react-icons/ci";
import RainClouds from './assets/rain_with_cloud.png'
import Tornado from './assets/Tornado.png'
import Thunder from './assets/thunder.png'
import Sun from './assets/sun.png'
import Cloudy from './assets/cloudy.png'
import * as Yup from 'yup'

const App = () => {
  const [cityData, setCityData] = useState(null)
  const [cityName,setCityName] = useState('Karachi');
  const [error, setError] = useState(null)
  const getWeather = async () => {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=7032064b9fbc4f6eb3d153741242208&q=${cityName}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json();
      console.log(data.current);
    
    if (data.error) setError(data.error.message)
      else setCityData(data)
    } catch (error) {
      console.error('error',error)
      setError(error.message)
    }
  }
  useEffect(()=>{
     getWeather()
  },[cityName])

  const defaultValue = {
    city: ""
  }

  const validation = Yup.object().shape({
    city: Yup.string().required('You must enter a city name before.')
  })

  const handleSubmit = ({ city: newCity }) => {
    setCityName(newCity)
  };

  const getWeatherImage = (conditionText) => {
    if(!conditionText) return Sun;

    const lowerCaseCondition = conditionText.toLowerCase();

    if(lowerCaseCondition.includes('rain')) return RainClouds;
    if(lowerCaseCondition.includes('thunder')) return Thunder;
    if(lowerCaseCondition.includes('tornado')) return Tornado;
    if(lowerCaseCondition.includes('cloudy' || 'clouds')) return Cloudy;
    if(lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) return Sun;
  }

  return (
    <>
      <div className='flex items-center justify-center bg-gradient-to-t from-blue-900 to-blue-300 w-full h-screen'>
        <div className='bg-neutral-950 w-[430px] h-[750px] md:h-[850px] rounded-[73px] p-2'>
          <div className='w-full h-[75%] md:h-[80%] bg-gradient-to-t from-blue-700 to-cyan-400 rounded-[65px]'>

            <div>
              <div className='w-full h-[40px] pt-14 flex items-center justify-center text-white'>
                <MdLocationOn className='text-3xl' />
                <h1 className='text-3xl font-medium'>{cityData?.location?.name || cityName}</h1>
              </div>

              <div className='w-full h-[300px] pt-14'>
                <img src={getWeatherImage(cityData?.current?.condition?.text) || Sun} alt="" className='mx-auto w-[250px] drop-shadow-xl' />
              </div>

             {
              cityData && (
                <div className='w-full text-center'>
                  <h1 className='text-white font-medium text-8xl md:text-[165px] leading-28 relative'>{ Math.floor(cityData?.current?.temp_c || '30')}<span className='absolute top-[-10px] right-25 font-light text-7xl'>°</span></h1>
                  <h1 className='leading-15 text-white font-normal text-2xl'>{ cityData?.current?.condition?.text || 'Clouds' }</h1>
                  <h1 className='leading-3 text-white'>{ cityData?.location?.localtime || '2025-10-3 19:15' }</h1>
                </div>
              )
             }
              <br />
              <hr className='text-blue-400 md:block hidden' />
              <div className='w-full h-[100px] mt-18 md:mt-0 flex items-center justify-evenly text-white p-3'>
                <div className='text-2xl flex flex-col items-center justify-center'>
                  <WiStrongWind className='text-4xl md:text-5xl' />
                  {cityData?.current?.wind_kph}
                </div>
                <div className='text-2xl flex flex-col items-center justify-center'>
                  <MdOutlineWater className='text-4xl md:text-5xl' />
                  {cityData?.current?.humidity}
                </div>
                <div className='text-2xl flex flex-col items-center justify-center'>
                  <CiTempHigh className='text-4xl md:text-5xl' />
                  {cityData?.current?.feelslike_c}
                </div>
              </div>
            </div>

          </div>


          <div className='w-full h-[70px] mt-3 flex'>
            <div className='w-[90%] h-full mx-auto rounded-4xl px-2 border border-neutral-500'>
              <Formik
                initialValues={defaultValue}
                validationSchema={validation}
                onSubmit={handleSubmit}
              >

                <Form>
                  <div className='w-full h-[70px] flex items-center justify-between'>
                    <Field
                      name='city'
                      type='text'
                      placeholder='Enter city name...'
                      className='w-[70%] h-[50px] border-none outline-none text-xl ps-2 text-white'
                    />
                    <button
                      type='submit'
                      className='bg-gradient-to-tl from-blue-700 to-cyan-300 py-2 px-6 md:py-3 md:px-8 text-white text-xl rounded-4xl cursor-pointer'
                    >Search</button>
                  </div>
                  <div>
                    <ErrorMessage name='city' className='text-red-500'/>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App