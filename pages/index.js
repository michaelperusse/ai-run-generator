// pages/index.js
import React, { useState, useRef } from 'react';
import '../src/app/globals.css';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const Home = () => {
  const [distance, setDistance] = useState('');
  const [distanceUnits, setDistanceUnits] = useState('');
  const [pace, setPace] = useState('');
  const [time, setTime] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const canvasRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
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
  
      let prediction = await response.json();
      const userImage = new Image();
      userImage.src = prediction.output.url;
  
      const stravaLogo = new Image();
      stravaLogo.src = '/images/STRAVA-LOGO.png'; // Path to the Strava logo
  
      userImage.onload = () => {
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
  
        stravaLogo.onload = () => {
          const stravaRatio = 4.76;
          const stravaWidth = 100;
          const stravaHeight = stravaWidth / stravaRatio;
          ctx.drawImage(stravaLogo, canvasWidth / 30, canvasWidth / 30, stravaWidth, stravaHeight);
        };
      };
    } catch (error) {
      console.error('Error creating prediction:', error);
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto justify-center min-h-screen pt-20">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-4xl text-gray-800 font-bold mb-6 text-center">AI Strava Run Generator</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-8 mx-auto justify-center">
          <input
            type="number"
            placeholder="Distance (e.g. 6.32)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
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
          <input
            type="text"
            placeholder="Pace (e.g. 7:30)"
            value={pace}
            onChange={(e) => setPace(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              placeholder="Time (e.g. 48:30)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              placeholder="Image Description (e.g. An astronaut riding a rainbow unicorn)"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded w-full">
              Generate
            </button>
          </form>
  
          <canvas ref={canvasRef} width="1120" height="1488" className="mt-8"></canvas>
        </div>
      </div>
    );
  };
  
  export default Home;
