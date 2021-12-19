import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import mapboxgl from "!mapbox-gl";
import Link from 'next/link';

mapboxgl.accessToken =
    "pk.eyJ1IjoiYmFzaXQtYmFsb2d1bjEwIiwiYSI6ImNrdm1sM2RocTB3aTcyb281cTJhNHQ2NjMifQ.MGsYHwZcN8HiDoUoj-FPIA";
    const bounds = [
        [-81.101472, 32.075529], // Southwest coordinates
        [-81.079246, 32.082284] // Northeast coordinates
        ];
const Map = ({pickupCoordinates, dropoffCoordinates, displayBackButton}) => {
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph",
            center: [-99.29011, 39.39172],
            zoom: 1,
            maxBounds: bounds
        });

        (pickupCoordinates && dropoffCoordinates) && (() => {
            addToMap(map, pickupCoordinates);
            addToMap(map, dropoffCoordinates);

            map.fitBounds([
                dropoffCoordinates,
                pickupCoordinates
            ], {
                padding: 60
            })
        })();
    }, [pickupCoordinates, dropoffCoordinates]);

    const addToMap = (map, coordinates) => {
        const marker1 = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);
    }
    
    return (
        <Wrapper id="map">
            { displayBackButton && (<ButtonContainer>
            <Link href="/search">
                <BackButton src="https://img.icons8.com/ios-filled/50/000000/left.png" />
            </Link>
            </ButtonContainer>)}
        </Wrapper>
    )
};

const Wrapper = tw.div`
    flex-1 h-1/2 relative
`

const ButtonContainer = tw.div`
bg-white z-50 border rounded-full p-2 absolute top-4 left-4 shadow-md
`
const BackButton = tw.img`
h-12 cursor-pointer 
`

export default Map;
