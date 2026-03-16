import kepem from '../assets/1977.jpg';
import { Link, useNavigate } from "react-router";

export default function MainPage(){
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/login');          // vagy '/login'
        // navigate('/bejelentkezes', { replace: true });  ← ha nem akarod a vissza gombot
    };

    return(
        
       <div className="blackBackground">
            

            <nav className="navbar sticky-top custom-nav navbar-expand-xxl">
    <div className="container-fluid px-3 px-xxl-5">

      
      <a className="navbar-brand me-4 me-xxl-5" href="#">
        <img 
          src={kepem} 
          alt="InfoScreen Logo" 
          width="100" 
          height="50" 
          className="d-inline-block align-text-top rotate-45"
        />
      </a>

      
      <button 
        className="navbar-toggler ms-auto custom-toggler d-xxl-none" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarContent" 
        aria-controls="navbarContent" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      
      <div className="collapse navbar-collapse" id="navbarContent">

        
        <ul className="navbar-nav mx-auto text-center gap-4 gap-xxl-5">
          <li className="nav-item">
            <a className="nav-link  fw-bold NavBarTextActive montserrat" href="#">Főoldal</a>
          </li>
          <li className="nav-item">
            <a className="nav-link  fw-bold NavBarCenterText montserrat" href="#">Mi az?</a>
          </li>
          <li className="nav-item">
            <a className="nav-link  fw-bold NavBarCenterText montserrat" href="#">Rólunk</a>
          </li>
          <li className="nav-item">
            <a className="nav-link  fw-bold NavBarCenterText montserrat" href="#">Elérhetőség</a>
          </li>
        </ul>

        
        <div className="d-none d-xxl-block  ButtonMargin">
          <button className="btn  ButtonStyles" type="button" onClick={handleLoginClick}>
            Bejelentkezés
          </button>
        </div>

        
        <div className="d-xxl-none mt-4 pt-3 w-100 text-center">
          <button className="btn  ButtonStyles px-5 py-2" type="button" onClick={handleLoginClick}>
            Bejelentkezés
          </button>
        </div>

      </div>
    </div>
  </nav>

  
  <section className="py-5 py-md-8 text-center">
    <div className="container">
      <h1 className="CenterText fw-black mb-4">
        InfoScreen – Minden infó<br/>egy helyen, zseb nélkül!
      </h1>
      <p className="WhiteCenterText lead fs-3">
        Egy kijelző, ami információt ad telefon nélkül is.
      </p>
    </div>
  </section>

  
  <section className="py-5">
    <div className="container">
      <div className="row align-items-center gy-5">
        <div className="col-lg-6">
          <h2 className="fw-bold display-5 mb-4">Könnyű használat, könnyű információ adás</h2>
          <p className="OrangeText fs-5 lh-lg">
            Iskolába, céghez, boltba – bárhova tökéletes. Letisztult, könnyen használható és gyorsan felállítható rendszer, amivel az információátadás új szintre lép.
          </p>
        </div>
      </div>
    </div>
  </section>

  
  <section className="py-5 bg-dark">
    <div className="container">
      <div className="row align-items-center gy-5 flex-lg-row-reverse">
        <div className="col-lg-6">
          <h2 className="fw-bold display-5 mb-4">Mi az InfoScreen? Mire képes?</h2>
          <p className="OrangeText fs-5 lh-lg">
            Az InfoScreen egy <strong>új generációs</strong>, webalapú információátadó rendszer.<br/>
            Friss üzenetek, hírek, események, időjárás, órarend – bármi, amit szeretnél megjeleníteni.
          </p>
        </div>
      </div>
    </div>
  </section>

  
  <section className="py-5">
    <div className="container">
      <div className="row align-items-center gy-5">
        <div className="col-lg-6">
          <p className="fs-5 lh-lg" style={{"color": "#e0e0e0"}}>
            Admin felületen keresztül egyszerűen frissítheted az üzeneteket.<br/>
            Heti események, teendők, időjárás, órarend, projekt státusz – mind megjeleníthető.<br/><br/>
            Dolgozók mindig képben vannak, az ügyfelek mindig tájékoztatva – telefon nélkül.
          </p>
        </div>
      </div>
    </div>
  </section>

  
  <div className="OrangeBackColor mx-auto"></div>

  
  <section className="py-5 text-center">
    <div className="container">
      <h2 className="WhiteCenterText display-4 fw-bold mb-5">Kik vagyunk?</h2>
      <p className="OrangeCenterText fs-4 mx-auto" style={{"maxWidth": "900px"}}>
        Két diák, akik a projektvizsgájukkal nagyot álmodtak – és valóra váltották.<br/><br/>
        Minél több ügyfelet szeretnénk elérni ezzel a rendszerrel – iskoláktól a cégeken át a boltokig.<br/>
        Célunk, hogy az információátadás új forradalmát indítsuk el.<br/><br/>
        Telefonmentesen, letisztultan, hatékonyan – csak a képzelet szab határt, mit lehet az InfoScreennel megmutatni.
      </p>
    </div>
  </section>

  
  <footer className="bg-dark py-5 mt-5">
    <div className="container text-center text-white">
      <h3 className="fs-3 fw-bold mb-4" style={{"color": "#fe7320"}}>Elérhetőségeink</h3>
      
      <div className="row justify-content-center g-4">
        <div className="col-md-4">
          <p className="mb-1 fw-bold">Email</p>
          <p><a href="mailto:info@infoscreen.hu" className="text-white text-decoration-none">info@infoscreen.hu</a></p>
        </div>
        <div className="col-md-4">
          <p className="mb-1 fw-bold">Telefon</p>
          <p><a href="tel:+36301234567" className="text-white text-decoration-none">+36 30 123 4567</a></p>
        </div>
        <div className="col-md-4">
          <p className="mb-1 fw-bold">Weboldal</p>
          <p><a href="https://www.infoscreen.hu" className="text-white text-decoration-none">www.infoscreen.hu</a></p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-muted small">1011 Budapest, Fő utca 1.</p>
      </div>

      <div className="mt-4">
        <a href="#" className="text-white mx-2 fs-4">FB</a>
        <a href="#" className="text-white mx-2 fs-4">IG</a>
        <a href="#" className="text-white mx-2 fs-4">LI</a>
      </div>

      <p className="text-muted mt-5 mb-0 small">© 2026 InfoScreen – Minden jog fenntartva</p>
    </div>
  </footer>

       </div>
    );
}