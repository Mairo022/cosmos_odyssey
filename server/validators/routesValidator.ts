import { RoutesCache } from "../data/RoutesCache"

export function routesValidator(req, res, next) {
    const from = req.query.from.trim()
    const to = req.query.to.trim()

    if (!from) {
        return res.status(400).json("Origin is missing")
    }

    if (!to) {
        return res.status(400).json("Destination is missing")
    }

    if (!RoutesCache.planets.includes(from)) {
        return res.status(400).json("Origin is invalid")
    }

    if (!RoutesCache.planets.includes(to)) {
        return res.status(400).json("Destination is invalid")
    }

    next()
}