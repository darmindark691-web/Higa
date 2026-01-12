fetch("data.json").then(r=>r.json()).then(d=>{
  document.getElementById("content").innerHTML = d.map(x=>`
  <div class="card">
    <h3>[${x.hub}] ${x.title}</h3>

    <p><b>Kya hua:</b> ${x.title}</p>
    <p><b>Kisne:</b> ${x.hub}</p>
    <p><b>Kab:</b> ${x.date || "Ghoshna ke samay"}</p>
    <p><b>Kyon:</b> Prashasanik / arthik sudhar ke liye</p>

    <p><b>Summary:</b><br>
    • Sarkar ne naya update jari kiya<br>
    • Iska sambandh shasan/prashasan se hai<br>
    • Isse niti me spashtata aati hai<br>
    • Lagu hone se pranali majboot hogi<br>
    • Rajya aur kendra dono prabhavit honge<br>
    </p>

    <p><b>Key Points:</b></p>
    <ul>
      <li>Adhikarik ghoshna</li>
      <li>Sanbandhit sanstha</li>
      <li>Niti sudhar</li>
      <li>UPSC mahatva</li>
    </ul>

    <p><b>Practice Questions:</b></p>
    <ol>
      <li>Yeh ghoshna kis sanstha ne ki?</li>
      <li>Iska uddeshya kya hai?</li>
      <li>Yeh kis kshetra se sambandhit hai?</li>
      <li>Iska prabhav kinke upar padega?</li>
      <li>UPSC ke kis paper se sambandhit ho sakta hai?</li>
    </ol>

    <a href="${x.link}" target="_blank">Source</a>
  </div>
  `).join("");
});
