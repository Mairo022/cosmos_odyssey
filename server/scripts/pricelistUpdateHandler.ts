import { Routes } from "../types/routes"
import prisma from "../db/prisma"
import { addPricelistToDB } from "./pricelistToDB"
import { RoutesCache } from "../data/RoutesCache"
import {PRICELIST} from "../constants/pricelistConstants";
import {cleanUpPricelists} from "./pricelistDBCleanup";

export default async function schedulePricelistUpdate(): Promise<void> {
    if (process.env.ENV == "LIVE") {
        await updateActions()
        setInterval(updateActions, PRICELIST.UPDATE_INTERVAL)
    }
    if (process.env.ENV == "DEV") {
        RoutesCache.developmentSetCompaniesPlanets()
    }
}

async function updateActions(): Promise<void> {
    await updatePricelist()
    await cleanUpPricelists()
    await RoutesCache.updateAll()
}

async function updatePricelist(): Promise<void> {
    await getUpdatedPricelist()
        .then(async (pricelist) => {
            try {
                if (!isPricelistIDValid(pricelist.id)) {
                    throw new Error(`Invalid pricelist id: ${pricelist.id}`)
                }
                if (await isNewPricelist(pricelist.id)) {
                    await addPricelistToDB(pricelist)
                    console.log("Latest pricelist added to database")
                } else {
                    console.log("Pricelist is already up to date")
                }
            } catch (e) {
                console.error("Error:", e)
            }
        })
}

async function getUpdatedPricelist(): Promise<Routes> {
    try {
        const response = await fetch(process.env.PRICELIST_API_URL)

        if (!response.ok) throw new Error(`Error fetching pricelist, http status: ${response.status}`)

        const pricelist: Routes = await response.json()

        return pricelist
    } catch (e) {
        console.error(e)
    }
}

async function isNewPricelist(pricelistID: string): Promise<boolean> {
    const pricelist = await prisma.pricelists.findFirst({where: { id: pricelistID }})
    return pricelist == null
}

function isPricelistIDValid(pricelistID: string): boolean {
    return pricelistID.length == 36
}
