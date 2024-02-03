import { http, HttpResponse } from "msw"
import { setupServer } from 'msw/node'
import { act, findByText, fireEvent, getByTestId, getByText, render, screen, waitFor, within } from '@testing-library/react';
import MainPage from '../components/MainPage/MainPage';


vi.mock('../hooks/useAuth')

const server = setupServer(
  http.post("http://localhost:5000/search", () => {
    return HttpResponse.json([
      // Mocked search results
      {
        artists: [{ name: 'artistExample' }],
        album: {
          images: [
            { url: 'urlExample-1', height: 100 },
            { url: 'urlExample-2', height: 200 },
          ],
        },
        uri: 'uriExample',
        name: 'nameExample',
      },
      {
        artists: [{ name: 'secondArtist' }],
        album: {
          images: [
            { url: 'secondUrl-1', height: 100 },
            { url: 'secondUrl-2', height: 200 },
          ],
        },
        uri: 'secondUri',
        name: 'secondName',
      },
    ])
  }),
  http.post("http://localhost:5000/playlist", () => {
    return HttpResponse.text('confirmation message')
  })
  )
  
  beforeAll(() => {
    // Start the interception.
    server.listen()
  })
  
  afterEach(() => {
    // Remove any handlers you may have added
    // in individual tests (runtime handlers).
    server.resetHandlers()
  })
  
  afterAll(() => {
    // Disable request interception and clean up.
    server.close()
  })
  
  test('searched song is played', async () => {
  render(<MainPage code={'random'} />)
  
  const searchBar = screen.getByRole('textbox')
  expect(searchBar).toBeVisible();
  fireEvent.change(searchBar, { target: { value: 'song1' } })
  
  await waitFor(() => expect(screen.getByText(/artistExample/i)).toBeVisible())
  
  expect(screen.queryByRole('button', {  name: /playing/i})).toBeNull();
  
  fireEvent.click(screen.getByRole('button', {  name: /nameExample artistExample/i}));
  
  const playingStateIcon = screen.getByRole('button', {  name: /playing/i});
  expect(playingStateIcon).toBeVisible()
  
})


test('specified playlist is sent to spotify', async () => {
  render(<MainPage code={'random'} />)
  
  // Search for a song
  const searchBar = screen.getByRole('textbox', {  name: /search\-bar/i});
  expect(searchBar).toBeVisible();
  fireEvent.change(searchBar, { target: { value: 'song1' } })
  
  await waitFor(() => expect(screen.getByText(/artistExample/i)).toBeVisible())
  
  // click the add to playlist button
  const songOne = screen.getByRole('button', { name: /nameExample artistExample/i });
  
  const addToPlaylistBtn = within(songOne).getByRole('button', { name: /add to playlist/i });
  expect(addToPlaylistBtn).toBeVisible();
  
  fireEvent.click(addToPlaylistBtn);
  
  // verify playlist component is on screen and then create and confirm the playlist name.
  expect(screen.getByText(/Enter Playlist Name:/i)).toBeVisible();
  
  const playlistNameInput = screen.getByRole('textbox', {  name: /playlist\-name/i});
  expect(playlistNameInput).toBeVisible();
  
  fireEvent.change(playlistNameInput, { target: { value: 'playlist1' } })
  const confirmButton = screen.getByRole('button', { name: /Confirm/i });
  fireEvent.click(confirmButton);
  
  await waitFor(() => expect(screen.getByText(/playlist1/i)).toBeVisible())
  
  // verify first song is inside playlist component
  const playlistContainer = screen.getByTestId('playlist-container');
  const playlistSongOne = within(playlistContainer).getByText(/nameExample/i);
  expect(playlistSongOne).toBeVisible();
  
  // add another song
  const songTwo = screen.getByRole('button', { name: /secondName secondArtist/i });
  expect(songTwo).toBeVisible();
  
  const addToPlaylistBtnSong2 = within(songTwo).getByRole('button', { name: /add to playlist/i });
  expect(addToPlaylistBtnSong2).toBeVisible();
  
  fireEvent.click(addToPlaylistBtnSong2);
  
  const playlistSongTwo = within(playlistContainer).getByText(/secondName/i);
  expect(playlistSongTwo).toBeVisible();
  
  
  const removeFromPlaylistBtn = within(within(playlistContainer).getAllByTestId('playlist-song')[1]).getByRole('button', { name: /remove from playlist/i });
  expect(removeFromPlaylistBtn).toBeVisible();
  
  fireEvent.click(removeFromPlaylistBtn);
  
  expect(within(playlistContainer).queryByText(/secondName/i)).toBeNull();
  
  const addToSpotifyButton = screen.getByRole('button', {  name: /add to spotify/i});
  fireEvent.click(addToSpotifyButton);
  
  await waitFor(() => expect(screen.getByText(/Playlist Created/i)).toBeVisible());

  await act(async () => await new Promise((resolve) => setTimeout(resolve, 3000)));

  await waitFor(() => expect(screen.queryByText(/Playlist Created/i)).toBeNull())
  
  // screen.debug()
  // expect(1).toEqual(2);
})


test('playlist cleared', async () => {
  render(<MainPage code={'random'} />)

  // Search for a song
  const searchBar = screen.getByRole('textbox', {  name: /search\-bar/i});
  expect(searchBar).toBeVisible();
  fireEvent.change(searchBar, { target: { value: 'song1' } })
  
  await waitFor(() => expect(screen.getByText(/artistExample/i)).toBeVisible())
  
  // click the add to playlist button
  const songOne = screen.getByRole('button', { name: /nameExample artistExample/i });
  
  const addToPlaylistBtn = within(songOne).getByRole('button', { name: /add to playlist/i });
  expect(addToPlaylistBtn).toBeVisible();
  
  fireEvent.click(addToPlaylistBtn);
  
  // verify playlist component is on screen.
  expect(screen.getByText(/Enter Playlist Name:/i)).toBeVisible();

  const clearPlaylistButton = screen.getByRole('button', {  name: /clear playlist/i});
  fireEvent.click(clearPlaylistButton);

  expect(screen.queryByText(/Enter Playlist Name:/i)).toBeNull();
})