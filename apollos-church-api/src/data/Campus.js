import { Campus } from '@apollosproject/data-connector-rock';

const { schema, resolver, dataSource: CampusDataSource } = Campus;

// copied from core
export const latLonDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
};

class dataSource extends CampusDataSource {
  getAll = () =>
    this.request()
      .filter('IsActive eq true')
      .expand('Location')
      .expand('Location/Image')
      .expand('CampusTypeValue')
      .cache({ ttl: 600 }) // ten minutes
      .get();

  getByLocation = async ({ latitude, longitude } = {}) => {
    let campuses = await this.getAll();

    const onlineCampuses = campuses
      .filter(({ campusTypeValue }) => campusTypeValue?.value === 'Online')
      .map((campus) => ({
        ...campus,
        location: {
          ...campus.location,
          street1: 'No locations near you. ',
          city: "When there's one",
          state: "we'll let you know!",
          postalCode: '',
        },
      }));
    campuses = campuses.filter(
      ({ campusTypeValue }) => campusTypeValue?.value !== 'Online'
    );

    campuses = campuses.map((campus) => ({
      ...campus,
      distanceFromLocation: latLonDistance(
        latitude,
        longitude,
        campus.location.latitude,
        campus.location.longitude
      ),
    }));

    campuses = campuses.sort(
      (a, b) => a.distanceFromLocation - b.distanceFromLocation
    );

    if (
      campuses.every(({ distanceFromLocation }) => distanceFromLocation > 50)
    ) {
      campuses = [...onlineCampuses, ...campuses];
    } else {
      campuses = [...campuses, ...onlineCampuses];
    }

    return campuses;
  };
}

export { schema, resolver, dataSource };
