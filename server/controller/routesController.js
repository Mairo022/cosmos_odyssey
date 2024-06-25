import { findRoutes, findPlanets } from "../services/routesService.js"

export function getRoutes(req, res) {
    const from = req.query.from
    const to = req.query.to
    
    const validInput = validateInput([from, to])
    if (!validInput) {
        return res.status(400).json("Invalid parameters")
    }

    const routes = findRoutes(from, to)
    return res.status(200).json(routes)
}

export function getPlanets(_, res) {
    const planets = findPlanets()
    return res.status(200).json(planets)
}

function validateInput(inputs) {
    for (const input of inputs) {
        if (input && input.length > 0 && input.trim() !== "") continue
        else return false
    }
    return true
}