import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
   <div>
     <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: 300,
        borderRadius: '16px',
        margin: 16,
        border: "2px solid black",
        backgroundColor: "white",
        lineHeight: 1.5,
      }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          marginTop: 0,
          marginBottom: 8,
        }}
      >
        Welcome to your Gallery Wall Extension!
      </h2>
      <h4
        style={{
          fontSize: 14,
          fontWeight: 400,
          marginTop: 0,
          marginBottom: 8,
          color: '#5c5c5c',
        }}
      >
        Improve your home art shopping experience. Customize online art stores' background color, frame color, frame width, and more.
      </h4>

      <h4
        style={{
          fontSize: 14,
          fontWeight: 400,
          marginTop: 0,
          marginBottom: 8,
          color: '#5c5c5c',
        }}
      >
        We support the following stores:
      </h4>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <a href="https://www.desenio.com/" target="_blank" rel="noreferrer">
          Desenio.com
        </a>
        <a href="https://www.desenio.com/" target="_blank" rel="noreferrer">
          Desenio.ca
        </a>
        <a href="https://www.desenio.com/" target="_blank" rel="noreferrer">
          Desenio.co.uk
        </a>
        <a href="https://www.desenio.com/" target="_blank" rel="noreferrer">
          Desenio.eu
        </a>
      </div>
      
    </div>
   </div>
  )
}

export default IndexPopup
