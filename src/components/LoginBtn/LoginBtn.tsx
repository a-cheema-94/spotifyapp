import Spotify from "../../data/auth_and_api_calls"

const LoginBtn = () => {
  return (
    <button onClick={() => Spotify.initialAuth()}>Login with Spotify</button>
  )
} 

export default LoginBtn