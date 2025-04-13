import React, { useEffect, useRef } from "react";
import tw from "tailwind-styled-components";
import mapboxgl from "!mapbox-gl";
import Link from 'next/link';

mapboxgl.accessToken =
    "pk.eyJ1IjoiYmFzaXQtYmFsb2d1bjEwIiwiYSI6ImNrdm1sM2RocTB3aTcyb281cTJhNHQ2NjMifQ.MGsYHwZcN8HiDoUoj-FPIA";
    const bounds = [
        [-81.101472, 32.075529], // Southwest coordinates
        [-81.079246, 32.082284] // Northeast coordinates
        ];
const Map = ({pickupCoordinates, dropoffCoordinates, displayBackButton, stops = [], userLocation}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (!map.current && mapContainer.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph",
                center: [-99.29011, 39.39172],
                zoom: 1,
                maxBounds: bounds
            });

            // Add user location marker
            if (userLocation) {
                new mapboxgl.Marker({ color: '#3B82F6' })
                  .setLngLat([userLocation.lng, userLocation.lat])
                  .addTo(map.current);
            }

            // Add stop markers
            stops.forEach(stop => {
                new mapboxgl.Marker({ color: '#10B981' })
                  .setLngLat([stop.lng, stop.lat])
                  .setPopup(new mapboxgl.Popup().setHTML(`<h3>${stop.name}</h3><p>Next: ${stop.nextArrival}</p>`))
                  .addTo(map.current);
            });

            (pickupCoordinates && dropoffCoordinates) && (() => {
                addToMap(map.current, pickupCoordinates);
                addToMap(map.current, dropoffCoordinates);

                map.current.fitBounds([
                    dropoffCoordinates,
                    pickupCoordinates
                ], {
                    padding: 60
                })
            })();
        }

        return () => map.current?.remove();
    }, [pickupCoordinates, dropoffCoordinates, stops, userLocation]);

    const addToMap = (map, coordinates) => {
        const marker1 = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);
    }
    
    return (
        <Wrapper id="map" ref={mapContainer}>
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
