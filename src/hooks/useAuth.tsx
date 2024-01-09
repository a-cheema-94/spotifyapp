import { useEffect, useState, useRef } from 'react'
import axios from '../api/axios';


const useAuth = (code: string | null) => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);
  const stopMultipleCallsRef = useRef(false);

  // accessToken
  useEffect(() => {
    const getToken = () => {
      if(!code) return
      axios.post('/auth/token', { 
        code,
       })
      .then(res => {
        console.log('received access token res')
        setAccessToken(res.data.access_token)
        setRefreshToken(res.data.refresh_token)
        setExpiresIn(res.data.expires_in)
        
      })
      .catch(err => console.log('Front end error: ', err))
    }
    if(!stopMultipleCallsRef.current) {
      stopMultipleCallsRef.current = true
      getToken()
    }
  }, [code])

  // refreshToken
  useEffect(() => {
    if(!refreshToken || !expiresIn) return

    const interval = setInterval(() => {

      
      axios.post('/auth/refresh', {
        refreshToken,
      })
      .then(res => {
        console.log('refreshed token')
        setAccessToken(res.data.access_token);
        setExpiresIn(res.data.expires_in);
        
      })
      .catch((err) => console.log('Front end error: ', err))
      
    }, (expiresIn / 2) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken;
}

export default useAuth