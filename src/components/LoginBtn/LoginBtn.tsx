import { Container } from "react-bootstrap"

const LoginBtn = () => {

  return (
    <Container 
      className="d-flex justify-content-center align-items-center" 
      style={{ 
        minHeight: '100dvh', minWidth: '100dvw', backgroundImage: 'url(../../../images/layered-waves-haikei.svg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', fontFamily: 'Inter, sans-serif',
      }}
    >
      <button className="btn border-2 btn-success" style={{ width: '12rem', height: '3.5rem',}}>
        <a className="text-decoration-none text-light" href="http://localhost:5000/auth/login">Login to Spotify</a>
      </button>
    </Container>
  )
} 

export default LoginBtn