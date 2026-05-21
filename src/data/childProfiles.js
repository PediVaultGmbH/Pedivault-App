export const CHILD_PROFILES = {
  aanya: {
    name:'Aanya Müller', dob:'2022-10-14', gender:'Girl',
    bloodGroup:'B+', nationality:'German / Indian',
    birthWeight:'3.2 kg', birthLength:'50 cm',
    birthPlace:'Klinik Berlin Mitte', gestationalAge:'39 weeks',
    color:'#C47A92',
    allergies:[
      {name:'Dust mites',   severity:'Mild',     reaction:'Sneezing, watery eyes', confirmed:'2025-02-14'},
      {name:'Tree pollen',  severity:'Mild',     reaction:'Rhinitis, itchy eyes',  confirmed:'2025-02-14'},
    ],
    conditions:[
      {name:'Iron deficiency anaemia', status:'Resolved', since:'2024-09', notes:'Treated with iron supplements for 3 months'},
    ],
    careTeam:[
      {role:'Paediatrician',    name:'Dr. Kavita Singh',  clinic:'Apollo Paediatrics',          phone:'+49 30 8888 0001', email:'kavita.singh@apollo.de'},
      {role:'GP / Family Dr',  name:'Dr. Priya Mehta',   clinic:"Fortis Children's Clinic",    phone:'+49 30 7777 0002', email:'priya.mehta@fortis.de'},
      {role:'Radiologist',     name:'Dr. Franz Weber',   clinic:'Charité Radiologie',           phone:'+49 30 4500 1234', email:''},
    ],
    emergency:[
      {name:'Lena Müller',  relation:'Mother', phone:'+49 151 0001 0001', primary:true},
      {name:'Raj Müller',   relation:'Father', phone:'+49 151 0002 0002', primary:false},
      {name:'Priya Sharma', relation:'Grandmother', phone:'+49 151 0003 0003', primary:false},
    ],
    insurance:{
      provider:'AOK Berlin',
      number:'A123456789',
      type:'Gesetzliche Krankenversicherung (GKV)',
      validUntil:'2026-12-31',
    },
  },
  rohan: {
    name:'Rohan Müller', dob:'2021-03-20', gender:'Boy',
    bloodGroup:'O+', nationality:'German / Indian',
    birthWeight:'3.6 kg', birthLength:'52 cm',
    birthPlace:'Charité Berlin', gestationalAge:'40 weeks',
    color:'#3478B0',
    allergies:[],
    conditions:[],
    careTeam:[
      {role:'Paediatrician', name:'Dr. Kavita Singh', clinic:'Apollo Paediatrics', phone:'+49 30 8888 0001', email:'kavita.singh@apollo.de'},
    ],
    emergency:[
      {name:'Lena Müller', relation:'Mother', phone:'+49 151 0001 0001', primary:true},
      {name:'Raj Müller',  relation:'Father', phone:'+49 151 0002 0002', primary:false},
    ],
    insurance:{
      provider:'AOK Berlin',
      number:'B987654321',
      type:'Gesetzliche Krankenversicherung (GKV)',
      validUntil:'2026-12-31',
    },
  },
};
