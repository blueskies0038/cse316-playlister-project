import Button from '@mui/material/Button';

export default function SplashScreen() {
  const buttonStyle = {
    backgroundColor: "#d5cfff",
    borderRadius: 35,
    marginTop: "10px",
    color: "#000000",
    minWidth: "300px"
  }
  return (
      <div id="splash-screen">
          <div id="playlister-logo">
              <span id="credit">by Jenny Bao</span>
          </div>
          <div id="button-wrapper">
              <Button variant="contained" style={buttonStyle} href='/login'>Login</Button>
              <Button variant="contained" style={buttonStyle} href='/register'>Create Account</Button>
              <Button variant="contained" style={buttonStyle} href='/all'>Continue as Guest</Button>
          </div>
      </div>
  )
}