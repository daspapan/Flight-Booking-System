import SeatSelection from "@/components/Seating";
import { fetchAuthSession } from "@aws-amplify/core";


interface FlightType {
    Origin: string;
    Destination: string;
    FlightID: string;
    DepartureTime: Date;
    ArrivalTime: Date;
}

export default async function Home() {

    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const flightsData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}flights`, {
        method: "GET",
        headers: {
            Authorization: `${authToken}`,
        },
    })
    const response = await flightsData.json();

    const formattedData = response.data.map((flight: FlightType) => ({
        ...flight,
        DepartureTime: flight.DepartureTime.toString(),
        ArrivalTime: flight.ArrivalTime.toString(),
    }));
    

    /* const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const seatsData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}flights/FL456`, {
        method: "GET",
        headers: {
            Authorization: `${authToken}`,
        },
    })
    const responseS = await seatsData.json();
    console.log("Fetched Seats 1: ", responseS.data); */
    


    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl lg:mt-20">
                <SeatSelection flights={formattedData} />
            </div>
        </div>
    )
}