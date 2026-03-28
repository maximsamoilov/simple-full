import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App, { getDisplayFontSize } from './App';
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

  it('display uses default font size for short numbers', () => {
    render(<App />);
    const display = screen.getByTestId('display');
    // initial value '0' — should have the largest font
    expect(display).toHaveStyle({ fontSize: '2em' });
  });

  it('display font shrinks when a long number is shown', () => {
    render(<App />);
    // Click digits to build a 10-character number (1234567890)
    ['1','2','3','4','5','6','7','8','9'].forEach(d => {
      fireEvent.click(screen.getByText(d));
    });
    fireEvent.click(screen.getByText('0'));
    const display = screen.getByTestId('display');
    const fontSize = display.style.fontSize;
    // 10 chars → should be smaller than default 2em
    expect(['1.6em', '1.2em', '0.95em', '0.75em']).toContain(fontSize);
  });
});

describe('getDisplayFontSize', () => {
  it('returns 2em for ≤9 characters', () => {
    expect(getDisplayFontSize('123456789')).toBe('2em');
    expect(getDisplayFontSize('0')).toBe('2em');
  });

  it('returns 1.6em for 10–12 characters', () => {
    expect(getDisplayFontSize('1234567890')).toBe('1.6em');
    expect(getDisplayFontSize('123456789012')).toBe('1.6em');
  });

  it('returns 1.2em for 13–16 characters', () => {
    expect(getDisplayFontSize('1234567890123')).toBe('1.2em');
    expect(getDisplayFontSize('1234567890123456')).toBe('1.2em');
  });

  it('returns 0.95em for 17–20 characters', () => {
    expect(getDisplayFontSize('12345678901234567')).toBe('0.95em');
    expect(getDisplayFontSize('12345678901234567890')).toBe('0.95em');
  });

  it('returns 0.75em for >20 characters', () => {
    expect(getDisplayFontSize('123456789012345678901')).toBe('0.75em');
    expect(getDisplayFontSize('1'.repeat(30))).toBe('0.75em');
  });
});
