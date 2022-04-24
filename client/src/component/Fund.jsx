import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

const Fund = ({
  crowdSaleContract,
  tokenContract,
  isLogin,
  hasStarted,
  account,
  isOver,
  hasReachedGoal,
}) => {
  const [currentFunded, setCurrentFunded] = useState(0);
  const [currentToken, setCurrentToken] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [isLTMin, setIsLTMin] = useState(false);
  const [isGTMax, setIsGTMax] = useState(false);
  const [isError, setIsError] = useState(false);
  const [refundMsg, setRefundMsg] = useState("");

  const [fundAmount, setFundAmount] = useState("");
  const getFundInfo = async () => {
    const fundedByBuyer = await crowdSaleContract.buyers(account);
    const ownedToken = await tokenContract.balanceOf(account);
    const _min = await crowdSaleContract.investorMinCap();
    const _max = await crowdSaleContract.investorMaxCap();

    setCurrentFunded(ethers.utils.formatEther(fundedByBuyer));
    setCurrentToken(ethers.utils.formatEther(ownedToken));
    console.log(ethers.utils.formatEther(_min));
    setMin(ethers.utils.formatEther(_min));
    setMax(ethers.utils.formatEther(_max));
  };

  const refund = async () => {
    try {
      //await crowdSaleContract.finishCrowdsale();
      await crowdSaleContract.claimRefund({ from: account });
      setRefundMsg(`${currentFunded} ETH가 환불되었습니다.`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLogin && crowdSaleContract.address && tokenContract.address)
      getFundInfo();
  }, [crowdSaleContract, tokenContract, isLogin]);

  const getAmount = (e) => {
    setFundAmount(e.target.value);
  };
  const buyToken = async (e) => {
    e.preventDefault();
    if (!isLogin) return;
    console.log(Number(fundAmount) + Number(currentFunded));
    if (fundAmount < min) {
      setIsLTMin(true);
    } else if (Number(fundAmount) + Number(currentFunded) > max) {
      setIsGTMax(true);
    } else {
      setIsLTMin(false);
      setIsGTMax(false);
      try {
        await crowdSaleContract.buyTokens(account, {
          from: account,
          value: ethers.utils.parseEther(fundAmount),
        });
        getFundInfo();
        setIsError(false);
      } catch (err) {
        setIsError(true);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: 350,
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Typography variant='body2' gutterBottom>
          구매한 토큰 수: <strong>{currentToken}</strong> YTT
        </Typography>
        <Typography variant='body2' gutterBottom>
          지불한 총 ETH: <strong>{currentFunded}</strong> ETH
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!isOver ? (
          <>
            <TextField
              {...(isLTMin
                ? {
                    error: true,
                    helperText: "0.001ETH 보다 더 구매해야합니다.",
                  }
                : isGTMax
                ? {
                    error: true,
                    helperText: `${
                      max - currentFunded
                    }ETH 보다 적게 구매해야합니다.`,
                  }
                : { error: false })}
              id='standard-basic'
              label='ETH'
              variant='standard'
              onChange={getAmount}
            />
            <Button variant='outlined' onClick={buyToken}>
              구매
            </Button>
          </>
        ) : hasReachedGoal ? (
          <Typography variant='h7' gutterBottom>
            ICO가 성공적입니다! 토큰을 자유롭게 사용하실 수 있습니다!
          </Typography>
        ) : (
          <>
            <Button variant='outlined' onClick={refund}>
              환불
            </Button>
            <Typography variant='body2' gutterBottom>
              {refundMsg}
            </Typography>
          </>
        )}
      </Box>
      <br />
      {isLogin || (
        <Alert severity='error'>먼저 지갑에 연결해주시기 바랍니다.</Alert>
      )}
      {isError && (
        <Alert severity='error'>
          트랜잭션 중 에러가 발생했습니다. 다시 시도해주시기 바랍니다.
        </Alert>
      )}
    </>
  );
};

export default Fund;
