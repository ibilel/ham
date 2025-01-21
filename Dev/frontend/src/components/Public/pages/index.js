import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PublicAcceuil() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isDataAvailable , setIsDataAvailable] = useState(false);
  const recognitionRef = useRef(null);

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
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      setError(`Erreur: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (!transcript) {
        setIsDataAvailable("Aucune entrée vocale détectée.")
        console.log("Aucune entrée vocale détectée.");
      }
    };

    recognitionRef.current = recognition;
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
    }else {
      startRecording();
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
              <img src={window.location.origin + '/assets/images/loading.gif'} className='image_logo' alt="image loading"/>
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

        {isDataAvailable && (
          <>
           <div className='alert alert-danger text-center mt-3'>
            <strong> {isDataAvailable}</strong>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PublicAcceuil;
