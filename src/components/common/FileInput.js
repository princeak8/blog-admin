import React from "react";

export default function FileInput({onChange, isUploading, containerStyle, inputStyle, value="", label="", inputKey})
{
    return (
        <div style={containerStyle}>
            <label htmlFor="cover">{label.toUpperCase()}: </label><br/>
            <input 
                key={inputKey} type="file" id="cover" onChange={onChange} 
                className={inputStyle}
            />
            {isUploading && <h5>Uploading</h5>}
        </div>
    );
}