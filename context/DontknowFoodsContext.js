import React, { createContext, useState } from 'react';

export const DontknowFoodsContext = createContext();

export const DontknowFoodsProvider = ({ children }) => {
    const [dontknowFoods, setDontknowFoods] = useState([]);

    return (
        <DontknowFoodsContext.Provider value={{ dontknowFoods, setDontknowFoods}}>
            {children}
        </DontknowFoodsContext.Provider>
    );
};
