import { createGlobalStyle, styled } from "styled-components";
import { Helmet } from "react-helmet-async";
// import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./theme";
import { ToDoList } from "./components/ToDoList";
import { CategoryList } from "@/components/CategoryList";
import { CategoryAdder } from "@/components/CategoryAdder";
import { ToDoAdder } from "@/components/ToDoAdder";
import { HorizontalDivider } from "@/components/HorizontalDivider";

/* @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap'); */
const GlobalStyle = createGlobalStyle`
  /* http://meyerweb.com/eric/tools/css/reset/
    v5.0.1 | 20191019
    License: none (public domain)
  */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, menu, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
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
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  body {
    line-height: 1;
  }
  menu, ol, ul {
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
  
  * {
    box-sizing: border-box;
  }
  body {
    font-family: "Source Sans 3", sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
    
    background-color: ${({ theme }) => theme.bgColor};
    color: ${({ theme }) => theme.textColor};
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 15px;
`;

function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <GlobalStyle />
        <Main>
          <CategoryList />
          <HorizontalDivider />
          <CategoryAdder />
          <HorizontalDivider />
          <ToDoAdder />
          <HorizontalDivider />
          <ToDoList />
        </Main>
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      </ThemeProvider>
    </>
  );
}

export default App;
