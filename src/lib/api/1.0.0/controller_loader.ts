import UserController from "./controllers/usercontroller";
import GroupController from "./controllers/groupcontroller";
import FavoriteController from "./controllers/favoritecontroller";
import RideController from "./controllers/ridecontroller";
import PushController from "./controllers/pushcontroller";
import RatingController from "./controllers/ratingcontroller";
import ModelLoader from "./model_loader";

export default class ControllerLoader {

    public db: any;
    public controllers: any;
    public models: any;

    public static load(db, models) {
        return {
            UserController: new UserController(db, models),
            GroupController: new GroupController(db, models),
            FavoriteController: new FavoriteController(db, models),
            RideController: new RideController(db, models),
            PushController: new PushController(db, models),
            RatingController: new RatingController(db, models),
        };
    }
}