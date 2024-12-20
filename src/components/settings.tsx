import { useState } from "react";
import Button from "@mui/joy/Button/Button";
import Stack from "@mui/joy/Stack/Stack";
import Textarea from "@mui/joy/Textarea/Textarea";
import Client from "@/utils/client";

function Settings() {
  const [mamid, setMamid] = useState("")

  const client = new Client;

  async function updateMamid() {
    client.setMamid(mamid);
    setMamid("");
  }

  return (
    <Stack spacing={1} sx={{
      pt: { xs: 2, md: 3 }
    }}>
      <Textarea 
        value={mamid}
        onChange={(event) =>
          setMamid(event.target.value)
        }
      />
      <Stack direction="row" spacing={1}>
        <Button onClick={function(){ updateMamid() }}>
            Save
        </Button>
      </Stack>
    </Stack>
  )
}

export default Settings;