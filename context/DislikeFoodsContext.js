import React, { createContext, useState } from 'react';

export const DislikeFoodsContext = createContext();

export const DislikeFoodsProvider = ({ children }) => {
    const [dislikeFoods, setDislikeFoods] = useState([]);

    return (
        <DislikeFoodsContext.Provider value={{ dislikeFoods, setDislikeFoods}}>
            {children}
        </DislikeFoodsContext.Provider>
    );
};
