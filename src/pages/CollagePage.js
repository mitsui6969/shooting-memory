import React from 'react'
import Frame from '../components/Frame/Frame'
import './styles/CollagePage.css'
import testImage from'../assets/background-lantern.jpeg'

const CollagePage = ( images=[] ) => {
    images=[testImage, 'img2.png', 'img2.png', 'img2.png']

    return (
        <div className='collagePage'>
            <h2>collage page</h2>

            <div className='frameArea'>
                <Frame/>
            </div>
            
            <div className='imagesArea'>
                <ul className='imagesArray'>
                    {images.map((src, index) => (
                        <li key={index} className='imageContainer'> 
                            <img
                            src={src}
                            alt={`Collage image ${index + 1}`}
                            className='image' 
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default CollagePage