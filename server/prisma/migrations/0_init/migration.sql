-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "route_ids" UUID[],
    "flight_ids" UUID[],
    "price" DECIMAL(20,2) NOT NULL,
    "start" TIMESTAMPTZ(6) NOT NULL,
    "end" TIMESTAMPTZ(6) NOT NULL,
    "user_id" UUID,
    "firstname" VARCHAR(100) NOT NULL,
    "lastname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "cancelled" BOOLEAN DEFAULT false,
    "pricelist_id" UUID NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flights" (
    "id" UUID NOT NULL,
    "route_id" UUID NOT NULL,
    "company" VARCHAR(100) NOT NULL,
    "price" DECIMAL(20,2) NOT NULL,
    "start" TIMESTAMPTZ(6) NOT NULL,
    "end" TIMESTAMPTZ(6) NOT NULL,
    "pricelist_id" UUID NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricelists" (
    "id" UUID NOT NULL,
    "valid_until" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pricelists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" UUID NOT NULL,
    "from" VARCHAR(20) NOT NULL,
    "to" VARCHAR(20) NOT NULL,
    "distance" BIGINT NOT NULL,
    "pricelist_id" UUID NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "pricelist" FOREIGN KEY ("pricelist_id") REFERENCES "pricelists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "route" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "pricelist" FOREIGN KEY ("pricelist_id") REFERENCES "pricelists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

