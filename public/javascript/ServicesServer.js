const config = require('../../src/index'), 
    ServiceCategory = require('../../src/model/ServiceCategory').ServiceCategory,
    Service = require('../../src/model/Service').Service;

//------------------------------------------------
//------------------- SERVICE --------------------
//------------------------------------------------

const insertService = async(serviceToAdd) => {
    try {

        const insert = config.then(async function (connection) {
            const servCatRep = connection.getRepository(ServiceCategory);
            const searchOneServCat = await servCatRep.findOneBy({
                name:serviceToAdd.categories,
                isDeleted: false
            })

            let service = new Service();
            service.serviceCategoryId = searchOneServCat.id;
            service.name = serviceToAdd.name;
            service.price = serviceToAdd.price;
            service.duration = serviceToAdd.duration;
            service.description = serviceToAdd.description;
            service.isDeleted = serviceToAdd.isDeleted;
            service.categories = searchOneServCat;

            const serviceRep = connection.getRepository(Service);

            console.log(service);

            const dup = await duplicateService(service.name);
            if(dup) return true;
            else{
                await serviceRep.save(service);
                console.log('[Server] Service Saved');
                return false;
            }
        })
        
        return insert;

    } catch (error) {
        console.log('insert service '+ error);
    }
}

const duplicateService = async(serviceName) => {
    try {

        const duplicate = config.then(async function(connection){
            const serviceRep = connection.getRepository(Service);
            const searchOneService = await serviceRep.findOneBy({
                name:serviceName,
                isDeleted: false
            })

            if (searchOneService != null) return true;
            else return false;
        })
        return duplicate;

    } catch (error) {
        console.log('Select specific service '+error);
    }
}

const searchAllService = async() => {
    try {
            const search = config.then(async function(connection){
            const serviceRep = connection.getRepository(Service);
            const allService = await serviceRep.findBy({
                isDeleted:false
            })

            return allService
        })
        return search;

    } catch (error) {
        console.log('Select specific service '+error);
    }
}

const searchOneService = async(serviceName) => {
    try {
        
        const search = config.then(async function(connection){
            const serviceRep = connection.getRepository(Service);
            const searchAService = await serviceRep.find({
                where: {
                    name: serviceName,
                    isDeleted: false
                },
                relations: ["categories"]
            })

            return searchAService;
        })
        return search;

    } catch (error) {
        console.log('Select specific service '+error);
    }
}

const searchOneServiceById = async(serviceId) => {
    try {
        
        const search = config.then(async function(connection){
            const serviceRep = connection.getRepository(Service);
            const searchAService = await serviceRep.findOne({
                where: {
                    id: serviceId,
                    isDeleted: false
                },
                relations: ["categories"]
            })

            return searchAService;
        })
        return search;

    } catch (error) {
        console.log('Select specific service '+error);
    }
}

const sortServiceByCategory= async(serviceName) => {
    try {
        const search = config.then(async function(connection){
            const serviceCatRep = connection.getRepository(ServiceCategory);
            const serviceCat = await serviceCatRep.findOneBy({
                name: serviceName.value,
                isDeleted: false
            })

            const serviceRep = connection.getRepository(Service);
            const searchAService = await serviceRep.find({
                where: {
                    serviceCategoryId: serviceCat.id,
                    isDeleted: false
                },
                relations: ["categories"]
            })

            return searchAService;
        })
        return search;

    } catch (error) {
        console.log('Select specific service '+error);
    }
}

const quickSearchService = async(serviceWord) => {
    try {
        var search = config.then(async function (connection) {
            const servRep = connection.getRepository(Service);
            const allService = await servRep.findBy({
                isDeleted: false
            });

            var specificServices = new Array();

            allService.forEach(services => {
                var serv = String(services.name).toLowerCase();
                if(serv.includes(String(serviceWord.name).toLowerCase(),0)){
                    var jsonService = new Object();
                    jsonService.name = services.name;
                    specificServices.push(jsonService);
                }
            });
            
            return specificServices;
        })

        return search;
    } catch (error) {
        
    }
}

const editService = async(newService) => {
    try {
        const edit = config.then(async function (connection) {
            const serviceRep = connection.getRepository(Service);
            const serviceToUpdate = await serviceRep.findOneBy({
                name: newService.oldName,
                isDeleted: false
            })

            const servCatRep = connection.getRepository(ServiceCategory);
            const searchOneServCat = await servCatRep.findOneBy({
                name:newService.categories,
                isDeleted: false
            });
            
            serviceToUpdate.serviceCategoryId = searchOneServCat.id;
            serviceToUpdate.name = newService.name;
            serviceToUpdate.price = newService.price;
            serviceToUpdate.duration = newService.duration;
            serviceToUpdate.description = newService.description;
            serviceToUpdate.categories = searchOneServCat;

            await serviceRep.save(serviceToUpdate);
            console.log('[Server] Service Saved');
        })

    } catch (error) {
        console.log('insert service '+ error);
    }
}

const deleteService = async(serviceName) => {
    try {
        const toDelete = config.then(async function (connection) {
            const serviceRep = connection.getRepository(Service);
            const serviceToDelete = await serviceRep.findOneBy({
                name: serviceName.name,
                isDeleted: false
            })

            serviceToDelete.isDeleted = true;

            console.log(serviceToDelete);

            await serviceRep.save(serviceToDelete);
            console.log('[Server] Service Deleted');
        })

        return await toDelete

    } catch (error) {
        console.log('insert service '+ error);
    }
}

//------------------------------------------------
//---------------SERVICE CATEGORIES---------------
//------------------------------------------------

const insertServiceType = async(serviceType) => {
    try {

        const insert = config.then(async function (connection) {
            const servCat = new ServiceCategory();
            servCat.isDeleted = serviceType.isDeleted;
            servCat.name = serviceType.name;
            
            const dup = await duplicateServiceType(servCat.name);

            if(dup) return true;

            await connection.manager.save(servCat);
            console.log('[Server] Service Category Saved');
            return false;
        })

        return await insert;
        
    } catch (error) {
        console.log('insert service category '+ error);
    }
}

const selectServiceTypeAll = async() => {
    try {
        var selectServiceType = config.then(async function (connection) {
            const servCatRep = connection.getRepository(ServiceCategory);
            const allServCat = await servCatRep.findBy({
                isDeleted: false
            });

            return allServCat;
        })

        return selectServiceType;

    } catch (error) {
        console.log('select All Service Category '+error);
    }
}

const selectSpecificServiceType = async(serviceName) => {
    try {

        var select = config.then(async function (connection) {
            const servCatRep = connection.getRepository(ServiceCategory);
            const allServCat = await servCatRep.findBy({
                isDeleted: false
            });

            var specificServicesCat = new Array();

            allServCat.forEach(serviceCat => {
                var catName = String(serviceCat.name).toLowerCase();
                if(catName.includes(String(serviceName.name).toLowerCase(),0)){
                    var jsonServCat = new Object();
                    jsonServCat.name = serviceCat.name;

                    specificServicesCat.push(jsonServCat);
                }
            });
            
            //var jsonArray = JSON.parse(JSON.stringify(specificServicesCat));

            return specificServicesCat;
        })

        return select;
        
    } catch (error) {
        console.log('select All Service Category '+error);
    }
}

const duplicateServiceType = async(serviceTypeName) => {
    try {

        const duplicate = config.then(async function (connection) {
            const servCatRep = connection.getRepository(ServiceCategory);
            const searchOneServCat = await servCatRep.findOneBy({
                name:serviceTypeName,
                isDeleted: false
            })

            if (searchOneServCat != null && !searchOneServCat.isDeleted) return true;
            else return false;
        })  
        return duplicate;
        
    } catch (error) {
        console.log('select specific service category'+error);
    }
}

const updateServiceType = async(servCat) => {
    try {

        const update = config.then(async function (connection) {
            const servCatRep = connection.getRepository(ServiceCategory);
            const servCatToUpdate = await servCatRep.findOneBy({
                name: servCat.oldName,
                isDeleted: false
            })
            
            const dup = await duplicateServiceType(servCat.name);
            if(dup) return dup
            servCatToUpdate.name = servCat.name;
            await servCatRep.save(servCatToUpdate);

            return dup
        })

        return await update
        
    } catch (error) {
        console.log('update service type '+error);
    }
}

const deleteServiceType = async(servCat) => {
    try {

        const deleted = config.then(async function (connection) {
            const servCatRep = connection.getRepository(ServiceCategory);
            const servCatToUpdate = await servCatRep.findOneBy({
                name: servCat.name,
                isDeleted: false
            })

            servCatToUpdate.isDeleted = true;
            await servCatRep.save(servCatToUpdate);
        })

        return await deleted
        
    } catch (error) {
        console.log('delete service category '+error);
    }
}

module.exports = {
    //Service Category
    insertServiceType,
    selectServiceTypeAll,
    selectSpecificServiceType,
    duplicateServiceType,
    updateServiceType,
    deleteServiceType,
    //Service
    insertService,
    searchAllService,
    searchOneService,
    editService,
    deleteService,
    quickSearchService,
    sortServiceByCategory,
    searchOneServiceById
}
