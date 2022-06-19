import React, { useContext, useEffect, useState } from 'react';

import JsonList from "../../Resources/Json/MultipleChoiceData.json"
import MultipleChoiceField from "./Components/MultipleChoiceField";
import './MultipleChoice.css'
import ModiHeader from "../../Gamemodi/ModiHeader";
import { ModiContext } from "../../Gamemodi/Gamemodi";
import { useNavigate } from "react-router";
import service from "../../service";
import storage from "../../storage";

const modalData = [
    {
        title: "SPIELANLEITUNG 🎲",
        content: "Lesen Sie sich den Text auf der linken Seite sorgfältig durch und kreuzen Sie anschließend die zutreffenden Aussagen an. Sie können eine oder mehrere Antworten ankreuzen."
    },
    {
        title: "LEIDER FALSCH ✗",
        content: "Leider ist nicht alles richtig, überprüfen Sie Ihre Antworten noch einmal. 🧐"
    },
    {
        title: "ALLES RICHTIG ✓",
        content: "Super, Sie haben alles richtig gelöst! 👏"
    }
]

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const MultipleChoice = () => {
    const eigenerName = "Multiplechoice"
    const [openedModal, setOpenedModal] = useState(true);
    const [openedPopover, setOpenedPopover] = useState(false);
    const [modalContent, setModalContent] = useState(modalData[0])
    const [allRight, setAllRight] = useState(false)
    const [text, setText] = useState("");
    const [aufgaben] = useState([])

    const { redirect } = useContext(ModiContext);

    const navigator = useNavigate();



    useEffect(() => {
        // redirect to actual mode
        redirect(eigenerName)
        // loading data from db
        if (aufgaben[0] === undefined) {
            let Data = service.getMultipleChoice(storage.getBadgeID(), storage.getModiID())
            if (Data === undefined) {
                navigator('../../Error503')
                return
            } else if (Data === null) {
                console.error("DB nicht erreichbar, nutze Demo Daten")
                // navigator('../../Error503')
                Data = JsonList[0]
            }
            Data = Data[0]

            Data.aufgaben.map((object, idx) => {
                let aufgabe = {
                    id: idx + 1,
                    frage: object.frage,
                    antworten: [],
                    isRichtig: false
                }
                object.antworten.map((object, idx) => {
                    let antwort = {
                        id: idx + 1,
                        text: object.text,
                        isRichtig: object.isRichtig,
                        isChecked: false
                    }
                    aufgabe.antworten.push(antwort)
                }
                )
                aufgabe.antworten = shuffle(aufgabe.antworten)
                aufgaben.push(aufgabe)
            })
            setText(Data.text)

        }
    })

    //checks if all answers are right
    const checkIfAllRight = () => {
        aufgaben.map(aufgabe => {
            let abbruch = false
            aufgabe.antworten.map(antwort => {
                if (!abbruch)
                    if (antwort.isChecked && antwort.isRichtig) {
                        aufgabe.isRichtig = true
                    } else if (antwort.isChecked && !antwort.isRichtig) {
                        aufgabe.isRichtig = false
                        abbruch = true
                    } else if (!antwort.isChecked && antwort.isRichtig) {
                        aufgabe.isRichtig = false
                        abbruch = true
                    }
            })
        })

        if (aufgaben.filter(aufgabe => !aufgabe.isRichtig).length === 0) {
            // right
            setModalContent(modalData[2]);
            setOpenedModal(true);
            setAllRight(true);
        } else {
            // false
            setModalContent(modalData[1]);
            setOpenedModal(true);
            setAllRight(false);

        }
    }

    // sets a multipleChoice field checked
    const setAufgabeChecked = (aufgabenID, antwortID) => {
        const antwort = aufgaben.filter(aufgabe => aufgabe.id === aufgabenID)[0].antworten.filter(antwort => antwort.id === antwortID)[0]
        antwort.isChecked = !antwort.isChecked
    };

    return (
        <>
            <div className="multiChoice-header">
                <ModiHeader
                    setModalContent={setModalContent}
                    modalContent={modalContent}
                    openedModal={openedModal}
                    openedPopover={openedPopover}
                    setOpenedPopover={setOpenedPopover}
                    setOpenedModal={setOpenedModal}
                    checkIfAllRight={checkIfAllRight}
                    eigenerName={eigenerName}
                    allRight={allRight}
                    modalData={modalData}
                    aufgabenstellungVisible={false}
                    fertigVisible={true}
                    tooltipText="⚠️ Sie müssen erst alles richtig haben, um weiterzumachen!"
                    popoverText="⚠️ Sie müssen erst alle Fragen beantworten!"
                />
            </div>

            <div className="multipleChoiceContainer">
                <div className="multipleChoiceBody">

                    <div className="textField">

                        <div className="textFieldBody">
                            <p className="text">
                                {text}
                            </p>
                        </div>
                    </div>

                    <div className="multipleChoiceField">
                        {
                            aufgaben.map(aufgabe => (
                                <MultipleChoiceField key={Math.random()} aufgabe={aufgabe}
                                    setAufgabeChecked={setAufgabeChecked} />
                            )
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default MultipleChoice
