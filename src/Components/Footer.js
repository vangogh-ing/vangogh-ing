const Footer = () => {
  return (
    <div className="footerContainer">
      <div className="footerName">
        <div className="navbar_name">
          VANGOGH
          <img src="/sunflower.png" alt="" />
          ING
        </div>
      </div>

      <div className="footerInfoBlock">
        <h3 className="footerTitle"> Contact Us </h3>
        <div className="footerPersonBlock">
          <p className="footerPerson">Ashley Quevido</p>
          <a className="footerLink" href="https://github.com/ashleyquevedo/">
            Github
          </a>
          <br />
          <a
            className="footerLink"
            href="https://www.linkedin.com/in/ashleyquevedo/"
          >
            LinkedIn
          </a>
        </div>
        <div className="footerPersonBlock">
          <p className="footerPerson">Brianna Liang</p>
          <a className="footerLink" href="https://github.com/macabrie">
            Github
          </a>
          <br />
          <a
            className="footerLink"
            href="https://www.linkedin.com/in/brianna-liang/"
          >
            LinkedIn
          </a>
        </div>
        <div className="footerPersonBlock">
          <p className="footerPerson">Sonia Slobodsky</p>
          <a className="footerLink" href="https://github.com/soniafaye1">
            Github
          </a>
          <br />
          <a
            className="footerLink"
            href="https://www.linkedin.com/in/sonia-slobodsky"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
