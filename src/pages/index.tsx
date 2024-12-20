import { useState } from "react";
import Book from "@/components/book";
import Header from "@/components/header";
import { CssVarsProvider } from "@mui/joy/styles/CssVarsProvider";
import CssBaseline from "@mui/joy/CssBaseline/CssBaseline";
import Stack from "@mui/joy/Stack/Stack";

const HomePage = (): JSX.Element => {
  const [data, setData] = useState([]);

  return (
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      <Header setData={setData}/>
      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
          {data.map((b, i) => <Book book={b} key={i} />)}
      </Stack>
    </CssVarsProvider>
  );
};

export default HomePage;
