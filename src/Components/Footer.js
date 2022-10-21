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
        {/* <h3 className="footerTitle"> Contact Us </h3> */}
        <div className="footerPersonBlock">
          <p className="footerPerson">Ashley Quevedo</p>
          <a
            className="footerLink"
            href="https://github.com/ashleyquevedo/"
            rel="noreferrer"
            target="_blank"
          >
            <img height="25" width="25" src="/GitHub.png" />
          </a>
          <a
            className="footerLink"
            href="https://www.linkedin.com/in/ashleyquevedo/"
            rel="noreferrer"
            target="_blank"
          >
            <img height="25" width="25" src="/linkedIn.png" />
          </a>
        </div>
        <div className="footerPersonBlock">
          <p className="footerPerson">Brianna Liang</p>
          <a
            className="footerLink"
            href="https://github.com/macabrie"
            rel="noreferrer"
            target="_blank"
          >
            <img height="25" width="25" src="/GitHub.png" />
          </a>

          <a
            className="footerLink"
            href="https://www.linkedin.com/in/brianna-liang/"
            rel="noreferrer"
            target="_blank"
          >
            <img height="25" width="25" src="/linkedIn.png" />
          </a>
        </div>
        <div className="footerPersonBlock">
          <p className="footerPerson">Sonia Slobodsky</p>
          <a
            className="footerLink"
            href="https://github.com/soniafaye1"
            rel="noreferrer"
            target="_blank"
          >
            <img height="25" width="25" src="/GitHub.png" />
          </a>
          <a
            className="footerLink"
            href="https://www.linkedin.com/in/sonia-slobodsky"
            rel="noreferrer"
            target="_blank"
          >
            <img height="25" width="25" src="/linkedIn.png" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
