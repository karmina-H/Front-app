import React, { createContext, useState } from 'react';

export const LikeFoodsContext = createContext();

export const LikeFoodsProvider = ({ children }) => {
    const [likeFoods, setLikeFoods] = useState([]);

    return (
        <LikeFoodsContext.Provider value={{ likeFoods, setLikeFoods}}>
            {children}
        </LikeFoodsContext.Provider>
    );
};
