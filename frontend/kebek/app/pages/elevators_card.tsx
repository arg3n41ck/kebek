import { Suspense } from "react";
import ElevatorCard from "../components/ElevatorCard/ElevatorCard";
import Loader from "../components/Loader/Loader";

export default function Elevators_card() {
    return (
        <>
            <Suspense fallback={<Loader />} >
                <ElevatorCard />
            </Suspense>
        </>
    )
}
