import React, { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import Map from "../components/Map";
import RideSelector from "../components/RideSelector";

const Confirm = () => {
    const [pickupCoordinates, setPickupCoordinates] = useState([0, 0]);
    const [dropoffCoordinates, setDropoffCoordinates] = useState([0, 0]);

    const router = useRouter();
    const { pickup, dropoff } = router.query;

    useEffect(() => {
        getPickupCoordinates(pickup);
        getDropoffCoordinates(dropoff);
    }, [pickup, dropoff]);

    const getPickupCoordinates = (pickup) => {
        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${pickup}.json?` +
                new URLSearchParams({
                    access_token:
                        "pk.eyJ1IjoiYmFzaXQtYmFsb2d1bjEwIiwiYSI6ImNrdm1sM2RocTB3aTcyb281cTJhNHQ2NjMifQ.MGsYHwZcN8HiDoUoj-FPIA",
                    limit: 1,
                })
        )
            .then((response) => response.json())
            .then((data) => {
                setPickupCoordinates(data.features[0].center);
            })
            .catch(error => console.log(error));
    };

    const getDropoffCoordinates = (dropoff) => {
        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${dropoff}.json?` +
                new URLSearchParams({
                    access_token:
                        "pk.eyJ1IjoiYmFzaXQtYmFsb2d1bjEwIiwiYSI6ImNrdm1sM2RocTB3aTcyb281cTJhNHQ2NjMifQ.MGsYHwZcN8HiDoUoj-FPIA",
                    limit: 1,
                })
        )
            .then((response) => response.json())
            .then((data) => {
                setDropoffCoordinates(data.features[0].center);
            })
            .catch((error) => console.log(error));
    };

    return (
        <Wrapper>
            <Map
                pickupCoordinates={pickupCoordinates}
                dropoffCoordinates={dropoffCoordinates}
                displayBackButton={true}
            />

            <RideContainer>
                <RideSelector 
                pickupCoordinates={pickupCoordinates}
                dropoffCoordinates={dropoffCoordinates}
                />
                <ConfirmButtonContainer>
                    <ConfirmButton>
                        Confirm UberX
                    </ConfirmButton>
                </ConfirmButtonContainer>
            </RideContainer>
        </Wrapper>
    );
};

export default Confirm;

const ConfirmButton = tw.div`
bg-black text-white my-4 mx-4 py-4 text-center text-xl rounded-lg
`

const ConfirmButtonContainer = tw.div`
border-t-2
`

const RideContainer = tw.div`
flex flex-1 flex-col h-1/2
`

const Wrapper = tw.div`
flex flex-col h-screen
`