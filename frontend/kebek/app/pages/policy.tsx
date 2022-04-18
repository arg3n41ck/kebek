import React from 'react'
import Loader from '../components/Loader/Loader'
import Policy from '../components/Policy/Policy'

function policy() {
    return (
        <React.Suspense fallback={<Loader />}>
            <div style={{ position: "relative", paddingBottom: 150 }} >
                <Policy />
            </div>
        </React.Suspense>
    )
}

export default policy