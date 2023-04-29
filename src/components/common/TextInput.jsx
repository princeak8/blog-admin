import React from "react";

export default function TextInput({
    onChange, placeholder="", containerStyle, 
    inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none", 
    value="", label="", ref, focus=false, required=true 
})
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