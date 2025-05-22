import { useEffect, useState, useRef } from "react";
import axios from "../axiosConfig/axios";

const useAuth = (code: string | null, state: string | null) => {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const stopMultipleCallsRef = useRef(false);

  // accessToken
  useEffect(() => {
    if (!code) return;
    const getToken = async () => {
      try {
        const res = await axios.post(
          "/auth/token",
          {
            code,
            state,
          },
          { withCredentials: true }
        );

        window.history.pushState({}, "", "/");
        console.log("received access token res");
        setAccessToken(res.data.access_token);
        setRefreshToken(res.data.refresh_token);
        setExpiresIn(res.data.expires_in);
      } catch (error) {
        console.log(error);
      }
    };
    if (!stopMultipleCallsRef.current) {
      stopMultipleCallsRef.current = true;
      getToken();
    }
  }, [code]);

  // refreshToken
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const requestRefreshToken = async () => {
      try {
        const res = await axios.post("/auth/refresh", {
          refreshToken,
        });
        console.log("refreshed token");
        setAccessToken(res.data.access_token);
        setExpiresIn(res.data.expires_in);
      } catch (error) {
        console.log("Front end error: ", error);
      }
    };
    const interval = setInterval(() => {
      requestRefreshToken();
    }, (expiresIn / 4) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
};

export default useAuth;
