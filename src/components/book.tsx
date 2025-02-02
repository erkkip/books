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
import moment from "moment";

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
      </div>
      <CardContent orientation="horizontal">
        <Stack spacing={1}>
        <Typography level="body-xs">
          <Stack spacing={1} direction="row">
            <Box>{fileTypes.map((type, i) => <Chip size="sm" key={i} {...(type == 'epub' ? {color: 'success'} : {color: "neutral"})}>{type}</Chip>)}</Box>
            <Divider orientation="vertical" />
            <Box><Chip size="sm" color="neutral">{book.lang_code}</Chip></Box>
          </Stack>
        </Typography>
        <Typography level="body-xs">
          <Box>
            Size {book.size}
          </Box>
          <Box>
            Added {moment(book.added).fromNow()}
          </Box>
        </Typography>
        <Box>
        <IconButton
          aria-label="get"
          variant="soft"
          color="primary"
          size="sm"
          onClick={function(){ download() }}
          loading={loading}
          disabled={finished}
        >
          {finished ? (<Check />) : (<FileDownload />)}
        </IconButton>
        </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Book;