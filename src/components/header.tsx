import { useState } from "react";
import IconButton from "@mui/joy/IconButton/IconButton";
import Sheet from "@mui/joy/Sheet/Sheet";
import Box from "@mui/material/Box/Box";
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from "@mui/joy/FormControl/FormControl";
import Input from "@mui/joy/Input/Input";
import Settings from "./settings";
import Client from "@/utils/client";

function Header({setData}: {setData: React.Dispatch<React.SetStateAction<never[]>>}) {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const client = new Client;

  async function searchBooks(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsLoading(true);
    const data = await client.search(search);
    setData(data.data ?? []);
    setIsLoading(false);
  }

  return (
    <Sheet variant="plain" sx={{ px: { xs: 2, md: 6 }, py: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton aria-label="settings" onClick={function(){ setShowSettings(!showSettings) }}>
          <SettingsIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <form onSubmit={searchBooks} id="search">
            <FormControl>
              <Input
                sx={{ '--Input-decoratorChildHeight': '45px' }}
                required
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                onFocus={e => e.target.select()}
                endDecorator={
                  <IconButton
                    variant="solid"
                    color="primary"
                    loading={isLoading}
                    type="submit"
                    sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  >
                    <SearchIcon />
                  </IconButton>
                }
              />
            </FormControl>
          </form>
        </Box>  
      </Box>
      {showSettings ? (<Settings />) : ""}
    </Sheet>
  )
}

export default Header;