import { useState, useEffect, useRef } from 'react';
import './ReactionGame.css';

function ReactionGame() {
  const [status, setStatus] = useState('waiting'); // waiting | ready | now
  const [message, setMessage] = useState('Haz clic para comenzar');
  const [reactionTime, setReactionTime] = useState(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  const startGame = () => {
    setReactionTime(null);
    setStatus('ready');
    setMessage('Espera a que se ponga amarillo...');
    const delay = Math.floor(Math.random() * 4000) + 3000; // 3000-7000 ms

    timeoutRef.current = setTimeout(() => {
      setStatus('now');
      setMessage('¡Haz clic ahora!');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (status === 'waiting') {
      startGame();
    } else if (status === 'ready') {
      // Click demasiado pronto
      clearTimeout(timeoutRef.current);
      setStatus('waiting');
      setMessage('¡Demasiado pronto! Inténtalo de nuevo');
    } else if (status === 'now') {
      const endTime = Date.now();
      const reaction = endTime - startTimeRef.current;
      setReactionTime(reaction);
      setStatus('waiting');
      setMessage(`Tu tiempo de reacción fue de ${reaction} ms. Haz clic para intentarlo otra vez.`);
    }
  };

  // Limpiar timeout si el componente se desmonta
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className={`reaction-box ${status}`} onClick={handleClick}>
      <p>{message}</p>
      {reactionTime !== null && (
        <p className="reaction-time">🕒 {reactionTime} ms</p>
      )}
    </div>
  );
}

export default ReactionGame;
