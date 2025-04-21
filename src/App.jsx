import { useState } from 'react'
import { clsx } from "clsx"
import { languages } from './languages'
import { getFarewellText, getRandomWord } from './utils'
import Confetti from "react-confetti"

export default function AssemblyEndgame() {

  //State Values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([]);
  
  //Derived Values
  let wrongGuessCount = 0;
  
  guessedLetters.map(
    guessedLetter => {
       if(!currentWord.includes(guessedLetter)) {
          wrongGuessCount = wrongGuessCount + 1
       } 
    }
  )

  guessedLetters.filter(guessedLetter => !currentWord.includes(guessedLetter))

  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter)) 
  const isGameLost = wrongGuessCount >= languages.length  - 1
  const isGameOver = isGameWon || isGameLost

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  //Static Values
  const alphabets = "abcdefghijklmnopqrstuvwxyz"
  
  const languageElemenents = languages.map((language, index) => {

      const isLanguageLost = index < wrongGuessCount

      const styles = {
          backgroundColor: language.backgroundColor,
          color: language.color
      }
      
      const languageClassName = clsx("chip", isLanguageLost && "lost")      
      return (
          <span 
            className={languageClassName} 
            style={styles} 
            key={language.name}
          >
            {language.name}
          </span>
      )
  })

  function addGuessedLetter(letter){
    setGuessedLetters(prevLetter =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    )
  }

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(isGameLost && !guessedLetters.includes(letter) && "missed-letter")
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    )
  })


  function startNewGame(){
      setCurrentWord(getRandomWord())
      setGuessedLetters([])
  }

  const keyboardElements = alphabets.split("").map((alphabet) => {

      const isGuessed = guessedLetters.includes(alphabet)
      const isCorrect = isGuessed && currentWord.includes(alphabet)
      const isWrong = isGuessed && !currentWord.includes(alphabet)

      const className = clsx({
        correct: isCorrect,
        wrong: isWrong
      })
    
      return (
      <button 
        className={className}
        key={alphabet} 
        disabled={isGameOver}
        aria-disabled={isGameOver}
        aria-label={`Letter ${alphabet}`}
        onClick={() => addGuessedLetter(alphabet)}
      >
        {alphabet.toUpperCase()}
      </button>
      )
  })

  const gameStatusColor = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function renderGameStatus(){
    if(!isGameOver && isLastGuessIncorrect) {
      return <p className="farewell-message"> 
        {getFarewellText(languages[wrongGuessCount - 1].name)}
      </p> 
    }

    if(isGameWon){
      return (
        <>
          <h2>You win!</h2>  
          <p>Well done!</p>     
        </>
      )
    } 
    if(isGameLost) {
      return (
        <>
          <h2>Game Over!</h2> 
          <p>You lose! Better start learning Assembly </p>
        </>
      )
    }
  }

  return (
    <main>
      {
        isGameWon && <Confetti  recycle={false} numberOfPieces={1000}/>
      } 
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section 
        aria-live="polite" 
        role="status" 
        className={gameStatusColor}
      > 
        {renderGameStatus()} 
      </section>
      <section className="language-chips"> 
        {languageElemenents}
      </section>
      <section className="word"> 
        {letterElements}
      </section>

      {/* Combined visually-hidden aria-live region for status updates */}
      <section 
        className="sr-only"
        aria-live= "polite"
        role="status"
      > 
        <p>
          { currentWord.includes(lastGuessedLetter) ?
              `Correct! The letter ${lastGuessedLetter} is in the word.` :
              `Sorry, the letter ${lastGuessedLetter} is not in the word.`
          }
        </p>
        <p>Current Word: {
          currentWord.split("").map(letter =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
          ).join(" ")
        }
        </p>
      </section>
      <section className="keyboard"> 
        {keyboardElements}
      </section>
      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  )
}
