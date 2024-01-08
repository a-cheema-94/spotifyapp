
// Implement Authorization Code with PKCE Flow

let accessToken = localStorage.getItem("accessToken");
let expiresIn;
let clientId = '4783e3446653478cb11d7c649b0242e3';
let redirectUri = 'http://localhost:5173';

let Spotify = {

  async initialAuth() {

    const generateRandomString = (length: number) => {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
    
    const codeVerifier  = generateRandomString(64);
    const state = generateRandomString(16);
    
    // hash codeVerifier using SHA256 algorithm => will be sent within the user authorization request
    
    // SHA256 algorithm
    const sha256 = async (plain: string) => {
      const encoder = new TextEncoder()
      const data = encoder.encode(plain)
      return window.crypto.subtle.digest('SHA-256', data)
    }
    
    // encode to base64
    const base64encode = (input: ArrayBuffer) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }
    
    // code challenge algorithm
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);
    
    window.localStorage.setItem('code_verifier', codeVerifier);
    
    
    
    
    const scope = 'playlist-modify-public playlist-modify-private';
    
    const params = {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
      state: state,
    }
    
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  },

  async getAccessToken(code: any)  {

    // stored in the previous step
    let codeVerifier: any = localStorage.getItem('code_verifier');
  
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier
      }),
    }
  
    const body = await fetch('https://accounts.spotify.com/api/token', payload);
    const response =await body.json();
  
    localStorage.setItem('access_token', response.access_token);
  }

}




export default Spotify

