import React, {useState, useEffect} from 'react'

const getWindowDimensions = () => {
    const {innerWidth: width, innerHeight: height} = window
    return {width, height}

}

const useWindowsDimensions = () => {
    const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions())

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDimensions
}

export default useWindowsDimensions