import LoginBtn from "./components/LoginBtn/LoginBtn";
import MainPage from "./components/MainPage/MainPage";


function App() {

  const code = new URLSearchParams(window.location.search).get('code');
  
  return (
    <div className="login_page">
      {code ? <MainPage code={code}/> : <LoginBtn />}
    </div>  
  )
}

export default App
