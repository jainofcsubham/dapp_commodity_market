
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to calculate carbon footprint
function calculateCarbonFootprint(factor, unit, multiplier, callback) {
    rl.question(`Enter the amount of ${factor} (${unit}): `, (userInput) => {
        const inputNumber = parseFloat(userInput);
        if (isNaN(inputNumber)) {
            console.log('Invalid input. Please enter a valid number.');
        } else {
            const result = inputNumber * multiplier;
            console.log(`Carbon footprint for ${factor}: ${result} kg CO2 per annum`);
            callback(result);
        }
    });
}

// Function to choose food options
function chooseFoodOptions(callback) {
    rl.question('Choose food type (veg/non veg): ', (foodType) => {
        const type = foodType.toLowerCase();
        if (type === 'veg' || type === 'non veg') {
            if (type === 'veg') {
                rl.question('Choose veg type (vegan/veg): ', (vegType) => {
                    const vegan = vegType.toLowerCase() === 'vegan';
                    const multiplier = vegan ? 2019 : 2176;
                    console.log(`Carbon footprint for veg food: ${multiplier} kg CO2 per annum`);
                    callback(multiplier);
                });
            } else {
                rl.question('Choose non veg type (rarely/sometimes/regularly): ', (nonVegType) => {
                    const typeMultiplier = {
                        rarely: 2412,
                        sometimes: 3017,
                        regularly: 3781
                    };
                    const multiplier = typeMultiplier[nonVegType.toLowerCase()];
                    if (multiplier) {
                        console.log(`Carbon footprint for non veg food: ${multiplier} kg CO2 per annum`);
                        callback(multiplier);
                    } else {
                        console.log('Invalid input. Please choose a valid option.');
                    }
                });
            }
        } else {
            console.log('Invalid input. Please choose a valid food type.');
        }
    });
}


function calculateTotalCarbonFootprint() {
    let totalCarbonFootprint = 0;
    const factors = [
        ['petrol', 'liters', 2.34],
        ['diesel', 'liters', 2.71],
        ['coal', 'kg', 2.5],
        ['LPG/CNG', 'kg/liter', 2.07],
        ['Electricity', 'KWH', 0.708],
        ['Air Travel', 'km', 0.121],
        ['Rail Travel', 'km', 0.0078],
        ['Metro Travel', 'km', 0.0139],
        ['Bus Travel', 'km', 0.054],
        ['Electric Bus Travel', 'km', 0.03782],
        ['Cab/Taxi Travel', 'km', 0.1431],
        ['Electric Cab/Taxi Travel', 'km', 0.1035]
    ];

    let index = 0;
    function processFactors() {
        if (index < factors.length) {
            const factor = factors[index];
            calculateCarbonFootprint(...factor, (result) => {
                totalCarbonFootprint += result;
                index++;
                processFactors();
            });
        } else {
            chooseFoodOptions((result) => {
                totalCarbonFootprint += result;
                console.log(`Total Carbon Footprint: ${totalCarbonFootprint} kg CO2 per annum`);
                rl.close();
            });
        }
    }
    processFactors();
}

calculateTotalCarbonFootprint();