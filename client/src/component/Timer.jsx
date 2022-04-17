import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const Timer = ({ crowdSaleContract, hasStarted, setHasStarted }) => {
  const [openingTime, setOpeningTime] = useState(0);
  const [closingTime, setClosingTime] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMintes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const getTime = async () => {
      const openingTime = await crowdSaleContract.openingTime();
      const closingTime = await crowdSaleContract.closingTime();

      setOpeningTime(ethers.BigNumber.from(openingTime).toString());
      setClosingTime(ethers.BigNumber.from(closingTime).toString());
    };

    if (crowdSaleContract.address) getTime();
  }, [crowdSaleContract]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      let time;
      if (currentTime < openingTime) {
        time = openingTime - currentTime;
        setHasStarted(false);
      } else {
        time = closingTime - currentTime;
        setHasStarted(true);
      }
      const day = Math.floor(time / 86400);
      setDays(day);
      time -= day * 86400;
      const hour = Math.floor(time / 3600);
      setHours(hour);
      time -= hour * 3600;
      const minute = Math.floor(time / 60);
      setMintes(minute);
      time -= minute * 60;
      setSeconds(time);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [openingTime]);
  return (
    <div>
      <br />
      {hasStarted ? (
        <Typography variant='h2' component='div'>
          ICO가 진행 중입니다. 양띠클럽 토큰을 구매할 수 있습니다.
        </Typography>
      ) : (
        <Typography variant='h2' component='div'>
          양띠클럽 ICO가 곧 시작합니다.
        </Typography>
      )}
      <br />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          backgroundColor: "primary.dark",
          width: "700px",
          height: "200px",
          margin: "0 auto",
          "& > :not(style)": {
            m: 1,
            width: 128,
            height: 128,
          },
        }}
      >
        <Paper elevation={2} style={style}>
          <Typography variant='h2' component='div'>
            {days}
          </Typography>
          <Typography
            style={{ marginTop: "25px" }}
            variant='body1'
            component='div'
          >
            일
          </Typography>
        </Paper>
        <Paper elevation={2} style={style}>
          <Typography variant='h2' component='div'>
            {hours}
          </Typography>
          <Typography
            style={{ marginTop: "25px" }}
            variant='body1'
            component='div'
          >
            시간
          </Typography>
        </Paper>
        <Paper elevation={2} style={style}>
          <Typography variant='h2' component='div'>
            {minutes}
          </Typography>
          <Typography
            style={{ marginTop: "25px" }}
            variant='body1'
            component='div'
          >
            분
          </Typography>
        </Paper>
        <Paper elevation={2} style={style}>
          <Typography variant='h2' component='div'>
            {seconds}
          </Typography>
          <Typography
            style={{ marginTop: "25px" }}
            variant='body1'
            component='div'
          >
            초
          </Typography>
        </Paper>
      </Box>
    </div>
  );
};

export default Timer;
