import LoginBtn from "./components/LoginBtn/LoginBtn";
import MainPage from "./components/MainPage/MainPage";
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {

  const code = new URLSearchParams(window.location.search).get('code');
  const state = new URLSearchParams(window.location.search).get('state');
  const error = new URLSearchParams(window.location.search).get('error');

  if(error ) {
    console.log(error)
    return
  }
  
  return (

    <div className="">
      {code ? <MainPage code={code} state={state}/> : <LoginBtn/>}
    </div>  
  )
}

export default App
