import React, { useContext } from 'react';
import { useDrop } from "react-dnd";
import { ItemState } from "./ItemState";
import { CardContext } from "./Ablaufanordnung";


const CardStorage = (props) => {
    const { children } = props;

    const { markAsX } = useContext(CardContext);

    const [{ isDragging }, drop] = useDrop(() => ({
        accept: [ItemState.WRONG, ItemState.RIGHT],
        drop: (item) => markAsX(item.id, 0),
        collect: monitor => ({
            isDragging: monitor.canDrop(),
        })
    }));

    return (
        <div
            ref={drop}
            /*the background color where the cards are located*/
            style={{
                backgroundColor: (isDragging ? 'gray' : undefined),

            }}
            className="scrollmenu"
        >
            {children}

        </div>
    );
}

export default CardStorage;
