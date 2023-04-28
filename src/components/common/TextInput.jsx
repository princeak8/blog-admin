import React from "react";

export default function TextInput({onChange, placeholder="", containerStyle, inputStyle, value="", label="", ref, focus=false, required=true })
{
    return (
        <div className={containerStyle}>
            <label htmlFor="title">{label.toUpperCase()}: </label><br/>
            <input 
                value={value} type="text" id="title" placeholder={placeholder} onChange={onChange} required={required}
                className={inputStyle} ref={ref} autoFocus={focus}
            />
        </div>
    );
}