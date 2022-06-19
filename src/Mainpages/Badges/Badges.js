import React from "react";

// import component
import BadgeLine from "./components/BadgeLine";

// import CSS
import "./Badges.css"

import Headline from "../Startseite/Headline";

// import Mantine Core for responsive Background image
import { BackgroundImage } from "@mantine/core";

// import Data from JSON
import JsonData from "../../Resources/Json/BadgeData.json";

// import Backend
import storage from "../../storage";
import service from "../../service";

const Badges = () => {
    let badges = []

    //loading data from db
    if (storage.getBadges() === null) {
        let Data = service.getBadges()
        if (Data === null)
            Data = JsonData

        Data.map((object) => {
            let badge = {
                badgeID: parseInt(object.badgeID),
                title: object.title,
                text: object.text,
                modis: object.modis,
                passed: object.passed,
                unlocked: object.unlocked
            }
            badges.push(badge)
        }
        )
        badges[0].unlocked = true
        storage.setBadges(badges)
    } else
        badges = storage.getBadges()

    return (
        <div className="badges-container">
            <div className="badges-header">
                {/*we have changed "badges" to "Batches" here */}
                <Headline title={"Batches"} headline={"Dein Fortschritt"} text={""} />
            </div>
            <div className="badges-body">
                <BackgroundImage className="image" src={''}>
                    <BadgeLine badgeData={badges} />
                </BackgroundImage>
            </div>
        </div>
    )
};

export default Badges;
