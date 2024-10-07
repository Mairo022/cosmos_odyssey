import prisma from "../db/prisma"
import {PRICELIST} from "../constants/pricelistConstants";

export async function cleanUpPricelists(): Promise<void> {
    try {
        const pricelists = await prisma.pricelists
            .findMany({
                select: { id: true },
                orderBy: { created_at: "desc" }
            })

        if (pricelists.length <= PRICELIST.MAX_ENTRIES) {
            return
        }

        if (pricelists.length - PRICELIST.MAX_ENTRIES > 1) {
            console.error(`Pricelists DB cleanup: have ${pricelists.length} pricelists, limit is ${PRICELIST.MAX_ENTRIES}`)
        }

        const exceedingPricelistIds = pricelists
            .slice(PRICELIST.MAX_ENTRIES)
            .map(pricelist => pricelist.id)

        await prisma.pricelists.deleteMany({
            where: {
                id: { in: exceedingPricelistIds }
            }
        })

        console.log(`Pricelists table cleaned up, removed: ${exceedingPricelistIds.toString()}`)
    } catch (e) {
        console.error(e)
    }
}
