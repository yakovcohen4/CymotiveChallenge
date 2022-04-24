import svg from '../assets/logo.svg';
import video from '../assets/Cymotive_Homepage.mp4';
import wave from '../assets/footer-wave.png';

function Header() {
  return (
    <header id="pageHeader">
      <img id="logo" src={svg} alt="cymotive logo" />
      <p id="headline">
        Get Statistics About <br />
        The Future
        <br />
        of Mobility
      </p>
      <div className="video_wrapper">
        <video autoPlay muted loop playsInline>
          <source src={video} type="video/mp4" />
          <source src={video} type="video/ogg" />
        </video>
        <img id="wave" src={wave} alt="wave" />
      </div>
    </header>
  );
}

export default Header;
