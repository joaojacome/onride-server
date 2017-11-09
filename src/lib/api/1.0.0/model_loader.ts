import UserModel from "./models/usermodel";
import GroupModel from "./models/groupmodel";
import RideModel from "./models/ridemodel";
import FavoriteModel from "./models/favoritemodel";
import PushModel from "./models/pushmodel";
import FriendModel from "./models/friendmodel";
import RatingModel from "./models/ratingmodel";

export default class ModelLoader {

    public db: any;
    public models: any;

    public static load(db: any) {
        return {
            User: new UserModel(db),
            Group: new GroupModel(db),
            Ride: new RideModel(db),
            Rating: new RatingModel(db),
            Favorite: new FavoriteModel(db),
            Push: new PushModel(db),
            Friend: new FriendModel(db),
        };
    }
}