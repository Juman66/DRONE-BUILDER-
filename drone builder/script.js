const data = {};
const openCategories = {};

/* IMAGE LOGIC */
const droneImages = {
  racing: "https://images.unsplash.com/photo-1508614589041-895b88991e3e",
  cinematic: "https://images.unsplash.com/photo-1473968512647-3e447244af8f",
  freestyle: "https://images.unsplash.com/photo-1508614999368-9260051292e5",
  agriculture: "https://images.unsplash.com/photo-1595433562696-8c8d8df8b3e6",
  default: "https://via.placeholder.com/400x250"
};

/* ALL CATEGORIES */
const categories = [

  // CATEGORY 1
  {
    name: "Frame Configuration",
    fields: {
      type: ["quadcopter","hexacopter","octacopter"],
      frameType: ["racing","freestyle","cinematic","agriculture","prototype"],
      size: ["3 inch","4 inch","5 inch","6 inch","7 inch","10+ heavy lift"],
      frameModel: ["Model A","Model B","Model C"]
    }
  },

  // CATEGORY 2
  {
    name: "Motors & Propellers",
    fields: {
      motorSize: ["2207","2306","2806"],
      motorModel: ["Emax","TMotor","BrotherHobby"],
      propType: ["2-blade","3-blade","5-blade"],
      propModel: ["Gemfan","HQProp","DAL"]
    }
  },

  // CATEGORY 3
  {
    name: "Electronics",
    fields: {
      esc: ["30A","45A","60A"],
      escModel: ["Hobbywing","BLHeli","Spedix"],
      fc: ["F4","F7","Pixhawk"]
    }
  },

  // CATEGORY 4
  {
    name: "Power Supply",
    fields: {
      battery: ["4S","6S","12S"],
      batteryModel: ["CNHL","Tattu","Turnigy"]
    }
  },

  // CATEGORY 5
  {
    name: "Optional Components",
    fields: {
      rc: ["6ch","8ch","12ch"],
      receiver: ["FrSky","FlySky","ELRS"],
      gps: ["BN-880","M8N"],
      camera: ["FPV","HD"],
      vtx: ["Analog","Digital"]
    }
  }
];

/* RENDER */
function render(){
  const container = document.getElementById("categories");
  container.innerHTML = "";

  categories.forEach(cat => {
    const isOpen = openCategories[cat.name];

    container.innerHTML += `
      <div class="card">
        <h3 onclick="toggle('${cat.name}')">
          ${cat.name} ${isOpen ? "▲" : "▼"}
        </h3>

        <div class="dropdown ${isOpen ? "open" : ""}">
          ${renderFields(cat)}
        </div>
      </div>
    `;
  });

  renderSummary();
}

/* TOGGLE */
function toggle(name){
  openCategories[name] = !openCategories[name];
  render();
}

/* FIELDS */
function renderFields(cat){
  let html = "";

  Object.entries(cat.fields).forEach(([key,values])=>{
    html += `
      <select onchange="setValue('${key}',this.value)">
        <option value="">Select ${key}</option>
        ${values.map(v=>`
          <option value="${v}" ${data[key]===v ? "selected" : ""}>
            ${v}
          </option>
        `).join("")}
      </select>
    `;
  });

  return html;
}

/* SAVE */
function setValue(key,value){
  data[key]=value;
  render();

  // IMAGE CHANGE
  if(key === "frameType"){
    const img = document.getElementById("droneImage");
    img.style.opacity = 0;

    setTimeout(()=>{
      img.src = droneImages[value] || droneImages.default;
      img.style.opacity = 1;
    },300);
  }

  renderSummary();
}

/* SUMMARY */
function renderSummary(){
  const summary = document.getElementById("summary");

  summary.innerHTML = Object.entries(data)
    .map(([k,v])=>`<p><b>${k}:</b> ${v}</p>`)
    .join("");
}

/* INIT */
render();