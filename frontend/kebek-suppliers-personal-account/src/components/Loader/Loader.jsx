import { CircularProgress } from '@mui/material'
import React from 'react'

function Loader() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                height: "90vh",
                alignItems: "center",
            }}
        >
            <CircularProgress size="100px" />
        </div>
    )
}

export default Loader