import { render, screen } from '@testing-library/react';
import App from '../App';

test('if App renders successfully with login button initially', () => {
  render(<App />)
  const loginBtn = screen.getByRole('button', { name: /Login To Spotify/i });
  expect(loginBtn).toBeInTheDocument();
})