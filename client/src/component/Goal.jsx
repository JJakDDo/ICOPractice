import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { ethers } from "ethers";

const Goal = ({ crowdSaleContract }) => {
  const [progress, setProgress] = useState(40);
  const [hardCap, setHardCap] = useState(0);
  const [goal, setGoal] = useState(0);
  const [currentCap, setCurrentCap] = useState(0);

  useEffect(() => {
    const getCaps = async () => {
      const _hardCap = await crowdSaleContract.hardCap();
      const _goal = await crowdSaleContract.goal();
      const _currentCap = await crowdSaleContract.totalFundedInWei();

      setHardCap(ethers.utils.formatEther(_hardCap));
      setGoal(ethers.utils.formatEther(_goal));
      setCurrentCap(ethers.utils.formatEther(_currentCap));
    };

    if (crowdSaleContract.address) getCaps();
  }, [crowdSaleContract]);

  const getProgress = () => {
    return (currentCap / hardCap) * 100;
  };

  return (
    <>
      <Box sx={{ width: "50%" }} style={{ paddingTop: "100px" }}>
        <Box
          sx={{
            width: "50%",
            position: "relative",
            left: "215px",
          }}
        >
          <span
            style={{
              left: "-55px",
              position: "absolute",
            }}
          >
            {goal}
          </span>
          <span
            style={{
              display: "inline-block",
              right: "0px",
              position: "absolute",
            }}
          >
            {hardCap}
          </span>
        </Box>
        <LinearProgress
          variant='determinate'
          value={getProgress()}
          style={{ marginTop: "30px" }}
        />
      </Box>
    </>
  );
};

export default Goal;
