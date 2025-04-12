

export const calculateMaterialCost = (inputs) => {
    const {
      length,
      breadth,
      height,
      slabThickness,
      walls,
      floors,
      brickThickness,
      wallThickness,
      brickLength = 0.19,
      brickWidth = 0.09,
      brickHeight = 0.09,
      rates,
      labour
    } = inputs;
  
    if (
      length == null || breadth == null || height == null || slabThickness == null ||
      walls == null || floors == null || brickThickness == null || wallThickness == null ||
      !rates || !labour
    ) {
      throw new Error("Missing input fields in calculation");
    }
  
    const {
      brickRate,
      cementRate,
      steelRate,
      sandRate,
      aggregateRate,
      waterRate
    } = rates;
  
    const area = length * breadth;
    const slabVolume = area * slabThickness * floors;
    const wallVolume = walls * height * wallThickness * floors;
    const brickVolume = brickLength * brickWidth * brickHeight;
    const bricks = Math.ceil((wallVolume / brickVolume) * 1.05); // 5% wastage
  
    const concreteVolume = slabVolume;
    const rccCementBags = Math.ceil(((concreteVolume * (1 / 5.5)) * 1440) / 50 * 1.1);
    const mortarVolume = wallVolume * 0.25;
    const mortarCementBags = Math.ceil(((mortarVolume * (1 / 7)) * 1440) / 50 * 1.1);
  
    const steelKg = Math.ceil(concreteVolume * 100);
    const steelTons = steelKg / 1000;
  
    const rccSand = concreteVolume * (1.5 / 5.5);
    const rccAggregate = concreteVolume * (3 / 5.5);
    const mortarSand = mortarVolume * (6 / 7);
  
    const plasterArea = 2 * walls;
    const plasterThickness = 0.012;
    const plasterVolume = plasterArea * plasterThickness;
    const plasterCementBags = Math.ceil(((plasterVolume * (1 / 6)) * 1440) / 50);
    const plasterSand = plasterVolume * (5 / 6);
  
    const waterConcrete = concreteVolume * 200;
    const waterCement = (rccCementBags + mortarCementBags + plasterCementBags) * 50;
    const totalWater = waterConcrete + waterCement;
  
    // Material Quantity Output
    const cost = {
      bricks,
      cement: {
        rcc: rccCementBags,
        mortar: mortarCementBags,
        plaster: plasterCementBags,
        totalBags: rccCementBags + mortarCementBags + plasterCementBags
      },
      steel: {
        kg: steelKg,
        tons: steelTons
      },
      sand: {
        rcc: rccSand,
        mortar: mortarSand,
        plaster: plasterSand,
        total: rccSand + mortarSand + plasterSand
      },
      aggregate: rccAggregate,
      water: totalWater
    };
  
    // Material Cost Calculation
    const price = {
      bricks: bricks * brickRate,
      cement: cost.cement.totalBags * cementRate,
      steel: steelKg * steelRate,
      sand: cost.sand.total * sandRate,
      aggregate: rccAggregate * aggregateRate,
      water: totalWater * waterRate
    };
  
    const materialTotal = Object.values(price).reduce((sum, val) => sum + val, 0);
  
    // Labour Cost Calculation
    const labourBreakdown = {};
    let totalLabourCost = 0;
  
    for (const [role, { rate, days }] of Object.entries(labour)) {
      const total = rate * days;
      labourBreakdown[role] = { rate, days, total };
      totalLabourCost += total;
    }
  
    const totalEstimatedCost = materialTotal + totalLabourCost;
  
    return {
      ...cost,
      priceBreakdown: price,
      labour: labourBreakdown,
      materialTotal,
      totalLabourCost,
      totalEstimatedCost
    };
  };
  
  