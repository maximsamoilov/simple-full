import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import React from 'react';

describe('App component', () => {
  it('renders the calculator display', () => {
    render(<App />);
    const displayElement = screen.getByTestId('display');
    expect(displayElement).toBeInTheDocument();
    expect(displayElement).toHaveTextContent('0');
  });

  it('updates display when digits are clicked', () => {
    render(<App />);
    const button1 = screen.getByText('1');
    const button2 = screen.getByText('2');
    fireEvent.click(button1);
    fireEvent.click(button2);
    expect(screen.getByTestId('display')).toHaveTextContent('12');
  });

  it('clears the display when C is clicked', () => {
    render(<App />);
    const button1 = screen.getByText('1');
    const buttonC = screen.getByText('C');
    fireEvent.click(button1);
    expect(screen.getByTestId('display')).toHaveTextContent('1');
    fireEvent.click(buttonC);
    expect(screen.getByTestId('display')).toHaveTextContent('0');
  });
});
