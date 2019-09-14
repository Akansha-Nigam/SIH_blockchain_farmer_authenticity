/**
 *
 * @param {org.cyient.blockchain.BuyChemical} tx - the TemperatureReading transaction
 * @transaction
 */


async function buyChemical(tx) {  // eslint-disable-line no-unused-vars

    const NS = 'org.cyient.blockchain';
    if (tx.quantity < tx.producerChemical.quantity) {
        const factory = getFactory();
        
        const farmerChemical = factory.newResource(NS, 'FarmersChemical', tx.producerChemical.chemicalId);
        farmerChemical.farmer = factory.newRelationship(NS, 'Farmer', tx.farmer.farmerId);
        farmerChemical.quantity = tx.quantity;
        farmerChemical.producer = factory.newRelationship(NS, 'Producer', tx.producerChemical.producer.producerId);
        farmerChemical.name = tx.producerChemical.name;

        tx.producerChemical.quantity = tx.producerChemical.quantity - tx.quantity;

        const producerChemicalRegistry = await getAssetRegistry(NS + '.ProducersChemical');
        await producerChemicalRegistry.update(tx.producerChemical);

        const farmerChemicalRegistry = await getAssetRegistry(NS + '.FarmersChemical');
        await farmerChemicalRegistry.addAll([farmerChemical]);
    }
    else{
        let event = getFactory().newEvent(NS, 'SampleEvent');
        event.message = "Producer doesnot have sufficient quantity to sell. Adulteration possible.";
        emit(event);
    }

}
