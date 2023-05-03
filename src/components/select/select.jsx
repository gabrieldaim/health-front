import React, { useEffect, useState } from "react";
import "./select.css";

export default ({ componente, tipo, funcaoFilho }) => {
  const [checked, setChecked] = useState(false);
  return (
  <>
  {tipo=="suco"
  ?<>
  <div className="selectPersonalizar">
    <label>
     <input type="radio" name="suco" value={componente} onChange={(event) => funcaoFilho(event)} defaultChecked={true}/>
     <span className="check"></span>
     <p>{componente}</p>
    </label>
    </div>
  </>
  : <>
  <div className="selectPersonalizar">
    <label>
     <input type="checkbox" name="prato" value={componente} onChange={(event) => funcaoFilho(event)}/>
     <span className="check"></span>
     <p>{componente}</p>
    </label>
    </div>
  </>
  }
  </>
  )
};

{
  /* <div className={`checkbox-div ${checked}`} onClick={() => setChecked(!checked)} datatype=""></div>
<input type="checkbox" name={componente} id={componente} checked={checked}/>
<label htmlFor={componente}>{componente}</label> */
}
