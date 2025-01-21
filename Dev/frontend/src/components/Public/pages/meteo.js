import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PublicAcceuil() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [weatherData, setWeatherData] = useState('');
  const recognitionRef = useRef(null);

  const getRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Votre navigateur ne supporte pas la reconnaissance vocale.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      setIsRecording(false);
      handleWeatherRequest(speechResult); // Gérer la demande de météo
    };

    recognition.onerror = (event) => {
      setError(`Erreur: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (!transcript) {
        setIsDataAvailable('Aucune entrée vocale détectée.');
      }
    };

    recognitionRef.current = recognition;
  };

  useEffect(() => {
    getRecognition();
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsDataAvailable('');
      setIsRecording(true);
      setTranscript('');
      setError('');
      recognitionRef.current.start();

      setTimeout(() => {
        if (isRecording) {
          recognitionRef.current.stop();
          setIsRecording(false);
        }
      }, 5000); // 5000 ms = 5 secondes
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      setIsDataAvailable('');
      setIsRecording(false);
      recognitionRef.current.stop();
    }
  };

  const disableButton = () => {
    if (isRecording) {
      setIsButtonDisabled(true);
      stopRecording();
      setTimeout(() => setIsButtonDisabled(false), 100);
    } else {
      startRecording();
    }
  };

  const handleWeatherRequest = async (speech) => {
    const cityMatch = speech.match(/à (.+)/i);
    const city = cityMatch ? cityMatch[1] : null;

    if (city) {
      try {
        const apiKey = '2fc4723689423e69c3187b4a1c87e02a';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`
        );
        const data = await response.json();

        if (data.cod === 200) {
          const description = data.weather[0].description;
          const temperature = data.main.temp;
          const weatherText = `La météo à ${city} est ${description} avec une température de ${temperature}°C.`;
          setWeatherData(weatherText);
          speakWeather(weatherText);
        } else {
          setWeatherData(`Impossible de trouver la météo pour ${city}.`);
          speakWeather(`Je n'ai pas pu trouver la météo pour ${city}.`);
        }
      } catch (error) {
        setWeatherData('Une erreur est survenue lors de la récupération des données météo.');
        speakWeather('Une erreur est survenue lors de la récupération des données météo.');
      }
    } else {
      setWeatherData('Je n\'ai pas compris la ville. Veuillez réessayer.');
      speakWeather('Je n\'ai pas compris la ville. Veuillez réessayer.');
    }
  };

  const speakWeather = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className='container mt-5'>
      <div className='card p-4' id='primary_bg'>
        <h1 className='text-center text-white'>Parlez et interagissez avec l'IA</h1>
        <div className='text-center my-4'>
          <button
            className={`${isRecording ? '' : ''} btn-lg me-2 recording_button`}
            onClick={startRecording}
            disabled={isRecording || isButtonDisabled}
          >
            {isRecording ? (
              <img src={window.location.origin + '/assets/images/loading.gif'} className='image_logo' alt="loading" />
            ) : (
              <FontAwesomeIcon icon="fa-solid fa-microphone" style={{ fontSize: '70px' }} />
            )}
          </button>
            <br></br>
          <button
            className={`${isRecording ? 'disable_button_on' : 'disable_button_off'}`}
            onClick={disableButton}
          >
            {isRecording ? (
              <FontAwesomeIcon icon="fa-solid fa-microphone" className='on' />
            ) : (
              <FontAwesomeIcon icon="fa-solid fa-microphone-slash" className='off'/>
            )}
          </button>
        </div>
        {error && <p className='text-danger text-center'>{error}</p>}
        {transcript && (
          <div className='alert alert-success text-center mt-3'>
            <strong>Texte capturé :</strong> {transcript}
          </div>
        )}
        {weatherData && (
          <div className='alert alert-info text-center mt-3'>
            <strong>Météo :</strong> {weatherData}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicAcceuil;
