
import data from "@/assets/data.json";
    

export class TestService {

    title: string = "TypeComposer";


    get sidebar() {
        return data.sidebar;
    }
    
}