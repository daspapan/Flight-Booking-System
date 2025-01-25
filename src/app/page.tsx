import { fetchFlights } from "@/actions/flight.actions";
import SeatSelection from "@/components/Seating";

export default async function Home() {

    const data = await fetchFlights();

    const formattedData = data.map((flight) => ({
        ...flight,
        DepartureTime: flight.DepartureTime.toString(),
        ArrivalTime: flight.ArrivalTime.toString(),
    }));
    // console.log("formattedData", formattedData);


    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl lg:mt-20">
                <SeatSelection flights={formattedData} />
            </div>
        </div>
    )
}