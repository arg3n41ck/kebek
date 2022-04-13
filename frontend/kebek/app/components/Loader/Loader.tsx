import { CircularProgress } from '@mui/material'
import React from 'react'

function Loader() {
    return (
        <div style={{
            minHeight: "90vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <CircularProgress color='success' size="100px" />
        </div>
    )
}

export default Loader