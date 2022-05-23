import React, {createContext, useEffect, useState} from 'react';
import {Outlet, useParams} from "react-router-dom";
import Fortschrittsanzeige from "./Fortschrittsanzeige";
import {Button, Group, Modal} from "@mantine/core";
import {useNavigate} from "react-router";
import storage from '../storage';

// let modiData = [
//     {
//         modiID: 1,
//         passed: false,
//         title: 'Konversation'
//     },
//     {
//         modiID: 2,
//         passed: false,
//         title: 'Konversation'
//     },
//     {
//         modiID: 1,
//         passed: false,
//         title: 'Konversation'
//     },
//     // {
//     //     modiID: 3,
//     //     passed: false,
//     //     title: 'Ablaufanordnung'
//     // },
//     // {
//     //     modiID: 4,
//     //     passed: false,
//     //     title: 'Zuordnung'
//     // }
// ]

export const ModiContext = createContext({});

const Gamemodi = () => {
    const {badgeNr} = useParams();
    const [modalOpened, setModalOpened] = useState(false);
    const navigator = useNavigate();
    const [currentModiTitle, setCurrentModiTitle] = useState("");
    const [firstRender, setFirstRender] = useState(true)
    const [reload, setReload] = useState(true)
    const [modis] = useState(storage.getModis())


    useEffect(() => {
            if (firstRender) {
                setFirstRender(false)
                loadModiData()
            }
            if (reload) {
                setReload(false)
                redirect()
            }
        }
    )

    // navigierte zum aktuellen Modi
    const redirect = (eigenerName) => {
        const currentModiTitle = storage.getCurrentModiTitle()
        if (currentModiTitle !== null && currentModiTitle !== eigenerName) {
            navigator('./' + currentModiTitle)
        }
    }

    const loadModiData = () => {
        // setzt den aktuellen Modi Title
        const tempModiTitle = storage.getCurrentModiTitle()
        if (tempModiTitle === undefined || tempModiTitle === null) {
            const currentModi = modis.filter(modi => !modi.passed)[0]
            setCurrentModiTitle(currentModi.title)
            storage.setCurrentModiTitle(currentModi.title)
            storage.setModiID(currentModi.modiID)
        } else {
            setCurrentModiTitle(tempModiTitle)
        }
    }

    // setzt einen Modi alls 'Passed' und leitet zum nächsten weiter
    const markAsPassed = () => {

        storage.setModiPassed()
        modis.filter(modi => !modi.passed)[0].passed = true
        console.log(storage.getModis(), "stor Modi")
        console.log(modis, "prog modi")

        if (modis.filter(modi => !modi.passed).length !== 0) {
            let nextModi = modis.filter(modi => !modi.passed)[0]
            storage.setCurrentModiTitle(nextModi.title)
            storage.setModiID(nextModi.modiID)

            setCurrentModiTitle(nextModi.title)
            setReload(true)
            navigator('./')
        } else {
            storage.setCurrentModiTitle('Endscreen')
            setCurrentModiTitle('Endscreen')
            navigator('./Endscreen')
        }
    }
// TODO hier wurde was gemacht
    return (
        <>
            {/* Modal zum abbrechen*/}
            <Modal opened={modalOpened} onClose={() => setModalOpened(false)}>
                <p>Möchtest du wirklich abbrechen?</p>
                <Group>
                    <Button onClick={() => {
                        modis.map(modi => modi.passed = false)
                        storage.removeAll()
                        navigator('../Badges')
                        setModalOpened(false)
                    }}>Ja</Button>
                    <Button onClick={() => setModalOpened(false)}>Nein</Button>
                </Group>
            </Modal>

            {/* Fortschrittsanzeige */}
            <div className="section-header">
                <h3 className="title" data-title={"Badge " + badgeNr}>{currentModiTitle}</h3>
                <br/>
                <Fortschrittsanzeige modis={modis}/>
                <br/>
                <div onClick={() => setModalOpened(true)} className="xbutton"/>
            </div>

            {/* Bereich für die Modi*/}
            <div className="container" style={{position: 'relative'}}>
                <ModiContext.Provider value={{markAsPassed, redirect}}>
                    <Outlet/>
                </ModiContext.Provider>
            </div>
        </>
    );
}

export default Gamemodi;
