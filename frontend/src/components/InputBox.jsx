import React from "react";

export const InputBox = ({ placeholder, label, onChange }) => {
   return (
      <div className="py-2">
         <div className="pb-1">{label}</div>
         <input
            placeholder={placeholder}
            className="w-full px-2 py-1 border rounded border-slate-200"
            onChange={onChange}
         />
      </div>
   );
};
