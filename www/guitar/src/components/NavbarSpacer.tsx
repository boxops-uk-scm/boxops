import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

type NavItemProps = {
  label: string;
  src: string;
}

function NavItem({ label, src }: NavItemProps) {
  return <div {...stylex.props(styles.navLabel)}><a href={src}>{label}</a></div>
}

type InfoProps = {
  icon: React.ReactNode;
  primary: string;
  secondary: string;
}

function Info({ icon, primary, secondary }: InfoProps) {
  return (
    <div {...stylex.props(styles.info)}>
      <span {...stylex.props(styles.icon)}>{icon}</span>
      <div {...stylex.props(styles.details)}>
        <span {...stylex.props(styles.primary)}>{primary}</span>
        <span {...stylex.props(styles.secondary)}>{secondary}</span>
      </div>
    </div>
  );
}

const calendarIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM112,184a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm56-8a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136a23.76,23.76,0,0,1-4.84,14.45L152,176ZM48,80V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80Z"></path></svg>

const mapPinIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"></path></svg>

const deviceMobileIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16ZM80,32h96a8,8,0,0,1,8,8v8H72V40A8,8,0,0,1,80,32Zm96,192H80a8,8,0,0,1-8-8v-8H184v8A8,8,0,0,1,176,224Z"></path></svg>

const envelopeOpenIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M228.44,89.34l-96-64a8,8,0,0,0-8.88,0l-96,64A8,8,0,0,0,24,96V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V96A8,8,0,0,0,228.44,89.34ZM96.72,152,40,192V111.53Zm16.37,8h29.82l56.63,40H56.46Zm46.19-8L216,111.53V192Z"></path></svg>

const list = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128ZM40,76H216a12,12,0,0,0,0-24H40a12,12,0,0,0,0,24ZM216,180H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z"></path></svg>



export function NavbarSpacer() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleScrollOrResize = () => {
      setCollapsed(window.scrollY > 50 || window.innerHeight < 1100);
    };

    window.addEventListener("scroll", handleScrollOrResize);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  return <div {...stylex.props(styles.navbar, styles.header)}>
    <div {...stylex.props(styles.top, collapsed && styles.collapsed)}>
      <Info icon={envelopeOpenIcon} primary="EMAIL" secondary="mkguitarschool@hotmail.com" />
      <Info icon={deviceMobileIcon} primary="PHONE" secondary="07912 505777" />
      <Info icon={mapPinIcon} primary="LOCATION" secondary="Brewster Cl, Medbourne, MK5 6FX" />
      <Info icon={calendarIcon} primary="HOURS" secondary="Mon-Sat, 9am-8pm" />
    </div>
    <div {...stylex.props(styles.bottom)}>
      <div {...stylex.props(styles.navitems)}>
        <img src="/logo.svg" alt="MK Guitar" style={{ height: '32px' }} />
        <NavItem label="Home" src="/" />
        <NavItem label="About" src="/about" />
        <NavItem label="Lessons" src="/lessons" />
        <NavItem label="Services" src="/services" />
        <NavItem label="Tutors" src="/tutors" />
        <NavItem label="Resources" src="/resources" />
        <NavItem label="Contact" src="/contact" />
      </div>
      <span style={{ flexGrow: 1 }} />
      <button {...stylex.props(styles.button, styles.burger)}>{list}</button>
      <button {...stylex.props(styles.button)}>Book</button>
    </div>
  </div>
}

const styles = stylex.create({
  icon: {
    color: 'white',
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.4rem',
    alignItems: 'center',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  navLabel: {
    marginBottom: '0.5rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    userSelect: 'none',
    ':hover': {
      color: '#000000',
      textDecoration: 'underline',
      textDecorationThickness: '2px',
      textUnderlineOffset: '4px',
    }
  },
  primary: {
    fontWeight: 'bold',
    opacity: 1.0,
    fontSize: '0.9rem',
  },
  secondary: {
    fontSize: '0.8rem',
    opacity: 0.9,
  },
  navbar: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    userSelect: 'none',
    marginBottom: '3rem',
    ['@media (max-width: 1200px)']: {
      marginBottom: '0',
    },
    visibility: 'hidden',
    maxHeight: '160px',
  },
  header: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
  },
  top: {
    transition: 'max-height 0.35s ease, padding 0.2s ease',
    padding: '0.75rem 16rem',
    backgroundColor: '#000000',
    color: 'white',
    overflow: 'hidden',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    ['@media (max-width: 1500px)']: {
      minHeight: '0',
      maxHeight: '0',
      padding: '0rem 16rem',
      transition: 'max-height 0.35s ease, padding 0.2s ease',
    },
  },
  button: {
    padding: '0.5rem 2rem',
    backgroundColor: '#ef4136',
    userSelect: 'none',
    color: '#fff',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1.3rem',
    height: '3rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    ':hover': {
      color: '#f3f3f3',
      backgroundColor: 'rgb(216, 16, 16)',
    },
    [':active']: {
      color: '#f3f3f3',
      backgroundColor: 'rgb(186, 1, 1)',
    },
    borderWidth: '0',
    marginLeft: '0.5rem',
  },
  collapsed: {
    minHeight: '0',
    maxHeight: '0',
    padding: '0rem 16rem',
    transition: 'max-height 0.35s ease, padding 0.2s ease',
  },
  navitems: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3rem',
    minHeight: '48px',
    transition: 'opacity 0.2s ease',
    ['@media (max-width: 1200px)']: {
      opacity: 0,
    },
  },
  burger: {
    ['@media (min-width: 1200px)']: {
      visibility: 'hidden',
      opacity: 0,
    },
    ':hover': {
      color: '#f3f3f3',
      backgroundColor: 'rgb(0,0,0,0.5)',
    },
    transition: 'opacity 0.3s ease',
    opacity: 1,
    backgroundColor: 'rgb(0,0,0,0.4)',
    color: 'white',
    padding: '0.5rem 1rem',
  },
  bottom: {
    padding: '1.5rem 2rem',
    flexGrow: 1,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right',
    minHeight: '48px',
    transition: 'background-color 0.2s ease',
    ['@media (max-width: 1200px)']: {
      backgroundColor: 'transparent',
    },
  }
});