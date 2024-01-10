import { useEffect, useState, useRef } from 'react'
import axios from '../api/axios';


const useAuth = (code: string | null) => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);
  const stopMultipleCallsRef = useRef(false);

  // accessToken
  useEffect(() => {
    if(!code) return
    const getToken = async () => {
      try {
        const res = await axios.post('/auth/token', { 
          code,
         })
         
        window.history.pushState({}, '', '/');
        console.log('received access token res')
        setAccessToken(res.data.access_token)
        setRefreshToken(res.data.refresh_token)
        setExpiresIn(res.data.expires_in)
      } catch (error) {
        console.log(error)
      }

      // axios.post('/auth/token', { 
      //   code,
      //  })
      // .then(res => {
      //   window.history.pushState({}, '', '/');
      //   console.log('received access token res')
      //   setAccessToken(res.data.access_token)
      //   setRefreshToken(res.data.refresh_token)
      //   setExpiresIn(res.data.expires_in)
        
      // })
      // .catch(err => console.log('Front end error: ', err))
    }
    if(!stopMultipleCallsRef.current) {
      stopMultipleCallsRef.current = true
      getToken()
    }
  }, [code])

  // refreshToken
  useEffect(() => {
    if(!refreshToken || !expiresIn) return

    const requestRefreshToken = async () => {
      try {
        const res = await axios.post('/auth/refresh', {
          refreshToken,
        })
        console.log('refreshed token')
        setAccessToken(res.data.access_token);
        setExpiresIn(res.data.expires_in);
      } catch (error) {
        console.log('Front end error: ', error)
      }
      
    }
    const interval = setInterval(() => {
      requestRefreshToken()
      // axios.post('/auth/refresh', {
      //   refreshToken,
      // })
      // .then(res => {
      //   console.log('refreshed token')
      //   setAccessToken(res.data.access_token);
      //   setExpiresIn(res.data.expires_in);
        
      // })
      // .catch((err) => console.log('Front end error: ', err))
      
    }, (expiresIn / 2) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken;
}

export default useAuth