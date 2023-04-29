import React from "react";

export default function TextArea({onChange, placeholder="", containerStyle, inputStyle, value="", label=""})
{
    const limit = 25;
    return (
        <div classname={containerStyle}>
            <label htmlFor="cover">{label.toUpperCase()}: </label><br/>
            <textarea 
                placeholder={placeholder} id="preview" onChange={onChange} 
                className={inputStyle} value={value}
            />
            {`${value.split(" ").length - 1} / ${limit} ${
                value.split(" ").length - 1 < 2 ? "word" : "words"
            }`}
        </div>
    );
}