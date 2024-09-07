import { RouteProvider, RoutesRendered } from "../features/flights/types/flights.model";

export interface Booking {
    overview: RoutesRendered | undefined
    routes: RouteProvider[] | undefined
}
