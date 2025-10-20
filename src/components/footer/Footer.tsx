import './Footer.css';

import BrandIcon from '../../assets/Icon.png';


import YoutubeIcon from '../../assets/Youtube.png';
import TwitterIcon from '../../assets/Twitter.png';
import InstagramIcon from '../../assets/Vector.png';     
import PinterestIcon from '../../assets/Pinterest.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__row">

        <div className="brand">
          <img src={BrandIcon} alt="" className="brand__icon" />
          <span>Die Rezeptwelt</span>
        </div>

        <div className="social">
          <div className="social__title">Social Media</div>
          <div className="social__icons">
            <a href="#" aria-label="YouTube">
              <img src={YoutubeIcon} alt="" />
            </a>
            <a href="#" aria-label="Twitter / X">
              <img src={TwitterIcon} alt="" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src={InstagramIcon} alt="" />
            </a>
            <a href="#" aria-label="Pinterest">
              <img src={PinterestIcon} alt="" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
