import { useState } from "react";
import Client from "@/utils/client";
import { FileDownload, Check } from "@mui/icons-material";
import Box from "@mui/joy/Box/Box";
import Card from "@mui/joy/Card/Card";
import CardContent from "@mui/joy/CardContent/CardContent";
import Chip from "@mui/joy/Chip/Chip";
import Divider from "@mui/joy/Divider/Divider";
import IconButton from "@mui/joy/IconButton/IconButton";
import Stack from "@mui/joy/Stack/Stack";
import Typography from "@mui/joy/Typography/Typography";

function Book({book}: {book: BookType}) {
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const authors = Object.values(JSON.parse(book.author_info)).join(", ");
  const fileTypes = book.filetype.split(" ");

  const client = new Client;

  async function download() {
    setLoading(true);
    await client.download(book.dl)
      .then((res) => {
        if (res.status == 204) {
          setFinished(true);
        } else {
          console.log(res);
        }
      })
      .catch((res) => {
        console.log(res)
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Card>
      <div>
        <Typography level="title-lg">{book.title}</Typography>
        <Typography level="body-sm">{authors}</Typography>
        <IconButton
          aria-label="get"
          variant="soft"
          color="primary"
          size="sm"
          sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
          onClick={function(){ download() }}
          loading={loading}
          disabled={finished}
        >
          {finished ? (<Check />) : (<FileDownload />)}
        </IconButton>
      </div>
      <CardContent orientation="horizontal">
        <Typography level="body-xs">
          <Stack spacing={1} direction="row">
            <Box>Filetype {fileTypes.map((type, i) => <Chip size="sm" key={i} {...(type == 'epub' ? {color: 'success'} : {color: "neutral"})}>{type}</Chip>)}</Box>
            <Divider orientation="vertical" />
            <Box>Language <Chip size="sm" color="neutral">{book.lang_code}</Chip></Box>
          </Stack>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Book;