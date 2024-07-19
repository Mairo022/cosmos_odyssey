import { RouteProvider, RoutesRendered } from "../components/flights/flights.model";

export interface Booking {
    overview: RoutesRendered | undefined
    routes: RouteProvider[] | undefined
}