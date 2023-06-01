import ReactDOM from 'react-dom/client';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from './theme';
import App from './App';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query'

const GlobalStyled = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: black;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  a {
    text-decoration: none;
    color: inherit; // 부모 색상 받기
  }
  body::-webkit-scrollbar {
    width: 1rem;
  }
  body::-webkit-scrollbar-thumb {
    background-color: #666666;
		border-radius: 1rem;
		background-clip: padding-box;
		border: 0.25rem solid transparent;
  }
  body::-webkit-scrollbar-track {
    background-color: #141414;
  }
`;

const client = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RecoilRoot>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyled />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>
);