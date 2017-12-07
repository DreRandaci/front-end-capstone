'use strict';

app.service("TripsService", function ($http, $q, FIREBASE_CONFIG, AuthService) {

    const getTrips = (userUid) => {
        let trips = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/trips.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
                let fbTrips = results.data;
                Object.keys(fbTrips).forEach((key) => {
                    fbTrips[key].id = key;
                    trips.push(fbTrips[key]);
                });
                resolve(trips);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    const getSingleTrip = (id) => {
        return $http.get(`${FIREBASE_CONFIG.databaseURL}/trips/${id}.json`);
    };

    const createTripObj = (trip, address, lat, lng) => {
        return {
            "name": trip.id,
            "description": trip.description,
            "date": trip.date,
            "googleMapsAddress": address,
            "lat": lat,
            "lng": lat,
            "uid": AuthService.getCurrentUid()
        };
    };

    const saveTripToFirebase = (newTrip) => {
        return $http.post(`${FIREBASE_CONFIG.databaseURL}/trips.json`, JSON.stringify(newTrip));
    };

    return { getTrips, getSingleTrip, createTripObj, saveTripToFirebase };

});
