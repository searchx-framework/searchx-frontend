import React from "react";


const FormContainer = function({children}) {
    return <div className="Form">
        <div className="body">
            {children}
        </div>

    </div>
};

export default FormContainer;