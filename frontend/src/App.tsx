import { useState, useMemo } from 'react';
import './App.css';

export const getDisplayFontSize = (value: string): string => {
  const len = value.length;
  if (len <= 9) return '2em';
  if (len <= 12) return '1.6em';
  if (len <= 16) return '1.2em';
  if (len <= 20) return '0.95em';
  return '0.75em';
};

function App() {
  const [display, setDisplay] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecond, setWaitingForSecond] = useState<boolean>(false);

  const inputDigit = (digit: number) => {
    if (waitingForSecond) {
      setDisplay(String(digit));
      setWaitingForSecond(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + String(digit));
    }
  };

  const inputDot = () => {
    if (waitingForSecond) {
      setDisplay('0.');
      setWaitingForSecond(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const performCalculation = async (
    op: string,
    a: number,
    b: number,
  ): Promise<number> => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a, b, operation: op }),
      });
      const data = await response.json();
      if (response.ok) {
        return data.result;
      } else {
        alert(data.error);
        return b; // fail gracefully by returning current number
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to backend');
      return b;
    }
  };

  const handleOperator = async (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator && !waitingForSecond) {
      const result = await performCalculation(
        operator,
        firstOperand,
        inputValue,
      );
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecond(true);
    setOperator(nextOperator);
  };

  const handleEqual = async () => {
    if (!operator || waitingForSecond) return;

    const inputValue = parseFloat(display);
    const result = await performCalculation(
      operator,
      firstOperand!,
      inputValue,
    );
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(true);
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(false);
  };

  const fontSize = useMemo(() => getDisplayFontSize(display), [display]);

  return (
    <div className='calculator'>
      <div className='display' data-testid='display' style={{ fontSize }}>
        {display}
      </div>
      <div className='buttons'>
        <button onClick={clear} className='clear-button'>
          C
        </button>
        <button onClick={() => inputDigit(7)}>7</button>
        <button onClick={() => inputDigit(8)}>8</button>
        <button onClick={() => inputDigit(9)}>9</button>
        <button onClick={() => handleOperator('divide')} className='operator'>
          ÷
        </button>

        <button onClick={() => inputDigit(4)}>4</button>
        <button onClick={() => inputDigit(5)}>5</button>
        <button onClick={() => inputDigit(6)}>6</button>
        <button onClick={() => handleOperator('multiply')} className='operator'>
          ×
        </button>

        <button onClick={() => inputDigit(1)}>1</button>
        <button onClick={() => inputDigit(2)}>2</button>
        <button onClick={() => inputDigit(3)}>3</button>
        <button onClick={() => handleOperator('subtract')} className='operator'>
          −
        </button>

        <button onClick={() => inputDigit(0)}>0</button>
        <button onClick={inputDot}>.</button>
        <button onClick={handleEqual} className='operator'>
          =
        </button>
        <button onClick={() => handleOperator('add')} className='operator'>
          +
        </button>
      </div>
    </div>
  );
}

export default App;
