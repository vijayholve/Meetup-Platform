import React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

const Loading = () => {
  return (
    <div className="w-full h-screen flex pt-7 justify-center">
      <Stack
        spacing={2}
        direction="row"
        className="w-full max-w-md justify-between"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="flex-1 flex justify-content-between justify-center">
              <CircularProgress className="w-12 h-12 " color="secondary" size={60} />
            
            </div>
          </div>
        </div>
      </Stack>
    </div>
  );
};

export default Loading;
