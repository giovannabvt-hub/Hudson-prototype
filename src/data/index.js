// FolkAble — all static data

export const catColors = { event:'#c9a84c', gathering:'#3d6b4f' };

export const offerings = [
  {id:1,country:'Ireland',lat:53.35,lng:-6.26,title:'Tuesday Trad Session',member:'The Cobblestone',category:'event',date:'2026-05-12',price:'Free',desc:'Open trad session, all levels welcome.',company:'Hudson Records',artist:'aoife'},
  {id:2,country:'Argentina',lat:-34.61,lng:-58.38,title:'Chamamé Sunday',member:'Trío Reseda',category:'event',date:'2026-05-10',price:'ARS 8,000',desc:'Litoraleño dance night with live trio.',company:'Pampa Folk',artist:'santiago'},
  {id:3,country:'Portugal',lat:38.72,lng:-9.14,title:'Fado de Alfama',member:'Casa do Fado',category:'event',date:'2026-05-15',price:'€18',desc:'Traditional fado vadio evening.',company:'Casa do Fado',artist:'clara'},
  {id:4,country:'Norway',lat:60.39,lng:5.32,title:'Hardanger Fiddle Camp',member:'Vestland Folk',category:'gathering',date:'2026-06-20',price:'kr 1,800',desc:'Five-day intensive on the Bergen coast.',company:'Vestland Folk',artist:'erik'},
  {id:5,country:'Japan',lat:35.01,lng:135.77,title:'Shamisen Workshop',member:'Kyoto Strings',category:'gathering',date:'2026-05-30',price:'¥6,500',desc:'Two-hour beginner workshop in Kyoto.',company:'Eastern Routes',artist:'yuki'},
  {id:6,country:'Morocco',lat:34.03,lng:-5.00,title:'Gnawa Lila',member:'Maâlem Hamid',category:'event',date:'2026-05-22',price:'Donation',desc:'All-night gnawa ritual gathering in Fez.',company:'Hudson Records',artist:'hamid'},
  {id:7,country:'Mexico',lat:17.07,lng:-96.72,title:'Son Jarocho Fandango',member:'Tlen Huicani',category:'event',date:'2026-05-18',price:'Free',desc:'Open fandango in Oaxaca plaza.',company:'Pampa Folk',artist:'santiago'},
  {id:8,country:'United States of America',lat:35.60,lng:-82.55,title:'Banjo Tuning Course',member:'Asheville Folk Co.',category:'gathering',date:'2026-06-05',price:'$120',desc:'Weekend course in Appalachian banjo.',company:'Hollow Holler Records',artist:'aoife'},
  {id:9,country:'Spain',lat:37.18,lng:-3.60,title:'Peña Flamenca',member:'La Platería',category:'event',date:'2026-05-25',price:'€15',desc:'Traditional peña night in Granada.',company:'Casa do Fado',artist:'clara'},
  {id:10,country:'Brazil',lat:-12.97,lng:-38.50,title:'Forró Pé de Serra',member:'Coletivo Pifaneiros',category:'event',date:'2026-05-17',price:'R$30',desc:'Classic forró trio dance night.',company:'Hudson Records',artist:'clara'},
  {id:11,country:'Bulgaria',lat:42.69,lng:23.32,title:'Balkan Brass Meetup',member:'Brass Sofia',category:'gathering',date:'2026-06-12',price:'Free',desc:'Open jam for brass players.',company:'Vestland Folk',artist:'erik'},
  {id:12,country:'Mali',lat:12.64,lng:-8.00,title:'Kora Masterclass',member:'Kouyaté Family',category:'gathering',date:'2026-07-02',price:'$80',desc:'Intensive three-day kora masterclass.',company:'Eastern Routes',artist:'hamid'},
  {id:13,country:'United Kingdom',lat:57.48,lng:-4.22,title:'Celtic Connections Session',member:'Caledonian Folk Club',category:'event',date:'2026-06-14',price:'£12',desc:'Highland tune session.',company:'Hudson Records',artist:'aoife'},
  {id:14,country:'Colombia',lat:4.71,lng:-74.07,title:'Vallenato Cumbia Night',member:'Barranquilla Roots',category:'event',date:'2026-05-28',price:'COP 40,000',desc:'Traditional vallenato ensemble.',company:'Pampa Folk',artist:'santiago'},
  {id:15,country:'India',lat:20.59,lng:78.96,title:'Baul Songs of Bengal',member:'Mystic Strings India',category:'gathering',date:'2026-07-15',price:'₹800',desc:'Workshop on the spiritual Baul tradition.',company:'Eastern Routes',artist:'yuki'},
  {id:16,country:'France',lat:44.84,lng:-0.57,title:'Bordeaux Folk Gathering',member:'Le Cercle Folk',category:'gathering',date:'2026-06-08',price:'€15',desc:'Monthly gathering of French folk musicians.',company:'Hudson Records',artist:'clara'},
  {id:17,country:'Hungary',lat:47.50,lng:19.04,title:'Budapest Táncház Camp',member:'Tánchaz Egyesület',category:'gathering',date:'2026-08-10',price:'€220',desc:'Week-long traditional dance camp.',company:'Hudson Records',artist:'erik'},
  {id:18,country:'Norway',lat:69.65,lng:18.96,title:'Arctic Folk Summit',member:'Tromsø Folk Society',category:'event',date:'2026-08-01',price:'kr 450',desc:'Three-day festival above the Arctic Circle.',company:'Vestland Folk',artist:'erik'},
  {id:19,country:'Morocco',lat:31.63,lng:-7.99,title:'Atlas Mountain Moussem',member:'Maâlem Hamid',category:'event',date:'2026-09-05',price:'Free',desc:'Traditional moussem gathering in the High Atlas.',company:'Eastern Routes',artist:'hamid'},
  {id:20,country:'Sweden',lat:59.33,lng:18.07,title:'Nordic Fiddle Gathering',member:'Nordmark Luthier',category:'gathering',date:'2026-07-10',price:'kr 600',desc:'Annual meeting of Nordic fiddle traditions.',company:'Vestland Folk',artist:'erik'},
];

export const companies = [
  { id:'hudson',name:'Hudson Records',color:'#c9a84c',logo:'🏔️',
    bio:'Founded in 2018 in the Hudson Valley, New York, Hudson Records is a community-driven folk label dedicated to preserving and amplifying traditional music from around the world. From vinyl pressings to live sessions, they champion independent artists and authentic sound.',
    founded:'2018',location:'Hudson Valley, NY',members:42,
    articles:[
      {title:'Why We Chose Analogue',date:'2026-04-15',excerpt:'In a world of digital convenience, we doubled down on vinyl...'},
      {title:'Atlas Compilation: Call for Submissions',date:'2026-05-01',excerpt:'Our annual compilation is open. This year\'s theme will be chosen by governance vote...'},
    ],
    releases:['Galway Sessions Vol. 3','Forró de Caju','Atlas Compilation 2026'],
    events:['Celtic Connections Session','Bordeaux Folk Gathering','Budapest Táncház Camp'],
    socials:{website:'https://hudsonrecords.com',instagram:'@hudsonrecords',twitter:'@hudsonrec'}
  },
  { id:'sruth',name:'Sruth Records',color:'#8b7ec8',logo:'🌊',
    bio:'Sruth (Irish for "stream") is a boutique folk label from Galway, Ireland, specialising in traditional Irish music. Every release is pressed on vinyl with hand-designed sleeves.',
    founded:'2020',location:'Galway, Ireland',members:12,
    articles:[{title:'Vol. 3 Sold Out in 11 Days',date:'2026-05-05',excerpt:'We did not expect this. Thank you to every member who supported the pressing...'}],
    releases:['Galway Sessions Vol. 3','Galway Sessions Vol. 4','Clare to Here'],
    events:['Galway Sessions Listening Party'],
    socials:{website:'https://sruthrecords.ie',instagram:'@sruthrecords'}
  },
  { id:'casa',name:'Casa do Fado',color:'#d4a843',logo:'🎶',
    bio:'A Lisbon-based collective preserving the art of Portuguese fado. Casa do Fado hosts weekly performances and produces recordings of both traditional and contemporary fado.',
    founded:'2019',location:'Lisbon, Portugal',members:18,
    articles:[{title:'Fado Evenings Return to Alfama',date:'2026-04-20',excerpt:'After renovation, our casa reopens with an expanded programme...'}],
    releases:['Saudade do Norte','Entre Dois Mares'],
    events:['Fado de Alfama','Peña Flamenca'],
    socials:{website:'https://casadofado.pt',instagram:'@casadofado'}
  },
  { id:'vestland',name:'Vestland Folk',color:'#3d6b4f',logo:'🌲',
    bio:'Based in Bergen, Norway, Vestland Folk champions Scandinavian traditional music. From hardanger fiddle workshops to Arctic festivals, they connect Nordic folk traditions with the wider world.',
    founded:'2017',location:'Bergen, Norway',members:28,
    articles:[{title:'Arctic Folk Summit 2026 Announced',date:'2026-03-10',excerpt:'Three days above the Arctic Circle. Tromsø, August 1-3...'}],
    releases:['Nordmark'],
    events:['Hardanger Fiddle Camp','Balkan Brass Meetup','Arctic Folk Summit','Nordic Fiddle Gathering'],
    socials:{website:'https://vestlandfolk.no',instagram:'@vestlandfolk'}
  },
  { id:'hollow',name:'Hollow Holler Records',color:'#a0522d',logo:'🪕',
    bio:'From the hills of Tennessee, Hollow Holler Records documents the living tradition of Appalachian music. Small-batch vinyl and 7" pressings only.',
    founded:'2021',location:'Asheville, NC',members:15,
    articles:[{title:'7" Series Year Two',date:'2026-04-01',excerpt:'The quarterly series continues. Each release: 300 copies, one take, no overdubs...'}],
    releases:['Old-Time String Band 7"'],
    events:['Banjo Tuning Course'],
    socials:{website:'https://hollowholler.com',instagram:'@hollowholler'}
  },
  { id:'pampa',name:'Pampa Folk',color:'#7a9ec2',logo:'🌾',
    bio:'A Buenos Aires collective bridging South American folk traditions — chamamé, vallenato, son jarocho — with contemporary audiences. They organise Latin American folk tours and co-produce albums.',
    founded:'2020',location:'Buenos Aires, Argentina',members:22,
    articles:[{title:'Latin American Folk Circuit 2026',date:'2026-05-08',excerpt:'Six countries, twelve cities. The circuit launches in September...'}],
    releases:['Reseda','La Pampa Vive'],
    events:['Chamamé Sunday','Son Jarocho Fandango','Vallenato Cumbia Night'],
    socials:{website:'https://pampafolk.ar',instagram:'@pampafolk'}
  },
  { id:'eastern',name:'Eastern Routes',color:'#c27a7a',logo:'🧭',
    bio:'Eastern Routes connects folk traditions of Asia, North Africa, and the Middle East with global audiences. They produce albums, organise masterclasses, and coordinate cultural exchanges.',
    founded:'2019',location:'Marrakech / Tokyo',members:20,
    articles:[{title:'Gnawa-Koto Collaboration Announced',date:'2026-05-12',excerpt:'Maâlem Hamid and Yuki Nakashima enter the studio together this autumn...'}],
    releases:['Lila','Ma — Silence Between Notes','Colours of the Guembri'],
    events:['Gnawa Lila','Shamisen Workshop','Kora Masterclass','Baul Songs of Bengal','Atlas Mountain Moussem'],
    socials:{website:'https://easternroutes.org',instagram:'@easternroutes'}
  },
];

export const companyMap = {
  'Hudson Records':'hudson','Sruth Records':'sruth','Casa do Fado':'casa',
  'Vestland Folk':'vestland','Hollow Holler Records':'hollow','Pampa Folk':'pampa','Eastern Routes':'eastern',
};

export const artists = [
  { id:'aoife',emoji:'🎻',name:'Aoife Brennan',age:34,country:'Ireland',instrument:'Fiddle & Banjo',
    bio:'Born in County Clare, Aoife has played traditional Irish music since age six. She has performed at Fleadh Cheoil na hÉireann four times and released three albums with Sruth Records. Her playing bridges the gap between the old session traditions and a new generation of listeners.',
    products:['Galway Sessions Vol. 3 (vinyl)','The Banjo Notebooks (book)','Tour Hoodie 2026'],
    events:['Tuesday Trad Session','Banjo Tuning Course','Celtic Connections Session','Limerick Fiddle Week'],
    countries:['Ireland','United States of America','United Kingdom'],
    blog:[
      {title:'Recording in Galway — Behind Vol. 3',date:'2026-04-28',text:'We set up in the back room of the Cobblestone with two condenser mics and an old Tascam. The idea was to capture the room, not just the instruments...'},
      {title:'Why I Teach Banjo Tuning',date:'2026-03-15',text:'The banjo is a misunderstood instrument in Irish trad. Most people think of Appalachian picking, but the Irish tenor banjo has its own voice entirely...'},
    ],
    socials:{instagram:'@aoifebrennan_trad',spotify:'Aoife Brennan',youtube:'AoifeBrennanMusic',website:'https://aoifebrennan.ie'},
    supporters:847, label:'Sruth Records'
  },
  { id:'santiago',emoji:'🪗',name:'Santiago Vera',age:42,country:'Argentina',instrument:'Bandoneón & Guitar',
    bio:'Santiago grew up in the Litoral region deeply influenced by chamamé. He has toured across Latin America and collaborated with Parisian tango orchestras. His music carries the weight of the pampas and the joy of the river towns.',
    products:['Reseda (LP)','La Pampa Vive (EP)','Pampa Tour Tote'],
    events:['Chamamé Sunday','Son Jarocho Fandango','Vallenato Cumbia Night'],
    countries:['Argentina','Mexico','Colombia','Spain'],
    blog:[
      {title:'Chamamé Is Not Tango',date:'2026-05-02',text:'People always ask me to play tango. I play bandoneón, yes, but chamamé is the music of the rivers, the land, the mosquitoes at dusk...'},
    ],
    socials:{instagram:'@santiagoveramusic',spotify:'Santiago Vera',website:'https://santiagovera.com.ar'},
    supporters:612, label:'Pampa Folk'
  },
  { id:'yuki',emoji:'🎵',name:'Yuki Nakashima',age:28,country:'Japan',instrument:'Shamisen & Koto',
    bio:'Yuki studied at the Tokyo University of the Arts under master shamisen player Kenji Inoue. She blends traditional Japanese court music with folk influences from across Asia. Her album "Ma" explores the spaces between notes.',
    products:['Ma — Silence Between Notes (album)'],
    events:['Shamisen Workshop','Baul Songs of Bengal'],
    countries:['Japan','India'],
    blog:[
      {title:'The Concept of Ma in Music',date:'2026-04-10',text:'Ma is the silence between sounds. In Western music, the focus is on the notes. In Japanese tradition, the space between them carries equal weight...'},
    ],
    socials:{instagram:'@yuki_shamisen',spotify:'Yuki Nakashima',youtube:'YukiNakashimaMusic'},
    supporters:523, label:'Eastern Routes'
  },
  { id:'clara',emoji:'🎼',name:'Clara Monteiro',age:31,country:'Portugal',instrument:'Classical Guitar & Voice',
    bio:'Born in Lisbon and raised between Portugal and Brazil, Clara blends the melancholy of fado with the rhythmic joy of forró. Her voice carries the saudade of the Atlantic — the longing for home that never quite arrives.',
    products:['Saudade do Norte (LP)','Alfama Notebooks (songbook)'],
    events:['Fado de Alfama','Peña Flamenca','Forró Pé de Serra','Bordeaux Folk Gathering'],
    countries:['Portugal','Spain','Brazil','France'],
    blog:[
      {title:'Saudade Cannot Be Translated',date:'2026-03-20',text:'Every language has untranslatable words. For Portuguese speakers, saudade is the deepest — a longing for something you may never have had...'},
    ],
    socials:{instagram:'@claramonteiro_fado',spotify:'Clara Monteiro',website:'https://claramonteiro.pt'},
    supporters:1034, label:'Casa do Fado'
  },
  { id:'erik',emoji:'🎻',name:'Erik Lindström',age:45,country:'Sweden',instrument:'Nyckelharpa & Hardanger Fiddle',
    bio:'Erik is a craftsman and musician from Uppsala who both builds and plays the nyckelharpa. He leads workshops across Scandinavia and has spent three decades preserving Nordic fiddle traditions through performance and instrument-making.',
    products:['Nordmark (LP)','Hand-built nyckelharpa','The Keyed Fiddle Guide (book)'],
    events:['Hardanger Fiddle Camp','Balkan Brass Meetup','Arctic Folk Summit','Budapest Táncház Camp','Nordic Fiddle Gathering'],
    countries:['Sweden','Norway','Bulgaria','Hungary'],
    blog:[
      {title:'Building a Nyckelharpa from Scratch',date:'2026-02-18',text:'Each instrument takes about 400 hours. I start with a block of Swedish maple and end with something that sings. The keys are the hardest part...'},
    ],
    socials:{instagram:'@eriklindstrom_folk',website:'https://eriklindstrom.se'},
    supporters:391, label:'Vestland Folk'
  },
  { id:'hamid',emoji:'🥁',name:'Maâlem Hamid Qadiri',age:58,country:'Morocco',instrument:'Guembri & Voice',
    bio:'Maâlem Hamid is a master of the Gnawa spiritual tradition, based in Fez. Initiated at fifteen, he has performed lila ceremonies for four decades. His music is prayer — rhythmic, trance-inducing, ancient.',
    products:['Lila (live recording)','Colours of the Guembri (LP)','Gnawa Krakeb (pair)'],
    events:['Gnawa Lila','Kora Masterclass','Atlas Mountain Moussem'],
    countries:['Morocco','Mali'],
    blog:[
      {title:'The Lila Is Not a Concert',date:'2026-04-05',text:'People call it a performance. It is not. The lila is a ceremony — a conversation with the spirits. The music serves a purpose beyond entertainment...'},
    ],
    socials:{instagram:'@maalem_hamid',youtube:'MaalemHamidQadiri'},
    supporters:678, label:'Eastern Routes'
  },
];

export const communityChannels = [
  { id:'general', name:'General', emoji:'🌍', description:'Open discussion for all FolkAble members', members: 184,
    messages:[
      {author:'Hudson Records',avatar:'🏔️',time:'2m ago',text:'Welcome to the new FolkAble community platform! Explore, connect, and share.'},
      {author:'Aoife Brennan',avatar:'🎻',time:'15m ago',text:'Just finished recording the last track for Vol. 4. Cannot wait to share it with everyone.'},
      {author:'Erik Lindström',avatar:'🎻',time:'28m ago',text:'Anyone heading to the Arctic Folk Summit? Let\'s coordinate travel.'},
      {author:'Clara Monteiro',avatar:'🎼',time:'1h ago',text:'The Bordeaux gathering was beautiful. Photos coming soon.'},
      {author:'Santiago Vera',avatar:'🪗',time:'1h ago',text:'New chamamé arrangements uploaded to my page. Feedback welcome!'},
      {author:'Maâlem Hamid',avatar:'🥁',time:'2h ago',text:'The lila recording session in Fez was transcendent. More details on my profile.'},
      {author:'Yuki Nakashima',avatar:'🎵',time:'3h ago',text:'Excited about the Europe tour. Eight cities! Thank you for the governance vote.'},
    ]
  },
  { id:'events', name:'Events & Gatherings', emoji:'📅', description:'Coordinate and discuss upcoming events', members: 128,
    messages:[
      {author:'Vestland Folk',avatar:'🌲',time:'5m ago',text:'Arctic Folk Summit tickets go live next week. Member pre-sale starts Monday.'},
      {author:'Coletivo Pifaneiros',avatar:'🌾',time:'20m ago',text:'Forró night this Saturday in Salvador. Two accordion spots still open.'},
      {author:'Le Cercle Folk',avatar:'🎶',time:'45m ago',text:'June gathering programme is finalised. Jazz manouche workshop added!'},
      {author:'Tánchaz Egyesület',avatar:'💃',time:'1h ago',text:'Dance partner matching for Budapest camp is now live on the portal.'},
    ]
  },
  { id:'production', name:'Production & Recording', emoji:'🎙️', description:'Talk recording, mixing, mastering, vinyl', members: 67,
    messages:[
      {author:'Sruth Records',avatar:'🌊',time:'10m ago',text:'Anyone have experience pressing on 180g vs 140g? Quality difference worth the cost?'},
      {author:'Hollow Holler Records',avatar:'🪕',time:'30m ago',text:'Our 7" lathe cuts are done. Hand-numbered, shipping next week.'},
      {author:'Eastern Routes',avatar:'🧭',time:'1h ago',text:'The gnawa-koto collab session starts in September. Studio in Marrakech confirmed.'},
    ]
  },
  { id:'instruments', name:'Instruments & Craft', emoji:'🪕', description:'Luthiers, instrument makers, and collectors', members: 43,
    messages:[
      {author:'Erik Lindström',avatar:'🎻',time:'15m ago',text:'New nyckelharpa build log up on my profile. This one uses spruce instead of maple.'},
      {author:'Taller del Sur',avatar:'🥁',time:'1h ago',text:'Cedar cajón workshop in Sevilla, June 7. Five spots remaining.'},
    ]
  },
  { id:'marketplace', name:'Marketplace', emoji:'🏪', description:'Buy, sell, and trade folk items', members: 89,
    messages:[
      {author:'Santiago Vera',avatar:'🪗',time:'3h ago',text:'1960s bandoneón for sale. Excellent condition. Serious players only.'},
      {author:'Aoife Brennan',avatar:'🎻',time:'5h ago',text:'Tour hoodies restocked! New embroidered design.'},
    ]
  },
];

export const proposals = [
  { id:'FOLK-014', cat:'Event', status:'active',
    title:'Greenlight pressing of "Galway Sessions Vol. 4" — 500 copies',
    by:'Sruth Records', body:'Vol. 3 sold out in 11 days. We propose pressing 500 copies of Vol. 4 (vs. the standard 200) to meet member demand. Treasury cost: €4,800 for plates + pressing.',
    options:[ {label:'For — press 500', votes:147}, {label:'Against — keep at 200', votes:38}, {label:'Abstain', votes:12} ],
    closes:'2 days', quorum:197 },
  { id:'FOLK-013', cat:'Tour', status:'active',
    title:'Fund Yuki Nakashima\'s Europe tour (8 dates)',
    by:'Eastern Routes', body:'Yuki has been invited to perform at 8 European folk festivals in autumn 2026. Treasury contribution: €6,200. Estimated return: €4,400 from merch + royalties.',
    options:[ {label:'For — fund the tour', votes:186}, {label:'Against', votes:21}, {label:'Fund partially (€3,000)', votes:34} ],
    closes:'5 days', quorum:241 },
  { id:'FOLK-012', cat:'Compilation', status:'active',
    title:'Choose theme for the 2026 Atlas Compilation',
    by:'Hudson Records', body:'Annual compilation tradition. Theme decides the curation, sleeve art, and call for submissions.',
    options:[ {label:'Songs of Migration', votes:88}, {label:'Coastal & Maritime Folk', votes:67}, {label:'Voices of the Mountains', votes:104}, {label:'Lullabies of the World', votes:55} ],
    closes:'3 days', quorum:197 },
  { id:'FOLK-011', cat:'Onboarding', status:'active',
    title:'Onboard "Taller del Sur" as official luthier-member',
    by:'Casa do Fado', body:'The Sevilla-based cajón maker has been a regular contributor. We propose granting them voting member status.',
    options:[ {label:'For — onboard', votes:73}, {label:'Against', votes:9}, {label:'Abstain', votes:5} ],
    closes:'6 days', quorum:103 },
  { id:'FOLK-010', cat:'Treasury', status:'passed',
    title:'Approve 2026 H1 budget allocation',
    by:'Hudson Records', body:'Standard half-year budget. €34,000 total: 40% releases, 25% events, 20% tour support, 10% grants, 5% reserves.',
    options:[ {label:'For', votes:284, winner:true}, {label:'Against', votes:28}, {label:'Abstain', votes:14} ],
    closes:'closed', quorum:103, passed:true },
  { id:'FOLK-009', cat:'Event', status:'passed',
    title:'Add Latin American Folk Circuit to 2026 calendar',
    by:'Pampa Folk', body:'Six countries, twelve cities. Budget request for venue deposits and artist travel.',
    options:[ {label:'For', votes:198, winner:true}, {label:'Against', votes:15} ],
    closes:'closed', quorum:103, passed:true },
  { id:'FOLK-008', cat:'Policy', status:'rejected',
    title:'Add commercial sync licensing partner',
    by:'Hudson Records', body:'Proposal to partner with a major sync agency for film/TV placements.',
    options:[ {label:'For', votes:91}, {label:'Against', votes:178, winner:true}, {label:'Abstain', votes:22} ],
    closes:'closed', quorum:103, passed:false },
];

export const motifs = {
  'Ireland':{notes:[293.66,440,391.99,369.99,329.63,293.66,261.63,293.66],tempo:140,wave:'triangle'},
  'Argentina':{notes:[220,261.63,293.66,329.63,392,329.63,293.66,220],tempo:110,wave:'sawtooth'},
  'Portugal':{notes:[329.63,349.23,415.30,440,493.88,440,415.30,349.23],tempo:90,wave:'sine'},
  'Norway':{notes:[293.66,329.63,369.99,415.30,440,415.30,369.99,329.63],tempo:120,wave:'sawtooth'},
  'Japan':{notes:[293.66,311.13,392,440,466.16,440,392,293.66],tempo:80,wave:'triangle'},
  'Morocco':{notes:[293.66,311.13,369.99,392,440,466.16,554.37,587.33],tempo:100,wave:'square'},
  'Mexico':{notes:[392,440,493.88,587.33,659.25,587.33,493.88,440],tempo:140,wave:'triangle'},
  'United States of America':{notes:[392,493.88,587.33,659.25,587.33,493.88,392,329.63],tempo:130,wave:'square'},
  'Spain':{notes:[329.63,349.23,415.30,440,466.16,523.25,587.33,440],tempo:120,wave:'sawtooth'},
  'Brazil':{notes:[293.66,369.99,440,587.33,440,369.99,293.66,220],tempo:130,wave:'triangle'},
  'Bulgaria':{notes:[293.66,329.63,349.23,415.30,440,466.16,554.37,440],tempo:160,wave:'sawtooth'},
  'Mali':{notes:[349.23,392,466.16,523.25,622.25,523.25,466.16,392],tempo:120,wave:'triangle'},
  'Sweden':{notes:[440,493.88,523.25,587.33,659.25,587.33,523.25,440],tempo:110,wave:'triangle'},
  'Hungary':{notes:[293.66,329.63,349.23,415.30,440,466.16,554.37,440],tempo:140,wave:'sawtooth'},
  'United Kingdom':{notes:[330,370,415,440,494,587,659,587],tempo:132,wave:'triangle'},
  'Colombia':{notes:[392,440,494,587,659,587,494,440],tempo:145,wave:'sawtooth'},
  'India':{notes:[261.63,293.66,329.63,349.23,415.30,466.16,523.25,440],tempo:100,wave:'sine'},
  'France':{notes:[330,370,392,440,494,523,587,523],tempo:115,wave:'sine'},
};
