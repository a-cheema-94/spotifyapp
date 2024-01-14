import { Container } from "react-bootstrap"

const LoginBtn = () => {

  const loginToSpotify = () => {
    window.location.href = 'http://localhost:5000/auth/login'
  }

  return (
    <Container 
      className="center-flex-container main-pages-sizing" 
      style={{ 
       backgroundImage: 'url(../../../images/green.svg)', fontFamily: 'Inter, sans-serif',
      }}
    >
      <button 
        className="btn border-none btn-success py-3 px-4 fs-5" 
        onClick={() => loginToSpotify()}
        style={{
          boxShadow: '7px 7px 5px -4px rgba(46,46,46,0.53)',
        }}
      >
        Login To Spotify
      </button>
    </Container>
  )
} 

export default LoginBtn