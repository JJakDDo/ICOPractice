import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const Info = ({ crowdSaleContract }) => {
  return (
    <>
      <Box sx={{ width: "100%", maxWidth: 500, marginTop: "30px" }}>
        <Typography variant='body1' component='div' gutterBottom>
          * 총 5 ETH 만큼의 토큰만 발행할 예정입니다.
        </Typography>
        <Typography variant='body1' component='div' gutterBottom>
          * 목표 금액을 달성하면 토큰을 자유롭게 사용할 수 있습니다.
        </Typography>
        <Typography variant='body1' component='div' gutterBottom>
          * 만약 목표 금액을 달성하지 못하면 환불해드립니다. (트랜잭션 수수료
          제외)
        </Typography>
        <Typography variant='body1' component='div' gutterBottom>
          * 최소 0.001 ETH 부터 구매가 가능합니다.
        </Typography>
        <Typography variant='body1' component='div' gutterBottom>
          * 한 사람당 최대 1 ETH 만큼만 구매가 가능합니다.
        </Typography>
      </Box>
    </>
  );
};

export default Info;
