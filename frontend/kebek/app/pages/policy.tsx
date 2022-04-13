import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
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