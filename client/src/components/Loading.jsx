import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const Loading = () => {
  return (
    <>
        <Box sx={{mx: "auto"}}>
            <CircularProgress/>
        </Box>
    </>
  )
}

export default Loading