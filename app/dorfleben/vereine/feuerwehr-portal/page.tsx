import React from 'react';
import './style.css'; // Assuming there's a style file for CSS styling

const FeuerwehrPortal = () => {
    return (
        <div className="selection-container">
            <h1>Feuerwehr Portal</h1>
            <div className="selection">
                <label>
                    <input type="radio" name="feuerwehr" value="freiwillige" />
                    Freiwillige Feuerwehr
                </label>
                <label>
                    <input type="radio" name="feuerwehr" value="jugend" />
                    Jugendfeuerwehr
                </label>
            </div>
        </div>
    );
};

export default FeuerwehrPortal;