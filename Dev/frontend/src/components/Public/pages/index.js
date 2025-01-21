import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PublicAcceuil() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isDataAvailable , setIsDataAvailable] = useState(false);
  const [musicResult, setMusicResult] = useState(null);
  const [weatherResult, setWeatherResult] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    handleCommand(transcript);
  },[transcript])

  useEffect(() => {
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
      console.log("speechresult : ", speechResult)
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      setError(`Erreur: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (!transcript) {
        setIsDataAvailable("Aucune entrée vocale détectée.");
        console.log("Aucune entrée vocale détectée.");
      } else {
       // handleCommand(transcript);
      }
    };

    recognitionRef.current = recognition;
  }, [transcript]);

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
          console.log("Enregistrement arrêté automatiquement après 5 secondes sans résultat.");
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
    if(isRecording){
      setIsButtonDisabled(true);
      stopRecording();
      setTimeout(() => setIsButtonDisabled(false), 100);
    } else {
      startRecording();
    }
  };

  const speakWeather = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  // Fonction pour appeler l'API Flask avec la commande
  const handleCommand = async (command) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/getCommande', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      console.log("response : ", response.data)
      const data = await response.json();

      console.log("data : ",data)
      if (data.intent === 'music') {
        // Lancer la musique via l'API Spotify
        fetchMusic(data.query);
      } else if (data.intent === 'weather') {
        // Obtenir la météo via OpenWeatherMap
        fetchWeather(data.location, data.date);
      } else {
        setIsDataAvailable(data.message || "Commande non reconnue.");
      }
    } catch (error) {
      setError("Une erreur est survenue lors de l'appel à l'API.");
    }
  };

  // Fonction pour récupérer la musique via l'API Spotify
  const fetchMusic = async (query) => {
    try {

    const encodedQuery = encodeURIComponent(query);
      // Remplacer cette URL par l'API Spotify que vous utilisez
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodedQuery}&type=track`, {
        headers: {
          Authorization: 'Bearer d65bd2303e054b9c93f086c8dfa98f89',
        },
      });
      const data = await response.json();
      if (data.tracks.items.length > 0) {
        const track = data.tracks.items[0];
        setMusicResult(`Lancement de la musique: ${track.name} de ${track.artists[0].name}`);
      } else {
        setIsDataAvailable('Aucune musique trouvée.');
      }
    } catch (error) {
      setError('Erreur lors de la récupération de la musique.');
    }
  };

  // Fonction pour récupérer les données météo via OpenWeatherMap
  const fetchWeather = async (location, date) => {
    try {
      const apiKey = '2fc4723689423e69c3187b4a1c87e02a';
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&lang=fr`);
      const data = await response.json();
      if (data.weather) {
        setWeatherResult(`Météo à ${location}: ${data.weather[0].description}, Température: ${Math.round(data.main.temp - 273.15)}°C`);
        speakWeather(`Météo à ${location}: ${data.weather[0].description}, Température: ${Math.round(data.main.temp - 273.15)}°C`);
       
      } else {
        setIsDataAvailable('Lieu introuvable pour la météo.');
      }
    } catch (error) {
      setError('Erreur lors de la récupération des données météo.');
    }
  };

  return (
    <div className='container mt-5'>
      <div className='card p-4' id='primary_bg'>
        <h1 className='text-center text-white'>Parlez et interagissez avec l'IA</h1>
        <div className='text-center my-4'>
          <button
            className={`${isRecording ? '' : ''}  recording_button`}
            onClick={startRecording}
            disabled={isRecording || isButtonDisabled}
          >
            {isRecording ? (
              <img src={window.location.origin + '/assets/images/loading.gif'} className='image_logo' alt-text="alt"/>
            ) : (
              <FontAwesomeIcon icon="fa-solid fa-microphone" style={{ fontSize: '70px' }} />
            )}
          </button>

          <br />
          <button
            className={`${isRecording ? 'disable_button_on' : 'disable_button_off'} `}
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
        {musicResult && (
          <div className='alert alert-success text-center mt-3'>
            <strong>{musicResult}</strong>
          </div>
        )}
        {weatherResult && (
          <div className='alert alert-success text-center mt-3'>
            <strong>{weatherResult}</strong>
          </div>
        )}
        {isDataAvailable && (
          <div className='alert alert-danger text-center mt-3'>
            <strong>{isDataAvailable}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicAcceuil;
