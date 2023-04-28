import React from "react";

export default function PasswordInput({onChange, placeholder="", containerStyle, inputStyle, value="", label="", ref, required=true })
{
    return (
        <div className={containerStyle}>
            <label htmlFor="title">{label.toUpperCase()}: </label><br/>
            <input 
                value={value} type="password" id="title" placeholder={placeholder} onChange={onChange} required={required}
                className={inputStyle} ref={ref}
            />
        </div>
    );
}