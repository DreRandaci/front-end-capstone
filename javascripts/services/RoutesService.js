'use strict';

app.service("RoutesService", function ($http, $q, FIREBASE_CONFIG, AuthService) {

    // RETURNS A FORMATTED ROUTE OBJECT TO SAVE TO FIREBASE
    const createRouteObj = (route, tripId) => {
        return {
            "routeId": route.id,
            "type": route.type,
            "name": route.name,
            "rating": route.rating,
            "stars": route.stars,
            "area": route.area, 
            "trip_id": tripId,
            "url" : route.url,
            "uid": AuthService.getCurrentUid()
        };
    };

    const getRoutes = (userUid) => {
        let routes = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/savedRoutesForTrips.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
                let fbRoutes = results.data;
                Object.keys(fbRoutes).forEach((key) => {
                    fbRoutes[key].id = key;
                    routes.push(fbRoutes[key]);
                });
                resolve(routes);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    const getRoutesForSingleTrip = (tripId) => {
        let routes = [];
        let fbRoutes = [];
        return $q((resolve, reject) => {
          $http.get(`${FIREBASE_CONFIG.databaseURL}/savedRoutesForTrips.json`).then((results) => {
            fbRoutes = results.data;
            Object.keys(fbRoutes).forEach((key) => {
              if (fbRoutes[key].trip_id === tripId) {
                fbRoutes[key].id = key;
                routes.push(fbRoutes[key]);
              }
            });
            resolve(routes);
          }).catch((error) => {
            reject(error);
          });
        });
      };

    const saveTripRoutesToFirebase = (newRoute) => {
        return $http.post(`${FIREBASE_CONFIG.databaseURL}/savedRoutesForTrips.json`, JSON.stringify(newRoute));
    };

    const deleteRoutes = (routeId) => {
        return $http.delete(`${FIREBASE_CONFIG.databaseURL}/savedRoutesForTrips/${routeId}.json`);
    };

    return { createRouteObj, deleteRoutes, getRoutesForSingleTrip, getRoutes, saveTripRoutesToFirebase };
});