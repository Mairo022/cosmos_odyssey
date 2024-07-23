import { RouteProvider, RoutesRendered } from "../components/flights/flights.component.model";

export interface Booking {
    overview: RoutesRendered | undefined
    routes: RouteProvider[] | undefined
}