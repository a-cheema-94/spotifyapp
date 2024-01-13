import { Container } from "react-bootstrap"

const LoginBtn = () => {

  return (
    <Container 
      className="center-flex-container main-pages-sizing" 
      style={{ 
       backgroundImage: 'url(../../../images/layered-waves-haikei.svg)', fontFamily: 'Inter, sans-serif',
      }}
    >
      <button className="btn border-2 btn-success" style={{ width: '12rem', height: '3.5rem',}}>
        <a className="text-decoration-none text-light" href="http://localhost:5000/auth/login">Login to Spotify</a>
      </button>
    </Container>
  )
} 

export default LoginBtn