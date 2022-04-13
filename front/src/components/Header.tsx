import React from 'react';

function Header() {
  return (
    <header id="pageHeader">
      <img
        id="logo"
        src="https://www.cymotive.com/wp-content/uploads/2018/08/Logo.svg"
        alt="cymotive logo"
      />
      <p id="headline">
        Get Statistics About <br />
        The Future
        <br />
        of Mobility
      </p>
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
        <img
          id="wave"
          src="https://www.cymotive.com/wp-content/themes/cymotive/images/footer-wave.png"
          alt="wave"
        />
      </div>
    </header>
  );
}

export default Header;
