import React, {useState} from "react";
import {createRoot} from "react-dom/client";

function App() {
  const [result, setResult] = useState(null);
  const [adjusted, setAdjusted] = useState(false);

  async function analyze() {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({})
    });
    setResult(await response.json());
    setAdjusted(false);
  }

  return <main style={{fontFamily:"Arial",maxWidth:760,margin:"40px auto",padding:24,color:"#202744"}}>
    <h1>🏡 RoomSync</h1>
    <p>Know your week before you share a room.</p>
    <h2>Roommate schedule comparison</h2>
    <section style={{display:"flex",gap:16,flexWrap:"wrap"}}>
      <article style={{background:"#fff1e8",padding:20,borderRadius:12,flex:1}}>
        <h3>Asha</h3><p>Needs quiet: 10:30 PM – 7:00 AM</p><b>Budget: ₹10,000</b>
      </article>
      <article style={{background:"#edf2ff",padding:20,borderRadius:12,flex:1}}>
        <h3>Dev</h3><p>Project calls: 10 PM – 12 AM</p><b>Monday · Wednesday · Friday</b>
      </article>
    </section>
    <button onClick={analyze} style={btn}>Analyze schedules</button>
    {result && <section style={{background:"#f4f2ff",padding:20,borderRadius:12,marginTop:20}}>
      <h2>{adjusted ? "Proposed adjustment" : "Weekly conflict detected"}</h2>
      <h1>{adjusted ? "0 hours" : `${result.weekly_conflict_hours} hours`}</h1>
      {!adjusted && <p>{result.weekly_conflict_minutes} minutes of overlap this week.</p>}
      <p>{adjusted ? "If Dev takes calls in the common room, the bedroom conflict is removed in this demo. Both roommates should agree." : result.suggestion}</p>
      {!adjusted && <button style={btn} onClick={()=>setAdjusted(true)}>Try suggested adjustment</button>}
    </section>}
    <p style={{color:"#777",marginTop:30}}>Demo uses sample roommate schedules, not live property data.</p>
  </main>;
}
const btn={background:"#6257df",color:"white",border:0,padding:"12px 18px",borderRadius:8,marginTop:18,cursor:"pointer"};
createRoot(document.getElementById("root")).render(<App/>);
