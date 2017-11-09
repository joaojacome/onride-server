export default class Distance {
    public static distLatLong(lat1, lon1, lat2, lon2) {

        let R = 6371; // raio da terra
        let Lati = Math.PI / 180 * (lat2 - lat1); //Graus  - > Radianos
        let Long = Math.PI / 180 * (lon2 - lon1);
        let a =
            Math.sin(Lati / 2) * Math.sin(Lati / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(Long / 2) * Math.sin(Long / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // distância en km
        //console.log(d)
        return (d.toFixed(1) <= '10');
        //return d.toFixed(1);
    }
    public static calculaDistancia(lat1, lon1, lat2, lon2) {
        let R = 6371; // raio da terra
        let Lati = Math.PI / 180 * (lat2 - lat1); //Graus  - > Radianos
        let Long = Math.PI / 180 * (lon2 - lon1);
        let a =
            Math.sin(Lati / 2) * Math.sin(Lati / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(Long / 2) * Math.sin(Long / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // distância en km
        // console.log(d)
        return d.toFixed(1);
    }
    public static deg2rad(angle) {
        return angle * .017453292519943295; // (angle / 180) * Math.PI;
    }
}