import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ connectToWallet, isLogin, account }) => {
  const login = (e) => {
    e.preventDefault();
    connectToWallet();
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            양띠클럽
          </Typography>
          {isLogin ? (
            <>
              <Typography variant='h6' component='div' sx={{ flexGrow: 0.1 }}>
                {account}
              </Typography>
              <Button color='inherit'>Logout</Button>
            </>
          ) : (
            <Button color='inherit' onClick={connectToWallet}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
