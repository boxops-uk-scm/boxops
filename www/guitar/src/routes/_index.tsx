import { usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { createEntryPointRoute } from "../relay/createEntryPointRoute";
import { graphql } from "relay-runtime";
import type { IndexQuery } from "./__generated__/IndexQuery.graphql";
import * as stylex from '@stylexjs/stylex';
import { Navbar } from "../components/Navbar";
import Lessons from "../components/Lessons";
import { Testimonials } from "../components/Testimonials";
import { Experience } from "../components/Experience";
import FAQList from "../components/FAQ";

const viewerQuery = graphql`
  query IndexQuery {
    viewer {
      id
    }
  }
`;

const entryPointRoute = createEntryPointRoute({
  queries: {
    viewerQuery
  },
  getQueryVariables: () => {
    return {};
  },
  Component: HomePage
})

type HomePageProps = {
  viewerQuery: PreloadedQuery<IndexQuery>;
}

// eslint-disable-next-line react-refresh/only-export-components
function HomePage(props: HomePageProps) {
  const _data = usePreloadedQuery(viewerQuery, props.viewerQuery);

  return (
    <>
      <div {...stylex.props(styles.heroBg)}>
        <img src="/hero_image.png" alt="" {...stylex.props(styles.heroImg)} />
        <div {...stylex.props(styles.strapline)}>
          Milton Keynes' Permier Guitar School
        </div>
        <span {...stylex.props(styles.title)}>MK Guitar</span>
          <div style={{
            position: 'absolute',
            top: '79%',
            right: '2rem',
            display: 'flex',
            gap: '1rem',
          }}>
            <img src="/instagram.svg" alt="Instagram" style={{
              width: '50px',
              height: '50px',
            }}/>
            <img src="/facebook.svg" alt="Instagram" style={{
              width: '50px',
              height: '50px',
            }}/>
        </div>
      </div>
      <Navbar />
      <main {...stylex.props(styles.page)}>
        <section {...stylex.props(styles.heroSpacer)} />
        <Lessons />
        <Experience />
        <Testimonials />
        <FAQList />
        <div {...stylex.props(styles.footer)}>
          <div {...stylex.props(styles.footerGrid)}>
            <div {...stylex.props(styles.footerList)}>
              <span {...stylex.props(styles.footerTitle)}>Support</span>
              <span {...stylex.props(styles.footerItem)}>About</span>
              <span {...stylex.props(styles.footerItem)}>Terms of Service</span>
              <span {...stylex.props(styles.footerItem)}>Privacy Policy</span>
              <span {...stylex.props(styles.footerItem)}>Accessibility Policy</span>
            </div>
            <div {...stylex.props(styles.footerList)}>
              <span {...stylex.props(styles.footerTitle)}>Social Media</span>
              <span {...stylex.props(styles.footerItem)}>Twitter</span>
              <span {...stylex.props(styles.footerItem)}>Facebook</span>
              <span {...stylex.props(styles.footerItem)}>Instagram</span>
            </div>
            <div {...stylex.props(styles.footerList)}>
              <span {...stylex.props(styles.footerTitle)}>Resources</span>
              <span {...stylex.props(styles.footerItem)}>Site Map</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const loader = entryPointRoute.loader;
export default entryPointRoute.Component;

export const links = () => [
  {
    rel: "preload",
    href: "/envelope_open.svg",
    as: "image",
    type: "image/svg+xml",
  },
  {
    rel: "preload",
    href: "/google.svg",
    as: "image",
    type: "image/svg+xml",
  },
  {
    rel: "preload",
    href: "/facebook.svg",
    as: "image",
    type: "image/svg+xml",
  },
  {
    rel: "preload",
    href: "/instagram.svg",
    as: "image",
    type: "image/svg+xml",
  },
  {
    rel: "preload",
    href: "/calendar.svg",
    as: "image",
    type: "image/svg+xml",
  },
  {
    rel: "preload",
    href: "/logo.svg",
    as: "image",
    type: "image/svg+xml",
  },
];

const styles = stylex.create({
  strapline: {
    position: 'absolute',
    top: '60%',
    right: '2rem',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'semi-bold',
    textAlign: 'right',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '24px',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '8rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
    color: 'white',
    position: 'absolute',
    top: '72%',
    right: '2rem',
    transform: 'translateY(-50%)',
  },
  page: {
    position: 'relative',
    zIndex: 1,
  },
  heroBg: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  heroSpacer: {
    minHeight: '90vh',
    // transition: 'min-height 0.3s ease',
    ['@media (max-width: 1200px)']: {
      minHeight: '48px',
      backgroundColor: '#f8f8f8',
    },
  },
  content: {
    backgroundColor: 'white',
    minHeight: '80vh',
    padding: '2rem',
  },
  footer: {
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '4rem',
    paddingBottom: '4rem',
    width: '100%',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '4rem',
    ['@media (max-width: 600px)']: {
      gridTemplateColumns: '1fr',
      gap: '2rem',
    },
  },
  footerTitle: {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  footerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  footerItem: {
    color: 'white',
    opacity: 0.8,
  }
})