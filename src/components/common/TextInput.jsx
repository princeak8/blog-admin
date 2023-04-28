import React from "react";

export default function TextInput({onChange, placeholder="", containerStyle, inputStyle, value="", label=""})
{
    return (
        <div className={containerStyle}>
            <label htmlFor="title">{label.toUpperCase()}: </label><br/>
            <input 
                value={value} type="text" id="title" placeholder={placeholder} onChange={onChange} 
                className={inputStyle}
            />
        </div>
    );
}