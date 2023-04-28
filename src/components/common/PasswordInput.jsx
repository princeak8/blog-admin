import React from "react";

export default function PasswordInput({onChange, placeholder="", containerStyle, inputStyle, value="", label=""})
{
    return (
        <div className={containerStyle}>
            <label htmlFor="title">{label.toUpperCase()}: </label><br/>
            <input 
                value={value} type="password" id="title" placeholder={placeholder} onChange={onChange} 
                className={inputStyle}
            />
        </div>
    );
}