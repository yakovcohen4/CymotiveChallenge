function App() {
  return (
    <div className="App">
      <div className="video_wrapper">
        <video autoPlay muted loop playsInline>
          <source
            src="https://www.cymotive.com/wp-content/uploads/2018/08/Cymotive_Homepage.mp4"
            type="video/mp4"
          />
          <source
            src="https://www.cymotive.com/wp-content/uploads/2018/08/Cymotive_Homepage.mp4"
            type="video/ogg"
          />
        </video>
      </div>
    </div>
  );
}

export default App;
