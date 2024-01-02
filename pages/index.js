// pages/index.js
import React, { useState, useRef } from 'react';
import '../src/app/globals.css';
import Replicate from "replicate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const Home = () => {
  let [distance, setDistance] = useState('');
  let [distanceUnits, setDistanceUnits] = useState('');
  let [pace, setPace] = useState('');
  let [time, setTime] = useState('');
  let [imageDescription, setImageDescription] = useState('');
  let [imageRendering, setImageRendering] = useState(false);
  let [imageRendered, setImageRendered] = useState(false);
  const canvasRef = useRef(null);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setImageRendering(true);

  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  if (imageDescription === '') {
    imageDescription = "central park NYC";
  }
  if (pace === '') {
    pace = "5";
  }
  if (time === '') {
    time = "5";
  }
  if (pace === '') {
    pace = "5";
  }

  imageDescription = "photorealistic 4K photo of " + imageDescription;

  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageDescription }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let userImageLoaded = false;
    let stravaLogoLoaded = false;

    let prediction = await response.json();
    const userImage = new Image();
    userImage.crossOrigin = "anonymous";
    userImage.src =  prediction.output[0];

    userImage.onload = () => {
      userImageLoaded = true;
      drawImages();
    };

    const stravaLogo = new Image();
    stravaLogo.crossOrigin = "anonymous";
    stravaLogo.src = '/images/STRAVA-LOGO.png'; // Path to the Strava logo
    stravaLogo.onload = () => {
      stravaLogoLoaded = true;
      drawImages();
    };

    function drawImages() {

      if (userImageLoaded && stravaLogoLoaded) {
        ctx.drawImage(userImage, 0, 0, canvas.width, canvas.height);
        ctx.font = '16px Arial';
  
        const canvasWidth = canvas.width;
  
        const textTitlePosY = canvas.height - canvas.height / 10;
        const subtitlePosY = textTitlePosY + canvas.height / 22;
  
        ctx.font = '18px Tahoma';
        ctx.fillStyle = 'white';
        ctx.fillText(`Run`, (canvasWidth / 3) * 0 + (canvasWidth / 10), textTitlePosY);
        ctx.fillText(`Pace`, (canvasWidth  / 3) * 1 + (canvasWidth / 10), textTitlePosY);


        ctx.fillText(`Time`, (canvasWidth / 3) * 2 + (canvasWidth / 10) , textTitlePosY);
  
        ctx.font = '30px Tahoma';
        ctx.fillText(`${distance} ${distanceUnits === 'kilometers' ? 'km' : 'mi'}`, (canvasWidth  / 3) * 0 + (canvasWidth / 10), subtitlePosY);
        ctx.fillText(`${pace} / ${distanceUnits === 'kilometers' ? 'km' : 'mi'}`, (canvasWidth / 3) * 1 + (canvasWidth / 10), subtitlePosY);
        ctx.fillText(`${time}`, (canvasWidth  / 3) * 2 + (canvasWidth / 10), subtitlePosY);
  
        // stravaLogo.onload = () => {
          const stravaRatio = 4.76;
          const stravaWidth = 100;
          const stravaHeight = stravaWidth / stravaRatio;
          ctx.drawImage(stravaLogo, canvasWidth / 30, canvasWidth / 30, stravaWidth, stravaHeight);
        // };

        setImageRendering(false);
        setImageRendered(true);
      }

    }

    // userImage.onload = () => {
    //   ctx.drawImage(userImage, 0, 0, canvas.width, canvas.height);
    //   ctx.font = '16px Arial';

    //   const canvasWidth = canvas.width;

    //   const textTitlePosY = canvas.height - canvas.height / 10;
    //   const subtitlePosY = textTitlePosY + canvas.height / 22;

    //   ctx.font = '18px Tahoma';
    //   ctx.fillStyle = 'white';
    //   ctx.fillText(`Run`, (canvasWidth / 3) * 0 + (canvasWidth / 10), textTitlePosY);
    //   ctx.fillText(`Pace`, (canvasWidth  / 3) * 1 + (canvasWidth / 10), textTitlePosY);
    //   ctx.fillText(`Time`, (canvasWidth / 3) * 2 + (canvasWidth / 10) , textTitlePosY);

    //   ctx.font = '30px Tahoma';
    //   ctx.fillText(`${distance} ${distanceUnits === 'kilometers' ? 'km' : 'mi'}`, (canvasWidth  / 3) * 0 + (canvasWidth / 10), subtitlePosY);
    //   ctx.fillText(`${pace} / ${distanceUnits === 'kilometers' ? 'km' : 'mi'}`, (canvasWidth / 3) * 1 + (canvasWidth / 10), subtitlePosY);
    //   ctx.fillText(`${time}`, (canvasWidth  / 3) * 2 + (canvasWidth / 10), subtitlePosY);

    //   stravaLogo.onload = () => {
    //     const stravaRatio = 4.76;
    //     const stravaWidth = 100;
    //     const stravaHeight = stravaWidth / stravaRatio;
    //     ctx.drawImage(stravaLogo, canvasWidth / 30, canvasWidth / 30, stravaWidth, stravaHeight);
    //   };
    // };
  } catch (error) {
    console.error('Error creating prediction:', error);
  }
};

  return (
    <div className="flex flex-col items-center mx-auto justify-center min-h-screen w-full pt-20 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto border p-12 rounded-xl shadow-sm">
        <h1 className="text-4xl text-gray-800 font-bold mb-2 text-left">AI Run Generator 🏃‍♀️</h1>

        <div className='w-7/8 flex mx-auto align-center items-center border-b border-gray-200 mb-6'></div>

        <form onSubmit={handleSubmit} className="flex flex-col items-left space-y-6 mx-auto justify-center">
          <label className="relative">
            <input
              type="number"
              placeholder="6.32"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
            {<span className='bg-white text-xs' style={{position: "absolute", top: "-12px", left: "0", padding: "2px", color: "gray"}}>Distance</span>}
          </label>
          <div className="flex items-center space-x-4">
            <label>
              <input
                type="radio"
                value="miles"
                checked={distanceUnits === 'miles' || !distanceUnits}
                onChange={() => setDistanceUnits('miles')}
              />
              Miles
            </label>
            <label>
              <input
                type="radio"
                value="kilometers"
                checked={distanceUnits === 'kilometers'}
                onChange={() => setDistanceUnits('kilometers')}
              />
              Kilometers
            </label>
          </div>

          <label className='relative'>
            <select
              value={pace}
              onChange={(e) => {
                const selectedSpeed = e.target.value;
                let calculatedPace, calculatedTime;

                // Do all calculations in miles, update pace at the end if in km

                switch (selectedSpeed) {
                  case 'slow':
                    calculatedPace = '10:00'; // replace with your logic
                    calculatedTime = '60:00'; // replace with your logic
                    break;
                  case 'fast':
                    calculatedPace = '7:30'; // replace with your logic
                    calculatedTime = '45:00'; // replace with your logic
                    break;
                  case 'wicked fast':
                    calculatedPace = '5:00'; // replace with your logic
                    calculatedTime = '30:00'; // replace with your logic
                    break;
                  default:
                    break;
                }

                setPace(selectedSpeed); // Update the pace state variable with the selected speed
                setTime(calculatedTime);
              }}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="slow">Slow</option>
              <option value="fast">Fast</option>
              <option value="wicked fast">Wicked Fast</option>
            </select>

            {<span className='bg-white text-xs' style={{position: "absolute", top: "-12px", left: "0", padding: "2px", color: "gray"}}>Pace</span>}

          </label>


          <label className="relative">
            <input
              type="text"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="Central Park NYC"
              className="p-2 border border-gray-300 rounded w-full"
            />
            {<span className='bg-white text-xs' style={{position: "absolute", top: "-12px", left: "0", padding: "2px", color: "gray"}}>Image description</span>}
          </label>

            


            
            <button type="submit" className={`p-2 ${imageRendering ? 'bg-green-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded w-full items-center mx-auto`}>
              {imageRendering ? (
                <span className="flex mx-auto align-center items-center space-x-2 justify-center items-center">
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Running...</span>
                </span>
              ) : (
                "Generate run"
              )}
            </button>

            <>
            { imageRendering ?
              (<div className='font-light text-xs'>Did you know? AI runs take about 15-30 seconds to generate, but will save you hours of exertion.</div>) : ""
            }
            </>
          </form>
          </div>

          {imageRendered && (
            <button className='border rounded-md mt-2 bg-gray-200 px-4 p-2' onClick={() => {
              let link = document.createElement('a');
              link.download = 'generated_run.png';
              link.href = canvasRef.current.toDataURL()
              link.click();
            }}>
              Download Image
            </button>
          )}
          <canvas ref={canvasRef} width="560" height="744" className="mt-8 pb-20"></canvas>
          

      </div>

      
    );
  };
  
  export default Home;
