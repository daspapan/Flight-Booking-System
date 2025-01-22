import { fetchFlights } from "@/actions/flight.actions";
import SeatSelection from "@/components/Seating";

export default async function Home() {

    const data = await fetchFlights();

    const formattedData = data.map((flight) => ({
        ...flight,
        DepartureTime: flight.DepartureTime.toString(),
        ArrivalTime: flight.ArrivalTime.toString(),
    }));
    console.log("formattedData", formattedData);


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Welcome to the home page</h1>
            <p className="text-2xl">This is the home page</p>
            <SeatSelection flights={formattedData} />
        </div>
    )
}